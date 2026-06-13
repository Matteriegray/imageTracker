const mongoose = require('mongoose');
const dns = require('dns');
const dotenv = require('dotenv');

dotenv.config();

// Use public DNS servers for MongoDB Atlas SRV lookup
if (process.env.MONGO_URI && process.env.MONGO_URI.startsWith('mongodb+srv://')) {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
  console.log('Using public DNS servers for MongoDB Atlas SRV lookup');
}

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;
    
    if (!uri) {
      console.error('❌ MONGO_URI is not defined in .env file');
      console.log('⚠️  Server will start without database connection');
      return false;
    }

    console.log('Attempting to connect to MongoDB...');
    
    // Mongoose 7.x doesn't need useNewUrlParser and useUnifiedTopology
    // Set a connection timeout to fail faster if IP not whitelisted
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds instead of 30
      socketTimeoutMS: 45000,
    });
    
    console.log('✅ MongoDB connected successfully');
    console.log(`📍 Database: ${mongoose.connection.name}`);
    return true;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    
    // More helpful error messages
    if (error.message.includes('IP') || error.message.includes('whitelist')) {
      console.log('\n⚠️  IP WHITELIST ISSUE DETECTED');
      console.log('📋 Your friend needs to whitelist your IP in MongoDB Atlas:');
      console.log('   1. Go to https://cloud.mongodb.com/');
      console.log('   2. Navigate to Network Access (Security section)');
      console.log('   3. Click "Add IP Address"');
      console.log('   4. Add 0.0.0.0/0 for development (or your specific IP)');
      console.log('   5. Wait 1-3 minutes for changes to apply\n');
    }
    
    console.log('⚠️  Server will start without database connection');
    console.log('⚠️  Signup and login will not work until MongoDB is connected\n');
    return false;
  }
};

// Handle connection events
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected from MongoDB');
});

module.exports = connectDB;