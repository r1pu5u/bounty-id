const express = require('express');
const router = express.Router();
const { User } = require('../models');
const { protect } = require('../middleware/auth');

// Debug middleware untuk route user
router.use((req, res, next) => {
  console.log('User route accessed:', req.method, req.path);
  next();
});

// Get user profile
router.get('/profile', protect, async (req, res) => {
  console.log('Profile route accessed, user:', req.user); // Debug log
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { 
        exclude: ['password'] // Jangan kirim password ke frontend
      }
    });

    if (!user) {
      console.log('User not found:', req.user.id); // Debug log
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }

    console.log('User found:', user.id); // Debug log
    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      phone: user.phone || '',
      bio: user.bio || '',
      avatar: user.avatar || '',
      role: user.role,
      points: user.points
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile
router.put('/profile', protect, async (req, res) => {
  try {
    const { fullName, phone, bio, avatar } = req.body;
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }

    // Update user data
    await user.update({
      username: fullName,
      phone,
      bio,
      avatar
    });

    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      phone: user.phone,
      bio: user.bio,
      avatar: user.avatar,
      role: user.role,
      points: user.points
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get leaderboard
router.get('/leaderboard', async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: [
        'id', 
        'username', 
        'points',
        'bugsReported',
        'criticalFinds',
        'totalRewards'
      ],
      order: [['points', 'DESC']],
      limit: 10
    });
    res.json(users);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 