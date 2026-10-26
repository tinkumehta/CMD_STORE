// src/routes/workCase.route.js
import express from 'express';
import multer from 'multer';
import { uploadWorkStatus, getWorkStatus } from '../controllers/workCase.controller.js';
import { authenticate, isAdmin } from '../middleware/auth.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.get('/', getWorkStatus); // Publicly accessible
router.post('/upload', authenticate, isAdmin, upload.single('file'), uploadWorkStatus);

export default router;