const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/db');
const path = require('path');

const app = express();

// Update CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Debug middleware untuk melihat request yang masuk
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/api/users', require('./routes/user'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/programs', require('./routes/program'));
app.use('/api/reports', require('./routes/report'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/payments', require('./routes/payment'));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const PORT = process.env.PORT || 5000;

// Connect to database and start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}); 