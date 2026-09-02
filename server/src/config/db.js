const mongoose = require('mongoose');
const env = require('./env');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(env.mongoUri, {
      serverSelectionTimeoutMS: 2500,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`⚠️ MongoDB Connection Warning: ${error.message} (Chạy chế độ in-memory fallback)`);
    if (env.nodeEnv === 'production') {
      process.exit(1);
    }
  }
};

module.exports = connectDB;
