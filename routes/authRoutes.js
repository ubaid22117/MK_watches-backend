const express = require('express');
const router = express.Router();
const {
  registerUser, verifyEmail, resendVerification,
  loginUser, forgotPassword, resetPassword,
  getUserProfile, updateUserProfile,
} = require('../controllers/authController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Customer routes
router.post('/register', registerUser);
router.get('/verify-email/:token', verifyEmail);
router.post('/resend-verification', resendVerification);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);

// Separate Admin login route
router.post('/admin/login', async (req, res) => {
  try {
    const { loginUser: login } = require('../controllers/authController');
    const { email, password } = req.body;
    
    // Reuse loginUser but add admin check
    const User = require('../models/userModel');
    const bcrypt = require('bcryptjs');
    const jwt = require('jsonwebtoken');

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (!user.isAdmin) {
      return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

    res.json({
      success: true,
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      isVerified: user.isVerified,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;