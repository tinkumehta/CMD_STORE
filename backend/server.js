import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import db from './db.js';


import authRoutes from './routes/auth.route.js';
import poRoutes from './routes/purchaseOrder.route.js';
import statsRoutes from './routes/stats.route.js';
import adminRoutes from './routes/admin.route.js';
import workCaseRoutes from './routes/workCase.route.js'
import materialPoRoutes from './routes/materialPo.route.js';
import paymentStatusRoutes from './routes/paymentStatus.route.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/purchase-orders', poRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/work-cases', workCaseRoutes); 
app.use('/api/material-pos', materialPoRoutes);
app.use('/api/payment-statuses', paymentStatusRoutes);


app.get('/api/health', async (req, res) => {
  try {
    await db.raw('SELECT 1');

    res.status(200).json({
      status: 'OK',
      database: 'Connected',
      message: 'CMD_STORE API is running',
    });
  } catch (error) {
    console.error('Database health check failed:', error.message);

    res.status(503).json({
      status: 'ERROR',
      database: 'Disconnected',
    });
  }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});