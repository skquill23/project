export interface ExerciseDefinition {
  name: string;
  category: string;
  muscleGroups: string[];
  equipment: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
}

export const EXERCISE_CATEGORIES = [
  "Chest", "Back", "Shoulders", "Biceps", "Triceps",
  "Legs", "Core", "Cardio", "Full Body"
] as const;

export const EXERCISE_LIBRARY: ExerciseDefinition[] = [
  // Chest
  { name: "Bench Press", category: "Chest", muscleGroups: ["Chest", "Triceps", "Shoulders"], equipment: "Barbell", difficulty: "Intermediate" },
  { name: "Incline Bench Press", category: "Chest", muscleGroups: ["Upper Chest", "Shoulders"], equipment: "Barbell", difficulty: "Intermediate" },
  { name: "Dumbbell Flyes", category: "Chest", muscleGroups: ["Chest"], equipment: "Dumbbells", difficulty: "Beginner" },
  { name: "Push-Ups", category: "Chest", muscleGroups: ["Chest", "Triceps", "Core"], equipment: "Bodyweight", difficulty: "Beginner" },
  { name: "Cable Crossovers", category: "Chest", muscleGroups: ["Chest"], equipment: "Cable", difficulty: "Intermediate" },
  { name: "Dips (Chest)", category: "Chest", muscleGroups: ["Chest", "Triceps"], equipment: "Bodyweight", difficulty: "Intermediate" },
  { name: "Dumbbell Bench Press", category: "Chest", muscleGroups: ["Chest", "Triceps"], equipment: "Dumbbells", difficulty: "Beginner" },

  // Back
  { name: "Deadlift", category: "Back", muscleGroups: ["Back", "Hamstrings", "Glutes"], equipment: "Barbell", difficulty: "Advanced" },
  { name: "Pull-Ups", category: "Back", muscleGroups: ["Back", "Biceps"], equipment: "Bodyweight", difficulty: "Advanced" },
  { name: "Barbell Rows", category: "Back", muscleGroups: ["Back", "Biceps"], equipment: "Barbell", difficulty: "Intermediate" },
  { name: "Lat Pulldown", category: "Back", muscleGroups: ["Back", "Biceps"], equipment: "Cable", difficulty: "Beginner" },
  { name: "Dumbbell Rows", category: "Back", muscleGroups: ["Back", "Biceps"], equipment: "Dumbbells", difficulty: "Beginner" },
  { name: "Seated Cable Row", category: "Back", muscleGroups: ["Back", "Biceps"], equipment: "Cable", difficulty: "Beginner" },
  { name: "T-Bar Row", category: "Back", muscleGroups: ["Back"], equipment: "Barbell", difficulty: "Intermediate" },

  // Shoulders
  { name: "Overhead Press", category: "Shoulders", muscleGroups: ["Shoulders", "Triceps"], equipment: "Barbell", difficulty: "Intermediate" },
  { name: "Lateral Raises", category: "Shoulders", muscleGroups: ["Shoulders"], equipment: "Dumbbells", difficulty: "Beginner" },
  { name: "Front Raises", category: "Shoulders", muscleGroups: ["Shoulders"], equipment: "Dumbbells", difficulty: "Beginner" },
  { name: "Face Pulls", category: "Shoulders", muscleGroups: ["Rear Delts", "Upper Back"], equipment: "Cable", difficulty: "Beginner" },
  { name: "Arnold Press", category: "Shoulders", muscleGroups: ["Shoulders"], equipment: "Dumbbells", difficulty: "Intermediate" },
  { name: "Reverse Flyes", category: "Shoulders", muscleGroups: ["Rear Delts"], equipment: "Dumbbells", difficulty: "Beginner" },

  // Biceps
  { name: "Barbell Curls", category: "Biceps", muscleGroups: ["Biceps"], equipment: "Barbell", difficulty: "Beginner" },
  { name: "Dumbbell Curls", category: "Biceps", muscleGroups: ["Biceps"], equipment: "Dumbbells", difficulty: "Beginner" },
  { name: "Hammer Curls", category: "Biceps", muscleGroups: ["Biceps", "Forearms"], equipment: "Dumbbells", difficulty: "Beginner" },
  { name: "Preacher Curls", category: "Biceps", muscleGroups: ["Biceps"], equipment: "Barbell", difficulty: "Beginner" },
  { name: "Concentration Curls", category: "Biceps", muscleGroups: ["Biceps"], equipment: "Dumbbells", difficulty: "Beginner" },

  // Triceps
  { name: "Tricep Pushdowns", category: "Triceps", muscleGroups: ["Triceps"], equipment: "Cable", difficulty: "Beginner" },
  { name: "Skull Crushers", category: "Triceps", muscleGroups: ["Triceps"], equipment: "Barbell", difficulty: "Intermediate" },
  { name: "Overhead Tricep Extension", category: "Triceps", muscleGroups: ["Triceps"], equipment: "Dumbbells", difficulty: "Beginner" },
  { name: "Close-Grip Bench Press", category: "Triceps", muscleGroups: ["Triceps", "Chest"], equipment: "Barbell", difficulty: "Intermediate" },
  { name: "Dips (Triceps)", category: "Triceps", muscleGroups: ["Triceps"], equipment: "Bodyweight", difficulty: "Intermediate" },

  // Legs
  { name: "Barbell Squat", category: "Legs", muscleGroups: ["Quads", "Glutes", "Core"], equipment: "Barbell", difficulty: "Intermediate" },
  { name: "Romanian Deadlift", category: "Legs", muscleGroups: ["Hamstrings", "Glutes"], equipment: "Barbell", difficulty: "Intermediate" },
  { name: "Leg Press", category: "Legs", muscleGroups: ["Quads", "Glutes"], equipment: "Machine", difficulty: "Beginner" },
  { name: "Leg Curls", category: "Legs", muscleGroups: ["Hamstrings"], equipment: "Machine", difficulty: "Beginner" },
  { name: "Leg Extensions", category: "Legs", muscleGroups: ["Quads"], equipment: "Machine", difficulty: "Beginner" },
  { name: "Bulgarian Split Squat", category: "Legs", muscleGroups: ["Quads", "Glutes"], equipment: "Dumbbells", difficulty: "Intermediate" },
  { name: "Calf Raises", category: "Legs", muscleGroups: ["Calves"], equipment: "Machine", difficulty: "Beginner" },
  { name: "Hip Thrusts", category: "Legs", muscleGroups: ["Glutes", "Hamstrings"], equipment: "Barbell", difficulty: "Intermediate" },
  { name: "Lunges", category: "Legs", muscleGroups: ["Quads", "Glutes"], equipment: "Dumbbells", difficulty: "Beginner" },
  { name: "Goblet Squat", category: "Legs", muscleGroups: ["Quads", "Glutes"], equipment: "Dumbbells", difficulty: "Beginner" },

  // Core
  { name: "Planks", category: "Core", muscleGroups: ["Core"], equipment: "Bodyweight", difficulty: "Beginner" },
  { name: "Hanging Leg Raises", category: "Core", muscleGroups: ["Core", "Hip Flexors"], equipment: "Bodyweight", difficulty: "Advanced" },
  { name: "Cable Crunches", category: "Core", muscleGroups: ["Core"], equipment: "Cable", difficulty: "Beginner" },
  { name: "Russian Twists", category: "Core", muscleGroups: ["Obliques"], equipment: "Bodyweight", difficulty: "Beginner" },
  { name: "Ab Wheel Rollouts", category: "Core", muscleGroups: ["Core"], equipment: "Ab Wheel", difficulty: "Advanced" },
  { name: "Dead Bugs", category: "Core", muscleGroups: ["Core"], equipment: "Bodyweight", difficulty: "Beginner" },

  // Cardio
  { name: "Treadmill Run", category: "Cardio", muscleGroups: ["Full Body"], equipment: "Machine", difficulty: "Beginner" },
  { name: "Jump Rope", category: "Cardio", muscleGroups: ["Full Body", "Calves"], equipment: "Jump Rope", difficulty: "Beginner" },
  { name: "Rowing Machine", category: "Cardio", muscleGroups: ["Full Body"], equipment: "Machine", difficulty: "Beginner" },
  { name: "Burpees", category: "Cardio", muscleGroups: ["Full Body"], equipment: "Bodyweight", difficulty: "Intermediate" },
  { name: "Cycling", category: "Cardio", muscleGroups: ["Legs"], equipment: "Machine", difficulty: "Beginner" },
  { name: "Stairmaster", category: "Cardio", muscleGroups: ["Legs", "Glutes"], equipment: "Machine", difficulty: "Beginner" },
];
