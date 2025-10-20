import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Dumbbell, CheckCircle2, Clock, ExternalLink, Play, TrendingUp } from "lucide-react";

interface Exercise {
  name: string;
  type: string;
  duration: number;
  calories: number;
  description: string;
  videoUrl: string;
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
          name: "Burpees",
          type: "Cardio",
          duration: 15,
          calories: 200,
          difficulty: "Intermediate",
          muscleGroups: ["Full Body"],
          description: "Full-body explosive movement that burns maximum calories in minimal time",
          videoUrl: "https://www.youtube.com/watch?v=TU8QYVW0gDU",
          formTips: [
            "Start in standing position, drop to squat with hands on floor",
            "Jump feet back to plank position",
            "Do a push-up, jump feet back to squat",
            "Explode up jumping with arms overhead",
            "Land softly and immediately repeat"
          ]
        },
        {
          name: "Jump Rope",
          type: "Cardio",
          duration: 20,
          calories: 250,
          difficulty: "Beginner",
          muscleGroups: ["Calves", "Core"],
          description: "High-intensity cardio that improves coordination and burns fat efficiently",
          videoUrl: "https://www.youtube.com/watch?v=FJmRQ5iTXKE",
          formTips: [
            "Keep elbows close to body, rotate from wrists not arms",
            "Jump on balls of feet, land softly",
            "Maintain upright posture with core engaged",
            "Start with single jumps, progress to double-unders",
            "Jump just high enough for rope to pass under feet"
          ]
        },
        {
          name: "Mountain Climbers",
          type: "Cardio",
          duration: 15,
          calories: 180,
          difficulty: "Beginner",
          muscleGroups: ["Core", "Shoulders"],
          description: "Dynamic cardio exercise that strengthens core while burning calories",
          videoUrl: "https://www.youtube.com/watch?v=nmwgirgXLYM",
          formTips: [
            "Start in high plank position with hands under shoulders",
            "Bring one knee toward chest, then quickly switch legs",
            "Keep hips level and core tight throughout",
            "Breathe rhythmically, don't hold your breath",
            "Increase speed as you improve form"
          ]
        },
        {
          name: "High Knees",
          type: "Cardio",
          duration: 10,
          calories: 150,
          difficulty: "Beginner",
          muscleGroups: ["Legs", "Core"],
          description: "Running in place while bringing knees to hip level for cardio conditioning",
          videoUrl: "https://www.youtube.com/watch?v=8opcQdC-V-U",
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
          videoUrl: "https://www.youtube.com/watch?v=NBY9-kTuHEk",
          formTips: [
            "Start with box at knee height or lower",
            "Jump explosively onto box landing softly",
            "Land with knees slightly bent, full foot on box",
            "Step down one foot at a time (don't jump down)",
            "Reset fully between reps for safety"
          ]
        }
      ],
      muscle_gain: [
        {
          name: "Barbell Bench Press",
          type: "Strength",
          duration: 20,
          calories: 120,
          difficulty: "Intermediate",
          muscleGroups: ["Chest", "Triceps", "Shoulders"],
          description: "Compound movement for building upper body strength and chest mass",
          videoUrl: "https://www.youtube.com/watch?v=rT7DgCr-3pg",
          formTips: [
            "Lie on bench with feet flat on floor",
            "Grip bar slightly wider than shoulder width",
            "Lower bar to mid-chest with elbows at 45 degrees",
            "Press up explosively until arms fully extended",
            "Keep shoulder blades retracted throughout"
          ]
        },
        {
          name: "Barbell Squats",
          type: "Strength",
          duration: 25,
          calories: 180,
          difficulty: "Intermediate",
          muscleGroups: ["Quads", "Glutes", "Core"],
          description: "King of leg exercises for building lower body mass and strength",
          videoUrl: "https://www.youtube.com/watch?v=ultWZbUMPL8",
          formTips: [
            "Bar rests on upper back, feet shoulder-width apart",
            "Descend by pushing hips back and bending knees",
            "Go to parallel or slightly below",
            "Keep chest up, knees tracking over toes",
            "Drive through heels to stand back up"
          ]
        },
        {
          name: "Deadlifts",
          type: "Strength",
          duration: 20,
          calories: 160,
          difficulty: "Advanced",
          muscleGroups: ["Back", "Hamstrings", "Glutes"],
          description: "Total body strength builder targeting posterior chain muscles",
          videoUrl: "https://www.youtube.com/watch?v=op9kVnSso6Q",
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
          videoUrl: "https://www.youtube.com/watch?v=eGo4IYlbE5g",
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
          videoUrl: "https://www.youtube.com/watch?v=QAQ64hK4Xxs",
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
          videoUrl: "https://www.youtube.com/watch?v=roCP6wCXPqo",
          formTips: [
            "Place one knee and hand on bench for support",
            "Hold dumbbell in opposite hand, let it hang",
            "Pull dumbbell to hip, keeping elbow close to body",
            "Squeeze shoulder blade at top of movement",
            "Lower with control, repeat on other side"
          ]
        }
      ],
      maintenance: [
        {
          name: "Push-Ups",
          type: "Strength",
          duration: 10,
          calories: 80,
          difficulty: "Beginner",
          muscleGroups: ["Chest", "Triceps", "Core"],
          description: "Classic bodyweight exercise for upper body strength maintenance",
          videoUrl: "https://www.youtube.com/watch?v=IODxDxX7oi4",
          formTips: [
            "Start in high plank, hands shoulder-width apart",
            "Lower body as one unit until chest near floor",
            "Keep elbows at 45-degree angle to body",
            "Push back up to starting position",
            "Maintain straight line from head to heels"
          ]
        },
        {
          name: "Bodyweight Squats",
          type: "Strength",
          duration: 12,
          calories: 90,
          difficulty: "Beginner",
          muscleGroups: ["Legs", "Glutes"],
          description: "Fundamental lower body movement for maintaining leg strength",
          videoUrl: "https://www.youtube.com/watch?v=xqvCmoLULNY",
          formTips: [
            "Stand with feet shoulder-width apart",
            "Lower by pushing hips back and bending knees",
            "Go as deep as comfortable while maintaining form",
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
          videoUrl: "https://www.youtube.com/watch?v=ASdvN_XEl_c",
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
          videoUrl: "https://www.youtube.com/watch?v=QOVaHwm-Q6U",
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
          videoUrl: "https://www.youtube.com/watch?v=v7AYKMP6rOE",
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
            Select exercises to build your custom workout split. Each exercise includes form tips and video demonstrations.
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

                  <div className="space-y-2 pt-2">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => window.open(exercise.videoUrl, '_blank')}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Watch Tutorial
                      <ExternalLink className="w-3 h-3 ml-2" />
                    </Button>
                    
                    <Button
                      className="w-full"
                      onClick={() => logWorkout(exercise)}
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Complete Workout
                    </Button>
                  </div>
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
