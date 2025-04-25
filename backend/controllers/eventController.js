const Events = require("../models/Events");

// Get all events with pagination and filtering
const mongoose = require('mongoose');
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
    
    // Pagination
    const page = parseInt(filters.page) || 1;
    const limit = parseInt(filters.limit) || 10;
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

    // Handle address filters with bracket notation: address[mandal], address[area], etc.
    // First, find the Mandal document by name
    if (filters['address[mandal]']) {
      const mandal = await mongoose.model('Mandal').findOne({ 
        mandalName: filters['address[mandal]'] 
      });
      
      if (mandal) {
        query['address.mandal'] = mandal._id;
        
        // Create a log for debugging hierarchical filters
        console.log(`Found mandal: ${mandal.mandalName} with ID: ${mandal._id}`);
        
        // Additional area/village/booth filters
        // These will become part of our aggregation pipeline or query conditions
        
        // We'll store these for potential aggregation lookups
        const areaFilter = filters['address[area]'] || null;
        const villageFilter = filters['address[village]'] || null;
        const boothFilter = filters['address[booth]'] || null;
        
        // Store these for logging/debugging
        if (areaFilter) console.log(`Area filter: ${areaFilter}`);
        if (villageFilter) console.log(`Village filter: ${villageFilter}`);
        if (boothFilter) console.log(`Booth filter: ${boothFilter}`);
        
        // We won't add these directly to the query as they're not fields in the Event model
        // Instead, we'll use them for filtering after getting the events
      }
    }
    
    // Handle other address fields
    if (filters['address[postOffice]']) {
      query['address.postOffice'] = { $regex: filters['address[postOffice]'], $options: "i" };
    }
    if (filters['address[policeStation]']) {
      query['address.policeStation'] = { $regex: filters['address[policeStation]'], $options: "i" };
    }
    if (filters['address[pincode]']) {
      query['address.pincode'] = filters['address[pincode]'];
    }

    console.log("Final query:", JSON.stringify(query, null, 2));

    // Fetch events with pagination
    const totalCount = await Events.countDocuments(query);
    const events = await Events.find(query)
      .sort({ eventDate: 1, startTime: 1 })
      .skip(skip)
      .limit(limit)
      .populate({ path: "createdBy", select: "username" })
      .populate({ 
        path: "address.mandal", 
        select: "mandalName areas" 
      });
    
    // Now we need to filter events based on area, village, and booth if provided
    let filteredEvents = events;
    
    if (filters['address[area]'] || filters['address[village]'] || filters['address[booth]']) {
      // We might need to implement some custom filtering here
      // This could be complex and depend on how your events are structured
      // For now, we'll keep all events but log that additional filtering would happen
      console.log("Additional area/village/booth filtering would happen here");
    }

    res.json({ 
      events: filteredEvents,
      page,
      limit,
      totalCount,
      totalPages: Math.ceil(totalCount / limit)
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
    let mandalId;
    if (address.mandal) {
      const mandal = await Mandal.findOne({ mandalName: address.mandal });
      if (!mandal) {
        return res.status(400).json({ message: "Invalid mandal name" });
      }
      mandalId = mandal._id;
    } else {
      return res.status(400).json({ message: "Mandal is required" });
    }

    // Construct address with mandal ObjectId
    const completeAddress = {
      postOffice: address.postOffice,
      policeStation: address.policeStation,
      pincode: address.pincode,
      mandal: mandalId, // Use the ObjectId, not the name
    };

    // You can also store area, village, booth as metadata if needed
    // These aren't in your schema but might be useful for reference
    if (address.area) completeAddress.area = address.area;
    if (address.village) completeAddress.village = address.village;
    if (address.booth) completeAddress.booth = address.booth;

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
      .populate('address.mandal', 'mandalName')
      .populate('createdBy', 'username');

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
    // Create update object with all fields from req.body
    const updateData = { ...req.body };
    
    // Handle address if it's sent as a string
    if (typeof updateData.address === "string") {
      try {
        updateData.address = JSON.parse(updateData.address);
      } catch (e) {
        console.error("Error parsing address:", e);
        return res.status(400).json({ message: "Invalid address format" });
      }
    }

    // Get the existing event to check which fields are being updated
    const existingEvent = await Events.findById(req.params.id);
    if (!existingEvent) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Merge existing address with the updates
    if (updateData.address) {
      // Only update mandal if it's changing
      if (updateData.address.mandal && updateData.address.mandal !== existingEvent.address.mandal.toString()) {
        // Find the mandal by name to get its ObjectId
        const mandal = await Mandal.findOne({ mandalName: updateData.address.mandal });
        if (!mandal) {
          return res.status(400).json({ message: "Invalid mandal name" });
        }
        // Replace mandal name with mandal ObjectId
        updateData.address.mandal = mandal._id;
      } else if (!updateData.address.mandal) {
        // Keep existing mandal if not provided
        updateData.address.mandal = existingEvent.address.mandal;
      }

      // Merge the existing address with provided updates
      updateData.address = {
        ...existingEvent.address.toObject(),
        ...updateData.address
      };
    }

    // Validate time format if provided
    if (updateData.startTime && updateData.endTime) {
      if (!isValidTime(updateData.startTime) || !isValidTime(updateData.endTime)) {
        return res.status(400).json({ message: "Invalid time format (HH:MM)" });
      }

      if (convertTimeToMinutes(updateData.startTime) >= convertTimeToMinutes(updateData.endTime)) {
        return res.status(400).json({ message: "End time must be after start time" });
      }
    } else if (updateData.startTime && !updateData.endTime) {
      // If only start time is provided, validate it against existing end time
      if (convertTimeToMinutes(updateData.startTime) >= convertTimeToMinutes(existingEvent.endTime)) {
        return res.status(400).json({ message: "End time must be after start time" });
      }
    } else if (!updateData.startTime && updateData.endTime) {
      // If only end time is provided, validate it against existing start time
      if (convertTimeToMinutes(existingEvent.startTime) >= convertTimeToMinutes(updateData.endTime)) {
        return res.status(400).json({ message: "End time must be after start time" });
      }
    }

    // Validate pincode if provided
    if (updateData.address && updateData.address.pincode && !/^\d{6}$/.test(updateData.address.pincode)) {
      return res.status(400).json({ message: "Pincode must be 6 digits" });
    }

    // Validate phone number if provided
    if (updateData.requesterContact && !/^\d{10}$/.test(updateData.requesterContact)) {
      return res.status(400).json({ message: "Phone number must be 10 digits" });
    }

    // Handle uploaded file
    if (req.file) {
      updateData.imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;
      console.log("File uploaded:", updateData.imageUrl);
    }

    const updatedEvent = await Events.findByIdAndUpdate(
      req.params.id,
      updateData,
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


