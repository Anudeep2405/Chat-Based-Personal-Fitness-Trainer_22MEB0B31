import { useState } from 'react';
import { authAPI, setAuthToken } from '../utils/api';

function Register({ onSuccess, onNavigate }) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        age: '',
        gender: 'male',
        height: '',
        weight: '',
        fitnessGoal: 'general_fitness',
        fitnessLevel: 'beginner',
        targetWeight: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Convert numeric fields
        const submitData = {
            ...formData,
            age: parseInt(formData.age),
            height: parseFloat(formData.height),
            weight: parseFloat(formData.weight),
            targetWeight: formData.targetWeight ? parseFloat(formData.targetWeight) : undefined,
        };

        try {
            const response = await authAPI.register(submitData);
            setAuthToken(response.token);
            onSuccess(response.user, response.token);
        } catch (err) {
            setError(err.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 px-4 py-8">
            <div className="max-w-2xl w-full">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-primary-700 mb-2">
                        💪 AI Fitness Trainer
                    </h1>
                    <p className="text-gray-600">Create your personalized fitness profile</p>
                </div>

                <div className="card">
                    <h2 className="text-2xl font-semibold mb-6 text-center">
                        Get Started
                    </h2>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Personal Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="name" className="label">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="input-field"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="label">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="input-field"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="label">
                                Password (min 6 characters)
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="input-field"
                                minLength="6"
                                required
                            />
                        </div>

                        {/* Physical Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label htmlFor="age" className="label">
                                    Age
                                </label>
                                <input
                                    type="number"
                                    id="age"
                                    name="age"
                                    value={formData.age}
                                    onChange={handleChange}
                                    className="input-field"
                                    min="13"
                                    max="120"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="gender" className="label">
                                    Gender
                                </label>
                                <select
                                    id="gender"
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    className="input-field"
                                    required
                                >
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="height" className="label">
                                    Height (cm)
                                </label>
                                <input
                                    type="number"
                                    id="height"
                                    name="height"
                                    value={formData.height}
                                    onChange={handleChange}
                                    className="input-field"
                                    min="100"
                                    max="250"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="weight" className="label">
                                    Current Weight (kg)
                                </label>
                                <input
                                    type="number"
                                    id="weight"
                                    name="weight"
                                    value={formData.weight}
                                    onChange={handleChange}
                                    className="input-field"
                                    min="30"
                                    max="300"
                                    step="0.1"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="targetWeight" className="label">
                                    Target Weight (kg) - Optional
                                </label>
                                <input
                                    type="number"
                                    id="targetWeight"
                                    name="targetWeight"
                                    value={formData.targetWeight}
                                    onChange={handleChange}
                                    className="input-field"
                                    min="30"
                                    max="300"
                                    step="0.1"
                                />
                            </div>
                        </div>

                        {/* Fitness Goals */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="fitnessGoal" className="label">
                                    Fitness Goal
                                </label>
                                <select
                                    id="fitnessGoal"
                                    name="fitnessGoal"
                                    value={formData.fitnessGoal}
                                    onChange={handleChange}
                                    className="input-field"
                                    required
                                >
                                    <option value="weight_loss">Weight Loss</option>
                                    <option value="muscle_gain">Muscle Gain</option>
                                    <option value="general_fitness">General Fitness</option>
                                    <option value="endurance">Endurance</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="fitnessLevel" className="label">
                                    Fitness Level
                                </label>
                                <select
                                    id="fitnessLevel"
                                    name="fitnessLevel"
                                    value={formData.fitnessLevel}
                                    onChange={handleChange}
                                    className="input-field"
                                    required
                                >
                                    <option value="beginner">Beginner</option>
                                    <option value="intermediate">Intermediate</option>
                                    <option value="advanced">Advanced</option>
                                </select>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full"
                        >
                            {loading ? 'Creating Account...' : 'Create Account'}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-gray-600">
                            Already have an account?{' '}
                            <button
                                onClick={() => onNavigate('login')}
                                className="text-primary-600 hover:text-primary-700 font-medium"
                            >
                                Login
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;
