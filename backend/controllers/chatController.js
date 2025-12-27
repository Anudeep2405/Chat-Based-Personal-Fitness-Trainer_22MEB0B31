import User from '../models/User.js';
import { generateFitnessResponse } from '../services/geminiService.js';

/**
 * Send chat message and get AI response
 * POST /api/chat/message
 */
export const sendMessage = async (req, res) => {
    try {
        const { message } = req.body;

        // Validate input
        if (!message || message.trim().length === 0) {
            return res.status(400).json({
                message: 'Message cannot be empty'
            });
        }

        // Get user with profile data
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate AI response using Gemini (server-side)
        const aiResponse = await generateFitnessResponse(
            message,
            user.getPublicProfile()
        );

        // Save to chat history
        user.chatHistory.push({
            userMessage: message,
            aiResponse,
            timestamp: new Date(),
        });

        // Keep only last 50 messages to prevent document size issues
        if (user.chatHistory.length > 50) {
            user.chatHistory = user.chatHistory.slice(-50);
        }

        await user.save();

        res.json({
            message: 'Message sent successfully',
            reply: aiResponse,
            timestamp: new Date(),
        });
    } catch (error) {
        console.error('Chat error:', error);

        // Handle Gemini API errors
        if (error.message.includes('API')) {
            return res.status(503).json({
                message: 'AI service temporarily unavailable. Please try again.'
            });
        }

        res.status(500).json({ message: 'Server error' });
    }
};

/**
 * Get chat history
 * GET /api/chat/history
 */
export const getChatHistory = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('chatHistory');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Return last 20 messages
        const recentHistory = user.chatHistory.slice(-20).reverse();

        res.json({
            history: recentHistory,
            total: user.chatHistory.length,
        });
    } catch (error) {
        console.error('Get chat history error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

/**
 * Clear chat history
 * DELETE /api/chat/history
 */
export const clearChatHistory = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.chatHistory = [];
        await user.save();

        res.json({ message: 'Chat history cleared successfully' });
    } catch (error) {
        console.error('Clear chat history error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
