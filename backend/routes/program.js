const express = require('express');
const router = express.Router();
const { Program } = require('../models');
const { protect, admin } = require('../middleware/auth');

// Get all programs
router.get('/', async (req, res) => {
  try {
    const programs = await Program.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.json(programs);
  } catch (error) {
    console.error('Error fetching programs:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get program by ID
router.get('/:id', async (req, res) => {
  try {
    const program = await Program.findByPk(req.params.id);
    if (!program) {
      return res.status(404).json({ message: 'Program tidak ditemukan' });
    }
    res.json(program);
  } catch (error) {
    console.error('Error fetching program:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new program (admin only)
router.post('/', protect, admin, async (req, res) => {
  try {
    const program = await Program.create(req.body);
    res.status(201).json(program);
  } catch (error) {
    console.error('Error creating program:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update program (admin only)
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const program = await Program.findByPk(req.params.id);
    if (!program) {
      return res.status(404).json({ message: 'Program tidak ditemukan' });
    }
    await program.update(req.body);
    res.json(program);
  } catch (error) {
    console.error('Error updating program:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete program (admin only)
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const program = await Program.findByPk(req.params.id);
    if (!program) {
      return res.status(404).json({ message: 'Program tidak ditemukan' });
    }
    await program.destroy();
    res.json({ message: 'Program berhasil dihapus' });
  } catch (error) {
    console.error('Error deleting program:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 