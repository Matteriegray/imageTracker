const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const caseRoutes = require('./routes/cases');
const evidenceRoutes = require('./routes/evidence');
const relationshipRoutes = require('./routes/relationships');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// CORS configuration
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/cases', caseRoutes);
app.use('/api/evidence', evidenceRoutes);
app.use('/api/relationships', relationshipRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    database: require('mongoose').connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

// Start server and connect to database
const startServer = async () => {
  try {
    // Try to connect to MongoDB but don't crash if it fails
    const dbConnected = await connectDB();
    
    // Start server regardless of DB connection status
    app.listen(port, () => {
      console.log('\n' + '='.repeat(60));
      console.log(`✅ Server running on http://localhost:${port}`);
      console.log(`📡 API endpoints:`);
      console.log(`   - POST http://localhost:${port}/api/auth/signup`);
      console.log(`   - POST http://localhost:${port}/api/auth/login`);
      console.log(`   - GET  http://localhost:${port}/api/health`);
      console.log(`\n📊 Database status: ${dbConnected ? '✅ Connected' : '❌ Disconnected'}`);
      
      if (!dbConnected) {
        console.log(`⚠️  Auth endpoints will fail until MongoDB is connected`);
      }
      
      console.log('='.repeat(60) + '\n');
    });
    
    // Attempt to reconnect to MongoDB every 30 seconds if initial connection failed
    if (!dbConnected) {
      setInterval(async () => {
        if (require('mongoose').connection.readyState !== 1) {
          console.log('🔄 Attempting to reconnect to MongoDB...');
          await connectDB();
        }
      }, 30000);
    }
    
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
