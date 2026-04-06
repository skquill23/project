import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
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
      const { data: nutritionData } = await supabase
        .from("daily_nutrition_summary").select("date").eq("user_id", userId).order("date", { ascending: false });
      if (nutritionData) setNutritionStreak(calculateConsecutiveDays(nutritionData.map(d => d.date)));

      const { data: workoutData } = await supabase
        .from("workouts").select("completed_at").eq("user_id", userId).order("completed_at", { ascending: false });
      if (workoutData) {
        const workoutDates = workoutData.map(w => new Date(w.completed_at).toISOString().split('T')[0]);
        setWorkoutStreak(calculateConsecutiveDays([...new Set(workoutDates)]));
      }
      setLoading(false);
    } catch (error) { console.error("Error calculating streaks:", error); setLoading(false); }
  };

  const calculateConsecutiveDays = (dates: string[]): number => {
    if (!dates || dates.length === 0) return 0;
    const sortedDates = dates.sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    let streak = 0;
    const today = new Date(); today.setHours(0, 0, 0, 0);
    for (let i = 0; i < sortedDates.length; i++) {
      const currentDate = new Date(sortedDates[i]); currentDate.setHours(0, 0, 0, 0);
      const expectedDate = new Date(today); expectedDate.setDate(today.getDate() - streak); expectedDate.setHours(0, 0, 0, 0);
      if (currentDate.getTime() === expectedDate.getTime()) { streak++; }
      else if (i === 0 && currentDate.getTime() === new Date(today.setDate(today.getDate() - 1)).getTime()) { streak++; }
      else { break; }
    }
    return streak;
  };

  if (loading) return <div className="animate-pulse text-sm text-muted-foreground">Loading streaks...</div>;

  return (
    <div className="grid gap-3 grid-cols-2">
      {[
        { label: "Nutrition", value: nutritionStreak, threshold: 7 },
        { label: "Workout", value: workoutStreak, threshold: 7 },
      ].map(s => (
        <Card key={s.label} className="glass card-hover">
          <CardContent className="p-4 text-center">
            <Flame className="w-5 h-5 text-accent mx-auto mb-1" />
            <p className="text-2xl font-extrabold font-mono">{s.value}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{s.label}</p>
            {s.value >= s.threshold && (
              <Badge variant="secondary" className="mt-2 text-[10px]">
                <TrendingUp className="w-2.5 h-2.5 mr-0.5" /> On Fire!
              </Badge>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StreakTracker;
