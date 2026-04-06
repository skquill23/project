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
      const { data } = await supabase.from("leaderboard_profiles").select("user_id, display_name, avatar_emoji").neq("user_id", userId);
      setAllUsers(data || []);
    };
    loadUsers();
  }, [userId]);

  const handleChallenge = (opponentId: string) => { setChallengeTarget(opponentId); setActiveTab("battles"); };

  if (social.loading) {
    return <div className="space-y-4"><Skeleton className="h-12 w-full rounded-xl" /><Skeleton className="h-64 w-full rounded-xl" /></div>;
  }

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl glass p-6">
        <div className="absolute top-0 right-0 w-48 h-48 bg-accent/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
        <div className="relative">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl gradient-accent flex items-center justify-center glow-accent">
              <Swords className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-extrabold tracking-tight">Social Challenges</h2>
          </div>
          <p className="text-sm text-muted-foreground max-w-md">Connect with friends, compete in XP battles, and dominate the feed.</p>
          <div className="flex gap-6 mt-4">
            {[
              { value: social.friends.length, label: "Friends", color: "text-primary" },
              { value: social.battles.filter(b => b.status === "active").length, label: "Active", color: "text-accent" },
              { value: social.battles.filter(b => b.winner_id === userId).length, label: "Wins", color: "text-warning" },
            ].map(s => (
              <div key={s.label} className="text-center">
                <p className={`text-2xl font-extrabold font-mono ${s.color}`}>{s.value}</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 rounded-xl">
          <TabsTrigger value="friends" className="rounded-lg flex items-center gap-1.5"><Users className="w-4 h-4" /><span className="hidden sm:inline">Friends</span></TabsTrigger>
          <TabsTrigger value="battles" className="rounded-lg flex items-center gap-1.5"><Swords className="w-4 h-4" /><span className="hidden sm:inline">Battles</span></TabsTrigger>
          <TabsTrigger value="feed" className="rounded-lg flex items-center gap-1.5"><Activity className="w-4 h-4" /><span className="hidden sm:inline">Feed</span></TabsTrigger>
        </TabsList>
        <TabsContent value="friends" className="mt-4"><FriendsList userId={userId} friends={social.friends} pendingRequests={social.pendingRequests} allUsers={allUsers} onSendRequest={social.sendFriendRequest} onRespondRequest={social.respondToRequest} onRemoveFriend={social.removeFriend} onChallenge={handleChallenge} /></TabsContent>
        <TabsContent value="battles" className="mt-4"><XPBattles userId={userId} battles={social.battles} friends={social.friends} onChallenge={social.challengeFriend} onRespond={social.respondToBattle} initialOpponentId={challengeTarget} onClearInitialOpponent={() => setChallengeTarget(null)} /></TabsContent>
        <TabsContent value="feed" className="mt-4"><ActivityFeed activities={social.activityFeed} userId={userId} /></TabsContent>
      </Tabs>
    </div>
  );
};

export default SocialChallenges;
