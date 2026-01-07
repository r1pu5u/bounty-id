const express = require('express');
const router = express.Router();
const { User, Report } = require('../models');
const { protect } = require('../middleware/auth');
const { Op } = require('sequelize');

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

    // Hitung jumlah laporan yang diterima (Accepted)
    const bugsAccepted = await Report.count({
      where: {
        reporterId: user.id,
        status: 'Accepted'
      }
    });

    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      phone: user.phone || '',
      bio: user.bio || '',
      avatar: user.avatar || '',
      role: user.role,
      points: user.points,
      bugsReported: user.bugsReported || 0,
      criticalFinds: user.criticalFinds || 0,
      totalRewards: user.totalRewards || 0,
      bugsAccepted: bugsAccepted || 0
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile
router.put('/profile', protect, async (req, res) => {
  try {
    const { fullName, phone, bio, avatar, bankName, bankAccountNumber, bankAccountHolder, paypalEmail } = req.body;
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }

    // Update user data
    await user.update({
      username: fullName,
      phone,
      bio,
      avatar,
      bankName,
      bankAccountNumber,
      bankAccountHolder,
      paypalEmail
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

// Get leaderboard (dynamic points calculated from accepted reports)
router.get('/leaderboard', async (req, res) => {
  try {
    // point mapping: Critical 40, High 20, Medium 10, Low 5
    const sql = `
      SELECT u.id, u.username,
        COALESCE(SUM(CASE
          WHEN UPPER(r.severity) = 'CRITICAL' THEN 40
          WHEN UPPER(r.severity) = 'HIGH' THEN 20
          WHEN UPPER(r.severity) = 'MEDIUM' THEN 10
          WHEN UPPER(r.severity) = 'LOW' THEN 5
          ELSE 0 END), 0) AS points,
        COUNT(r.id) AS bugsReported,
        COALESCE(SUM(CASE WHEN UPPER(r.severity) = 'CRITICAL' THEN 1 ELSE 0 END), 0) AS criticalFinds,
        COALESCE(SUM(r.reward), 0) AS totalRewards
      FROM Users u
      LEFT JOIN Reports r ON r.reporterId = u.id AND UPPER(r.status) = 'ACCEPTED'
      WHERE u.role <> 'admin'
      GROUP BY u.id, u.username
      ORDER BY points DESC
      LIMIT 10
    `;

    const { sequelize } = require('../config/db');
    const [results] = await sequelize.query(sql);
    res.json(results);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user stats (for dashboard)
router.get('/stats', protect, async (req, res) => {
  try {
    // find user just to verify they exist
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }

    // 1) Total bugs reported
    const bugsReported = await Report.count({
      where: { reporterId: user.id }
    });

    // 2) Total critical findings
    const criticalFinds = await Report.count({
      where: {
        reporterId: user.id,
        severity: 'Critical'
      }
    });

    // 3) Count of accepted bugs
    const bugsAccepted = await Report.count({
      where: {
        reporterId: user.id,
        status: 'Accepted'
      }
    });

    // 4) Sum of rewards for accepted bugs
    let rewardDiterima = await Report.sum('reward', {
      where: {
        reporterId: user.id,
        status: 'Accepted'
      }
    });
    // if no accepted, sum returns null
    rewardDiterima = rewardDiterima || 0;

    // return with Indonesian field names
    res.json({
      bugDilaporkan:  bugsReported,
      temuanKritis:   criticalFinds,
      rewardDiterima: parseFloat(rewardDiterima.toFixed(2)),
      bugDiterima:    bugsAccepted
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
module.exports = router; 