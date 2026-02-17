import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Lazy initialization of Gemini client
 * (Ensures .env is already loaded before using the API key)
 */
let genAI = null;

const getGeminiClient = () => {
    if (!genAI) {
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            throw new Error("GEMINI_API_KEY not found in environment variables");
        }

        genAI = new GoogleGenerativeAI(apiKey);
    }

    return genAI;
};

/**
 * Generate personalized fitness response using Gemini AI
 */
export const generateFitnessResponse = async (userMessage, userProfile) => {
    try {
        const model = getGeminiClient().getGenerativeModel({
            model: 'gemini-1.5-flash', // ✅ supported model
        });

        const prompt = buildPrompt(userMessage, userProfile);

        const result = await model.generateContent(prompt);
        const response = await result.response;

        return response.text();
    } catch (error) {
        console.error('Gemini API Error:', error);
        throw new Error('Failed to generate AI response.');
    }
};

/**
 * Build personalized prompt with user context
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

    return `
You are an expert personal fitness trainer and nutritionist.
Provide personalized, safe, and actionable advice.

USER PROFILE:
- Name: ${profile.name}
- Age: ${profile.age} years old
- Gender: ${profile.gender}
- Weight: ${profile.weight} kg
- Height: ${profile.height} cm
- Target Weight: ${profile.targetWeight || 'Not specified'} kg
- Goal: ${goalMap[profile.fitnessGoal] || profile.fitnessGoal}
- Level: ${levelMap[profile.fitnessLevel] || profile.fitnessLevel}

USER QUESTION:
${userMessage}

INSTRUCTIONS:
1. Give structured, practical guidance.
2. Include workouts (sets/reps/duration).
3. Add nutrition advice if relevant.
4. Keep response under 300 words.
5. Be motivational and clear.
6. Adapt intensity to user's fitness level.
7. Avoid unsafe or extreme suggestions.

Respond now:
`;
};

/**
 * Generate weekly workout plan
 */
export const generateWorkoutPlan = async (userProfile) => {
    return generateFitnessResponse(
        'Create a detailed weekly workout plan for me.',
        userProfile
    );
};

/**
 * Generate nutrition advice
 */
export const generateNutritionAdvice = async (userProfile) => {
    return generateFitnessResponse(
        'Give me personalized nutrition and diet advice.',
        userProfile
    );
};
