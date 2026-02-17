/**
 * Fallback AI service (no external API calls)
 * Returns a short, safe, actionable fitness response using user profile.
 */

const formatGoal = (g) => ({
  weight_loss: 'lose weight',
  muscle_gain: 'build muscle',
  general_fitness: 'improve general fitness',
  endurance: 'increase endurance',
}[g] || g || 'improve fitness');

const formatLevel = (l) => ({
  beginner: 'beginner',
  intermediate: 'intermediate',
  advanced: 'advanced',
}[l] || 'beginner');

export const generateFitnessResponse = async (userMessage, profile) => {
  const name = profile?.name || 'Athlete';
  const goal = formatGoal(profile?.fitnessGoal);
  const level = formatLevel(profile?.fitnessLevel);
  const weight = profile?.weight ? `${profile.weight}kg` : '';
  const height = profile?.height ? `${profile.height}cm` : '';

  const intro = `Hi ${name}! Here’s a quick plan to help you ${goal} (${level}).`;

  // Very light heuristic guidance
  const strength = `Strength (3 days):
  - Full-body A: Squat 3x8-10, Push-up/Bench 3x8-10, Row 3x10-12, Plank 3x30-45s
  - Full-body B: Deadlift 3x5, Overhead Press 3x8-10, Lat Pulldown/Pull-up 3x6-8, Side Plank 3x30s/side
  - Accessories: Lunges 3x12/leg, DB Curls 2x12, Triceps Pushdown 2x12`;

  const cardio = `Cardio (2 days):
  - 20–30 min brisk walk, cycle, or jog at easy-moderate pace
  - Optional finisher: 5x1 min faster/1 min easy`;

  const nutrition = `Nutrition:
  - Protein: ~1.6–2.2g/kg/day (aim ~${profile?.weight ? Math.round(profile.weight*1.8) : 120}g)
  - Eat mostly whole foods; add 300–400 kcal/day for muscle gain
  - Hydrate well; 7–9h sleep/night`;

  const safety = `Progression & Safety:
  - Add small weights or reps weekly if form is solid
  - Warm up 5–10 min; stop if sharp pain
  - Track workouts; adjust based on energy and recovery`;

  const context = [weight, height].filter(Boolean).join(', ');

  return [
    `${intro}${context ? ` (${context})` : ''}`,
    '',
    strength,
    '',
    cardio,
    '',
    nutrition,
    '',
    safety,
  ].join('\n');
};

export default { generateFitnessResponse };
