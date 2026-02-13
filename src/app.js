import { config } from 'dotenv';
config();

import express from 'express';
import routes from '../src/routes/routes.js';
import { prisma, checkConnection } from './config/db.js';

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/', routes);

// Health check route
app.get('/health', async (req, res) => {
  const dbHealthy = await checkConnection();
  res.status(dbHealthy ? 200 : 503).json({
    status: dbHealthy ? 'healthy' : 'unhealthy',
    database: dbHealthy ? 'connected' : 'disconnected'
  });
});

// Check database connection before starting server
checkConnection().then(isConnected => {
  if (isConnected) {
    console.log("✅ Database connection is healthy");
  } else {
    console.error("❌ Database connection is not healthy");
    process.exit(1);
  }
}).catch(error => {
  console.error("❌ Database connection check failed:", error);
  process.exit(1);
});

// Start server
const server = app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});

// Handle graceful shutdown
const shutdown = async (signal) => {
  console.log(`\n${signal} received. Shutting down gracefully...`);
  
  server.close(async () => {
    console.log('✅ HTTP server closed');
    
    try {
      await prisma.$disconnect();
      console.log('✅ Database disconnected');
      process.exit(0);
    } catch (error) {
      console.error('❌ Error disconnecting database:', error);
      process.exit(1);
    }
  });

  // Force close after 10 seconds
  setTimeout(() => {
    console.error('⚠️ Forcing shutdown after timeout');
    process.exit(1);
  }, 10000);
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  console.error('💥 Uncaught Exception:', error);
  shutdown('UNCAUGHT_EXCEPTION');
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
  shutdown('UNHANDLED_REJECTION');
});

export default app;