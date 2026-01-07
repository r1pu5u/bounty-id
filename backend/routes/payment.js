const express = require('express');
const router = express.Router();
const { Payment, User } = require('../models');
const { protect } = require('../middleware/auth');

// Debug route middleware
router.use((req, res, next) => {
  console.log('Payments route:', req.method, req.path);
  next();
});

// Get payments for current user
router.get('/', protect, async (req, res) => {
  try {
    const payments = await Payment.findAll({ where: { userId: req.user.id }, order: [['createdAt', 'DESC']] });
    res.json(payments);
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new payment (payout request)
router.post('/', protect, async (req, res) => {
  try {
    const { amount, method, details, note } = req.body;

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }
    if (!['bank', 'paypal'].includes(method)) {
      return res.status(400).json({ message: 'Invalid payment method' });
    }

    // create payment record
    const payment = await Payment.create({
      userId: req.user.id,
      amount: Number(amount),
      method,
      details: details || null,
      note: note || null,
      status: 'Pending'
    });

    // (Optional) Decrease user's totalRewards/balance if you track it here.
    // Example: await req.user.decrement('totalRewards', { by: Number(amount) });

    res.status(201).json(payment);
  } catch (error) {
    console.error('Error creating payment:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
