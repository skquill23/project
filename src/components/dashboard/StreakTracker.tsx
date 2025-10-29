import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Flame, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface StreakTrackerProps {
  userId: string;
}

const StreakTracker = ({ userId }: StreakTrackerProps) => {
  const [nutritionStreak, setNutritionStreak] = useState(0);
  const [workoutStreak, setWorkoutStreak] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    calculateStreaks();
  }, [userId]);

  const calculateStreaks = async () => {
    try {
      // Calculate nutrition streak
      const { data: nutritionData } = await supabase
        .from("daily_nutrition_summary")
        .select("date")
        .eq("user_id", userId)
        .order("date", { ascending: false });

      if (nutritionData) {
        setNutritionStreak(calculateConsecutiveDays(nutritionData.map(d => d.date)));
      }

      // Calculate workout streak
      const { data: workoutData } = await supabase
        .from("workouts")
        .select("completed_at")
        .eq("user_id", userId)
        .order("completed_at", { ascending: false });

      if (workoutData) {
        const workoutDates = workoutData.map(w => 
          new Date(w.completed_at).toISOString().split('T')[0]
        );
        const uniqueDates = [...new Set(workoutDates)];
        setWorkoutStreak(calculateConsecutiveDays(uniqueDates));
      }

      setLoading(false);
    } catch (error) {
      console.error("Error calculating streaks:", error);
      setLoading(false);
    }
  };

  const calculateConsecutiveDays = (dates: string[]): number => {
    if (!dates || dates.length === 0) return 0;

    const sortedDates = dates.sort((a, b) => 
      new Date(b).getTime() - new Date(a).getTime()
    );

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < sortedDates.length; i++) {
      const currentDate = new Date(sortedDates[i]);
      currentDate.setHours(0, 0, 0, 0);
      
      const expectedDate = new Date(today);
      expectedDate.setDate(today.getDate() - streak);
      expectedDate.setHours(0, 0, 0, 0);

      if (currentDate.getTime() === expectedDate.getTime()) {
        streak++;
      } else if (i === 0 && currentDate.getTime() === new Date(today.setDate(today.getDate() - 1)).getTime()) {
        // If first date is yesterday, still count it
        streak++;
      } else {
        break;
      }
    }

    return streak;
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="animate-pulse">Loading streaks...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="border-primary/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Nutrition Streak</CardTitle>
          <Flame className="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{nutritionStreak}</div>
          <p className="text-xs text-muted-foreground mt-1">
            consecutive days tracked
          </p>
          {nutritionStreak >= 7 && (
            <Badge variant="secondary" className="mt-2">
              <TrendingUp className="w-3 h-3 mr-1" />
              On Fire!
            </Badge>
          )}
        </CardContent>
      </Card>

      <Card className="border-primary/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Workout Streak</CardTitle>
          <Flame className="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{workoutStreak}</div>
          <p className="text-xs text-muted-foreground mt-1">
            consecutive days worked out
          </p>
          {workoutStreak >= 7 && (
            <Badge variant="secondary" className="mt-2">
              <TrendingUp className="w-3 h-3 mr-1" />
              Amazing!
            </Badge>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StreakTracker;
