// Saved Place / Wishlist Controller
import { SavedPlaceModel } from '../models/SavedPlace.js';
import { errorResponse } from '../utils/responseHelper.js';

export const getAllSavedPlaces = (req, res) => {
  try {
    const savedPlaces = SavedPlaceModel.getAll();
    return res.json({ savedPlaces });
  } catch (err) {
    return errorResponse(res, 'Failed to fetch saved places', 500, err);
  }
};

export const createSavedPlace = (req, res) => {
  try {
    const savedPlace = SavedPlaceModel.create(req.body);
    return res.status(201).json({ success: true, savedPlace });
  } catch (err) {
    return errorResponse(res, 'Failed to save place', 500, err);
  }
};

export const deleteSavedPlace = (req, res) => {
  try {
    const success = SavedPlaceModel.delete(req.params.id);
    return res.json({ success });
  } catch (err) {
    return errorResponse(res, 'Failed to remove saved place', 500, err);
  }
};

export default {
  getAllSavedPlaces,
  createSavedPlace,
  deleteSavedPlace,
};
