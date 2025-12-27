import { useState, useEffect } from 'react';
import Chat from '../components/Chat';
import WorkoutLog from '../components/WorkoutLog';
import ProgressChart from '../components/ProgressChart';
import { authAPI } from '../utils/api';

function Dashboard({ user: initialUser, onLogout }) {
    const [user, setUser] = useState(initialUser);
    const [activeTab, setActiveTab] = useState('chat');
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    // Fetch user profile if not provided
    useEffect(() => {
        if (!user) {
            fetchProfile();
        }
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await authAPI.getProfile();
            setUser(response.user);
        } catch (error) {
            console.error('Failed to fetch profile:', error);
        }
    };

    const handleWorkoutLogged = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    const goalLabels = {
        weight_loss: 'Weight Loss',
        muscle_gain: 'Muscle Gain',
        general_fitness: 'General Fitness',
        endurance: 'Endurance',
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-primary-700">
                                💪 AI Fitness Trainer
                            </h1>
                            <p className="text-sm text-gray-600">
                                Welcome back, {user?.name || 'User'}!
                            </p>
                        </div>
                        <button
                            onClick={onLogout}
                            className="btn-secondary text-sm"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            {/* User Stats Bar */}
            {user && (
                <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                            <div>
                                <p className="text-primary-100 text-sm">Goal</p>
                                <p className="font-semibold">{goalLabels[user.fitnessGoal]}</p>
                            </div>
                            <div>
                                <p className="text-primary-100 text-sm">Current Weight</p>
                                <p className="font-semibold">{user.weight} kg</p>
                            </div>
                            <div>
                                <p className="text-primary-100 text-sm">Target Weight</p>
                                <p className="font-semibold">
                                    {user.targetWeight ? `${user.targetWeight} kg` : 'Not set'}
                                </p>
                            </div>
                            <div>
                                <p className="text-primary-100 text-sm">Level</p>
                                <p className="font-semibold capitalize">{user.fitnessLevel}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Tab Navigation */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex space-x-8">
                        <button
                            onClick={() => setActiveTab('chat')}
                            className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${activeTab === 'chat'
                                    ? 'border-primary-600 text-primary-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            💬 AI Coach
                        </button>
                        <button
                            onClick={() => setActiveTab('workout')}
                            className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${activeTab === 'workout'
                                    ? 'border-primary-600 text-primary-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            🏋️ Log Workout
                        </button>
                        <button
                            onClick={() => setActiveTab('progress')}
                            className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${activeTab === 'progress'
                                    ? 'border-primary-600 text-primary-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            📊 Progress
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {activeTab === 'chat' && <Chat />}
                {activeTab === 'workout' && (
                    <WorkoutLog onWorkoutLogged={handleWorkoutLogged} />
                )}
                {activeTab === 'progress' && (
                    <ProgressChart refreshTrigger={refreshTrigger} />
                )}
            </main>
        </div>
    );
}

export default Dashboard;
