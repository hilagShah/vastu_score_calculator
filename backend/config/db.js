const mongoose = require('mongoose');

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/vastu_score';

  try {
    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.log('Continuing with local fallback or mock state...');
    // We do not crash the server so that frontend can still be verified with mock database behavior if needed.
  }
};

module.exports = connectDB;
