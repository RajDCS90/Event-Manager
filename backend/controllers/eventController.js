const Events = require("../models/Events");

// Get all events with pagination and filtering
const mongoose = require("mongoose");
const Mandal = require("../models/Mandal");

// Helper function to convert HH:MM to minutes
function convertTimeToMinutes(timeStr) {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours * 60 + minutes;
}

// Helper function to validate time format
function isValidTime(timeStr) {
  return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(timeStr);
}

// Get all events with pagination and filtering

exports.getAllEvents = async (req, res) => {
  try {
    const filters = req.query;
    const query = {};

    // Pagination - default to 30 documents when no query parameters
    const page = parseInt(filters.page) || 1;
    const limit = Object.keys(filters).length === 0 ? 30 : 200;
    const skip = (page - 1) * limit;

    // Basic filters
    if (filters.eventType) {
      query.eventType = filters.eventType;
    }
    if (filters.status) {
      query.status = filters.status;
    }
    if (filters.venue) {
      query.venue = { $regex: filters.venue, $options: "i" };
    }

    // Handle date range in format "YYYY-MM-DD,YYYY-MM-DD"
    if (filters.dateRange) {
      const [startDate, endDate] = filters.dateRange.split(',');
      if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
          start.setHours(0, 0, 0, 0);
          end.setHours(23, 59, 59, 999);
          query.eventDate = { $gte: start, $lte: end };
        }
      }
    }
    // Single date filter
    else if (filters.eventDate) {
      const date = new Date(filters.eventDate);
      if (!isNaN(date.getTime())) {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);
        query.eventDate = { $gte: startOfDay, $lte: endOfDay };
      }
    }

    // Handle address filters with bracket notation
    // For mandal, we need to check if filter is by ID or name
    if (filters["address[mandal]"]) {
      // First try to find by name
      const mandal = await mongoose.model("Mandal").findOne({
        mandalName: filters["address[mandal]"],
      });

      if (mandal) {
        query["address.mandal"] = mandal._id;
      } else {
        // If not found by name, maybe it's already an ID
        query["address.mandalName"] = filters["address[mandal]"];
      }
    }

    // Now we can directly query other address fields because they are stored in the event
    if (filters["address[area]"]) {
      query["address.area"] = filters["address[area]"];
    }

    if (filters["address[village]"]) {
      query["address.village"] = filters["address[village]"];
    }

    if (filters["address[booth]"]) {
      query["address.booth"] = filters["address[booth]"];
    }

    // Other address fields
    if (filters["address[postOffice]"]) {
      query["address.postOffice"] = {
        $regex: filters["address[postOffice]"],
        $options: "i",
      };
    }
    if (filters["address[policeStation]"]) {
      query["address.policeStation"] = {
        $regex: filters["address[policeStation]"],
        $options: "i",
      };
    }
    if (filters["address[pincode]"]) {
      query["address.pincode"] = filters["address[pincode]"];
    }

    console.log("Final query:", JSON.stringify(query, null, 2));
    console.log("Limit:", limit);

    // Fetch events with pagination
    const totalCount = await Events.countDocuments(query);
    const events = await Events.find(query)
      .sort({ eventDate: 1, startTime: 1 })
      .skip(skip)
      .limit(limit)
      .populate({ path: "createdBy", select: "username" })
      .populate({
        path: "address.mandal",
        select: "mandalName",
      });

    // Transform the response to simplify the address schema
    const simplifiedEvents = events.map(event => {
      const eventObj = event.toObject();
      
      // If address.mandal is populated and has mandalName, extract it
      if (eventObj.address && eventObj.address.mandal && typeof eventObj.address.mandal === 'object') {
        const mandalName = eventObj.address.mandal.mandalName;
        
        // Simplify the mandal object to match grievance structure
        eventObj.address.mandal = {
          _id: eventObj.address.mandal._id,
          mandalName: mandalName
        };
      }
      
      return eventObj;
    });

    res.json({
      events: simplifiedEvents,
      page,
      limit,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
    });
  } catch (error) {
    console.error("Filter error:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.createEvent = async (req, res) => {
  try {
    const { eventDate, startTime, endTime, address = {}, ...rest } = req.body;

    // Validate date
    const dateObj = new Date(eventDate);
    if (isNaN(dateObj.getTime())) {
      return res.status(400).json({ message: "Invalid date format" });
    }

    // Validate times
    if (!isValidTime(startTime) || !isValidTime(endTime)) {
      return res.status(400).json({ message: "Invalid time format (HH:MM)" });
    }

    if (convertTimeToMinutes(startTime) >= convertTimeToMinutes(endTime)) {
      return res
        .status(400)
        .json({ message: "End time must be after start time" });
    }

    // Validate pincode if provided
    if (address.pincode && !/^\d{6}$/.test(address.pincode)) {
      return res.status(400).json({ message: "Pincode must be 6 digits" });
    }

    // Validate phone number
    if (!/^\d{10}$/.test(rest.requesterContact)) {
      return res
        .status(400)
        .json({ message: "Phone number must be 10 digits" });
    }

    // Find the mandal by name to get its ObjectId
    let mandalDoc;
    if (address.mandal) {
      mandalDoc = await Mandal.findOne({ mandalName: address.mandal });
      if (!mandalDoc) {
        return res.status(400).json({ message: "Invalid mandal name" });
      }
    } else {
      return res.status(400).json({ message: "Mandal is required" });
    }

    // Find the area type (Panchayat or Ward)
    const selectedArea = mandalDoc.areas.find(
      (area) => area.name === address.area
    );
    if (!selectedArea) {
      return res.status(400).json({ message: "Invalid area name" });
    }

    // Construct complete address with all hierarchical information
    const completeAddress = {
      mandal: mandalDoc._id,
      mandalName: address.mandal,
      area: address.area,
      areaType: selectedArea.type,
      village: address.village,
      booth: address.booth,
      postOffice: address.postOffice,
      policeStation: address.policeStation,
      pincode: address.pincode,
    };

    const eventData = {
      ...rest,
      eventDate: dateObj,
      startTime,
      endTime,
      address: completeAddress,
      createdBy: req.user.id,
    };

    const event = new Events(eventData);
    await event.save();

    // Fetch the created event with populated mandal for the response
    const populatedEvent = await Events.findById(event._id)
      .populate("address.mandal", "mandalName")
      .populate("createdBy", "username");

    res.status(201).json(populatedEvent);
  } catch (error) {
    console.error("Create event error:", error);
    res.status(400).json({
      message: "Validation failed",
      errors: error.errors
        ? Object.keys(error.errors).reduce((acc, key) => {
            acc[key] = error.errors[key].message;
            return acc;
          }, {})
        : error.message,
    });
  }
};

// Update event with full validation
exports.updateEvent = async (req, res) => {
  try {
    // Create update object with only fields that were explicitly sent
    const updateData = {};
    
    // Copy only the fields that are present in the request body
    Object.keys(req.body).forEach(key => {
      if (key !== 'address') {
        updateData[key] = req.body[key];
      }
    });
    
    // Get the existing event
    const existingEvent = await Events.findById(req.params.id);
    if (!existingEvent) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Handle address updates
    if (req.body.address) {
      // Parse address if it's a string (from FormData)
      let addressUpdates = null;
      if (typeof req.body.address === "string") {
        try {
          addressUpdates = JSON.parse(req.body.address);
        } catch (e) {
          console.error("Error parsing address:", e);
          return res.status(400).json({ message: "Invalid address format" });
        }
      } else {
        addressUpdates = req.body.address;
      }

      // Only add addressUpdates if there are actual updates
      if (addressUpdates && Object.keys(addressUpdates).length > 0) {
        // For partial updates, merge with existing address instead of replacing it
        const existingAddress = existingEvent.address.toObject();
        updateData.address = { ...existingAddress };
        
        // Handle mandal update - special case as it's a reference
        if (addressUpdates.mandal && addressUpdates.mandal !== existingAddress.mandalName) {
          // Find the mandal by name to get its ObjectId
          const mandal = await Mandal.findOne({ mandalName: addressUpdates.mandal });
          if (!mandal) {
            return res.status(400).json({ message: "Invalid mandal name" });
          }
          
          // Set mandal ObjectId and name
          updateData.address.mandal = mandal._id;
          updateData.address.mandalName = addressUpdates.mandal;
        }
        
        // Handle area update - special case as it requires areaType
        if (addressUpdates.area && addressUpdates.area !== existingAddress.area) {
          updateData.address.area = addressUpdates.area;
          
          // Find areaType from mandal document
          const mandalId = updateData.address.mandal || existingAddress.mandal;
          const mandal = await Mandal.findById(mandalId);
          if (mandal) {
            const selectedArea = mandal.areas.find(area => area.name === addressUpdates.area);
            if (selectedArea) {
              updateData.address.areaType = selectedArea.type;
            }
          }
        }
        
        // Copy remaining address fields that were updated
        ['village', 'booth', 'postOffice', 'policeStation', 'pincode'].forEach(field => {
          if (addressUpdates[field] !== undefined) {
            updateData.address[field] = addressUpdates[field];
          }
        });
      }
    }

    // Handle file upload if present
    if (req.file) {
      updateData.imageUrl = req.file.path;
      
      // Delete old image if it exists
      if (existingEvent.imageUrl) {
        // Code to delete old file from storage
        // e.g., fs.unlink(existingEvent.imageUrl, (err) => {...});
      }
    }
    
    // If no fields to update, return existing event
    if (Object.keys(updateData).length === 0) {
      return res.json(existingEvent);
    }
    
    // Use $set to update only the specified fields
    const updatedEvent = await Events.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).populate('address.mandal', 'mandalName')
     .populate('createdBy', 'username');

    if (!updatedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json(updatedEvent);
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({
      message: "Error updating event",
      error: error.message,
    });
  }
};

// Delete event
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Events.findOneAndDelete({
      _id: req.params.id,
      // Ensure only admin or creator can delete
      $or: [
        { createdBy: req.user._id },
        { ...(req.user.role === "admin" ? {} : { _id: null }) },
      ],
    });

    if (!event) {
      return res
        .status(404)
        .json({ message: "Event not found or unauthorized" });
    }

    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
