const express = require('express');
const router = express.Router();
const { Report, Program } = require('../models');
const { protect } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Pastikan folder uploads ada
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Konfigurasi multer untuk menyimpan file
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Create new report
router.post('/', protect, upload.single('attachment'), async (req, res) => {
  try {
    const { programId, title, severity, description, steps, poc } = req.body;
    
    // Validate program exists
    const program = await Program.findByPk(programId);
    if (!program) {
      return res.status(404).json({ message: 'Program tidak ditemukan' });
    }

    const reportData = {
      ...req.body,
      attachment: req.file ? req.file.filename : null // Simpan hanya nama file
    };

    const report = await Report.create(reportData);
    res.status(201).json(report);
  } catch (error) {
    console.error('Error creating report:', error);
    res.status(500).json({ message: 'Error creating report' });
  }
});

// Get all reports for current user
router.get('/', protect, async (req, res) => {
  try {
    const reports = await Report.findAll({
      where: { reporterId: req.user.id },
      include: [{
        model: Program,
        as: 'Program',
        attributes: ['name', 'province']
      }],
      order: [['createdAt', 'DESC']]
    });
    res.json(reports);
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Serve uploaded files
router.get('/uploads/:filename', (req, res) => {
  const filePath = path.join(__dirname, '../uploads', req.params.filename);
  res.sendFile(filePath);
});

// Get report by ID
router.get('/:id', protect, async (req, res) => {
  try {
    const report = await Report.findOne({
      where: { 
        id: req.params.id,
        reporterId: req.user.id 
      },
      include: [{
        model: Program,
        attributes: ['name', 'province']
      }]
    });

    if (!report) {
      return res.status(404).json({ message: 'Laporan tidak ditemukan' });
    }

    res.json(report);
  } catch (error) {
    console.error('Error fetching report:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 