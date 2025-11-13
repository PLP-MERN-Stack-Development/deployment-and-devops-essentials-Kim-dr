// Sentry Configuration Guide
// This file shows how Sentry is configured in the application

// ============================================
// BACKEND CONFIGURATION (already in backend/src/server.js)
// ============================================

/*
import * as Sentry from '@sentry/node';

if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV || 'development',
    tracesSampleRate: 1.0, // Adjust for production
    
    // Performance monitoring
    integrations: [
      // Express integration
      new Sentry.Integrations.Http({ tracing: true }),
    ],
    
    // Release tracking
    release: `mern-todo-backend@${process.env.npm_package_version}`,
  });
  
  // Request handler must be the first middleware
  app.use(Sentry.Handlers.requestHandler());
  
  // Tracing handler
  app.use(Sentry.Handlers.tracingHandler());
  
  // Error handler must be before any other error middleware
  app.use(Sentry.Handlers.errorHandler());
}
*/

// ============================================
// FRONTEND CONFIGURATION (already in frontend/src/main.jsx)
// ============================================

/*
import * as Sentry from '@sentry/react';

if (import.meta.env.VITE_SENTRY_DSN) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    
    // Performance monitoring
    integrations: [
      new Sentry.BrowserTracing(),
      new Sentry.Replay({
        maskAllText: false,
        blockAllMedia: false,
      }),
    ],
    
    // Sample rates
    tracesSampleRate: 1.0,          // Adjust for production
    replaysSessionSampleRate: 0.1,  // 10% of sessions
    replaysOnErrorSampleRate: 1.0,  // 100% when error occurs
    
    // Environment
    environment: import.meta.env.MODE,
    
    // Release tracking
    release: `mern-todo-frontend@${import.meta.env.VITE_APP_VERSION}`,
  });
}
*/

// ============================================
// USAGE EXAMPLES
// ============================================

// Capturing errors manually:
/*
import * as Sentry from '@sentry/node'; // or '@sentry/react'

try {
  // Your code
} catch (error) {
  Sentry.captureException(error);
}
*/

// Adding context:
/*
Sentry.setContext('user', {
  id: user.id,
  email: user.email,
  username: user.name
});
*/

// Custom events:
/*
Sentry.captureMessage('Something important happened', 'info');
*/

// Breadcrumbs:
/*
Sentry.addBreadcrumb({
  category: 'auth',
  message: 'User logged in',
  level: 'info'
});
*/

export default {
  // This file is for documentation purposes
  // Actual configuration is in server.js and main.jsx
};