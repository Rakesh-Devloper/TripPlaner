// Booking Routes
import express from 'express';
import { getAllBookings, createBooking, deleteBooking } from '../controllers/bookingController.js';

const router = express.Router();

router.get('/', getAllBookings);
router.post('/', createBooking);
router.delete('/:id', deleteBooking);

export default router;
