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
      query.venue = { $regex: filters.venue, $options: 'i' };
    }
    
    // Handle date range
   if (filters.eventDate) {
      const date = new Date(filters.eventDate);
      if (!isNaN(date.getTime())) {
        const startOfDay = new Date(date.setHours(0, 0, 0, 0));
        const endOfDay = new Date(date.setHours(23, 59, 59, 999));
        query.eventDate = { $gte: startOfDay, $lte: endOfDay };
      }
    }
    
    if (filters.requesterName) {
      query.requesterName = { $regex: filters.requesterName, $options: 'i' };
    }
    if (filters.description) {
      query.description = { $regex: filters.description, $options: 'i' };
    }

    // Address filters
    if (filters.village) {
      query['address.village'] = { $regex: filters.village, $options: 'i' };
    }
    if (filters.postOffice) {
      query['address.postOffice'] = { $regex: filters.postOffice, $options: 'i' };
    }
    if (filters.policeStation) {
      query['address.policeStation'] = { $regex: filters.policeStation, $options: 'i' };
    }
    if (filters.pincode) {
      query['address.pincode'] = filters.pincode;
    }

    // Fetch all events matching the query
    const events = await Events.find(query)
      .sort({ eventDate: 1, startTime: 1 })
      .populate({ path: 'createdBy', select: 'username' });

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
      return res.status(400).json({ message: 'Invalid date format' });
    }

    // Validate times
    if (!isValidTime(startTime) || !isValidTime(endTime)) {
      return res.status(400).json({ message: 'Invalid time format (HH:MM)' });
    }

    if (convertTimeToMinutes(startTime) >= convertTimeToMinutes(endTime)) {
      return res.status(400).json({ message: 'End time must be after start time' });
    }

    // Validate pincode if provided
    if (address.pincode && !/^\d{6}$/.test(address.pincode)) {
      return res.status(400).json({ message: 'Pincode must be 6 digits' });
    }

    // Validate phone number
    if (!/^\d{10}$/.test(rest.requesterContact)) {
      return res.status(400).json({ message: 'Phone number must be 10 digits' });
    }

    const eventData = {
      ...rest,
      eventDate: dateObj,
      startTime,
      endTime,
      address,
      createdBy: req.user.id
    };
    
    const event = new Events(eventData);
    await event.save();
    
    res.status(201).json(event);
  } catch (error) {
    res.status(400).json({ 
      message: 'Validation failed',
      errors: error.errors ? Object.keys(error.errors).reduce((acc, key) => {
        acc[key] = error.errors[key].message;
        return acc;
      }, {}) : error.message
    });
  }
};

// Update event with full validation
exports.updateEvent = async (req, res) => {
  try {
    const { eventDate, startTime, endTime, address, ...rest } = req.body;
    const updateData = { ...rest };

    // Validate date if provided
    if (eventDate) {
      const dateObj = new Date(eventDate);
      if (isNaN(dateObj.getTime())) {
        return res.status(400).json({ message: 'Invalid date format' });
      }
      updateData.eventDate = dateObj;
    }

    // Validate times if provided
    if (startTime || endTime) {
      const event = await Events.findById(req.params.id);
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }

      const currentStart = startTime || event.startTime;
      const currentEnd = endTime || event.endTime;

      if (!isValidTime(currentStart) || !isValidTime(currentEnd)) {
        return res.status(400).json({ message: 'Invalid time format (HH:MM)' });
      }

      if (convertTimeToMinutes(currentStart) >= convertTimeToMinutes(currentEnd)) {
        return res.status(400).json({ message: 'End time must be after start time' });
      }

      if (startTime) updateData.startTime = startTime;
      if (endTime) updateData.endTime = endTime;
    }

    // Validate address if provided
    if (address) {
      if (address.pincode && !/^\d{6}$/.test(address.pincode)) {
        return res.status(400).json({ message: 'Pincode must be 6 digits' });
      }
      updateData.address = address;
    }

    // Validate phone number if provided
    if (rest.requesterContact && !/^\d{10}$/.test(rest.requesterContact)) {
      return res.status(400).json({ message: 'Phone number must be 10 digits' });
    }

    const updatedEvent = await Events.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('createdBy', 'username');
    
    if (!updatedEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    res.json(updatedEvent);
  } catch (error) {
    res.status(400).json({ 
      message: 'Validation failed',
      errors: error.errors ? Object.keys(error.errors).reduce((acc, key) => {
        acc[key] = error.errors[key].message;
        return acc;
      }, {}) : error.message
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
        { ...(req.user.role === 'admin' ? {} : { _id: null }) }
      ]
    });
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found or unauthorized' });
    }
    
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Helper function to convert HH:MM to minutes
function convertTimeToMinutes(timeStr) {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
}

// Helper function to validate time format
function isValidTime(timeStr) {
  return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(timeStr);
}