const Grievance = require('../models/Grievance');
const Mandal = require('../models/Mandal');
const mongoose = require('mongoose');

// Get all grievances (filtered by query params)
exports.getAllGrievances = async (req, res) => {
  try {
    // Build filter object
    const filters = {};
    
    // Basic filters
    if (req.query.status) {
      filters.status = req.query.status;
    }
    
    // Address filters
    if (req.query.mandal) {
      // Try to find mandal by name if it's not a valid ObjectId
      if (mongoose.Types.ObjectId.isValid(req.query.mandal)) {
        filters['address.mandal'] = mongoose.Types.ObjectId(req.query.mandal);
      } else {
        // Look up mandal by name
        try {
          const mandal = await Mandal.findOne({ mandalName: req.query.mandal });
          if (mandal) {
            filters['address.mandal'] = mandal._id;
          } else {
            // No matching mandal found, return empty result
            return res.json([]);
          }
        } catch (err) {
          console.error('Error finding mandal by name:', err);
          return res.status(400).json({ message: 'Error processing mandal filter' });
        }
      }
    }
    
    // Filter by area, village, and booth
    if (req.query.area) {
      filters['address.area'] = req.query.area;
    }
    
    if (req.query.village) {
      filters['address.village'] = req.query.village;
    }
    
    if (req.query.booth) {
      filters['address.booth'] = req.query.booth;
    }

    // Handle date filters
    if (req.query.programDate) {
      // Single date filter
      const date = new Date(req.query.programDate);
      if (!isNaN(date.getTime())) {
        const startOfDay = new Date(date);
        startOfDay.setUTCHours(0, 0, 0, 0);
        
        const endOfDay = new Date(date);
        endOfDay.setUTCHours(23, 59, 59, 999);
        
        filters.programDate = {
          $gte: startOfDay,
          $lte: endOfDay
        };
      }
    } else if (req.query.startDate && req.query.endDate) {
      // Date range filter
      const startDate = new Date(req.query.startDate);
      const endDate = new Date(req.query.endDate);
      
      if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
        startDate.setUTCHours(0, 0, 0, 0);
        endDate.setUTCHours(23, 59, 59, 999);
        
        filters.programDate = {
          $gte: startDate,
          $lte: endDate
        };
      }
    }

    console.log('Applied filters:', filters);

    const grievances = await Grievance.find(filters)
      .populate('address.mandal', 'mandalName')
      .populate('createdBy', 'username')
      .sort({ programDate: 1, startTime: 1 });

    res.json(grievances);
  } catch (error) {
    console.error('Error fetching grievances:', error);
    res.status(500).json({ message: error.message });
  }
};

// Create new grievance
exports.createGrievance = async (req, res) => {
  try {
    const { programDate, startTime, endTime, address, ...rest } = req.body;
    
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

    // Process address data
    const addressData = {};
    
    // Handle mandal - look up by name if string is provided
    if (address.mandal) {
      if (mongoose.Types.ObjectId.isValid(address.mandal)) {
        addressData.mandal = address.mandal;
      } else {
        // Try to find the mandal by name
        const mandal = await Mandal.findOne({ mandalName: address.mandal });
        if (!mandal) {
          return res.status(400).json({ message: `Mandal with name "${address.mandal}" not found` });
        }
        addressData.mandal = mandal._id;
      }
    } else {
      return res.status(400).json({ message: 'Mandal is required' });
    }
    
    // Store other address fields
    addressData.area = address.area;
    addressData.village = address.village;
    addressData.booth = address.booth;
    addressData.postOffice = address.postOffice;
    addressData.policeStation = address.policeStation;
    addressData.pincode = address.pincode;

    const grievanceData = {
      ...rest,
      programDate: dateObj,
      startTime,
      endTime,
      address: addressData,
      createdBy: req.user.id
    };
    
    const grievance = new Grievance(grievanceData);
    await grievance.save();
    
    // Populate the mandal field for the response
    await grievance.populate('address.mandal', 'mandalName');
    await grievance.populate('createdBy', 'username');
    
    res.status(201).json(grievance);
  } catch (error) {
    console.error('Error creating grievance:', error);
    res.status(400).json({ message: error.message });
  }
};

