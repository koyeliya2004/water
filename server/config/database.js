const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
  try {
    // For development, we'll use an in-memory store if no MongoDB is available
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/jaldhar';
    
    await mongoose.connect(mongoUri);
    
    console.log('MongoDB Connected Successfully');
  } catch (error) {
    console.log('MongoDB connection not available, using mock data');
    console.log('To enable full functionality, set MONGODB_URI in .env');
  }
};

module.exports = connectDB;
