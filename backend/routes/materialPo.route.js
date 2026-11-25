// src/routes/materialPo.route.js
import express from 'express';
import multer from 'multer';
import {
  uploadMaterialPos,
  getMaterialPos,
  getMaterialPoStats,
  getMaterialPoWorkflowStats
} from '../controllers/materialPo.controller.js';
import { authenticate, isAdmin } from '../middleware/auth.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.get('/', getMaterialPos);
router.get('/stats', getMaterialPoStats);
router.post('/upload', authenticate, isAdmin, upload.single('file'), uploadMaterialPos);
router.get('/workflow-stats', getMaterialPoWorkflowStats);

export default router;