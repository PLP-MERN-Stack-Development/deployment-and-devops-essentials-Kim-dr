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
// ===== NEW LINE =====
const NODE_ENV = process.env.NODE_ENV || 'development';

// Initialize Sentry for error tracking
if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    // ===== MODIFIED LINE =====
    environment: NODE_ENV,
    tracesSampleRate: 1.0,
  });
  app.use(Sentry.Handlers.requestHandler());
  app.use(Sentry.Handlers.tracingHandler());
}

// Connect to MongoDB
connectDB();

// Middleware
app.use(helmet()); // Security headers

// ===== THIS IS THE NEW, SAFER CORS SECTION =====
// ===== IT IS DIFFERENT FROM YOURS =====
const allowedOrigins = [
  'http://localhost:5173', // Your local dev frontend
  'https://deployment-and-devops-essentials-kim-dr-2.onrender.com' // Your deployed frontend
];

// In development, use simpler CORS
if (NODE_ENV === 'development') {
  app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
  }));
} else {
  // In production, use the strict allow-list
  app.use(cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like Render's health check, Postman)
      // 'origin' will be 'undefined' or 'null' for these.
      // ===== THIS IS THE CRUCIAL FIX =====
      if (!origin || origin === 'null') {
        return callback(null, true);
      }

      // Check if the origin is in our allowed list
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
        return callback(new Error(msg), false);
      }
      
      return callback(null, true);
    },
    credentials: true
  }));
}
// ===== END OF UPDATED CORS SECTION =====


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
  // ===== MODIFIED LINE =====
  logger.info(`Server running in ${NODE_ENV} mode on port ${PORT}`);
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});

export default app;