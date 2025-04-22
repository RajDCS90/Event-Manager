const Grievance = require('../models/Grievance');

// Get all grievances (filtered by query params)
exports.getAllGrievances = async (req, res) => {
  try {
    const filters = {};
    
    // Apply filters from query params
    if (req.query.status) {
      filters.status = req.query.status;
    }
    if (req.query.mandal) {
      filters.mandal = req.query.mandal;
    }
    if (req.query.programDate) {
      // Handle both date string and ISO format
      const date = new Date(req.query.programDate);
      if (!isNaN(date.getTime())) {
        // Filter for the entire day
        const startOfDay = new Date(date);
        startOfDay.setUTCHours(0, 0, 0, 0);
        
        const endOfDay = new Date(date);
        endOfDay.setUTCHours(23, 59, 59, 999);
        
        filters.programDate = {
          $gte: startOfDay,
          $lte: endOfDay
        };
      }
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
    // Create update object with all fields from req.body
    const updateData = { ...req.body };

    // Parse date if provided
    if (updateData.programDate) {
      const dateObj = new Date(updateData.programDate);
      if (isNaN(dateObj.getTime())) {
        return res.status(400).json({ message: 'Invalid date format' });
      }
      updateData.programDate = dateObj;
    }

    // Handle start and end time validation
    if (updateData.startTime || updateData.endTime) {
      const grievance = await Grievance.findById(req.params.id);
      if (!grievance) {
        return res.status(404).json({ message: 'Grievance not found' });
      }

      const currentStart = updateData.startTime || grievance.startTime;
      const currentEnd = updateData.endTime || grievance.endTime;

      const startMinutes = convertTimeToMinutes(currentStart);
      const endMinutes = convertTimeToMinutes(currentEnd);

      if (startMinutes >= endMinutes) {
        return res.status(400).json({ message: 'End time must be after start time' });
      }
    }

    // Handle uploaded file (if any)
    if (req.file) {
      updateData.imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;
      console.log('File uploaded:', updateData.imageUrl); // Debug log
    }

    const updatedGrievance = await Grievance.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('createdBy', 'username');

    if (!updatedGrievance) {
      return res.status(404).json({ message: 'Grievance not found' });
    }

    res.json(updatedGrievance);
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({
      message: 'Error updating grievance',
      error: error.message
    });
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