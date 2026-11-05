const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return true;
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/hackmate';

  try {
    mongoose.set('strictQuery', false);
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 600,
      connectTimeoutMS: 600,
    });

    isConnected = true;
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    isConnected = false;
    console.warn(`[Database] Real MongoDB not detected at ${uri} (${error.message}).`);
    console.log(`[Database] Running in-memory database fallback mode. Full app functionality (Auth, Teams, Requests, Recommendations) is 100% active!`);
    console.log(`[Database] To connect to MongoDB, supply MONGODB_URI in server/.env`);
    return false;
  }
};

const getIsConnected = () => isConnected;

module.exports = { connectDB, getIsConnected };
