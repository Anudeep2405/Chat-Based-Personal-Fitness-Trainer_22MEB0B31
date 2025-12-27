import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

/**
 * User Schema
 * Stores user authentication, profile, goals, and chat history
 */
const userSchema = new mongoose.Schema(
    {
        // Authentication
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [6, 'Password must be at least 6 characters'],
            select: false, // Don't return password by default
        },

        // Profile Information
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
        },
        age: {
            type: Number,
            required: [true, 'Age is required'],
            min: [13, 'Age must be at least 13'],
            max: [120, 'Age must be less than 120'],
        },
        gender: {
            type: String,
            enum: ['male', 'female', 'other'],
            required: [true, 'Gender is required'],
        },
        height: {
            type: Number, // in cm
            required: [true, 'Height is required'],
        },
        weight: {
            type: Number, // in kg
            required: [true, 'Weight is required'],
        },

        // Fitness Goals
        fitnessGoal: {
            type: String,
            enum: ['weight_loss', 'muscle_gain', 'general_fitness', 'endurance'],
            required: [true, 'Fitness goal is required'],
        },
        fitnessLevel: {
            type: String,
            enum: ['beginner', 'intermediate', 'advanced'],
            default: 'beginner',
        },
        targetWeight: {
            type: Number, // in kg
        },

        // Chat History
        chatHistory: [
            {
                userMessage: String,
                aiResponse: String,
                timestamp: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
    },
    {
        timestamps: true, // Adds createdAt and updatedAt
    }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
    // Only hash if password is modified
    if (!this.isModified('password')) {
        return next();
    }

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Method to get user profile without sensitive data
userSchema.methods.getPublicProfile = function () {
    return {
        id: this._id,
        name: this.name,
        email: this.email,
        age: this.age,
        gender: this.gender,
        height: this.height,
        weight: this.weight,
        fitnessGoal: this.fitnessGoal,
        fitnessLevel: this.fitnessLevel,
        targetWeight: this.targetWeight,
    };
};

const User = mongoose.model('User', userSchema);

export default User;
