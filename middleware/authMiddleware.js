const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// Login check — kya user logged in hai?
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Token nikalo
      token = req.headers.authorization.split(' ')[1];
      
      // Verify karo
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // User find karo (password chhod ke)
      req.user = await User.findById(decoded.id).select('-password');
      
      next();
    } catch (error) {
      res.status(401).json({ message: 'Token galat hai, access nahi milega' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Token nahi hai, access nahi milega' });
  }
};

// Admin check — sirf admin access kar sake
const adminOnly = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).json({ message: 'Sirf Admin access kar sakta hai' });
  }
};

module.exports = { protect, adminOnly };