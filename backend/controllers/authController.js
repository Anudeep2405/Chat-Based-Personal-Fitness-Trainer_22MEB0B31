import User from '../models/User.js';
import jwt from 'jsonwebtoken';

/**
 * Generate JWT token
 * @param {string} userId - User ID
 * @returns {string} JWT token
 */
const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '7d', // Token expires in 7 days
    });
};

/**
 * Register new user
 * POST /api/auth/register
 */
export const register = async (req, res) => {
    try {
        const {
            email,
            password,
            name,
            age,
            gender,
            height,
            weight,
            fitnessGoal,
            fitnessLevel,
            targetWeight
        } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: 'User with this email already exists'
            });
        }

        // Create new user
        const user = new User({
            email,
            password,
            name,
            age,
            gender,
            height,
            weight,
            fitnessGoal,
            fitnessLevel: fitnessLevel || 'beginner',
            targetWeight,
        });

        await user.save();

        // Generate token
        const token = generateToken(user._id);

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: user.getPublicProfile(),
        });
    } catch (error) {
        console.error('Registration error:', error);

        // Handle validation errors
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ message: errors.join(', ') });
        }

        res.status(500).json({ message: 'Server error during registration' });
    }
};

/**
 * Login user
 * POST /api/auth/login
 */
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                message: 'Email and password are required'
            });
        }

        // Find user (include password for comparison)
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({
                message: 'Invalid email or password'
            });
        }

        // Check password
        const isPasswordValid = await user.comparePassword(password);

        if (!isPasswordValid) {
            return res.status(401).json({
                message: 'Invalid email or password'
            });
        }

        // Generate token
        const token = generateToken(user._id);

        res.json({
            message: 'Login successful',
            token,
            user: user.getPublicProfile(),
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
};

/**
 * Get user profile
 * GET /api/auth/profile
 */
export const getProfile = async (req, res) => {
    try {
        // User is already attached by auth middleware
        res.json({
            user: req.user.getPublicProfile(),
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

/**
 * Update user profile
 * PUT /api/auth/profile
 */
export const updateProfile = async (req, res) => {
    try {
        const allowedUpdates = [
            'name',
            'age',
            'gender',
            'height',
            'weight',
            'fitnessGoal',
            'fitnessLevel',
            'targetWeight'
        ];

        const updates = {};

        // Filter only allowed fields
        Object.keys(req.body).forEach(key => {
            if (allowedUpdates.includes(key)) {
                updates[key] = req.body[key];
            }
        });

        // Update user
        const user = await User.findByIdAndUpdate(
            req.user._id,
            updates,
            { new: true, runValidators: true }
        );

        res.json({
            message: 'Profile updated successfully',
            user: user.getPublicProfile(),
        });
    } catch (error) {
        console.error('Update profile error:', error);

        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ message: errors.join(', ') });
        }

        res.status(500).json({ message: 'Server error' });
    }
};
