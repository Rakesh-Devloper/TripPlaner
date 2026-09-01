// User & Auth Routes
import express from 'express';
import { getCurrentUser, updateCurrentUser, login, register } from '../controllers/userController.js';

const router = express.Router();

router.get('/me', getCurrentUser);
router.put('/me', updateCurrentUser);
router.post('/login', login);
router.post('/register', register);

export default router;
