const PartyAndYouth = require('../models/PartyAndYouth');

// Get all party members (filtered by query params)
exports.getAllPartyMembers = async (req, res) => {
  try {
    const { 
      search, 
      mandal, 
      designation, 
      status,
      ward,
      panchayat,
      village,
      booth,
      areaType
    } = req.query;
    
    const filters = {};
    let shouldLimitResults = false;

    // Check if any filter is applied (excluding status)
    const hasFilters = search || mandal || designation || ward || panchayat || village || booth || areaType;

    // Search filter
    if (search) {
      filters.name = { $regex: search, $options: 'i' };
    }

    // Mandal filter
    if (mandal) {
      filters['address.mandal'] = mandal;
    }

    // Designation filter
    if (designation) {
      filters.designation = designation;
    }

    // Status filter (defaults to active users)
    if (status === 'inactive') {
      filters.isActive = false;
    } else {
      filters.isActive = true;
      // Only limit results if no filters are applied and we're showing active users
      if (!hasFilters) {
        shouldLimitResults = true;
      }
    }

    // Ward filter
    if (ward) {
      filters['address.area'] = ward;
      filters['address.areaType'] = 'Ward';
    }

    // Panchayat filter
    if (panchayat) {
      filters['address.area'] = panchayat;
      filters['address.areaType'] = 'Panchayat';
    }

    // Village filter
    if (village) {
      filters['address.village'] = village;
    }

    // Booth filter
    if (booth) {
      filters['address.booth'] = booth;
    }

    // Area type filter (if neither ward nor panchayat is specified)
    if (areaType && !ward && !panchayat) {
      filters['address.areaType'] = areaType;
    }

    // Create base query
    let query = PartyAndYouth.find(filters);

    // Apply limit only if no filters are present and we're showing active users
    if (shouldLimitResults) {
      query = query.limit(30);
    }

    const members = await query.lean();

    // Mask Aadhar numbers in response
    const safeMembers = members.map(member => ({
      ...member,
      aadharNo: member.aadharNo ? `****${member.aadharNo.slice(-4)}` : null
    }));
    
    res.json({
      data: safeMembers,
      limited: shouldLimitResults // Indicates if results were limited
    });
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
