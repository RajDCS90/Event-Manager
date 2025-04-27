const PartyAndYouth = require('../models/PartyAndYouth');
const crypto = require('crypto');

// Encryption configuration (should match schema configuration)
// const encryptionAlgorithm = 'aes-256-cbc';
// const encryptionKey = crypto.randomBytes(32); // Must be same as in schema
// const iv = crypto.randomBytes(16); // Must be same as in schema

// Function to encrypt data (for manual encryption if needed)
// function encryptAadhar(text) {
//   const cipher = crypto.createCipheriv(encryptionAlgorithm, Buffer.from(encryptionKey), iv);
//   let encrypted = cipher.update(text, 'utf8', 'hex');
//   encrypted += cipher.final('hex');
//   return encrypted;
// }

// Function to decrypt data (for manual decryption if needed)
// function decryptAadhar(encryptedText) {
//   const decipher = crypto.createDecipheriv(encryptionAlgorithm, Buffer.from(encryptionKey), iv);
//   let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
//   decrypted += decipher.final('utf8');
//   return decrypted;
// }
// Get all party members (filtered by query params)
exports.getAllPartyMembers = async (req, res) => {
  try {
    const { search, mandal, designation, status } = req.query;
    const filters = {};

    if (search) {
      filters.name = { $regex: search, $options: 'i' };
    }

    if (mandal) {
      filters['address.mandal'] = mandal;
    }

    if (designation) {
      filters.designation = designation;
    }

    if (status === 'inactive') {
      filters.isActive = false;
    } else {
      filters.isActive = true;
    }

    const members = await PartyAndYouth.find(filters).lean();
    
    // Mask Aadhar numbers in response
    const safeMembers = members.map(member => ({
      ...member,
      aadharNo: member.aadharNo ? `****${member.aadharNo.slice(-4)}` : null
    }));
    
    res.json(safeMembers);
  } catch (error) {
    console.error('Error fetching members:', error);
    res.status(500).json({ 
      message: 'Error fetching members',
      error: error.message 
    });
  }
};
// Create new party member

exports.createPartyMember = async (req, res) => {
  try {
    const memberData = req.body;
    
    // Validate Aadhar before processing
    if (!memberData.aadharNo || !/^\d{12}$/.test(String(memberData.aadharNo).trim())) {
      return res.status(400).json({ 
        message: 'Aadhar number must be exactly 12 digits' 
      });
    }

    // Convert to string explicitly
    memberData.aadharNo = String(memberData.aadharNo).trim();
    
    if (req.user) {
      memberData.createdBy = req.user.id;
    }
    
    const member = new PartyAndYouth(memberData);
    await member.save();
    
    // Return response with masked Aadhar
    const response = member.toObject();
    response.aadharNo = `****${response.aadharNo.slice(-4)}`;
    
    res.status(201).json(response);
  } catch (error) {
    console.error('Create member error:', {
      error: error.message,
      stack: error.stack
    });
    
    const message = error.message.includes('validation failed') 
      ? error.message.replace('PartyAndYouth validation failed: ', '')
      : error.message;
    
    res.status(400).json({ 
      message,
      details: error.errors ? Object.values(error.errors).map(e => e.message) : undefined
    });
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
    const member = await PartyAndYouth.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }

    res.json({ message: 'Member deactivated successfully', member });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Reactivate (make active) an inactive party member
exports.reactivatePartyMember = async (req, res) => {
  try {
    const member = await PartyAndYouth.findByIdAndUpdate(
      req.params.id,
      { isActive: true },
      { new: true }
    );

    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }

    res.json({ message: 'Member reactivated successfully', member });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
