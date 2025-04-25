const Events = require("../models/Events");

// Get all events with pagination and filtering
exports.getAllEvents = async (req, res) => {
  try {
    const filters = req.query;
    const query = {};

    // Apply filters
    if (filters.eventType) {
      query.eventType = filters.eventType;
    }
    if (filters.status) {
      query.status = filters.status;
    }
    if (filters.mandal) {
      query.mandal = filters.mandal;
    }
    if (filters.venue) {
      query.venue = { $regex: filters.venue, $options: "i" };
    }

    // Handle date range
    if (filters.dateRange) {
      const [startDate, endDate] = filters.dateRange.split(",");
      const start = new Date(startDate);
      const end = new Date(endDate);

      if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        query.eventDate = { $gte: start, $lte: end };
      }
    } 
    // Handle single date filter
    else if (filters.eventDate) {
      const date = new Date(filters.eventDate);
      if (!isNaN(date.getTime())) {
        const startOfDay = new Date(date.setHours(0, 0, 0, 0));
        const endOfDay = new Date(date.setHours(23, 59, 59, 999));
        query.eventDate = { $gte: startOfDay, $lte: endOfDay };
      }
    }

    // ... rest of your existing filters ...

    // Fetch all events matching the query
    const events = await Events.find(query)
      .sort({ eventDate: 1, startTime: 1 })
      .populate({ path: "createdBy", select: "username" });

    res.json({ events });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new event with full schema validation
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

    // Construct address with mandal (if needed)
    const completeAddress = {
      village: address.village,
      postOffice: address.postOffice,
      policeStation: address.policeStation,
      pincode: address.pincode,
      mandal: address.mandal, // ✅ include mandal inside address
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

    res.status(201).json(event);
  } catch (error) {
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

    // Handle uploaded file
    if (req.file) {
      updateData.imageUrl = `http://localhost:5000/uploads/${req.file.filename}`; // Store the path to the image
      console.log("File uploaded:", updateData.imageUrl); // Debug log
    }

    const updatedEvent = await Events.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

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

// Helper function to convert HH:MM to minutes
function convertTimeToMinutes(timeStr) {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours * 60 + minutes;
}

// Helper function to validate time format
function isValidTime(timeStr) {
  return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(timeStr);
}
