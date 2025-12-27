import Groq from 'groq-sdk';

// Initialize Groq AI with API key
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

/**
 * Generate personalized fitness response using Groq AI
 * @param {string} userMessage - User's fitness query
 * @param {object} userProfile - User's profile data
 * @returns {Promise<string>} AI-generated response
 */
export const generateFitnessResponse = async (userMessage, userProfile) => {
    try {
        // Build context-aware prompt
        const prompt = buildPrompt(userMessage, userProfile);

        // Generate content using Groq's Llama model
        const response = await groq.chat.completions.create({
            model: 'llama-3.3-70b-versatile', // Fast, free, and powerful
            messages: [
                {
                    role: 'user',
                    content: prompt
                }
            ],
            temperature: 0.7,
            max_tokens: 500,
            top_p: 1,
        });

        // Extract text from response
        return response.choices[0].message.content;
    } catch (error) {
        console.error('Groq API Error:', error);
        console.error('Error details:', error.message);
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
        beginner: 'beginner',
        intermediate: 'intermediate',
        advanced: 'advanced',
    };

    return `You are a knowledgeable fitness coach chatting with ${profile.name}. Answer questions directly and clearly.

CRITICAL RESPONSE FORMAT:
- START with the direct answer to their exact question in the FIRST sentence
- Use **bold text** for key numbers, recommendations, or important points
- Keep total response 150-250 words max
- Only greet at the very start of a new conversation
- Use profile info ONLY when relevant to the question

AVAILABLE CONTEXT (use only if needed):
- ${profile.name}, ${profile.age}yo, ${profile.gender}
- Goal: ${goalMap[profile.fitnessGoal] || profile.fitnessGoal}
- Level: ${levelMap[profile.fitnessLevel] || profile.fitnessLevel}
- Weight: ${profile.weight}kg, Height: ${profile.height}cm
${profile.targetWeight ? `- Target: ${profile.targetWeight}kg` : ''}

USER QUESTION: ${userMessage}

RESPONSE STRUCTURE:
1. FIRST: Direct answer to their question (use **bold** for key info)
2. THEN: Brief explanation or context if needed
3. LAST: Actionable advice or next steps

FORMATTING EXAMPLES:
- "Aim for **150g of protein daily** for muscle gain."
- "Do **3-4 sets of 8-12 reps** for strength."
- "**30-45 minutes** of cardio, 4-5 times per week."

STYLE:
- Be conversational but concise
- Use emojis sparingly (💪 🏃 🥗)
- Skip formalities in ongoing chats
- Answer what they asked, don't over-explain

Answer directly now:`;
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
