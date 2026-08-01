const mongoose = require('mongoose');

let connectionAttempted = false;

const connectDB = async () => {
  // Already connected
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  // Don't keep retrying on every request if we already tried and failed
  if (connectionAttempted && mongoose.connection.readyState !== 0) {
    return;
  }

  const mongoURI = process.env.MONGO_URI;
  if (!mongoURI) {
    console.warn('MONGO_URI missing in environment variables. Proceeding with fallback state.');
    connectionAttempted = true;
    return;
  }

  try {
    connectionAttempted = true;
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 2000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.log('Continuing with local fallback mode...');
  }
};

module.exports = connectDB;

