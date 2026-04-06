import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, LineChart, Line,
} from "recharts";
import { format, subDays } from "date-fns";
import { TrendingUp, Flame, Dumbbell, Target } from "lucide-react";

interface ProgressChartsProps {
  userId: string;
}

const ProgressCharts = ({ userId }: ProgressChartsProps) => {
  const [nutritionData, setNutritionData] = useState<any[]>([]);
  const [workoutData, setWorkoutData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [summaryStats, setSummaryStats] = useState({ avgCalories: 0, totalWorkouts: 0, bestStreak: 0, totalCaloriesBurned: 0 });

  useEffect(() => { loadData(); }, [userId]);

  const loadData = async () => {
    setLoading(true);
    const thirtyDaysAgo = subDays(new Date(), 30).toISOString().split("T")[0];
    const [nutritionRes, workoutRes] = await Promise.all([
      supabase.from("daily_nutrition_summary").select("*").eq("user_id", userId).gte("date", thirtyDaysAgo).order("date", { ascending: true }),
      supabase.from("workouts").select("*").eq("user_id", userId).gte("completed_at", thirtyDaysAgo).order("completed_at", { ascending: true }),
    ]);

    const last30Days = Array.from({ length: 30 }, (_, i) => format(subDays(new Date(), 29 - i), "yyyy-MM-dd"));
    const nutritionMap = new Map((nutritionRes.data || []).map((d: any) => [d.date, d]));
    const filledNutrition = last30Days.map((date) => {
      const existing = nutritionMap.get(date);
      return { date: format(new Date(date), "MMM dd"), rawDate: date, calories: existing?.total_calories || 0, protein: Number(existing?.total_protein_g || 0), carbs: Number(existing?.total_carbs_g || 0), fats: Number(existing?.total_fats_g || 0), meals: existing?.meals_count || 0 };
    });

    const workoutsByDay = new Map<string, { count: number; duration: number; burned: number }>();
    (workoutRes.data || []).forEach((w: any) => {
      const day = w.completed_at ? format(new Date(w.completed_at), "yyyy-MM-dd") : null;
      if (!day) return;
      const existing = workoutsByDay.get(day) || { count: 0, duration: 0, burned: 0 };
      existing.count += 1; existing.duration += w.duration_minutes || 0; existing.burned += w.calories_burned || 0;
      workoutsByDay.set(day, existing);
    });

    const filledWorkouts = last30Days.map((date) => {
      const existing = workoutsByDay.get(date);
      return { date: format(new Date(date), "MMM dd"), workouts: existing?.count || 0, duration: existing?.duration || 0, caloriesBurned: existing?.burned || 0 };
    });

    const activeDays = filledNutrition.filter((d) => d.calories > 0);
    setSummaryStats({
      avgCalories: activeDays.length > 0 ? Math.round(activeDays.reduce((s, d) => s + d.calories, 0) / activeDays.length) : 0,
      totalWorkouts: (workoutRes.data || []).length,
      bestStreak: activeDays.length,
      totalCaloriesBurned: (workoutRes.data || []).reduce((s: number, w: any) => s + (w.calories_burned || 0), 0),
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
            <Card key={i} className="glass animate-pulse"><CardContent className="p-6"><div className="h-16 bg-muted rounded-xl" /></CardContent></Card>
          ))}
        </div>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="glass-strong rounded-xl p-3 shadow-xl">
        <p className="text-sm font-semibold mb-1">{label}</p>
        {payload.map((entry: any, i: number) => (
          <p key={i} className="text-xs font-mono" style={{ color: entry.color }}>
            {entry.name}: {typeof entry.value === "number" ? entry.value.toLocaleString() : entry.value}
          </p>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.label} className="glass card-hover group">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">{stat.label}</p>
                  <p className="text-2xl font-extrabold font-mono mt-1">{stat.value}</p>
                </div>
                <div className="w-9 h-9 rounded-xl bg-muted/50 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <stat.icon className={`w-4 h-4 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="calories" className="w-full">
        <TabsList className="grid w-full grid-cols-3 rounded-xl">
          <TabsTrigger value="calories" className="rounded-lg">Calorie Trend</TabsTrigger>
          <TabsTrigger value="macros" className="rounded-lg">Macros</TabsTrigger>
          <TabsTrigger value="workouts" className="rounded-lg">Workouts</TabsTrigger>
        </TabsList>

        <TabsContent value="calories">
          <Card className="glass">
            <CardHeader><CardTitle className="text-base">Daily Calorie Intake</CardTitle><CardDescription>30-day trend</CardDescription></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={320}>
                <AreaChart data={nutritionData}>
                  <defs><linearGradient id="calorieGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} /><stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} /></linearGradient></defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.5} />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} interval={4} />
                  <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="calories" stroke="hsl(var(--primary))" fill="url(#calorieGrad)" strokeWidth={2} dot={false} activeDot={{ r: 5, fill: "hsl(var(--primary))" }} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="macros">
          <Card className="glass">
            <CardHeader><CardTitle className="text-base">Macronutrient Breakdown</CardTitle><CardDescription>Protein, carbs, and fats</CardDescription></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={nutritionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.5} />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} interval={4} />
                  <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                  <Tooltip content={<CustomTooltip />} /><Legend />
                  <Bar dataKey="protein" name="Protein (g)" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="carbs" name="Carbs (g)" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="fats" name="Fats (g)" fill="hsl(var(--chart-3))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="workouts">
          <Card className="glass">
            <CardHeader><CardTitle className="text-base">Workout Activity</CardTitle><CardDescription>Duration and calories burned</CardDescription></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={workoutData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.5} />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} interval={4} />
                  <YAxis yAxisId="left" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                  <Tooltip content={<CustomTooltip />} /><Legend />
                  <Line yAxisId="left" type="monotone" dataKey="duration" name="Duration (min)" stroke="hsl(var(--chart-4))" strokeWidth={2} dot={false} />
                  <Line yAxisId="right" type="monotone" dataKey="caloriesBurned" name="Calories Burned" stroke="hsl(var(--chart-3))" strokeWidth={2} dot={false} />
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
