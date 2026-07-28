const mongoose = require('mongoose');

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  const mongoURI = process.env.MONGO_URI;
  if (!mongoURI) {
    console.warn('MONGO_URI missing in environment variables. Proceeding with fallback state.');
    return;
  }

  try {
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.log('Continuing with local fallback mode...');
  }
};

module.exports = connectDB;
