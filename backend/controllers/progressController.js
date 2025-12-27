import Workout from '../models/Workout.js';

/**
 * Log a new workout
 * POST /api/progress/workout
 */
export const logWorkout = async (req, res) => {
    try {
        const { type, name, duration, caloriesBurned, intensity, notes, workoutDate } = req.body;

        // Validate required fields
        if (!type || !name || !duration) {
            return res.status(400).json({
                message: 'Type, name, and duration are required'
            });
        }

        // Create workout
        const workout = new Workout({
            user: req.user._id,
            type,
            name,
            duration,
            caloriesBurned: caloriesBurned || 0,
            intensity: intensity || 'medium',
            notes,
            workoutDate: workoutDate || new Date(),
        });

        await workout.save();

        res.status(201).json({
            message: 'Workout logged successfully',
            workout,
        });
    } catch (error) {
        console.error('Log workout error:', error);

        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ message: errors.join(', ') });
        }

        res.status(500).json({ message: 'Server error' });
    }
};

/**
 * Get workout history
 * GET /api/progress/workouts
 */
export const getWorkouts = async (req, res) => {
    try {
        const { limit = 20, skip = 0 } = req.query;

        const workouts = await Workout.find({ user: req.user._id })
            .sort({ workoutDate: -1 })
            .limit(parseInt(limit))
            .skip(parseInt(skip));

        const total = await Workout.countDocuments({ user: req.user._id });

        res.json({
            workouts,
            total,
            limit: parseInt(limit),
            skip: parseInt(skip),
        });
    } catch (error) {
        console.error('Get workouts error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

/**
 * Get progress statistics
 * GET /api/progress/stats
 */
export const getStats = async (req, res) => {
    try {
        const { days = 30 } = req.query;

        // Calculate date range
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - parseInt(days));

        // Get workouts in date range
        const workouts = await Workout.find({
            user: req.user._id,
            workoutDate: { $gte: startDate },
        }).sort({ workoutDate: 1 });

        // Calculate statistics
        const stats = {
            totalWorkouts: workouts.length,
            totalDuration: workouts.reduce((sum, w) => sum + w.duration, 0),
            totalCalories: workouts.reduce((sum, w) => sum + (w.caloriesBurned || 0), 0),
            averageDuration: 0,
            workoutsByType: {},
            workoutsByDay: [],
        };

        // Calculate average duration
        if (stats.totalWorkouts > 0) {
            stats.averageDuration = Math.round(stats.totalDuration / stats.totalWorkouts);
        }

        // Group by type
        workouts.forEach(workout => {
            if (!stats.workoutsByType[workout.type]) {
                stats.workoutsByType[workout.type] = 0;
            }
            stats.workoutsByType[workout.type]++;
        });

        // Group by day for chart
        const dailyData = {};
        workouts.forEach(workout => {
            const date = workout.workoutDate.toISOString().split('T')[0];
            if (!dailyData[date]) {
                dailyData[date] = {
                    date,
                    count: 0,
                    duration: 0,
                    calories: 0,
                };
            }
            dailyData[date].count++;
            dailyData[date].duration += workout.duration;
            dailyData[date].calories += workout.caloriesBurned || 0;
        });

        stats.workoutsByDay = Object.values(dailyData);

        res.json(stats);
    } catch (error) {
        console.error('Get stats error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

/**
 * Delete a workout
 * DELETE /api/progress/workout/:id
 */
export const deleteWorkout = async (req, res) => {
    try {
        const { id } = req.params;

        const workout = await Workout.findOneAndDelete({
            _id: id,
            user: req.user._id, // Ensure user owns the workout
        });

        if (!workout) {
            return res.status(404).json({
                message: 'Workout not found or unauthorized'
            });
        }

        res.json({ message: 'Workout deleted successfully' });
    } catch (error) {
        console.error('Delete workout error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
