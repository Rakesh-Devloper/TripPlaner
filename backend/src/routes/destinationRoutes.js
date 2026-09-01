// Destination Routes
import express from 'express';
import { getAllDestinations, getDestinationById } from '../controllers/destinationController.js';

const router = express.Router();

router.get('/', getAllDestinations);
router.get('/:id', getDestinationById);

export default router;
