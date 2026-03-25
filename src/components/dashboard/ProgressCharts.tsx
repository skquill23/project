import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, LineChart, Line,
} from "recharts";
import { format, subDays, startOfDay } from "date-fns";
import { TrendingUp, Flame, Dumbbell, Target } from "lucide-react";

interface ProgressChartsProps {
  userId: string;
}

const ProgressCharts = ({ userId }: ProgressChartsProps) => {
  const [nutritionData, setNutritionData] = useState<any[]>([]);
  const [workoutData, setWorkoutData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [summaryStats, setSummaryStats] = useState({
    avgCalories: 0,
    totalWorkouts: 0,
    bestStreak: 0,
    totalCaloriesBurned: 0,
  });

  useEffect(() => {
    loadData();
  }, [userId]);

  const loadData = async () => {
    setLoading(true);
    const thirtyDaysAgo = subDays(new Date(), 30).toISOString().split("T")[0];

    const [nutritionRes, workoutRes] = await Promise.all([
      supabase
        .from("daily_nutrition_summary")
        .select("*")
        .eq("user_id", userId)
        .gte("date", thirtyDaysAgo)
        .order("date", { ascending: true }),
      supabase
        .from("workouts")
        .select("*")
        .eq("user_id", userId)
        .gte("completed_at", thirtyDaysAgo)
        .order("completed_at", { ascending: true }),
    ]);

    // Fill in missing days for nutrition
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = subDays(new Date(), 29 - i);
      return format(date, "yyyy-MM-dd");
    });

    const nutritionMap = new Map(
      (nutritionRes.data || []).map((d: any) => [d.date, d])
    );

    const filledNutrition = last30Days.map((date) => {
      const existing = nutritionMap.get(date);
      return {
        date: format(new Date(date), "MMM dd"),
        rawDate: date,
        calories: existing?.total_calories || 0,
        protein: Number(existing?.total_protein_g || 0),
        carbs: Number(existing?.total_carbs_g || 0),
        fats: Number(existing?.total_fats_g || 0),
        meals: existing?.meals_count || 0,
      };
    });

    // Aggregate workouts by day
    const workoutsByDay = new Map<string, { count: number; duration: number; burned: number }>();
    (workoutRes.data || []).forEach((w: any) => {
      const day = w.completed_at ? format(new Date(w.completed_at), "yyyy-MM-dd") : null;
      if (!day) return;
      const existing = workoutsByDay.get(day) || { count: 0, duration: 0, burned: 0 };
      existing.count += 1;
      existing.duration += w.duration_minutes || 0;
      existing.burned += w.calories_burned || 0;
      workoutsByDay.set(day, existing);
    });

    const filledWorkouts = last30Days.map((date) => {
      const existing = workoutsByDay.get(date);
      return {
        date: format(new Date(date), "MMM dd"),
        workouts: existing?.count || 0,
        duration: existing?.duration || 0,
        caloriesBurned: existing?.burned || 0,
      };
    });

    // Summary stats
    const activeDays = filledNutrition.filter((d) => d.calories > 0);
    const avgCal = activeDays.length > 0
      ? Math.round(activeDays.reduce((s, d) => s + d.calories, 0) / activeDays.length)
      : 0;
    const totalW = (workoutRes.data || []).length;
    const totalBurned = (workoutRes.data || []).reduce((s: number, w: any) => s + (w.calories_burned || 0), 0);

    setSummaryStats({
      avgCalories: avgCal,
      totalWorkouts: totalW,
      bestStreak: activeDays.length,
      totalCaloriesBurned: totalBurned,
    });

    setNutritionData(filledNutrition);
    setWorkoutData(filledWorkouts);
    setLoading(false);
  };

  const statCards = [
    { label: "Avg Daily Calories", value: summaryStats.avgCalories.toLocaleString(), icon: Flame, color: "text-accent" },
    { label: "Workouts (30d)", value: summaryStats.totalWorkouts, icon: Dumbbell, color: "text-primary" },
    { label: "Active Days", value: summaryStats.bestStreak, icon: Target, color: "text-success" },
    { label: "Calories Burned", value: summaryStats.totalCaloriesBurned.toLocaleString(), icon: TrendingUp, color: "text-chart-5" },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6"><div className="h-16 bg-muted rounded" /></CardContent>
            </Card>
          ))}
        </div>
        <Card className="animate-pulse">
          <CardContent className="p-6"><div className="h-64 bg-muted rounded" /></CardContent>
        </Card>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-card border border-border rounded-lg p-3 shadow-xl">
        <p className="text-sm font-medium text-foreground mb-1">{label}</p>
        {payload.map((entry: any, i: number) => (
          <p key={i} className="text-xs" style={{ color: entry.color }}>
            {entry.name}: {typeof entry.value === "number" ? entry.value.toLocaleString() : entry.value}
            {entry.name.includes("Calories") || entry.name === "calories" ? " kcal" : ""}
            {entry.name.includes("g") ? "g" : ""}
            {entry.name === "duration" ? " min" : ""}
          </p>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Summary Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.label} className="relative overflow-hidden group hover:shadow-lg transition-shadow">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
                <stat.icon className={`w-5 h-5 ${stat.color} opacity-70`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <Tabs defaultValue="calories" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="calories">Calorie Trend</TabsTrigger>
          <TabsTrigger value="macros">Macro Breakdown</TabsTrigger>
          <TabsTrigger value="workouts">Workout Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="calories">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Daily Calorie Intake</CardTitle>
              <CardDescription>Your calorie consumption over the last 30 days</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={320}>
                <AreaChart data={nutritionData}>
                  <defs>
                    <linearGradient id="calorieGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} interval={4} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="calories"
                    stroke="hsl(var(--primary))"
                    fill="url(#calorieGrad)"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 5, fill: "hsl(var(--primary))" }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="macros">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Macronutrient Breakdown</CardTitle>
              <CardDescription>Protein, carbs, and fats over the last 30 days</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={nutritionData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} interval={4} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="protein" name="Protein (g)" fill="hsl(var(--chart-1))" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="carbs" name="Carbs (g)" fill="hsl(var(--chart-2))" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="fats" name="Fats (g)" fill="hsl(var(--chart-3))" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="workouts">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Workout Activity</CardTitle>
              <CardDescription>Duration and calories burned over the last 30 days</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={workoutData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} interval={4} />
                  <YAxis yAxisId="left" tick={{ fontSize: 11 }} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="duration"
                    name="Duration (min)"
                    stroke="hsl(var(--chart-4))"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4 }}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="caloriesBurned"
                    name="Calories Burned"
                    stroke="hsl(var(--chart-3))"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProgressCharts;
