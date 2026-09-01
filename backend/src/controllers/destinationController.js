// Destination Controller
import { DestinationModel } from '../models/Destination.js';
import { errorResponse } from '../utils/responseHelper.js';

export const getAllDestinations = (req, res) => {
  try {
    const { q } = req.query;
    if (q) {
      const destinations = DestinationModel.search(q);
      return res.json({ destinations });
    }
    const destinations = DestinationModel.getAll();
    return res.json({ destinations });
  } catch (err) {
    return errorResponse(res, 'Failed to fetch destinations', 500, err);
  }
};

export const getDestinationById = (req, res) => {
  try {
    const dest = DestinationModel.getById(req.params.id);
    if (!dest) return res.status(404).json({ error: 'Destination not found' });
    return res.json({ destination: dest });
  } catch (err) {
    return errorResponse(res, 'Failed to fetch destination', 500, err);
  }
};

export default {
  getAllDestinations,
  getDestinationById,
};
