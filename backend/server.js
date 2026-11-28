
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import db from './db.js';

import authRoutes from './routes/auth.route.js';
import poRoutes from './routes/purchaseOrder.route.js';
import statsRoutes from './routes/stats.route.js';
import adminRoutes from './routes/admin.route.js';
import workCaseRoutes from './routes/workCase.route.js';
import materialPoRoutes from './routes/materialPo.route.js';
import paymentStatusRoutes from './routes/paymentStatus.route.js';

dotenv.config();

const app = express();

// CORS configuration
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/api/health', async (req, res) => {
  try {
    await db.raw('SELECT 1');

    return res.status(200).json({
      status: 'OK',
      database: 'Connected',
      message: 'CMD_STORE API is running',
    });
  } catch (error) {
    console.error('DATABASE ERROR:', error);

    return res.status(503).json({
      status: 'ERROR',
      database: 'Disconnected',
      message: 'Database connection failed',
    });
  }
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/purchase-orders', poRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/work-cases', workCaseRoutes);
app.use('/api/material-pos', materialPoRoutes);
app.use('/api/payment-statuses', paymentStatusRoutes);

// Not found
app.use((req, res) => {
  res.status(404).json({
    error: 'API endpoint not found',
    path: req.originalUrl,
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('GLOBAL API ERROR:', err);

  if (res.headersSent) {
    return next(err);
  }

  res.status(err.status || 500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'production'
      ? 'Something went wrong'
      : err.message,
  });
});

export default app;
