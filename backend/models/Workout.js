import mongoose from 'mongoose';

/**
 * Workout Schema
 * Stores workout session logs for progress tracking
 */
const workoutSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },

        // Workout Details
        type: {
            type: String,
            enum: ['cardio', 'strength', 'flexibility', 'sports', 'other'],
            required: [true, 'Workout type is required'],
        },
        name: {
            type: String,
            required: [true, 'Workout name is required'],
            trim: true,
        },
        duration: {
            type: Number, // in minutes
            required: [true, 'Duration is required'],
            min: [1, 'Duration must be at least 1 minute'],
        },
        caloriesBurned: {
            type: Number,
            min: [0, 'Calories cannot be negative'],
        },
        intensity: {
            type: String,
            enum: ['low', 'medium', 'high'],
            default: 'medium',
        },

        // Additional Notes
        notes: {
            type: String,
            maxlength: [500, 'Notes cannot exceed 500 characters'],
        },

        // Date of workout
        workoutDate: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

// Index for faster queries
workoutSchema.index({ user: 1, workoutDate: -1 });

const Workout = mongoose.model('Workout', workoutSchema);

export default Workout;
