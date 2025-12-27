import { useState } from 'react';
import { progressAPI } from '../utils/api';

function WorkoutLog({ onWorkoutLogged }) {
    const [formData, setFormData] = useState({
        type: 'cardio',
        name: '',
        duration: '',
        caloriesBurned: '',
        intensity: 'medium',
        notes: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        setError('');
        setSuccess('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        const submitData = {
            ...formData,
            duration: parseInt(formData.duration),
            caloriesBurned: formData.caloriesBurned
                ? parseInt(formData.caloriesBurned)
                : undefined,
        };

        try {
            await progressAPI.logWorkout(submitData);
            setSuccess('Workout logged successfully! 🎉');

            // Reset form
            setFormData({
                type: 'cardio',
                name: '',
                duration: '',
                caloriesBurned: '',
                intensity: 'medium',
                notes: '',
            });

            // Notify parent to refresh stats
            if (onWorkoutLogged) {
                onWorkoutLogged();
            }
        } catch (err) {
            setError(err.message || 'Failed to log workout');
        } finally {
            setLoading(false);
        }
    };

    const workoutTypes = [
        { value: 'cardio', label: '🏃 Cardio', emoji: '🏃' },
        { value: 'strength', label: '💪 Strength', emoji: '💪' },
        { value: 'flexibility', label: '🧘 Flexibility', emoji: '🧘' },
        { value: 'sports', label: '⚽ Sports', emoji: '⚽' },
        { value: 'other', label: '🎯 Other', emoji: '🎯' },
    ];

    return (
        <div className="max-w-2xl mx-auto">
            <div className="card">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                    Log Your Workout
                </h2>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Workout Type */}
                    <div>
                        <label className="label">Workout Type</label>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                            {workoutTypes.map((type) => (
                                <button
                                    key={type.value}
                                    type="button"
                                    onClick={() =>
                                        setFormData({ ...formData, type: type.value })
                                    }
                                    className={`p-3 rounded-lg border-2 transition-all ${formData.type === type.value
                                            ? 'border-primary-600 bg-primary-50 text-primary-700'
                                            : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <div className="text-2xl mb-1">{type.emoji}</div>
                                    <div className="text-xs font-medium">
                                        {type.label.replace(/[^\w\s]/gi, '')}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Workout Name */}
                    <div>
                        <label htmlFor="name" className="label">
                            Workout Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="input-field"
                            placeholder="e.g., Morning Run, Chest Day, Yoga Session"
                            required
                        />
                    </div>

                    {/* Duration and Calories */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="duration" className="label">
                                Duration (minutes)
                            </label>
                            <input
                                type="number"
                                id="duration"
                                name="duration"
                                value={formData.duration}
                                onChange={handleChange}
                                className="input-field"
                                min="1"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="caloriesBurned" className="label">
                                Calories Burned (optional)
                            </label>
                            <input
                                type="number"
                                id="caloriesBurned"
                                name="caloriesBurned"
                                value={formData.caloriesBurned}
                                onChange={handleChange}
                                className="input-field"
                                min="0"
                            />
                        </div>
                    </div>

                    {/* Intensity */}
                    <div>
                        <label htmlFor="intensity" className="label">
                            Intensity Level
                        </label>
                        <select
                            id="intensity"
                            name="intensity"
                            value={formData.intensity}
                            onChange={handleChange}
                            className="input-field"
                        >
                            <option value="low">Low - Light activity</option>
                            <option value="medium">Medium - Moderate effort</option>
                            <option value="high">High - Intense workout</option>
                        </select>
                    </div>

                    {/* Notes */}
                    <div>
                        <label htmlFor="notes" className="label">
                            Notes (optional)
                        </label>
                        <textarea
                            id="notes"
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            className="input-field"
                            rows="3"
                            placeholder="How did you feel? Any observations?"
                            maxLength="500"
                        ></textarea>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full"
                    >
                        {loading ? 'Logging Workout...' : 'Log Workout'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default WorkoutLog;
