import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import * as Sentry from '@sentry/node';
import connectDB from './config/database.js';
import { errorHandler } from './middleware/errorHandler.js';
import { securityMiddleware } from './middleware/security.js';
import logger from './utils/logger.js';
import authRoutes from './routes/auth.js';
import todoRoutes from './routes/todos.js';
import healthRoutes from './routes/health.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Sentry for error tracking
if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV || 'development',
    tracesSampleRate: 1.0,
  });
  app.use(Sentry.Handlers.requestHandler());
  app.use(Sentry.Handlers.tracingHandler());
}

// Connect to MongoDB
connectDB();

// Middleware
app.use(helmet()); // Security headers
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));
app.use(securityMiddleware);

// Routes
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'MERN Todo API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      todos: '/api/todos'
    }
  });
});

// Sentry error handler (must be before other error handlers)
if (process.env.SENTRY_DSN) {
  app.use(Sentry.Handlers.errorHandler());
}

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  logger.info(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});

export default app;