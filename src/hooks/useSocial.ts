import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Friendship {
  id: string;
  requester_id: string;
  addressee_id: string;
  status: string;
  created_at: string;
  requester_name?: string;
  addressee_name?: string;
  requester_emoji?: string;
  addressee_emoji?: string;
}

export interface XPBattle {
  id: string;
  challenger_id: string;
  opponent_id: string;
  xp_goal: number;
  challenger_xp_start: number;
  opponent_xp_start: number;
  challenger_xp_current: number;
  opponent_xp_current: number;
  status: string;
  winner_id: string | null;
  starts_at: string;
  ends_at: string;
  created_at: string;
  challenger_name?: string;
  opponent_name?: string;
  challenger_emoji?: string;
  opponent_emoji?: string;
}

export interface ActivityItem {
  id: string;
  user_id: string;
  activity_type: string;
  title: string;
  description: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
  user_name?: string;
  user_emoji?: string;
}

export const useSocial = (userId: string) => {
  const [friends, setFriends] = useState<Friendship[]>([]);
  const [pendingRequests, setPendingRequests] = useState<Friendship[]>([]);
  const [battles, setBattles] = useState<XPBattle[]>([]);
  const [activityFeed, setActivityFeed] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadProfiles = useCallback(async (userIds: string[]) => {
    if (!userIds.length) return new Map<string, { name: string; emoji: string }>();
    const unique = [...new Set(userIds)];
    const { data } = await supabase
      .from("leaderboard_profiles")
      .select("user_id, display_name, avatar_emoji")
      .in("user_id", unique);
    const map = new Map<string, { name: string; emoji: string }>();
    (data || []).forEach((p) => map.set(p.user_id, { name: p.display_name, emoji: p.avatar_emoji }));
    return map;
  }, []);

  const loadFriends = useCallback(async () => {
    if (!userId) return;
    const { data } = await supabase
      .from("friendships")
      .select("*")
      .or(`requester_id.eq.${userId},addressee_id.eq.${userId}`);

    const all = data || [];
    const userIds = all.flatMap((f) => [f.requester_id, f.addressee_id]);
    const profiles = await loadProfiles(userIds);

    const enriched = all.map((f) => ({
      ...f,
      requester_name: profiles.get(f.requester_id)?.name || "Unknown",
      addressee_name: profiles.get(f.addressee_id)?.name || "Unknown",
      requester_emoji: profiles.get(f.requester_id)?.emoji || "🏃",
      addressee_emoji: profiles.get(f.addressee_id)?.emoji || "🏃",
    }));

    setFriends(enriched.filter((f) => f.status === "accepted"));
    setPendingRequests(enriched.filter((f) => f.status === "pending"));
  }, [userId, loadProfiles]);

  const loadBattles = useCallback(async () => {
    if (!userId) return;
    const { data } = await supabase
      .from("xp_battles")
      .select("*")
      .or(`challenger_id.eq.${userId},opponent_id.eq.${userId}`)
      .order("created_at", { ascending: false });

    const all = data || [];
    const userIds = all.flatMap((b) => [b.challenger_id, b.opponent_id]);
    const profiles = await loadProfiles(userIds);

    // Update current XP for active battles
    for (const battle of all) {
      if (battle.status === "active") {
        const { data: cXP } = await supabase.from("user_xp").select("total_xp").eq("user_id", battle.challenger_id).maybeSingle();
        const { data: oXP } = await supabase.from("user_xp").select("total_xp").eq("user_id", battle.opponent_id).maybeSingle();
        const cCurrent = (cXP?.total_xp || 0) - battle.challenger_xp_start;
        const oCurrent = (oXP?.total_xp || 0) - battle.opponent_xp_start;

        if (cCurrent !== battle.challenger_xp_current || oCurrent !== battle.opponent_xp_current) {
          const updates: Record<string, unknown> = {
            challenger_xp_current: cCurrent,
            opponent_xp_current: oCurrent,
          };

          // Check if battle is completed
          const now = new Date();
          const endsAt = new Date(battle.ends_at);
          if (now > endsAt || cCurrent >= battle.xp_goal || oCurrent >= battle.xp_goal) {
            updates.status = "completed";
            if (cCurrent > oCurrent) updates.winner_id = battle.challenger_id;
            else if (oCurrent > cCurrent) updates.winner_id = battle.opponent_id;
          }

          await supabase.from("xp_battles").update(updates).eq("id", battle.id);
          battle.challenger_xp_current = cCurrent;
          battle.opponent_xp_current = oCurrent;
          if (updates.status) battle.status = updates.status as string;
          if (updates.winner_id) battle.winner_id = updates.winner_id as string;
        }
      }
    }

    setBattles(all.map((b) => ({
      ...b,
      challenger_name: profiles.get(b.challenger_id)?.name || "Unknown",
      opponent_name: profiles.get(b.opponent_id)?.name || "Unknown",
      challenger_emoji: profiles.get(b.challenger_id)?.emoji || "🏃",
      opponent_emoji: profiles.get(b.opponent_id)?.emoji || "🏃",
    })));
  }, [userId, loadProfiles]);

  const loadActivityFeed = useCallback(async () => {
    const { data } = await supabase
      .from("activity_feed")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    const all = data || [];
    const userIds = all.map((a) => a.user_id);
    const profiles = await loadProfiles(userIds);

    setActivityFeed(all.map((a) => ({
      ...a,
      metadata: (a.metadata as Record<string, unknown>) || {},
      user_name: profiles.get(a.user_id)?.name || "Anonymous",
      user_emoji: profiles.get(a.user_id)?.emoji || "🏃",
    })));
  }, [loadProfiles]);

  const loadAll = useCallback(async () => {
    setLoading(true);
    await Promise.all([loadFriends(), loadBattles(), loadActivityFeed()]);
    setLoading(false);
  }, [loadFriends, loadBattles, loadActivityFeed]);

  useEffect(() => { loadAll(); }, [loadAll]);

  // Realtime activity feed
  useEffect(() => {
    const channel = supabase
      .channel("activity_feed_realtime")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "activity_feed" }, () => {
        loadActivityFeed();
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [loadActivityFeed]);

  const sendFriendRequest = useCallback(async (friendUserId: string) => {
    if (!userId || userId === friendUserId) {
      toast.error("Invalid friend request");
      return;
    }

    // Check if already friends or pending
    const existing = [...friends, ...pendingRequests].find(
      (f) => (f.requester_id === friendUserId || f.addressee_id === friendUserId)
    );
    if (existing) {
      toast.error("Already connected or request pending");
      return;
    }

    const { error } = await supabase.from("friendships").insert({
      requester_id: userId,
      addressee_id: friendUserId,
    });

    if (error) {
      toast.error("Failed to send request");
      return;
    }

    await postActivity("friend_request", "Sent a friend request", "Reaching out to a new training partner!");
    toast.success("Friend request sent!");
    await loadFriends();
  }, [userId, friends, pendingRequests, loadFriends]);

  const respondToRequest = useCallback(async (friendshipId: string, accept: boolean) => {
    const { error } = await supabase
      .from("friendships")
      .update({ status: accept ? "accepted" : "declined" })
      .eq("id", friendshipId);

    if (error) {
      toast.error("Failed to respond");
      return;
    }

    if (accept) {
      await postActivity("friend_accepted", "Made a new friend!", "Training partners united 💪");
    }

    toast.success(accept ? "Friend request accepted!" : "Request declined");
    await loadFriends();
  }, [loadFriends]);

  const removeFriend = useCallback(async (friendshipId: string) => {
    await supabase.from("friendships").delete().eq("id", friendshipId);
    toast.success("Friend removed");
    await loadFriends();
  }, [loadFriends]);

  const challengeFriend = useCallback(async (opponentId: string, xpGoal: number, durationDays: number) => {
    if (!userId) return;

    const [{ data: myXP }, { data: oppXP }] = await Promise.all([
      supabase.from("user_xp").select("total_xp").eq("user_id", userId).maybeSingle(),
      supabase.from("user_xp").select("total_xp").eq("user_id", opponentId).maybeSingle(),
    ]);

    const endsAt = new Date();
    endsAt.setDate(endsAt.getDate() + durationDays);

    const { error } = await supabase.from("xp_battles").insert({
      challenger_id: userId,
      opponent_id: opponentId,
      xp_goal: xpGoal,
      challenger_xp_start: myXP?.total_xp || 0,
      opponent_xp_start: oppXP?.total_xp || 0,
      challenger_xp_current: 0,
      opponent_xp_current: 0,
      status: "pending",
      ends_at: endsAt.toISOString(),
    });

    if (error) {
      toast.error("Failed to create battle");
      return;
    }

    await postActivity("battle_created", "Issued an XP Battle Challenge!", `${xpGoal} XP goal over ${durationDays} days ⚔️`);
    toast.success("Battle challenge sent!");
    await loadBattles();
  }, [userId, loadBattles]);

  const respondToBattle = useCallback(async (battleId: string, accept: boolean) => {
    const updates: Record<string, string> = { status: accept ? "active" : "declined" };
    await supabase.from("xp_battles").update(updates).eq("id", battleId);

    if (accept) {
      await postActivity("battle_accepted", "Accepted an XP Battle!", "The competition is ON 🔥");
    }

    toast.success(accept ? "Battle accepted! Game on!" : "Battle declined");
    await loadBattles();
  }, [loadBattles]);

  const postActivity = useCallback(async (type: string, title: string, description: string) => {
    if (!userId) return;
    await supabase.from("activity_feed").insert({
      user_id: userId,
      activity_type: type,
      title,
      description,
    });
  }, [userId]);

  return {
    friends, pendingRequests, battles, activityFeed, loading,
    sendFriendRequest, respondToRequest, removeFriend,
    challengeFriend, respondToBattle, postActivity,
    reload: loadAll,
  };
};
