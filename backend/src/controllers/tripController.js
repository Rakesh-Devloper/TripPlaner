// Trip Controller
import { TripModel } from '../models/Trip.js';
import { UserModel } from '../models/User.js';
import { successResponse, errorResponse } from '../utils/responseHelper.js';

export const getAllTrips = (req, res) => {
  try {
    const trips = TripModel.getAll();
    return res.json({ trips });
  } catch (err) {
    return errorResponse(res, 'Failed to fetch trips', 500, err);
  }
};

export const getTripById = (req, res) => {
  try {
    const trip = TripModel.getById(req.params.id);
    if (!trip) return res.status(404).json({ error: 'Trip not found' });
    return res.json({ trip });
  } catch (err) {
    return errorResponse(res, 'Failed to fetch trip', 500, err);
  }
};

export const createTrip = (req, res) => {
  try {
    const trip = TripModel.create(req.body);
    UserModel.incrementTripsCount();
    return res.status(201).json({ success: true, trip });
  } catch (err) {
    return errorResponse(res, 'Failed to create trip', 500, err);
  }
};

export const updateTrip = (req, res) => {
  try {
    const trip = TripModel.update(req.params.id, req.body);
    if (!trip) return res.status(404).json({ error: 'Trip not found' });
    return res.json({ success: true, trip });
  } catch (err) {
    return errorResponse(res, 'Failed to update trip', 500, err);
  }
};

export const deleteTrip = (req, res) => {
  try {
    const success = TripModel.delete(req.params.id);
    return res.json({ success });
  } catch (err) {
    return errorResponse(res, 'Failed to delete trip', 500, err);
  }
};

export default {
  getAllTrips,
  getTripById,
  createTrip,
  updateTrip,
  deleteTrip,
};
