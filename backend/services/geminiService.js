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
    const prompt = buildPrompt(userMessage, userProfile);

    // Allow overriding model via env; try sensible fallbacks to handle API changes
    const candidates = [
        process.env.GEMINI_MODEL,
        // Common current models
        'gemini-1.5-flash',
        'gemini-1.5-flash-latest',
        'gemini-1.5-flash-8b',
        'gemini-1.5-flash-8b-latest',
        'gemini-1.5-pro',
        'gemini-1.5-pro-latest',
        // Legacy names that some API keys still allow
        'gemini-pro',
        'gemini-1.0-pro',
        'gemini-1.0-pro-latest',
    ].filter(Boolean);

    let lastErr;
    for (const modelName of candidates) {
        try {
            const model = getGeminiClient().getGenerativeModel({ model: modelName });
            const result = await model.generateContent(prompt);
            const response = await result.response;
            return response.text();
        } catch (err) {
            // Keep trying other models on 404/not supported errors
            lastErr = err;
            const msg = String(err?.message || '');
            if (msg.includes('not found') || msg.includes('not supported') || msg.includes('404')) {
                console.warn(`Gemini model '${modelName}' failed, trying next fallback...`);
                continue;
            }
            break; // Other errors: stop retrying
        }
    }

    console.error('Gemini API Error:', lastErr);
    throw new Error(`Gemini API Error: ${lastErr?.message || 'Failed to generate AI response.'}`);
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
