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

    const events = await Events.find(filters).populate('createdBy', 'username');
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new event
exports.createEvent = async (req, res) => {
  try {
    const eventData = req.body;
    eventData.createdBy = req.user.id; // Attach the creator ID
    
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
    const event = await Events.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    res.json(event);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete event
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