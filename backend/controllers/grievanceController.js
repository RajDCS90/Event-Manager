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

    const grievances = await Grievance.find(filters).populate('createdBy', 'username');
    res.json(grievances);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new grievance
exports.createGrievance = async (req, res) => {
  try {
    const grievanceData = req.body;
    grievanceData.createdBy = req.user.id; // Attach the creator ID
    
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
    const grievance = await Grievance.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    if (!grievance) {
      return res.status(404).json({ message: 'Grievance not found' });
    }
    
    res.json(grievance);
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