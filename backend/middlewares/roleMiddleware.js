const checkTableAccess = (requiredTable) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized - No user information' });
  }

  // Admins have full access
  if (req.user.role === 'admin') {
    return next();
  }

  // Check if user has access to the required table
  if (requiredTable && !req.user.assignedTables.includes(requiredTable)) {
    return res.status(403).json({ message: 'Forbidden - No access to this resource' });
  }

  next();
};

const checkAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized - No user information' });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden - Admin access required' });
  }

  next();
};

module.exports = { checkTableAccess, checkAdmin };