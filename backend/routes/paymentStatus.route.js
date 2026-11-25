// src/routes/paymentStatus.route.js
import express from 'express';
import multer from 'multer';
import {
  uploadPaymentStatuses,
  getPaymentStatuses,
  getPaymentStatusStats,
  getPaymentWorkflowStats
} from '../controllers/paymentStatus.controller.js';
import { authenticate, isAdmin } from '../middleware/auth.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.get('/', getPaymentStatuses);
router.get('/stats', getPaymentStatusStats);
router.post('/upload', authenticate, isAdmin, upload.single('file'), uploadPaymentStatuses);
router.get('/workflow-stats', getPaymentWorkflowStats);

export default router;