// AI Routes
import express from 'express';
import { planTrip, chatAssistant } from '../controllers/aiController.js';

const router = express.Router();

router.post('/plan-trip', planTrip);
router.post('/chat', chatAssistant);

export default router;
