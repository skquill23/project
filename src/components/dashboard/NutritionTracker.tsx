import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { Loader2, Plus, Utensils } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";

interface NutritionTrackerProps {
  userId: string;
}

const NutritionTracker = ({ userId }: NutritionTrackerProps) => {
  const [mealInput, setMealInput] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [todayData, setTodayData] = useState<any>(null);
  const [calorieTarget, setCalorieTarget] = useState(2000);

  useEffect(() => {
    loadTodayData();
    loadProfile();
  }, [userId]);

  const loadProfile = async () => {
    const { data } = await supabase
      .from("profiles")
      .select("daily_calorie_target")
      .eq("id", userId)
      .single();

    if (data?.daily_calorie_target) {
      setCalorieTarget(data.daily_calorie_target);
    }
  };

  const loadTodayData = async () => {
    const today = new Date().toISOString().split("T")[0];
    
    const { data } = await supabase
      .from("daily_nutrition_summary")
      .select("*")
      .eq("user_id", userId)
      .eq("date", today)
      .maybeSingle();

    setTodayData(data || {
      total_calories: 0,
      total_protein_g: 0,
      total_carbs_g: 0,
      total_fats_g: 0,
      meals_count: 0,
    });
  };

  const analyzeMeal = async () => {
    if (!mealInput.trim()) return;

    setAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke("analyze-meal", {
        body: { mealDescription: mealInput },
      });

      if (error) throw error;

      toast.success("Meal logged successfully!");
      setMealInput("");
      await loadTodayData();
    } catch (error: any) {
      toast.error(error.message || "Failed to analyze meal");
    } finally {
      setAnalyzing(false);
    }
  };

  const macroData = [
    { name: "Protein", value: todayData?.total_protein_g || 0, color: "hsl(var(--chart-1))" },
    { name: "Carbs", value: todayData?.total_carbs_g || 0, color: "hsl(var(--chart-2))" },
    { name: "Fats", value: todayData?.total_fats_g || 0, color: "hsl(var(--chart-3))" },
  ];

  const calorieProgress = ((todayData?.total_calories || 0) / calorieTarget) * 100;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Utensils className="w-5 h-5" />
            Daily Nutrition Tracker
          </CardTitle>
          <CardDescription>
            Describe your meal and AI will automatically log the nutrition
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="e.g., Grilled chicken breast with rice and vegetables"
              value={mealInput}
              onChange={(e) => setMealInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && analyzeMeal()}
            />
            <Button onClick={analyzeMeal} disabled={analyzing}>
              {analyzing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Today's Calories</CardTitle>
            <CardDescription>
              {todayData?.total_calories || 0} / {calorieTarget} kcal
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Progress value={calorieProgress} className="h-3" />
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-sm text-muted-foreground">Protein</p>
                <p className="text-xl font-bold text-chart-1">{todayData?.total_protein_g || 0}g</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Carbs</p>
                <p className="text-xl font-bold text-chart-2">{todayData?.total_carbs_g || 0}g</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Fats</p>
                <p className="text-xl font-bold text-chart-3">{todayData?.total_fats_g || 0}g</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Macro Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={macroData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {macroData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NutritionTracker;
