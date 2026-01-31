/**
 * Static blog data for exercise education.
 * Structure ready to migrate to MongoDB (e.g. { _id, title, muscleGroup, ... }).
 */
export const blogPosts = [
  {
    id: '1',
    title: 'Bench Press: Form & Power',
    muscleGroup: 'Chest, Triceps, Shoulders',
    description: 'The bench press is a compound lift that builds pressing strength and chest size. Learn proper setup, bar path, and breathing.',
    image: null,
    tips: [
      'Retract your shoulder blades and keep them pinned throughout the lift.',
      'Plant your feet firmly and drive through your legs to create full-body tension.',
      'Lower the bar to mid-chest, not the neck or stomach.',
      'Use a grip slightly wider than shoulder-width for most people.',
    ],
    commonMistakes: [
      'Flaring elbows too wide (increases shoulder stress).',
      'Bouncing the bar off the chest.',
      'Lifting the head or butt off the bench.',
    ],
  },
  {
    id: '2',
    title: 'Squat Depth & Knee Safety',
    muscleGroup: 'Quads, Glutes, Hamstrings',
    description: 'Squats are the king of lower-body exercises. Here’s how to hit depth safely and protect your knees.',
    image: null,
    tips: [
      'Break at the hips and knees together; don’t let knees cave inward.',
      'Aim for at least parallel (hip crease at or below knee) for full range.',
      'Brace your core and keep your chest up as you descend.',
      'Push through the whole foot, not just the toes.',
    ],
    commonMistakes: [
      'Letting knees cave in (valgus).',
      'Excessive forward lean with a high bar.',
      'Not hitting consistent depth rep to rep.',
    ],
  },
  {
    id: '3',
    title: 'Deadlift: Hinge, Don’t Squat',
    muscleGroup: 'Back, Hamstrings, Glutes',
    description: 'The deadlift is a hip hinge. Master the setup and lockout to build a strong posterior chain.',
    image: null,
    tips: [
      'Set the bar over mid-foot and keep it close to your body.',
      'Hinge at the hips; don’t lead with a rounded lower back.',
      'Squeeze the bar and engage your lats before you pull.',
      'Lock out by driving hips forward, not by hyperextending the back.',
    ],
    commonMistakes: [
      'Rounding the lower back (especially on heavy reps).',
      'Starting with the bar too far in front.',
      'Pulling with the arms instead of driving with the legs and hips.',
    ],
  },
  {
    id: '4',
    title: 'Overhead Press for Strong Shoulders',
    muscleGroup: 'Shoulders, Triceps',
    description: 'The standing overhead press builds shoulder strength and stability. Focus on a straight bar path and a tight core.',
    image: null,
    tips: [
      'Start with the bar at the front of your shoulders, elbows slightly in front.',
      'Keep your core and glutes tight; avoid excessive lean back.',
      'Press the bar in a straight line; it may clear your face slightly.',
      'Lock out at the top with shoulders fully engaged.',
    ],
    commonMistakes: [
      'Leaning back too much (turns it into an incline press).',
      'Pressing the bar forward instead of up.',
      'Not bracing the core (lower back arches).',
    ],
  },
  {
    id: '5',
    title: 'Rows for a Strong Back',
    muscleGroup: 'Back, Biceps',
    description: 'Horizontal pulling builds thickness and balance. Barbell and dumbbell rows are essential for posture and strength.',
    image: null,
    tips: [
      'Hinge at the hips and keep your back flat; don’t round.',
      'Pull the weight to your hip or lower ribcage, not the chest.',
      'Squeeze your shoulder blade at the top of each rep.',
      'Keep your head in line with your spine.',
    ],
    commonMistakes: [
      'Using too much body swing (momentum instead of muscle).',
      'Shrugging instead of retracting the shoulder blade.',
      'Pulling to the wrong point (too high or too low).',
    ],
  },
];

export function getPostById(id) {
  return blogPosts.find((p) => p.id === id) ?? null;
}
