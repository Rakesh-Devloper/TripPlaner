// Saved Places Routes
import express from 'express';
import {
  getAllSavedPlaces,
  createSavedPlace,
  deleteSavedPlace,
} from '../controllers/savedPlaceController.js';

const router = express.Router();

router.get('/', getAllSavedPlaces);
router.post('/', createSavedPlace);
router.delete('/:id', deleteSavedPlace);

export default router;
