import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface WellnessLog {
  id: string;
  user_id: string;
  log_date: string;
  mood_score: number | null;
  sleep_hours: number | null;
  sleep_quality: number | null;
  motivation_score: number | null;
  energy_level: number | null;
  stress_level: number | null;
  notes: string | null;
  tags: string[];
  created_at: string;
}

export interface WellnessInsights {
  avgMood: number;
  avgSleep: number;
  avgMotivation: number;
  avgEnergy: number;
  avgStress: number;
  moodTrend: "up" | "down" | "stable";
  sleepTrend: "up" | "down" | "stable";
  wellnessScore: number;
  totalLogs: number;
  streak: number;
}

const defaultInsights: WellnessInsights = {
  avgMood: 0, avgSleep: 0, avgMotivation: 0, avgEnergy: 0, avgStress: 0,
  moodTrend: "stable", sleepTrend: "stable", wellnessScore: 0, totalLogs: 0, streak: 0,
};

export function useWellness(userId: string) {
  const [logs, setLogs] = useState<WellnessLog[]>([]);
  const [todayLog, setTodayLog] = useState<WellnessLog | null>(null);
  const [insights, setInsights] = useState<WellnessInsights>(defaultInsights);
  const [loading, setLoading] = useState(true);

  const fetchLogs = useCallback(async () => {
    if (!userId) return;
    try {
      const { data, error } = await supabase
        .from("wellness_logs")
        .select("*")
        .eq("user_id", userId)
        .order("log_date", { ascending: false })
        .limit(90);

      if (error) throw error;

      const parsed = (data || []).map((d: any) => ({
        ...d,
        tags: d.tags || [],
      })) as WellnessLog[];

      setLogs(parsed);

      const today = new Date().toISOString().split("T")[0];
      setTodayLog(parsed.find((l) => l.log_date === today) || null);

      computeInsights(parsed);
    } catch (err) {
      console.error("Error fetching wellness logs:", err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const computeInsights = (data: WellnessLog[]) => {
    if (data.length === 0) {
      setInsights(defaultInsights);
      return;
    }

    const last30 = data.slice(0, 30);
    const avg = (arr: (number | null)[]) => {
      const valid = arr.filter((v): v is number => v !== null);
      return valid.length ? valid.reduce((a, b) => a + b, 0) / valid.length : 0;
    };

    const avgMood = avg(last30.map((l) => l.mood_score));
    const avgSleep = avg(last30.map((l) => l.sleep_hours));
    const avgMotivation = avg(last30.map((l) => l.motivation_score));
    const avgEnergy = avg(last30.map((l) => l.energy_level));
    const avgStress = avg(last30.map((l) => l.stress_level));

    // Trends: compare last 7 vs previous 7
    const trend = (field: keyof WellnessLog): "up" | "down" | "stable" => {
      const recent = data.slice(0, 7).map((l) => l[field] as number | null).filter((v): v is number => v !== null);
      const prev = data.slice(7, 14).map((l) => l[field] as number | null).filter((v): v is number => v !== null);
      if (recent.length < 2 || prev.length < 2) return "stable";
      const rAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
      const pAvg = prev.reduce((a, b) => a + b, 0) / prev.length;
      const diff = rAvg - pAvg;
      if (Math.abs(diff) < 0.3) return "stable";
      return diff > 0 ? "up" : "down";
    };

    // Wellness score: weighted composite (mood 25%, sleep 20%, motivation 20%, energy 20%, stress-inverse 15%)
    const normalize = (val: number, max: number) => (val / max) * 100;
    const wellnessScore = Math.round(
      normalize(avgMood, 5) * 0.25 +
      normalize(Math.min(avgSleep, 9) / 9 * 10, 10) * 0.20 +
      normalize(avgMotivation, 10) * 0.20 +
      normalize(avgEnergy, 10) * 0.20 +
      normalize(10 - avgStress, 10) * 0.15
    );

    // Streak
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    for (let i = 0; i < data.length; i++) {
      const expected = new Date(today);
      expected.setDate(today.getDate() - streak);
      const logDate = new Date(data[i].log_date + "T00:00:00");
      if (logDate.getTime() === expected.getTime()) {
        streak++;
      } else if (i === 0) {
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        if (logDate.getTime() === yesterday.getTime()) {
          streak++;
        } else break;
      } else break;
    }

    setInsights({
      avgMood, avgSleep, avgMotivation, avgEnergy, avgStress,
      moodTrend: trend("mood_score"),
      sleepTrend: trend("sleep_hours"),
      wellnessScore,
      totalLogs: data.length,
      streak,
    });
  };

  const saveLog = async (logData: Partial<WellnessLog>) => {
    if (!userId) return;
    const today = new Date().toISOString().split("T")[0];

    try {
      if (todayLog) {
        const { error } = await supabase
          .from("wellness_logs")
          .update({ ...logData, updated_at: new Date().toISOString() })
          .eq("id", todayLog.id);
        if (error) throw error;
        toast.success("Wellness log updated!");
      } else {
        const { error } = await supabase
          .from("wellness_logs")
          .insert({ ...logData, user_id: userId, log_date: today });
        if (error) throw error;
        toast.success("Wellness log saved!");
      }
      await fetchLogs();
    } catch (err: any) {
      toast.error("Failed to save: " + err.message);
    }
  };

  return { logs, todayLog, insights, loading, saveLog, refetch: fetchLogs };
}
