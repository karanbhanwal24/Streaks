import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import habitRoutes from './routes/habits.js';
import analysisRoutes from './routes/analysis.js';
import { connectDatabase } from './db.js';

// Load environment variables
dotenv.config();

const app = express();
let databaseConnected = false;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/habits', habitRoutes);
app.use('/api/analysis', analysisRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.status(databaseConnected ? 200 : 503).json({
    success: databaseConnected,
    message: databaseConnected
      ? 'Habit Tracker API is running'
      : 'Habit Tracker API is running, but the database is unavailable',
    database: {
      connected: databaseConnected,
      type: 'postgresql',
    },
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
});

// Start server
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0';

const listenForRequests = () => new Promise((resolve, reject) => {
  const server = app.listen(PORT, HOST);

  server.once('listening', () => resolve(server));
  server.once('error', reject);
});

const startServer = async () => {
  try {
    await connectDatabase();
    databaseConnected = true;
    console.log('✅ PostgreSQL connected successfully');
    await listenForRequests();
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  } catch (err) {
    console.error('❌ Server startup error:', err);
    process.exit(1);
  }
};

startServer();

export default app;
