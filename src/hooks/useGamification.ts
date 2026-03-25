import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  xp_reward: number;
  requirement_type: string;
  requirement_value: number;
  tier: string;
  sort_order: number;
}

export interface UserAchievement {
  achievement_id: string;
  unlocked_at: string;
}

export interface DailyChallenge {
  id: string;
  challenge_type: string;
  challenge_title: string;
  challenge_description: string;
  target_value: number;
  current_value: number;
  xp_reward: number;
  is_completed: boolean;
}

const LEVEL_THRESHOLDS = Array.from({ length: 100 }, (_, i) => Math.floor(100 * Math.pow(1.15, i)));

export const getLevelFromXP = (xp: number) => {
  let level = 1;
  let accumulated = 0;
  for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
    if (accumulated + LEVEL_THRESHOLDS[i] > xp) break;
    accumulated += LEVEL_THRESHOLDS[i];
    level = i + 2;
  }
  return level;
};

export const getXPForLevel = (level: number) => {
  let total = 0;
  for (let i = 0; i < level - 1; i++) {
    total += LEVEL_THRESHOLDS[i];
  }
  return total;
};

export const getXPProgress = (xp: number) => {
  const level = getLevelFromXP(xp);
  const currentLevelXP = getXPForLevel(level);
  const nextLevelXP = getXPForLevel(level + 1);
  const progress = nextLevelXP - currentLevelXP > 0
    ? ((xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100
    : 100;
  return { level, progress, xpInLevel: xp - currentLevelXP, xpNeeded: nextLevelXP - currentLevelXP };
};

export const LEVEL_TITLES: Record<number, string> = {
  1: "Beginner",
  5: "Enthusiast",
  10: "Dedicated",
  15: "Athlete",
  20: "Champion",
  25: "Elite",
  30: "Master",
  40: "Grandmaster",
  50: "Legend",
};

export const getLevelTitle = (level: number) => {
  const keys = Object.keys(LEVEL_TITLES).map(Number).sort((a, b) => b - a);
  for (const key of keys) {
    if (level >= key) return LEVEL_TITLES[key];
  }
  return "Beginner";
};

const DAILY_CHALLENGE_TEMPLATES = [
  { type: "log_meals", title: "Meal Logger", description: "Log 3 meals today", target: 3, xp: 30 },
  { type: "log_calories", title: "Calorie Tracker", description: "Log at least 1500 calories today", target: 1500, xp: 25 },
  { type: "complete_workout", title: "Workout Warrior", description: "Complete a workout today", target: 1, xp: 35 },
  { type: "burn_calories", title: "Burn Baby Burn", description: "Burn 300+ calories in workouts", target: 300, xp: 40 },
  { type: "protein_goal", title: "Protein Power", description: "Hit 100g of protein today", target: 100, xp: 30 },
  { type: "log_breakfast", title: "Early Bird", description: "Log a breakfast meal", target: 1, xp: 20 },
];

export const useGamification = (userId: string) => {
  const [xp, setXP] = useState(0);
  const [level, setLevel] = useState(1);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [unlockedAchievements, setUnlockedAchievements] = useState<UserAchievement[]>([]);
  const [dailyChallenges, setDailyChallenges] = useState<DailyChallenge[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    if (!userId) return;
    setLoading(true);

    const [achievementsRes, userAchRes, xpRes, challengesRes] = await Promise.all([
      supabase.from("achievements").select("*").order("sort_order"),
      supabase.from("user_achievements").select("*").eq("user_id", userId),
      supabase.from("user_xp").select("*").eq("user_id", userId).maybeSingle(),
      supabase.from("daily_challenges").select("*").eq("user_id", userId)
        .eq("challenge_date", new Date().toISOString().split("T")[0]),
    ]);

    setAchievements(achievementsRes.data || []);
    setUnlockedAchievements(userAchRes.data || []);

    const currentXP = xpRes.data?.total_xp || 0;
    setXP(currentXP);
    setLevel(getLevelFromXP(currentXP));

    if (!xpRes.data) {
      await supabase.from("user_xp").insert({ user_id: userId, total_xp: 0, current_level: 1 });
    }

    // Generate daily challenges if none exist
    if (!challengesRes.data?.length) {
      const today = new Date().toISOString().split("T")[0];
      const shuffled = [...DAILY_CHALLENGE_TEMPLATES].sort(() => Math.random() - 0.5);
      const selected = shuffled.slice(0, 3);
      const toInsert = selected.map((c) => ({
        user_id: userId,
        challenge_date: today,
        challenge_type: c.type,
        challenge_title: c.title,
        challenge_description: c.description,
        target_value: c.target,
        current_value: 0,
        xp_reward: c.xp,
        is_completed: false,
      }));
      const { data: inserted } = await supabase.from("daily_challenges").insert(toInsert).select();
      setDailyChallenges(inserted || []);
    } else {
      setDailyChallenges(challengesRes.data);
    }

    setLoading(false);
  }, [userId]);

  useEffect(() => { loadData(); }, [loadData]);

  const addXP = useCallback(async (amount: number) => {
    const newXP = xp + amount;
    const newLevel = getLevelFromXP(newXP);
    setXP(newXP);

    if (newLevel > level) {
      setLevel(newLevel);
      toast.success(`🎉 Level Up! You're now Level ${newLevel} — ${getLevelTitle(newLevel)}!`);
    }

    await supabase.from("user_xp").update({ total_xp: newXP, current_level: newLevel }).eq("user_id", userId);
  }, [xp, level, userId]);

  const checkAndUnlockAchievements = useCallback(async () => {
    if (!userId) return;

    const unlockedIds = new Set(unlockedAchievements.map((a) => a.achievement_id));

    // Gather stats
    const [mealsRes, workoutsRes, challengesRes] = await Promise.all([
      supabase.from("meals").select("id", { count: "exact" }).eq("user_id", userId),
      supabase.from("workouts").select("id, calories_burned", { count: "exact" }).eq("user_id", userId),
      supabase.from("daily_challenges").select("id", { count: "exact" }).eq("user_id", userId).eq("is_completed", true),
    ]);

    const mealsCount = mealsRes.count || 0;
    const workoutsCount = workoutsRes.count || 0;
    const totalBurned = (workoutsRes.data || []).reduce((s, w) => s + (w.calories_burned || 0), 0);
    const challengesCompleted = challengesRes.count || 0;

    const stats: Record<string, number> = {
      meals_logged: mealsCount,
      workouts_completed: workoutsCount,
      calories_burned: totalBurned,
      level_reached: level,
      challenges_completed: challengesCompleted,
      streak_days: 0, // TODO: calculate from streak tracker
    };

    let xpGained = 0;
    const newUnlocks: string[] = [];

    for (const ach of achievements) {
      if (unlockedIds.has(ach.id)) continue;
      const current = stats[ach.requirement_type] || 0;
      if (current >= ach.requirement_value) {
        await supabase.from("user_achievements").insert({ user_id: userId, achievement_id: ach.id });
        xpGained += ach.xp_reward;
        newUnlocks.push(ach.id);
        toast.success(`🏆 Achievement Unlocked: ${ach.title}!`, { description: ach.description });
      }
    }

    if (newUnlocks.length > 0) {
      setUnlockedAchievements((prev) => [
        ...prev,
        ...newUnlocks.map((id) => ({ achievement_id: id, unlocked_at: new Date().toISOString() })),
      ]);
      if (xpGained > 0) await addXP(xpGained);
    }
  }, [userId, achievements, unlockedAchievements, level, addXP]);

  const refreshChallenges = useCallback(async () => {
    if (!userId) return;
    const today = new Date().toISOString().split("T")[0];

    // Recalculate challenge progress
    const [mealsRes, workoutsRes, nutritionRes] = await Promise.all([
      supabase.from("meals").select("*").eq("user_id", userId)
        .gte("logged_at", `${today}T00:00:00`).lte("logged_at", `${today}T23:59:59`),
      supabase.from("workouts").select("*").eq("user_id", userId)
        .gte("completed_at", `${today}T00:00:00`).lte("completed_at", `${today}T23:59:59`),
      supabase.from("daily_nutrition_summary").select("*").eq("user_id", userId).eq("date", today).maybeSingle(),
    ]);

    const meals = mealsRes.data || [];
    const workouts = workoutsRes.data || [];

    for (const challenge of dailyChallenges) {
      let currentValue = 0;
      switch (challenge.challenge_type) {
        case "log_meals": currentValue = meals.length; break;
        case "log_calories": currentValue = nutritionRes.data?.total_calories || 0; break;
        case "complete_workout": currentValue = workouts.length; break;
        case "burn_calories": currentValue = workouts.reduce((s, w) => s + (w.calories_burned || 0), 0); break;
        case "protein_goal": currentValue = Number(nutritionRes.data?.total_protein_g || 0); break;
        case "log_breakfast": currentValue = meals.filter((m) => m.meal_type === "breakfast").length; break;
      }

      const completed = currentValue >= challenge.target_value;
      if (currentValue !== challenge.current_value || completed !== challenge.is_completed) {
        await supabase.from("daily_challenges").update({
          current_value: currentValue,
          is_completed: completed,
        }).eq("id", challenge.id);

        if (completed && !challenge.is_completed) {
          toast.success(`✅ Challenge Complete: ${challenge.challenge_title}!`, {
            description: `+${challenge.xp_reward} XP earned!`,
          });
          await addXP(challenge.xp_reward);
        }
      }
    }

    // Reload challenges
    const { data } = await supabase.from("daily_challenges").select("*")
      .eq("user_id", userId).eq("challenge_date", today);
    setDailyChallenges(data || []);
  }, [userId, dailyChallenges, addXP]);

  return {
    xp, level, achievements, unlockedAchievements, dailyChallenges, loading,
    addXP, checkAndUnlockAchievements, refreshChallenges, reload: loadData,
  };
};
