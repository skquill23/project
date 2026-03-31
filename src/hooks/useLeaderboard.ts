import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { getLevelFromXP, getLevelTitle } from "./useGamification";

export interface LeaderboardEntry {
  user_id: string;
  display_name: string;
  avatar_emoji: string;
  total_xp: number;
  level: number;
  title: string;
  rank: number;
}

export interface MyLeaderboardProfile {
  display_name: string;
  avatar_emoji: string;
  is_visible: boolean;
}

const AVATAR_EMOJIS = ["🏃", "🏋️", "🧘", "🚴", "🏊", "⚡", "🔥", "💪", "🥇", "🎯", "🦁", "🐉", "🦅", "🌟", "💎", "🚀"];

export { AVATAR_EMOJIS };

export const useLeaderboard = (userId: string) => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [myProfile, setMyProfile] = useState<MyLeaderboardProfile | null>(null);
  const [myRank, setMyRank] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const loadLeaderboard = useCallback(async () => {
    if (!userId) return;
    setLoading(true);

    // Get all XP data
    const { data: xpData } = await supabase
      .from("user_xp")
      .select("user_id, total_xp")
      .order("total_xp", { ascending: false });

    // Get all visible leaderboard profiles
    const { data: profiles } = await supabase
      .from("leaderboard_profiles")
      .select("user_id, display_name, avatar_emoji");

    const profileMap = new Map(
      (profiles || []).map((p) => [p.user_id, p])
    );

    const entries: LeaderboardEntry[] = (xpData || []).map((xp, i) => {
      const profile = profileMap.get(xp.user_id);
      const level = getLevelFromXP(xp.total_xp);
      return {
        user_id: xp.user_id,
        display_name: profile?.display_name || "Anonymous Athlete",
        avatar_emoji: profile?.avatar_emoji || "🏃",
        total_xp: xp.total_xp,
        level,
        title: getLevelTitle(level),
        rank: i + 1,
      };
    });

    setLeaderboard(entries);

    const myEntry = entries.find((e) => e.user_id === userId);
    setMyRank(myEntry?.rank || null);

    // Load my profile
    const { data: myProf } = await supabase
      .from("leaderboard_profiles")
      .select("display_name, avatar_emoji, is_visible")
      .eq("user_id", userId)
      .maybeSingle();

    if (myProf) {
      setMyProfile(myProf);
    } else {
      // Auto-create profile
      const defaultProfile = {
        display_name: "Anonymous Athlete",
        avatar_emoji: AVATAR_EMOJIS[Math.floor(Math.random() * AVATAR_EMOJIS.length)],
        is_visible: true,
      };
      await supabase.from("leaderboard_profiles").insert({
        user_id: userId,
        ...defaultProfile,
      });
      setMyProfile(defaultProfile);
    }

    setLoading(false);
  }, [userId]);

  useEffect(() => { loadLeaderboard(); }, [loadLeaderboard]);

  const updateProfile = useCallback(async (updates: Partial<MyLeaderboardProfile>) => {
    if (!userId) return;
    const { error } = await supabase
      .from("leaderboard_profiles")
      .update(updates)
      .eq("user_id", userId);

    if (error) {
      toast.error("Failed to update profile");
      return;
    }
    setMyProfile((prev) => prev ? { ...prev, ...updates } : prev);
    toast.success("Profile updated!");
    await loadLeaderboard();
  }, [userId, loadLeaderboard]);

  return {
    leaderboard, myProfile, myRank, loading,
    updateProfile, reload: loadLeaderboard,
  };
};
