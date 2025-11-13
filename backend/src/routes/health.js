import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

// @route   GET /api/health
// @desc    Basic health check
// @access  Public
router.get('/', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// @route   GET /api/health/detailed
// @desc    Detailed health check with database status
// @access  Public
router.get('/detailed', async (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  
  const healthCheck = {
    status: dbStatus === 'connected' ? 'OK' : 'DEGRADED',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    database: {
      status: dbStatus,
      name: mongoose.connection.name || 'N/A'
    },
    memory: {
      rss: `${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)} MB`,
      heapUsed: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`,
      heapTotal: `${(process.memoryUsage().heapTotal / 1024 / 1024).toFixed(2)} MB`
    }
  };

  const statusCode = dbStatus === 'connected' ? 200 : 503;
  res.status(statusCode).json(healthCheck);
});

// @route   GET /api/health/ready
// @desc    Readiness probe for Kubernetes/Docker
// @access  Public
router.get('/ready', async (req, res) => {
  if (mongoose.connection.readyState === 1) {
    return res.status(200).json({ ready: true });
  }
  res.status(503).json({ ready: false });
});

// @route   GET /api/health/live
// @desc    Liveness probe for Kubernetes/Docker
// @access  Public
router.get('/live', (req, res) => {
  res.status(200).json({ alive: true });
});

export default router;