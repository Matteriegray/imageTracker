const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const authMiddleware = require('./middleware/auth');

dotenv.config();
connectDB();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/protected', authMiddleware, (req, res) => {
  res.json({ message: 'Protected route reached', user: req.user });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
