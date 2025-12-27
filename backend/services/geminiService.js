import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Generate personalized fitness response using Gemini AI
 * @param {string} userMessage - User's fitness query
 * @param {object} userProfile - User's profile data
 * @returns {Promise<string>} AI-generated response
 */
export const generateFitnessResponse = async (userMessage, userProfile) => {
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

        // Build context-aware prompt
        const prompt = buildPrompt(userMessage, userProfile);

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        return text;
    } catch (error) {
        console.error('Gemini API Error:', error);
        throw new Error('Failed to generate AI response. Please try again.');
    }
};

/**
 * Build personalized prompt with user context
 * @param {string} userMessage - User's query
 * @param {object} profile - User profile
 * @returns {string} Formatted prompt
 */
const buildPrompt = (userMessage, profile) => {
    const goalMap = {
        weight_loss: 'lose weight',
        muscle_gain: 'build muscle',
        general_fitness: 'improve general fitness',
        endurance: 'increase endurance',
    };

    const levelMap = {
        beginner: 'beginner (new to fitness)',
        intermediate: 'intermediate (some experience)',
        advanced: 'advanced (experienced athlete)',
    };

    return `You are an expert personal fitness trainer and nutritionist. Provide personalized, actionable advice.

USER PROFILE:
- Name: ${profile.name}
- Age: ${profile.age} years old
- Gender: ${profile.gender}
- Current Weight: ${profile.weight} kg
- Height: ${profile.height} cm
- Target Weight: ${profile.targetWeight || 'Not specified'} kg
- Fitness Goal: ${goalMap[profile.fitnessGoal] || profile.fitnessGoal}
- Fitness Level: ${levelMap[profile.fitnessLevel] || profile.fitnessLevel}

USER QUERY: ${userMessage}

INSTRUCTIONS:
1. Provide specific, personalized advice based on the user's profile
2. Include workout recommendations with sets, reps, and duration
3. Add nutrition tips when relevant
4. Keep responses concise but informative (max 300 words)
5. Use encouraging, motivational language
6. If asked about workout plans, structure them clearly
7. Always consider the user's fitness level and goals

Respond now:`;
};

/**
 * Generate workout plan based on user goals
 * @param {object} userProfile - User's profile data
 * @returns {Promise<string>} Workout plan
 */
export const generateWorkoutPlan = async (userProfile) => {
    const message = `Create a detailed weekly workout plan for me based on my fitness goals.`;
    return await generateFitnessResponse(message, userProfile);
};

/**
 * Generate nutrition advice
 * @param {object} userProfile - User's profile data
 * @returns {Promise<string>} Nutrition tips
 */
export const generateNutritionAdvice = async (userProfile) => {
    const message = `Give me personalized nutrition and diet advice for my fitness goals.`;
    return await generateFitnessResponse(message, userProfile);
};
