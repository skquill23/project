import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Crown, Medal, Award, Zap, Settings, Users } from "lucide-react";
import { useLeaderboard, AVATAR_EMOJIS } from "@/hooks/useLeaderboard";
import { getXPProgress } from "@/hooks/useGamification";

interface CommunityLeaderboardProps {
  userId: string;
}

const RANK_ICONS = [Crown, Medal, Award];
const RANK_COLORS = ["text-warning", "text-muted-foreground", "text-accent"];

const CommunityLeaderboard = ({ userId }: CommunityLeaderboardProps) => {
  const { leaderboard, myProfile, myRank, loading, updateProfile } = useLeaderboard(userId);
  const [editingProfile, setEditingProfile] = useState(false);
  const [editName, setEditName] = useState("");
  const [editEmoji, setEditEmoji] = useState("");

  const top10 = leaderboard.slice(0, 10);
  const myEntry = leaderboard.find((e) => e.user_id === userId);

  const startEdit = () => {
    setEditName(myProfile?.display_name || "");
    setEditEmoji(myProfile?.avatar_emoji || "🏃");
    setEditingProfile(true);
  };

  const saveProfile = async () => {
    await updateProfile({ display_name: editName, avatar_emoji: editEmoji });
    setEditingProfile(false);
  };

  return (
    <div className="space-y-6">
      {/* My Rank Card */}
      {myEntry && (
        <Card className="relative overflow-hidden border-primary/20">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-warning/5" />
          <CardContent className="relative p-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-warning/20 flex items-center justify-center border-2 border-primary/30 text-3xl">
                {myEntry.avatar_emoji}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold">{myEntry.display_name}</h2>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={startEdit}>
                    <Settings className="w-3.5 h-3.5" />
                  </Button>
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <Badge variant="secondary" className="text-xs">
                    Rank #{myEntry.rank}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    Level {myEntry.level} — {myEntry.title}
                  </Badge>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Zap className="w-3 h-3 text-primary" />
                    {myEntry.total_xp.toLocaleString()} XP
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Edit Profile */}
      {editingProfile && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Edit Leaderboard Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Display Name</label>
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Your display name"
                maxLength={20}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Avatar</label>
              <div className="grid grid-cols-8 gap-2">
                {AVATAR_EMOJIS.map((emoji) => (
                  <button
                    key={emoji}
                    className={`w-10 h-10 rounded-lg text-xl flex items-center justify-center border-2 transition-colors ${
                      editEmoji === emoji ? "border-primary bg-primary/10" : "border-transparent bg-muted/50 hover:bg-muted"
                    }`}
                    onClick={() => setEditEmoji(emoji)}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="text-sm font-medium">Visible on leaderboard</p>
                <p className="text-xs text-muted-foreground">Other users can see your profile</p>
              </div>
              <Switch
                checked={myProfile?.is_visible ?? true}
                onCheckedChange={(checked) => updateProfile({ is_visible: checked })}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setEditingProfile(false)}>Cancel</Button>
              <Button className="flex-1" onClick={saveProfile}>Save</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Leaderboard */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Trophy className="w-4 h-4 text-warning" />
              Global Rankings
            </CardTitle>
            <Badge variant="secondary" className="text-xs">
              <Users className="w-3 h-3 mr-1" />
              {leaderboard.length} athletes
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center text-muted-foreground py-8">Loading rankings...</p>
          ) : top10.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No rankings yet. Be the first!</p>
          ) : (
            <div className="space-y-2">
              {top10.map((entry) => {
                const isMe = entry.user_id === userId;
                const RankIcon = entry.rank <= 3 ? RANK_ICONS[entry.rank - 1] : null;
                const rankColor = entry.rank <= 3 ? RANK_COLORS[entry.rank - 1] : "";
                const { progress } = getXPProgress(entry.total_xp);

                return (
                  <div
                    key={entry.user_id}
                    className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
                      isMe ? "bg-primary/10 border border-primary/20" : "bg-muted/30 hover:bg-muted/50"
                    }`}
                  >
                    {/* Rank */}
                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                      {RankIcon ? (
                        <RankIcon className={`w-4 h-4 ${rankColor}`} />
                      ) : (
                        <span className="text-xs font-bold text-muted-foreground">{entry.rank}</span>
                      )}
                    </div>

                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center text-xl flex-shrink-0">
                      {entry.avatar_emoji}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-semibold truncate ${isMe ? "text-primary" : ""}`}>
                          {entry.display_name}
                          {isMe && " (You)"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] text-muted-foreground">Lv.{entry.level}</span>
                        <div className="h-1.5 flex-1 max-w-20 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-primary to-chart-2 rounded-full"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-muted-foreground">{entry.title}</span>
                      </div>
                    </div>

                    {/* XP */}
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-bold">{entry.total_xp.toLocaleString()}</p>
                      <p className="text-[10px] text-muted-foreground">XP</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CommunityLeaderboard;
