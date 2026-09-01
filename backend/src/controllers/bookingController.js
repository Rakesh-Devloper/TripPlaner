// Booking Controller
import { BookingModel } from '../models/Booking.js';
import { errorResponse } from '../utils/responseHelper.js';

export const getAllBookings = (req, res) => {
  try {
    const bookings = BookingModel.getAll();
    return res.json({ bookings });
  } catch (err) {
    return errorResponse(res, 'Failed to fetch bookings', 500, err);
  }
};

export const createBooking = (req, res) => {
  try {
    const booking = BookingModel.create(req.body);
    return res.status(201).json({ success: true, booking });
  } catch (err) {
    return errorResponse(res, 'Failed to create booking', 500, err);
  }
};

export const deleteBooking = (req, res) => {
  try {
    const success = BookingModel.delete(req.params.id);
    return res.json({ success });
  } catch (err) {
    return errorResponse(res, 'Failed to delete booking', 500, err);
  }
};

export default {
  getAllBookings,
  createBooking,
  deleteBooking,
};
