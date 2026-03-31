import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface WaterEntry {
  id: string;
  amount_ml: number;
  logged_at: string;
}

export const useWaterIntake = (userId: string) => {
  const [entries, setEntries] = useState<WaterEntry[]>([]);
  const [todayTotal, setTodayTotal] = useState(0);
  const [weeklyData, setWeeklyData] = useState<{ day: string; amount: number }[]>([]);
  const [dailyGoal] = useState(2500); // ml
  const [loading, setLoading] = useState(true);

  const today = new Date().toISOString().split("T")[0];

  const loadData = useCallback(async () => {
    if (!userId) return;
    setLoading(true);

    // Today's entries
    const { data: todayEntries } = await supabase
      .from("water_intake")
      .select("*")
      .eq("user_id", userId)
      .gte("logged_at", `${today}T00:00:00`)
      .lte("logged_at", `${today}T23:59:59`)
      .order("logged_at", { ascending: false });

    const entries = todayEntries || [];
    setEntries(entries);
    setTodayTotal(entries.reduce((s, e) => s + e.amount_ml, 0));

    // Weekly data
    const weekDays: { day: string; amount: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const dayName = d.toLocaleDateString("en", { weekday: "short" });

      const { data } = await supabase
        .from("water_intake")
        .select("amount_ml")
        .eq("user_id", userId)
        .gte("logged_at", `${dateStr}T00:00:00`)
        .lte("logged_at", `${dateStr}T23:59:59`);

      weekDays.push({
        day: dayName,
        amount: (data || []).reduce((s, e) => s + e.amount_ml, 0),
      });
    }
    setWeeklyData(weekDays);
    setLoading(false);
  }, [userId, today]);

  useEffect(() => { loadData(); }, [loadData]);

  const addWater = useCallback(async (amount_ml: number) => {
    if (!userId) return;
    const { error } = await supabase.from("water_intake").insert({
      user_id: userId,
      amount_ml,
    });
    if (error) {
      toast.error("Failed to log water");
      return;
    }
    toast.success(`+${amount_ml}ml logged 💧`);
    await loadData();
  }, [userId, loadData]);

  const removeEntry = useCallback(async (id: string) => {
    await supabase.from("water_intake").delete().eq("id", id);
    await loadData();
  }, [loadData]);

  return {
    entries, todayTotal, dailyGoal, weeklyData, loading,
    addWater, removeEntry, progress: Math.min((todayTotal / dailyGoal) * 100, 100),
  };
};
