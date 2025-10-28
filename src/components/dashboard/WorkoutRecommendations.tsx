import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Dumbbell, CheckCircle2, Clock, TrendingUp } from "lucide-react";

interface Exercise {
  name: string;
  type: string;
  duration: number;
  calories: number;
  description: string;
  formTips: string[];
  difficulty: string;
  muscleGroups: string[];
}

interface WorkoutRecommendationsProps {
  userId: string;
}

const WorkoutRecommendations = ({ userId }: WorkoutRecommendationsProps) => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedExercises, setSelectedExercises] = useState<Set<string>>(new Set());
  const [recentWorkouts, setRecentWorkouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [userId]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load profile to get fitness goal
      const { data: profile } = await supabase
        .from("profiles")
        .select("fitness_goal")
        .eq("id", userId)
        .single();

      // Generate exercise recommendations based on goal
      const exerciseList = getExercisesByGoal(profile?.fitness_goal || "maintenance");
      setExercises(exerciseList);

      // Load user's selected exercises
      const { data: savedExercises } = await supabase
        .from("workout_exercises")
        .select("exercise_name")
        .eq("user_id", userId)
        .eq("is_selected", true);

      if (savedExercises) {
        setSelectedExercises(new Set(savedExercises.map(e => e.exercise_name)));
      }

      // Load recent workouts
      const { data: workouts_data } = await supabase
        .from("workouts")
        .select("*")
        .eq("user_id", userId)
        .order("completed_at", { ascending: false })
        .limit(5);

      setRecentWorkouts(workouts_data || []);
    } catch (error: any) {
      toast.error("Failed to load workout data");
    } finally {
      setLoading(false);
    }
  };

  const getExercisesByGoal = (goal: string): Exercise[] => {
    const exerciseDatabase: Record<string, Exercise[]> = {
      weight_loss: [
        {
          name: "Jump Rope",
          type: "Cardio",
          duration: 15,
          calories: 220,
          description: "High-intensity cardiovascular exercise that burns calories quickly and improves coordination",
          formTips: [
            "Keep elbows close to body",
            "Jump on balls of feet, not flat-footed",
            "Use wrists to turn rope, not arms",
            "Maintain steady rhythm and breathing"
          ],
          difficulty: "Beginner",
          muscleGroups: ["Full Body", "Calves", "Shoulders"]
        },
        {
          name: "Burpees",
          type: "HIIT",
          duration: 20,
          calories: 300,
          description: "Full-body explosive exercise combining squat, plank, and jump for maximum calorie burn",
          formTips: [
            "Land softly when jumping down",
            "Keep core tight in plank position",
            "Explode up powerfully from squat",
            "Maintain controlled breathing pattern"
          ],
          difficulty: "Intermediate",
          muscleGroups: ["Full Body", "Chest", "Legs", "Core"]
        },
        {
          name: "Mountain Climbers",
          type: "HIIT",
          duration: 15,
          calories: 180,
          description: "Dynamic core and cardio exercise that engages multiple muscle groups simultaneously",
          formTips: [
            "Keep hips level with shoulders",
            "Drive knees toward chest quickly",
            "Maintain plank position throughout",
            "Keep hands directly under shoulders"
          ],
          difficulty: "Beginner",
          muscleGroups: ["Core", "Shoulders", "Legs"]
        },
        {
          name: "High Knees",
          type: "Cardio",
          duration: 10,
          calories: 150,
          difficulty: "Beginner",
          muscleGroups: ["Legs", "Core"],
          description: "Running in place while bringing knees to hip level for cardio conditioning",
          formTips: [
            "Stand tall, lift knees to hip height alternately",
            "Pump arms in running motion",
            "Stay on balls of feet, quick foot turnover",
            "Engage core to maintain upright posture",
            "Aim for 100+ steps per minute"
          ]
        },
        {
          name: "Box Jumps",
          type: "Plyometric",
          duration: 15,
          calories: 190,
          difficulty: "Advanced",
          muscleGroups: ["Legs", "Glutes"],
          description: "Explosive lower body movement that builds power and burns calories",
          formTips: [
            "Start with box at knee height or lower",
            "Jump explosively onto box landing softly",
            "Land with knees slightly bent, full foot on box",
            "Step down one foot at a time (don't jump down)",
            "Reset fully between reps for safety"
          ]
        },
        {
          name: "Swimming",
          type: "Cardio",
          duration: 30,
          calories: 350,
          description: "Low-impact full-body cardio that's easy on joints while burning significant calories",
          formTips: [
            "Keep body horizontal in water",
            "Breathe rhythmically every 2-3 strokes",
            "Use full range of arm motion",
            "Kick from hips, not knees"
          ],
          difficulty: "Beginner",
          muscleGroups: ["Full Body", "Back", "Shoulders", "Core"]
        },
        {
          name: "Cycling (Indoor/Outdoor)",
          type: "Cardio",
          duration: 45,
          calories: 400,
          description: "Excellent low-impact cardio for fat burning and leg strengthening",
          formTips: [
            "Keep knees aligned with feet",
            "Maintain slight bend in elbows",
            "Adjust seat height properly (slight knee bend at bottom)",
            "Keep steady cadence (80-100 RPM)"
          ],
          difficulty: "Beginner",
          muscleGroups: ["Quads", "Hamstrings", "Glutes", "Calves"]
        },
        {
          name: "Rowing Machine",
          type: "Cardio",
          duration: 20,
          calories: 280,
          description: "Full-body cardio combining upper and lower body for maximum calorie burn",
          formTips: [
            "Push with legs first, then pull with arms",
            "Keep back straight throughout motion",
            "Drive through heels",
            "Return slowly and controlled"
          ],
          difficulty: "Intermediate",
          muscleGroups: ["Full Body", "Back", "Legs", "Core"]
        },
        {
          name: "Kettlebell Swings",
          type: "Strength",
          duration: 15,
          calories: 220,
          description: "Dynamic hip-hinge movement combining cardio and strength training",
          formTips: [
            "Hinge at hips, not squat",
            "Drive through heels powerfully",
            "Keep arms relaxed (legs do the work)",
            "Maintain neutral spine throughout"
          ],
          difficulty: "Intermediate",
          muscleGroups: ["Glutes", "Hamstrings", "Core", "Shoulders"]
        }
      ],
      muscle_gain: [
        {
          name: "Barbell Squat",
          type: "Strength",
          duration: 30,
          calories: 250,
          description: "The king of leg exercises - builds overall lower body mass and strength",
          formTips: [
            "Bar should rest on upper traps, not neck",
            "Descend until thighs are parallel or below",
            "Keep knees tracking over toes",
            "Drive through heels on ascent",
            "Keep chest up and core tight"
          ],
          difficulty: "Intermediate",
          muscleGroups: ["Quads", "Glutes", "Hamstrings", "Core"]
        },
        {
          name: "Bench Press",
          type: "Strength",
          duration: 25,
          calories: 200,
          description: "Primary chest builder - fundamental upper body pushing exercise",
          formTips: [
            "Retract shoulder blades throughout",
            "Lower bar to mid-chest area",
            "Keep feet flat on floor",
            "Press in slight arc toward rack",
            "Maintain 5-point contact (head, shoulders, glutes, both feet)"
          ],
          difficulty: "Intermediate",
          muscleGroups: ["Chest", "Triceps", "Shoulders"]
        },
        {
          name: "Deadlifts",
          type: "Strength",
          duration: 20,
          calories: 160,
          difficulty: "Advanced",
          muscleGroups: ["Back", "Hamstrings", "Glutes"],
          description: "Total body strength builder targeting posterior chain muscles",
          formTips: [
            "Stand with feet hip-width, bar over mid-foot",
            "Grip bar just outside legs, shins touch bar",
            "Keep back flat, chest up, engage lats",
            "Drive through heels, extend hips and knees",
            "Bar stays close to body throughout movement"
          ]
        },
        {
          name: "Pull-Ups",
          type: "Strength",
          duration: 15,
          calories: 100,
          difficulty: "Advanced",
          muscleGroups: ["Back", "Biceps"],
          description: "Bodyweight exercise for building back width and arm strength",
          formTips: [
            "Hang from bar with overhand grip, hands shoulder-width",
            "Pull yourself up until chin clears bar",
            "Keep core tight, avoid swinging",
            "Lower with control to full arm extension",
            "Use resistance band for assistance if needed"
          ]
        },
        {
          name: "Overhead Press",
          type: "Strength",
          duration: 18,
          calories: 110,
          difficulty: "Intermediate",
          muscleGroups: ["Shoulders", "Triceps"],
          description: "Compound shoulder exercise for building upper body strength",
          formTips: [
            "Start with bar at shoulder height, grip shoulder-width",
            "Press bar overhead until arms fully extended",
            "Keep core braced, don't arch lower back excessively",
            "Bar path should be straight up and down",
            "Lower with control back to shoulders"
          ]
        },
        {
          name: "Dumbbell Rows",
          type: "Strength",
          duration: 15,
          calories: 95,
          difficulty: "Beginner",
          muscleGroups: ["Back", "Biceps"],
          description: "Unilateral back exercise for muscle development and strength",
          formTips: [
            "Place one knee and hand on bench for support",
            "Hold dumbbell in opposite hand, let it hang",
            "Pull dumbbell to hip, keeping elbow close to body",
            "Squeeze shoulder blade at top of movement",
            "Lower with control, repeat on other side"
          ]
        },
        {
          name: "Romanian Deadlift",
          type: "Strength",
          duration: 20,
          calories: 180,
          description: "Targets hamstrings and glutes with hip-hinge movement pattern",
          formTips: [
            "Keep knees slightly bent throughout",
            "Hinge at hips, push glutes back",
            "Bar should stay close to legs",
            "Feel stretch in hamstrings at bottom",
            "Maintain neutral spine, no rounding"
          ],
          difficulty: "Intermediate",
          muscleGroups: ["Hamstrings", "Glutes", "Lower Back"]
        },
        {
          name: "Dips",
          type: "Strength",
          duration: 12,
          calories: 90,
          description: "Compound pushing exercise for chest and triceps development",
          formTips: [
            "Start at top with arms fully extended",
            "Lean forward for chest emphasis or upright for triceps",
            "Lower until upper arms are parallel to floor",
            "Press back up explosively",
            "Keep shoulders down and back"
          ],
          difficulty: "Intermediate",
          muscleGroups: ["Chest", "Triceps", "Shoulders"]
        },
        {
          name: "Barbell Rows",
          type: "Strength",
          duration: 18,
          calories: 130,
          description: "Fundamental back exercise for thickness and strength",
          formTips: [
            "Hinge at hips, back at 45 degrees",
            "Pull bar to lower chest/upper abs",
            "Keep elbows close to body",
            "Squeeze shoulder blades together at top",
            "Control the weight on descent"
          ],
          difficulty: "Intermediate",
          muscleGroups: ["Back", "Biceps", "Core"]
        }
      ],
      maintenance: [
        {
          name: "Push-Ups",
          type: "Bodyweight",
          duration: 10,
          calories: 75,
          difficulty: "Beginner",
          muscleGroups: ["Chest", "Triceps", "Core"],
          description: "Classic bodyweight exercise for upper body strength and endurance",
          formTips: [
            "Hands slightly wider than shoulder-width apart",
            "Keep body in straight line from head to heels",
            "Lower chest to just above ground",
            "Push back up while engaging core",
            "Modify on knees if needed"
          ]
        },
        {
          name: "Squats (Bodyweight)",
          type: "Bodyweight",
          duration: 12,
          calories: 85,
          difficulty: "Beginner",
          muscleGroups: ["Legs", "Glutes", "Core"],
          description: "Fundamental lower body exercise for strength and mobility",
          formTips: [
            "Feet shoulder-width apart, toes slightly out",
            "Send hips back first, then bend knees",
            "Keep chest up and weight on heels",
            "Stand back up, squeezing glutes at top"
          ]
        },
        {
          name: "Planks",
          type: "Core",
          duration: 10,
          calories: 60,
          difficulty: "Beginner",
          muscleGroups: ["Core", "Shoulders"],
          description: "Isometric core exercise for stability and strength",
          formTips: [
            "Start in forearm plank position",
            "Keep body in straight line from head to heels",
            "Engage core by pulling belly button toward spine",
            "Don't let hips sag or pike up",
            "Hold for 30-60 seconds, rest and repeat"
          ]
        },
        {
          name: "Lunges",
          type: "Strength",
          duration: 12,
          calories: 95,
          difficulty: "Beginner",
          muscleGroups: ["Legs", "Glutes"],
          description: "Unilateral leg exercise for balance and functional strength",
          formTips: [
            "Step forward with one leg, lower back knee toward floor",
            "Front knee should be at 90 degrees over ankle",
            "Keep torso upright, don't lean forward",
            "Push through front heel to return to start",
            "Alternate legs or complete one side then switch"
          ]
        },
        {
          name: "Yoga Flow",
          type: "Flexibility",
          duration: 30,
          calories: 120,
          difficulty: "Beginner",
          muscleGroups: ["Full Body"],
          description: "Gentle flowing movements to improve flexibility and reduce stress",
          formTips: [
            "Follow sun salutation sequence: mountain to forward fold",
            "Transition through plank, cobra, downward dog",
            "Focus on smooth transitions between poses",
            "Breathe deeply and mindfully throughout",
            "Hold each pose for 5 breaths before moving"
          ]
        }
      ]
    };

    return exerciseDatabase[goal] || exerciseDatabase.maintenance;
  };

  const toggleExerciseSelection = async (exerciseName: string) => {
    const newSelected = new Set(selectedExercises);
    
    if (newSelected.has(exerciseName)) {
      newSelected.delete(exerciseName);
      
      // Delete from database
      await supabase
        .from("workout_exercises")
        .delete()
        .eq("user_id", userId)
        .eq("exercise_name", exerciseName);
    } else {
      newSelected.add(exerciseName);
      
      // Get exercise details
      const exercise = exercises.find(e => e.name === exerciseName);
      if (exercise) {
        // Insert to database
        await supabase.from("workout_exercises").insert({
          user_id: userId,
          exercise_name: exerciseName,
          exercise_type: exercise.type,
          is_selected: true
        });
      }
    }
    
    setSelectedExercises(newSelected);
    toast.success(
      newSelected.has(exerciseName) 
        ? "Added to your workout split" 
        : "Removed from your workout split"
    );
  };

  const logWorkout = async (exercise: Exercise) => {
    try {
      const { error } = await supabase.from("workouts").insert({
        user_id: userId,
        workout_name: exercise.name,
        workout_type: exercise.type,
        duration_minutes: exercise.duration,
        calories_burned: exercise.calories,
        notes: exercise.description,
      });

      if (error) throw error;

      toast.success("Workout logged successfully!");
      await loadData();
    } catch (error: any) {
      toast.error("Failed to log workout");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center space-y-2">
          <Dumbbell className="w-8 h-8 animate-pulse mx-auto" />
          <p className="text-muted-foreground">Loading exercises...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Dumbbell className="w-5 h-5" />
            Exercise Library
          </CardTitle>
          <CardDescription>
            Select exercises to build your custom workout split with form tips for each exercise.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {exercises.map((exercise, idx) => (
              <Card key={idx} className="border-2 hover:border-primary transition-colors">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={selectedExercises.has(exercise.name)}
                        onCheckedChange={() => toggleExerciseSelection(exercise.name)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <CardTitle className="text-lg">{exercise.name}</CardTitle>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <Badge variant="secondary">{exercise.type}</Badge>
                          <Badge variant="outline">{exercise.difficulty}</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {exercise.description}
                  </p>
                  
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {exercise.duration} min
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      {exercise.calories} cal
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold mb-2">Target Muscles:</p>
                    <div className="flex flex-wrap gap-1">
                      {exercise.muscleGroups.map((muscle, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {muscle}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold mb-2">Proper Form:</p>
                    <ul className="space-y-1">
                      {exercise.formTips.map((tip, i) => (
                        <li key={i} className="text-xs text-muted-foreground flex gap-2">
                          <span className="text-primary mt-0.5">•</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button
                    className="w-full"
                    onClick={() => logWorkout(exercise)}
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Complete Workout
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {selectedExercises.size > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Workout Split</CardTitle>
            <CardDescription>
              {selectedExercises.size} exercise{selectedExercises.size !== 1 ? 's' : ''} selected
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {Array.from(selectedExercises).map((name) => (
                <Badge key={name} variant="default" className="text-sm py-1">
                  {name}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {recentWorkouts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Workouts</CardTitle>
            <CardDescription>Your workout history</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recentWorkouts.map((workout) => (
                <div
                  key={workout.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted"
                >
                  <div>
                    <p className="font-medium">{workout.workout_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(workout.completed_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{workout.duration_minutes} min</p>
                    <p className="text-sm text-muted-foreground">
                      {workout.calories_burned} cal
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default WorkoutRecommendations;
