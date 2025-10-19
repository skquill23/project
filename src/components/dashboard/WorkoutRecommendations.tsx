import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Dumbbell, TrendingUp, CheckCircle2, Clock } from "lucide-react";

interface WorkoutRecommendationsProps {
  userId: string;
}

const WorkoutRecommendations = ({ userId }: WorkoutRecommendationsProps) => {
  const [recommendations, setRecommendations] = useState<any[]>([]);
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

      // Generate recommendations based on goal
      const workouts = getWorkoutsByGoal(profile?.fitness_goal || "maintenance");
      setRecommendations(workouts);

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

  const getWorkoutsByGoal = (goal: string) => {
    const workoutDatabase: Record<string, any[]> = {
      weight_loss: [
        {
          name: "HIIT Cardio Blast",
          type: "Cardio",
          duration: 25,
          calories: 300,
          description: "High-intensity interval training to maximize calorie burn",
        },
        {
          name: "Full Body Circuit",
          type: "Strength",
          duration: 30,
          calories: 250,
          description: "Dynamic circuit combining strength and cardio movements",
        },
        {
          name: "Running Intervals",
          type: "Cardio",
          duration: 35,
          calories: 350,
          description: "Alternate between jogging and sprinting for fat loss",
        },
      ],
      muscle_gain: [
        {
          name: "Upper Body Strength",
          type: "Strength",
          duration: 45,
          calories: 200,
          description: "Focus on chest, back, shoulders, and arms",
        },
        {
          name: "Lower Body Power",
          type: "Strength",
          duration: 45,
          calories: 220,
          description: "Squats, deadlifts, and leg exercises for muscle building",
        },
        {
          name: "Core & Stability",
          type: "Strength",
          duration: 30,
          calories: 150,
          description: "Build core strength and improve overall stability",
        },
      ],
      maintenance: [
        {
          name: "Balanced Strength Training",
          type: "Strength",
          duration: 40,
          calories: 200,
          description: "Full body workout for maintaining fitness",
        },
        {
          name: "Moderate Cardio",
          type: "Cardio",
          duration: 30,
          calories: 250,
          description: "Steady-state cardio for cardiovascular health",
        },
        {
          name: "Yoga & Flexibility",
          type: "Flexibility",
          duration: 45,
          calories: 150,
          description: "Improve flexibility and reduce stress",
        },
      ],
    };

    return workoutDatabase[goal] || workoutDatabase.maintenance;
  };

  const logWorkout = async (workout: any) => {
    try {
      const { error } = await supabase.from("workouts").insert({
        user_id: userId,
        workout_name: workout.name,
        workout_type: workout.type,
        duration_minutes: workout.duration,
        calories_burned: workout.calories,
        notes: workout.description,
      });

      if (error) throw error;

      toast.success("Workout logged successfully!");
      await loadData();
    } catch (error: any) {
      toast.error("Failed to log workout");
    }
  };

  if (loading) {
    return <div>Loading recommendations...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Dumbbell className="w-5 h-5" />
            Today's Workout Recommendations
          </CardTitle>
          <CardDescription>
            AI-powered workouts tailored to your fitness goals
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {recommendations.map((workout, idx) => (
              <Card key={idx} className="border-2">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{workout.name}</CardTitle>
                    <Badge variant="secondary">{workout.type}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {workout.description}
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {workout.duration} min
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      {workout.calories} cal
                    </div>
                  </div>
                  <Button
                    className="w-full"
                    onClick={() => logWorkout(workout)}
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

      {recentWorkouts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Workouts</CardTitle>
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
