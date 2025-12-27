import express from 'express';
import { register, login, getProfile, updateProfile } from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

/**
 * Authentication Routes
 */

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes (require authentication)
router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, updateProfile);

export default router;
