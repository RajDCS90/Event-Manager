const Grievance = require('../models/Grievance');

// Get all grievances (filtered by query params)
exports.getAllGrievances = async (req, res) => {
  try {
    const filters = {};
    
    // Apply filters from query params
    if (req.query.status) {
      filters.status = req.query.status;
    }
    if (req.query.type) {
      filters.type = req.query.type;
    }
    if (req.query.programDate) {
      filters.programDate = new Date(req.query.programDate);
    }
    if (req.query.assignedTo) {
      filters.assignedTo = req.query.assignedTo;
    }

    // For non-admin users, only show their created grievances
    // if (req.user.role !== 'admin') {
    //   filters.createdBy = req.user._id;
    // }

    const grievances = await Grievance.find(filters)
      .populate('createdBy', 'username')
      .sort({ programDate: 1, startTime: 1 }); // Sort by date and time

    res.json(grievances);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new grievance
exports.createGrievance = async (req, res) => {
  try {
    const { programDate, startTime, endTime, ...rest } = req.body;
    
    // Validate date and times
    const dateObj = new Date(programDate);
    if (isNaN(dateObj.getTime())) {
      return res.status(400).json({ message: 'Invalid date format' });
    }

    // Convert time strings to minutes for comparison
    const startMinutes = convertTimeToMinutes(startTime);
    const endMinutes = convertTimeToMinutes(endTime);
    
    if (startMinutes >= endMinutes) {
      return res.status(400).json({ message: 'End time must be after start time' });
    }

    const grievanceData = {
      ...rest,
      programDate: dateObj,
      startTime,
      endTime,
      createdBy: req.user.id
    };
    
    const grievance = new Grievance(grievanceData);
    await grievance.save();
    
    res.status(201).json(grievance);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update grievance
exports.updateGrievance = async (req, res) => {
  try {
    const { programDate, startTime, endTime, ...rest } = req.body;
    const updateData = { ...rest };

    if (programDate) {
      const dateObj = new Date(programDate);
      if (isNaN(dateObj.getTime())) {
        return res.status(400).json({ message: 'Invalid date format' });
      }
      updateData.programDate = dateObj;
    }

    if (startTime || endTime) {
      const grievance = await Grievance.findById(req.params.id);
      const currentStart = startTime || grievance.startTime;
      const currentEnd = endTime || grievance.endTime;

      const startMinutes = convertTimeToMinutes(currentStart);
      const endMinutes = convertTimeToMinutes(currentEnd);
      
      if (startMinutes >= endMinutes) {
        return res.status(400).json({ message: 'End time must be after start time' });
      }

      if (startTime) updateData.startTime = startTime;
      if (endTime) updateData.endTime = endTime;
    }

    const updatedGrievance = await Grievance.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate('createdBy', 'username');
    
    if (!updatedGrievance) {
      return res.status(404).json({ message: 'Grievance not found' });
    }
    
    res.json(updatedGrievance);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete grievance
exports.deleteGrievance = async (req, res) => {
  try {
    const grievance = await Grievance.findByIdAndDelete(req.params.id);
    
    if (!grievance) {
      return res.status(404).json({ message: 'Grievance not found' });
    }
    
    res.json({ message: 'Grievance deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Helper function to convert HH:MM to minutes
function convertTimeToMinutes(timeStr) {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
}