import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';

// Import routes
import authRoutes from './routes/auth.js';
import chatRoutes from './routes/chat.js';
import progressRoutes from './routes/progress.js';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware (development)
if (process.env.NODE_ENV === 'development') {
    app.use((req, res, next) => {
        console.log(`${req.method} ${req.path}`);
        next();
    });
}

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'Fitness Trainer API is running',
        timestamp: new Date().toISOString(),
    });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/progress', progressRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        message: 'Route not found',
        path: req.path,
    });
});

// Global error handler
app.use((error, req, res, next) => {
    console.error('Server Error:', error);
    res.status(500).json({
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`\n🚀 Server running on port ${PORT}`);
    console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🌐 API URL: http://localhost:${PORT}`);
    console.log(`💚 Health check: http://localhost:${PORT}/health\n`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err);
    process.exit(1);
});
