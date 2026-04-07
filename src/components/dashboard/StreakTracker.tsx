import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Flame } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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

  if (loading) return null;

  return (
    <TooltipProvider>
      <div className="flex items-center gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted/50 border border-border/50">
              <Flame className="w-3.5 h-3.5 text-orange-500" />
              <span className="text-xs font-bold font-mono">{nutritionStreak}</span>
              <span className="text-[10px] text-muted-foreground">meals</span>
            </div>
          </TooltipTrigger>
          <TooltipContent><p>Nutrition streak: {nutritionStreak} days</p></TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted/50 border border-border/50">
              <Flame className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-bold font-mono">{workoutStreak}</span>
              <span className="text-[10px] text-muted-foreground">workouts</span>
            </div>
          </TooltipTrigger>
          <TooltipContent><p>Workout streak: {workoutStreak} days</p></TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};

export default StreakTracker;
