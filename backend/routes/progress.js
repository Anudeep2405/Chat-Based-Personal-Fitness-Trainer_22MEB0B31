import express from 'express';
import { logWorkout, getWorkouts, getStats, deleteWorkout } from '../controllers/progressController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

/**
 * Progress Tracking Routes
 * All routes require authentication
 */

router.post('/workout', authenticate, logWorkout);
router.get('/workouts', authenticate, getWorkouts);
router.get('/stats', authenticate, getStats);
router.delete('/workout/:id', authenticate, deleteWorkout);

export default router;
