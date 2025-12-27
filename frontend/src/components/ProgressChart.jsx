import { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { progressAPI } from '../utils/api';

function ProgressChart({ refreshTrigger }) {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [timeRange, setTimeRange] = useState(30);

    useEffect(() => {
        fetchStats();
    }, [timeRange, refreshTrigger]);

    const fetchStats = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await progressAPI.getStats(timeRange);
            setStats(data);
        } catch (err) {
            setError(err.message || 'Failed to load statistics');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                <p className="mt-4 text-gray-600">Loading your progress...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="card">
                <div className="text-center py-12">
                    <p className="text-red-600">{error}</p>
                    <button onClick={fetchStats} className="btn-primary mt-4">
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    if (!stats || stats.totalWorkouts === 0) {
        return (
            <div className="card">
                <div className="text-center py-12">
                    <p className="text-6xl mb-4">📊</p>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                        No Workout Data Yet
                    </h3>
                    <p className="text-gray-600">
                        Start logging your workouts to see your progress!
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Time Range Selector */}
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Your Progress</h2>
                <div className="flex gap-2">
                    {[7, 30, 90].map((days) => (
                        <button
                            key={days}
                            onClick={() => setTimeRange(days)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${timeRange === days
                                    ? 'bg-primary-600 text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                        >
                            {days} Days
                        </button>
                    ))}
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="card bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                    <p className="text-sm text-blue-600 font-medium">Total Workouts</p>
                    <p className="text-3xl font-bold text-blue-700 mt-2">
                        {stats.totalWorkouts}
                    </p>
                </div>

                <div className="card bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                    <p className="text-sm text-green-600 font-medium">Total Duration</p>
                    <p className="text-3xl font-bold text-green-700 mt-2">
                        {stats.totalDuration} min
                    </p>
                </div>

                <div className="card bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                    <p className="text-sm text-orange-600 font-medium">Calories Burned</p>
                    <p className="text-3xl font-bold text-orange-700 mt-2">
                        {stats.totalCalories}
                    </p>
                </div>

                <div className="card bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                    <p className="text-sm text-purple-600 font-medium">Avg Duration</p>
                    <p className="text-3xl font-bold text-purple-700 mt-2">
                        {stats.averageDuration} min
                    </p>
                </div>
            </div>

            {/* Workout Activity Chart */}
            {stats.workoutsByDay && stats.workoutsByDay.length > 0 && (
                <div className="card">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                        Workout Activity Over Time
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={stats.workoutsByDay}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                dataKey="date"
                                tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            />
                            <YAxis />
                            <Tooltip
                                labelFormatter={(date) => new Date(date).toLocaleDateString()}
                            />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="duration"
                                stroke="#0ea5e9"
                                strokeWidth={2}
                                name="Duration (min)"
                            />
                            <Line
                                type="monotone"
                                dataKey="calories"
                                stroke="#f97316"
                                strokeWidth={2}
                                name="Calories"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            )}

            {/* Workout Types Distribution */}
            {stats.workoutsByType && Object.keys(stats.workoutsByType).length > 0 && (
                <div className="card">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                        Workouts by Type
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart
                            data={Object.entries(stats.workoutsByType).map(([type, count]) => ({
                                type: type.charAt(0).toUpperCase() + type.slice(1),
                                count,
                            }))}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="type" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="count" fill="#0ea5e9" name="Workouts" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
}

export default ProgressChart;