// Update grievance
exports.updateGrievance = async (req, res) => {
  try {
    const { programDate, startTime, endTime, address, ...rest } = req.body;
    const updateData = { ...rest };

    // Parse date if provided
    if (programDate) {
      const dateObj = new Date(programDate);
      if (isNaN(dateObj.getTime())) {
        return res.status(400).json({ message: 'Invalid date format' });
      }
      updateData.programDate = dateObj;
    }

    // Handle time validation
    const grievance = await Grievance.findById(req.params.id);
    if (!grievance) {
      return res.status(404).json({ message: 'Grievance not found' });
    }

    const currentStart = startTime || grievance.startTime;
    const currentEnd = endTime || grievance.endTime;
    updateData.startTime = currentStart;
    updateData.endTime = currentEnd;

    const startMinutes = convertTimeToMinutes(currentStart);
    const endMinutes = convertTimeToMinutes(currentEnd);

    if (startMinutes >= endMinutes) {
      return res.status(400).json({ message: 'End time must be after start time' });
    }

    // Handle address updates
    if (address) {
      updateData.address = {};
      
      // Process mandal - handle as object with _id property
      if (address.mandal) {
        // Check if mandal is an object with _id
        if (address.mandal._id) {
          // Use the _id property directly
          updateData.address.mandal = address.mandal._id;
        } 
        // If it's a string ID
        else if (mongoose.Types.ObjectId.isValid(address.mandal)) {
          updateData.address.mandal = address.mandal;
        } 
        // If it's a string name
        else if (typeof address.mandal === 'string') {
          const mandal = await Mandal.findOne({ mandalName: address.mandal });
          if (!mandal) {
            return res.status(400).json({ message: `Mandal with name "${address.mandal}" not found` });
          }
          updateData.address.mandal = mandal._id;
        }
        // If it has a mandalName property (object with mandalName)
        else if (address.mandal.mandalName) {
          const mandal = await Mandal.findOne({ mandalName: address.mandal.mandalName });
          if (!mandal) {
            return res.status(400).json({ message: `Mandal with name "${address.mandal.mandalName}" not found` });
          }
          updateData.address.mandal = mandal._id;
        }
        else {
          return res.status(400).json({ message: 'Invalid mandal format' });
        }
      } else if (grievance.address && grievance.address.mandal) {
        // Keep existing mandal if not provided
        updateData.address.mandal = grievance.address.mandal;
      }
      
      // Update other address fields
      updateData.address.area = address.area || (grievance.address ? grievance.address.area : '');
      updateData.address.village = address.village || (grievance.address ? grievance.address.village : '');
      updateData.address.booth = address.booth || (grievance.address ? grievance.address.booth : '');
      updateData.address.postOffice = address.postOffice || (grievance.address ? grievance.address.postOffice : '');
      updateData.address.policeStation = address.policeStation || (grievance.address ? grievance.address.policeStation : '');
      updateData.address.pincode = address.pincode || (grievance.address ? grievance.address.pincode : '');
    }

    // Handle uploaded file (if any)
    if (req.file) {
      updateData.imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;
    }

    const updatedGrievance = await Grievance.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    )
    .populate('address.mandal', 'mandalName')
    .populate('createdBy', 'username');

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

// Get grievance by ID
exports.getGrievanceById = async (req, res) => {
  try {
    const grievance = await Grievance.findById(req.params.id)
      .populate('address.mandal', 'mandalName')
      .populate('createdBy', 'username');
    
    if (!grievance) {
      return res.status(404).json({ message: 'Grievance not found' });
    }
    
    res.json(grievance);
  } catch (error) {
    res.status(500).json({ message: error.message });
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