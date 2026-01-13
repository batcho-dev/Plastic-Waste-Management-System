const jwt = require('jsonwebtoken');
const db = require('../config/db');  // Add this import
require('dotenv').config();

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // GET USER FROM DATABASE TO ENSURE THEY STILL EXIST
      const [users] = await db.query(
        'SELECT id, full_name, email, role, points FROM users WHERE id = ? AND is_active = TRUE',
        [decoded.id]
      );

      if (users.length === 0) {
        return res.status(401).json({ error: 'User not found or inactive' });
      }

      // Attach user to request
      req.user = users[0];  // Now has: id, full_name, email, role, points

      next();
    } catch (error) {
      console.error('Auth middleware error:', error);
      
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ error: 'Invalid token' });
      }
      
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Token expired. Please login again.' });
      }
      
      return res.status(401).json({ error: 'Not authorized' });
    }
  }

  if (!token) {
    return res.status(401).json({ error: 'Not authorized - no token' });
  }
};

// Role-based protection middleware
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'You do not have permission to perform this action'
      });
    }
    next();
  };
};

module.exports = { protect, restrictTo };