import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, Swords, Activity } from "lucide-react";
import { useSocial } from "@/hooks/useSocial";
import { supabase } from "@/integrations/supabase/client";
import FriendsList from "./social/FriendsList";
import XPBattles from "./social/XPBattles";
import ActivityFeed from "./social/ActivityFeed";

interface SocialChallengesProps {
  userId: string;
}

const SocialChallenges = ({ userId }: SocialChallengesProps) => {
  const social = useSocial(userId);
  const [allUsers, setAllUsers] = useState<{ user_id: string; display_name: string; avatar_emoji: string }[]>([]);
  const [challengeTarget, setChallengeTarget] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("friends");

  useEffect(() => {
    const loadUsers = async () => {
      const { data } = await supabase
        .from("leaderboard_profiles")
        .select("user_id, display_name, avatar_emoji")
        .neq("user_id", userId);
      setAllUsers(data || []);
    };
    loadUsers();
  }, [userId]);

  const handleChallenge = (opponentId: string) => {
    setChallengeTarget(opponentId);
    setActiveTab("battles");
  };

  if (social.loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-accent/15 via-primary/10 to-transparent border p-6">
        <div className="absolute top-0 right-0 w-48 h-48 bg-accent/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-2">
            <Swords className="w-6 h-6 text-accent" />
            <h2 className="text-xl font-bold">Social Challenges</h2>
          </div>
          <p className="text-sm text-muted-foreground max-w-md">
            Connect with friends, compete in head-to-head XP battles, and dominate the activity feed.
          </p>
          <div className="flex gap-4 mt-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{social.friends.length}</p>
              <p className="text-xs text-muted-foreground">Friends</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-accent">
                {social.battles.filter((b) => b.status === "active").length}
              </p>
              <p className="text-xs text-muted-foreground">Active Battles</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-warning">
                {social.battles.filter((b) => b.winner_id === userId).length}
              </p>
              <p className="text-xs text-muted-foreground">Victories</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="friends" className="flex items-center gap-1.5">
            <Users className="w-4 h-4" />
            <span className="hidden sm:inline">Friends</span>
          </TabsTrigger>
          <TabsTrigger value="battles" className="flex items-center gap-1.5">
            <Swords className="w-4 h-4" />
            <span className="hidden sm:inline">Battles</span>
          </TabsTrigger>
          <TabsTrigger value="feed" className="flex items-center gap-1.5">
            <Activity className="w-4 h-4" />
            <span className="hidden sm:inline">Feed</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="friends" className="mt-4">
          <FriendsList
            userId={userId}
            friends={social.friends}
            pendingRequests={social.pendingRequests}
            allUsers={allUsers}
            onSendRequest={social.sendFriendRequest}
            onRespondRequest={social.respondToRequest}
            onRemoveFriend={social.removeFriend}
            onChallenge={handleChallenge}
          />
        </TabsContent>

        <TabsContent value="battles" className="mt-4">
          <XPBattles
            userId={userId}
            battles={social.battles}
            friends={social.friends}
            onChallenge={social.challengeFriend}
            onRespond={social.respondToBattle}
            initialOpponentId={challengeTarget}
            onClearInitialOpponent={() => setChallengeTarget(null)}
          />
        </TabsContent>

        <TabsContent value="feed" className="mt-4">
          <ActivityFeed activities={social.activityFeed} userId={userId} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SocialChallenges;
