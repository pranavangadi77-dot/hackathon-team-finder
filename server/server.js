require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/db');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');
const runSeed = require('./seed');
const { User } = require('./models');

// Routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const teamRoutes = require('./routes/teamRoutes');
const requestRoutes = require('./routes/requestRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const recommendationRoutes = require('./routes/recommendationRoutes');

const app = express();

// Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    product: 'HackathonTeam Finder API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// Root Route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Hackathon Team Finder API is running!'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/recommendations', recommendationRoutes);

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  // Connect DB
  await connectDB();

  // If collection is empty, auto-seed with sample data
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('[Server] Database is empty. Seeding realistic sample dataset...');
      await runSeed();
    } else {
      console.log(`[Server] Database ready with ${userCount} existing student accounts.`);
    }
  } catch (err) {
    console.warn('[Server] Auto-seed check warning:', err.message);
  }

  app.listen(PORT, () => {
    console.log(`🚀 HackathonTeam Finder Server running on port ${PORT}`);
    console.log(`📡 API Endpoints available at http://localhost:${PORT}/api`);
  });
};

if (require.main === module) {
  startServer();
}

module.exports = { app, startServer };
