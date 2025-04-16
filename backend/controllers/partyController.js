const PartyAndYouth = require('../models/PartyAndYouth');

// Get all party members (filtered by query params)
exports.getAllPartyMembers = async (req, res) => {
  console.log("enter")
  try {
    const filters = {};
    
    // Apply filters from query params
    if (req.query.mandal) {
      filters.mandal = req.query.mandal;
    }
    if (req.query.designation) {
      filters.designation = req.query.designation;
    }

    const members = await PartyAndYouth.find(filters);
    res.json(members);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new party member (public access)
exports.createPartyMember = async (req, res) => {
  try {
    const memberData = req.body;
    
    // If user is logged in, attach the creator ID
    if (req.user) {
      memberData.createdBy = req.user.id;
    }
    
    const member = new PartyAndYouth(memberData);
    await member.save();
    
    res.status(201).json(member);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update party member
exports.updatePartyMember = async (req, res) => {
  try {
    const member = await PartyAndYouth.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }
    
    res.json(member);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete party member
exports.deletePartyMember = async (req, res) => {
  try {
    const member = await PartyAndYouth.findByIdAndDelete(req.params.id);
    
    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }
    
    res.json({ message: 'Member deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};