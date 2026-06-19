const User = require('../models/userModel');

// GET /api/users — Sab users (Admin)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json({ success: true, count: users.length, users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/users/:id — User delete (Admin)
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User nahi mila' });
    }
    if (user.isAdmin) {
      return res.status(400).json({ message: 'Admin ko delete nahi kar sakte' });
    }
    await user.deleteOne();
    res.json({ success: true, message: 'User delete ho gaya' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllUsers, deleteUser };