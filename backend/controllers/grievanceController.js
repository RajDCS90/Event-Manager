const Grievance = require('../models/Grievance');
const Mandal = require('../models/Mandal');
const mongoose = require('mongoose');

// Get all grievances (filtered by query params)
exports.getAllGrievances = async (req, res) => {
  try {
    const filters = req.query;
    const query = {};
    

    // Handle address filters
    if (filters.mandal) {
      const mandal = await Mandal.findOne({
        mandalName: filters.mandal,
      });
      if (mandal) {
        query["address.mandal"] = mandal._id;
      } else if (mongoose.Types.ObjectId.isValid(filters.mandal)) {
        query["address.mandal"] = filters.mandal;
      }
    }

    // Other filters
    if (filters.area) query["address.area"] = filters.area;
    if (filters.village) query["address.village"] = filters.village;
    if (filters.booth) query["address.booth"] = filters.booth;


    // Date filtering
    if (filters.startDate && filters.endDate) {
      const startDate = new Date(filters.startDate);
      const endDate = new Date(filters.endDate);
      startDate.setUTCHours(0, 0, 0, 0);
      endDate.setUTCHours(23, 59, 59, 999);
      query.programDate = { $gte: startDate, $lte: endDate };
    }

    const grievances = await Grievance.find(query)
      .populate('address.mandal', 'mandalName')
      .populate('createdBy', 'username')
      .sort({ programDate: 1, startTime: 1 });

    return res.json(grievances);

  } catch (error) {
    console.error('Error fetching grievances:', error);
    return res.status(500).json({ message: error.message });
  }
};

// Create new grievance
exports.createGrievance = async (req, res) => {
  try {
    const { programDate, startTime, endTime, address = {}, ...rest } = req.body;

    // Validate date
    const dateObj = new Date(programDate);
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

    // Validate phone number if provided
    if (rest.requesterContact && !/^\d{10}$/.test(rest.requesterContact)) {
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

    const grievanceData = {
      ...rest,
      programDate: dateObj,
      startTime,
      endTime,
      address: completeAddress,
      createdBy: req.user.id,
    };

    const grievance = new Grievance(grievanceData);
    await grievance.save();

    // Fetch the created grievance with populated mandal for the response
    const populatedGrievance = await Grievance.findById(grievance._id)
      .populate("address.mandal", "mandalName")
      .populate("createdBy", "username");

    res.status(201).json(populatedGrievance);
  } catch (error) {
    console.error("Create grievance error:", error);
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
      updateData.address = grievance.address ? { ...grievance.address } : {};
      
      // Process mandal - handle as object with _id property
      if (address.mandal) {
        let mandalId;
        let mandalName;
        
        // Check different possible mandal formats
        if (address.mandal._id) {
          mandalId = address.mandal._id;
          mandalName = address.mandal.mandalName;
        } else if (mongoose.Types.ObjectId.isValid(address.mandal)) {
          mandalId = address.mandal;
        } else if (typeof address.mandal === 'string') {
          const mandal = await Mandal.findOne({ mandalName: address.mandal });
          if (!mandal) {
            return res.status(400).json({ message: `Mandal with name "${address.mandal}" not found` });
          }
          mandalId = mandal._id;
          mandalName = mandal.mandalName;
        } else if (address.mandal.mandalName) {
          const mandal = await Mandal.findOne({ mandalName: address.mandal.mandalName });
          if (!mandal) {
            return res.status(400).json({ message: `Mandal with name "${address.mandal.mandalName}" not found` });
          }
          mandalId = mandal._id;
          mandalName = mandal.mandalName;
        }

        if (mandalId) {
          updateData.address.mandal = mandalId;
          updateData.address.mandalName = mandalName || (await Mandal.findById(mandalId)).mandalName;
        }
      }

      // Update other address fields
      if (address.area) {
        updateData.address.area = address.area;
        // Find and set areaType from the mandal's areas
        if (updateData.address.mandal) {
          const mandal = await Mandal.findById(updateData.address.mandal);
          if (mandal) {
            const areaInfo = mandal.areas.find(a => a.name === address.area);
            if (areaInfo) {
              updateData.address.areaType = areaInfo.type;
            }
          }
        }
      }
      
      if (address.village) updateData.address.village = address.village;
      if (address.booth) updateData.address.booth = address.booth;
      if (address.postOffice) updateData.address.postOffice = address.postOffice;
      if (address.policeStation) updateData.address.policeStation = address.policeStation;
      if (address.pincode) updateData.address.pincode = address.pincode;
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

    return res.json(updatedGrievance);
  } catch (error) {
    console.error('Update error:', error);
    return res.status(500).json({
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

function isValidTime(timeStr) {
  return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(timeStr);
}