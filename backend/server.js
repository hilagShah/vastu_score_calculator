const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');
const reportRoutes = require('./routes/reportRoutes');
const consultationRoutes = require('./routes/consultationRoutes');

// Load environment variables
dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Ensure MongoDB connection for serverless invocations
app.use(async (req, res, next) => {
  try {
    await connectDB();
  } catch (err) {
    console.error('DB Middleware Connection Error:', err);
  }
  next();
});

// Serve static uploads directory for local fallback
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/reports', reportRoutes);
app.use('/api/consultations', consultationRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Vastu Score Calculator API is running.' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Express Server Error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'An unexpected server error occurred.',
    error: process.env.NODE_ENV === 'development' ? err.stack : {}
  });
});

const PORT = process.env.PORT || 5001;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  });
}

module.exports = app;
