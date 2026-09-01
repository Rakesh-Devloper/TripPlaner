// Central API Route Index
import express from 'express';
import aiRoutes from './aiRoutes.js';
import userRoutes from './userRoutes.js';
import tripRoutes from './tripRoutes.js';
import destinationRoutes from './destinationRoutes.js';
import bookingRoutes from './bookingRoutes.js';
import expenseRoutes from './expenseRoutes.js';
import savedPlaceRoutes from './savedPlaceRoutes.js';
import notificationRoutes from './notificationRoutes.js';

const router = express.Router();

router.use('/ai', aiRoutes);
router.use('/users', userRoutes);
router.use('/auth', userRoutes);
router.use('/trips', tripRoutes);
router.use('/destinations', destinationRoutes);
router.use('/bookings', bookingRoutes);
router.use('/expenses', expenseRoutes);
router.use('/saved-places', savedPlaceRoutes);
router.use('/notifications', notificationRoutes);

// Health check
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'TripPlanner AI API',
    time: new Date().toISOString(),
    version: '1.0.0',
  });
});

export default router;
