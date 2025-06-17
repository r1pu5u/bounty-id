const express = require('express');
const router = express.Router();
const { User, Program, Report } = require('../models');
const { protect, admin } = require('../middleware/auth');
const path = require('path');
const fs = require('fs');

// Get admin dashboard statistics
router.get('/stats', async (req, res) => {
  try {
    const totalReports = await Report.count();
    const pendingReports = await Report.count({
      where: { status: 'Pending' }
    });
    const acceptedReports = await Report.count({
      where: { status: 'Accepted' }
    });
    const rejectedReports = await Report.count({
      where: { status: 'Rejected' }
    });
    const totalRewards = await Report.sum('reward', {
      where: { status: 'Accepted' }
    }) || 0;

    const stats = {
      totalReports,
      pendingReports,
      acceptedReports,
      rejectedReports,
      totalRewards: parseFloat(totalRewards)
    };

    res.json(stats);
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({ 
      message: 'Error fetching admin statistics',
      error: error.message 
    });
  }
});

// Get all users
router.get('/users', protect, admin, async (req, res) => {
  try {
    const users = await User.findAll({
      where: { role: 'user' },
      attributes: { exclude: ['password'] }
    });
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all programs
router.get('/programs', protect, admin, async (req, res) => {
  try {
    const programs = await Program.findAll();
    res.json(programs);
  } catch (error) {
    console.error('Error fetching programs:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all reports for admin
router.get('/reports', async (req, res) => {
  try {
    const reports = await Report.findAll({
      include: [
        { 
          model: Program,
          as: 'Program'
        },
        { 
          model: User,
          as: 'Reporter'
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json(reports);
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ 
      message: 'Error fetching reports',
      error: error.message 
    });
  }
});

// Get report detail
router.get('/reports/:id', async (req, res) => {
  try {
    const report = await Report.findByPk(req.params.id, {
      include: [
        { 
          model: Program,
          as: 'Program'
        },
        { 
          model: User,
          as: 'Reporter'
        }
      ]
    });

    if (!report) {
      return res.status(404).json({ message: 'Laporan tidak ditemukan' });
    }

    // Pastikan URL attachment lengkap jika ada
    if (report.attachment) {
      report.attachment = `${process.env.API_URL}/uploads/${report.attachment}`;
    }

    res.json(report);
  } catch (error) {
    console.error('Error fetching report detail:', error);
    res.status(500).json({ 
      message: 'Error mengambil detail laporan',
      error: error.message 
    });
  }
});

// Verify report
router.put('/reports/:id/verify', async (req, res) => {
  try {
    const { status, verificationNote } = req.body;
    const report = await Report.findByPk(req.params.id);

    if (!report) {
      return res.status(404).json({ message: 'Laporan tidak ditemukan' });
    }

    await report.update({
      status,
      verificationNote,
      verifiedAt: new Date()
    });

    res.json({ message: 'Laporan berhasil diverifikasi' });
  } catch (error) {
    console.error('Error verifying report:', error);
    res.status(500).json({ 
      message: 'Error memverifikasi laporan',
      error: error.message 
    });
  }
});

// Endpoint untuk mengakses file PDF
router.get('/reports/:id/pdf', async (req, res) => {
  try {
    const report = await Report.findByPk(req.params.id);
    
    if (!report || !report.attachment) {
      return res.status(404).json({ message: 'File tidak ditemukan' });
    }

    // Hapus 'uploads/' dari awal path jika ada
    const fileName = report.attachment.startsWith('uploads/') 
      ? report.attachment.substring(8) // Hapus 'uploads/' (8 karakter)
      : report.attachment;
      
    const filePath = path.join(__dirname, '../uploads', fileName);
    
    console.log('Attempting to access file at:', filePath); // Debug log

    // Cek apakah file exists
    if (!fs.existsSync(filePath)) {
      console.log('File not found at path:', filePath); // Debug log
      return res.status(404).json({ message: 'File tidak ditemukan di server' });
    }

    // Set header untuk PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${fileName}"`);
    
    // Stream file ke client
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } catch (error) {
    console.error('Error serving PDF:', error);
    res.status(500).json({ message: 'Error mengakses file PDF' });
  }
});

module.exports = router; 