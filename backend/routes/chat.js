import express from 'express';
import { sendMessage, getChatHistory, clearChatHistory } from '../controllers/chatController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

/**
 * Chat Routes
 * All routes require authentication
 */

router.post('/message', authenticate, sendMessage);
router.get('/history', authenticate, getChatHistory);
router.delete('/history', authenticate, clearChatHistory);

export default router;
