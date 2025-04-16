const Events = require("../models/Events");

// Get all events (filtered by query params)
exports.getAllEvents = async (req, res) => {
  try {
    const filters = {};
    
    // Apply filters from query params
    if (req.query.eventType) {
      filters.eventType = req.query.eventType;
    }
    if (req.query.status) {
      filters.status = req.query.status;
    }
    if (req.query.mandal) {
      filters.mandal = req.query.mandal;
    }
    if (req.query.date) {
      filters.eventDate = new Date(req.query.date);
    }

    // For non-admin users, only show their own events
    // if (req.user.role !== 'admin') {
    //   filters.createdBy = req.user._id;
    // }

    const events = await Events.find(filters)
      .populate('createdBy', 'username')
      .sort({ eventDate: 1, startTime: 1 }); // Sort by date and time

    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new event
exports.createEvent = async (req, res) => {
  try {
    const { eventDate, startTime, endTime, ...rest } = req.body;
    
    // Validate date and times
    const dateObj = new Date(eventDate);
    if (isNaN(dateObj.getTime())) {
      return res.status(400).json({ message: 'Invalid date format' });
    }

    // Convert time strings to minutes for comparison
    const startMinutes = convertTimeToMinutes(startTime);
    const endMinutes = convertTimeToMinutes(endTime);
    
    if (startMinutes >= endMinutes) {
      return res.status(400).json({ message: 'End time must be after start time' });
    }

    const eventData = {
      ...rest,
      eventDate: dateObj,
      startTime,
      endTime,
      createdBy: req.user.id
    };
    
    const event = new Events(eventData);
    await event.save();
    
    res.status(201).json(event);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update event
exports.updateEvent = async (req, res) => {
  try {
    const { eventDate, startTime, endTime, ...rest } = req.body;
    const updateData = { ...rest };

    if (eventDate) {
      const dateObj = new Date(eventDate);
      if (isNaN(dateObj.getTime())) {
        return res.status(400).json({ message: 'Invalid date format' });
      }
      updateData.eventDate = dateObj;
    }

    if (startTime || endTime) {
      const event = await Events.findById(req.params.id);
      const currentStart = startTime || event.startTime;
      const currentEnd = endTime || event.endTime;

      const startMinutes = convertTimeToMinutes(currentStart);
      const endMinutes = convertTimeToMinutes(currentEnd);
      
      if (startMinutes >= endMinutes) {
        return res.status(400).json({ message: 'End time must be after start time' });
      }

      if (startTime) updateData.startTime = startTime;
      if (endTime) updateData.endTime = endTime;
    }

    const updatedEvent = await Events.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate('createdBy', 'username');
    
    if (!updatedEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    res.json(updatedEvent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete event (unchanged)
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Events.findByIdAndDelete(req.params.id);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
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