import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Swords, Trophy, Clock, Check, X, Flame, Shield, Target } from "lucide-react";
import { XPBattle, Friendship } from "@/hooks/useSocial";
import { formatDistanceToNow } from "date-fns";

interface XPBattlesProps {
  userId: string;
  battles: XPBattle[];
  friends: Friendship[];
  onChallenge: (opponentId: string, xpGoal: number, days: number) => void;
  onRespond: (battleId: string, accept: boolean) => void;
  initialOpponentId?: string | null;
  onClearInitialOpponent?: () => void;
}

const XPBattles = ({
  userId, battles, friends, onChallenge, onRespond,
  initialOpponentId, onClearInitialOpponent,
}: XPBattlesProps) => {
  const [dialogOpen, setDialogOpen] = useState(!!initialOpponentId);
  const [selectedFriend, setSelectedFriend] = useState(initialOpponentId || "");
  const [xpGoal, setXpGoal] = useState("500");
  const [duration, setDuration] = useState("7");

  const handleCreate = () => {
    if (!selectedFriend) return;
    onChallenge(selectedFriend, parseInt(xpGoal), parseInt(duration));
    setDialogOpen(false);
    setSelectedFriend("");
    onClearInitialOpponent?.();
  };

  const pendingBattles = battles.filter((b) => b.status === "pending" && b.opponent_id === userId);
  const activeBattles = battles.filter((b) => b.status === "active");
  const completedBattles = battles.filter((b) => b.status === "completed");
  const sentBattles = battles.filter((b) => b.status === "pending" && b.challenger_id === userId);

  const getFriendOptions = () => {
    return friends.map((f) => {
      const isRequester = f.requester_id !== userId;
      return {
        id: isRequester ? f.requester_id : f.addressee_id,
        name: isRequester ? f.requester_name || "Unknown" : f.addressee_name || "Unknown",
        emoji: isRequester ? f.requester_emoji || "🏃" : f.addressee_emoji || "🏃",
      };
    });
  };

  return (
    <div className="space-y-4">
      {/* Create Battle */}
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Swords className="w-5 h-5 text-primary" />
              XP Battles
            </CardTitle>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" disabled={friends.length === 0}>
                  <Swords className="w-4 h-4 mr-1" /> New Battle
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Swords className="w-5 h-5 text-primary" /> Create XP Battle
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label>Challenge</Label>
                    <Select value={selectedFriend} onValueChange={setSelectedFriend}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a friend" />
                      </SelectTrigger>
                      <SelectContent>
                        {getFriendOptions().map((f) => (
                          <SelectItem key={f.id} value={f.id}>
                            {f.emoji} {f.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>XP Goal</Label>
                    <Select value={xpGoal} onValueChange={setXpGoal}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="250">250 XP — Quick Sprint</SelectItem>
                        <SelectItem value="500">500 XP — Standard</SelectItem>
                        <SelectItem value="1000">1,000 XP — Marathon</SelectItem>
                        <SelectItem value="2500">2,500 XP — Ultimate</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Duration</Label>
                    <Select value={duration} onValueChange={setDuration}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3">3 Days</SelectItem>
                        <SelectItem value="7">7 Days</SelectItem>
                        <SelectItem value="14">14 Days</SelectItem>
                        <SelectItem value="30">30 Days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button className="w-full" onClick={handleCreate} disabled={!selectedFriend}>
                    <Flame className="w-4 h-4 mr-2" /> Send Challenge
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {friends.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">Add friends first to start XP battles!</p>
          )}
        </CardContent>
      </Card>

      {/* Incoming Battle Requests */}
      {pendingBattles.length > 0 && (
        <Card className="border-warning/30">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Shield className="w-5 h-5 text-warning" />
              Incoming Challenges
              <Badge className="ml-auto bg-warning text-warning-foreground">{pendingBattles.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingBattles.map((b) => (
              <div key={b.id} className="p-4 rounded-xl bg-warning/5 border border-warning/20 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{b.challenger_emoji}</span>
                    <div>
                      <p className="font-semibold text-sm">{b.challenger_name}</p>
                      <p className="text-xs text-muted-foreground">challenges you!</p>
                    </div>
                  </div>
                  <Badge variant="outline">{b.xp_goal} XP</Badge>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  Ends {formatDistanceToNow(new Date(b.ends_at), { addSuffix: true })}
                </div>
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1" onClick={() => onRespond(b.id, true)}>
                    <Check className="w-4 h-4 mr-1" /> Accept
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1" onClick={() => onRespond(b.id, false)}>
                    <X className="w-4 h-4 mr-1" /> Decline
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Active Battles */}
      {activeBattles.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Flame className="w-5 h-5 text-accent" />
              Active Battles
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeBattles.map((b) => {
              const isChallenger = b.challenger_id === userId;
              const myXP = isChallenger ? b.challenger_xp_current : b.opponent_xp_current;
              const theirXP = isChallenger ? b.opponent_xp_current : b.challenger_xp_current;
              const myProgress = Math.min((myXP / b.xp_goal) * 100, 100);
              const theirProgress = Math.min((theirXP / b.xp_goal) * 100, 100);
              const opponentName = isChallenger ? b.opponent_name : b.challenger_name;
              const opponentEmoji = isChallenger ? b.opponent_emoji : b.challenger_emoji;

              return (
                <div key={b.id} className="p-4 rounded-xl border bg-card space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-primary" />
                      <span className="font-semibold text-sm">{b.xp_goal} XP Goal</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {formatDistanceToNow(new Date(b.ends_at), { addSuffix: true })}
                    </div>
                  </div>

                  {/* You */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">You</span>
                      <span className="text-primary font-bold">{myXP} XP</span>
                    </div>
                    <Progress value={myProgress} className="h-3" />
                  </div>

                  {/* Opponent */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-1">
                        <span>{opponentEmoji}</span>
                        <span className="font-medium">{opponentName}</span>
                      </span>
                      <span className="text-accent font-bold">{theirXP} XP</span>
                    </div>
                    <Progress value={theirProgress} className="h-3 [&>div]:bg-accent" />
                  </div>

                  {myXP > theirXP ? (
                    <Badge className="bg-success/10 text-success border-success/20">🔥 You're winning!</Badge>
                  ) : theirXP > myXP ? (
                    <Badge variant="outline" className="text-destructive border-destructive/20">⚡ Push harder!</Badge>
                  ) : (
                    <Badge variant="outline">🤝 Tied!</Badge>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Sent Challenges */}
      {sentBattles.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Awaiting Response</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {sentBattles.map((b) => (
              <div key={b.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border">
                <div className="flex items-center gap-2">
                  <span>{b.opponent_emoji}</span>
                  <span className="text-sm">{b.opponent_name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">{b.xp_goal} XP</Badge>
                  <Badge variant="secondary" className="text-xs">Pending</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Completed Battles */}
      {completedBattles.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Trophy className="w-5 h-5 text-warning" />
              Battle History
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {completedBattles.slice(0, 5).map((b) => {
              const isChallenger = b.challenger_id === userId;
              const won = b.winner_id === userId;
              const opponentName = isChallenger ? b.opponent_name : b.challenger_name;
              const myXP = isChallenger ? b.challenger_xp_current : b.opponent_xp_current;
              const theirXP = isChallenger ? b.opponent_xp_current : b.challenger_xp_current;

              return (
                <div key={b.id} className={`flex items-center justify-between p-3 rounded-lg border ${won ? "bg-success/5 border-success/20" : "bg-muted/30"}`}>
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{won ? "🏆" : "💪"}</span>
                    <div>
                      <p className="text-sm font-medium">vs {opponentName}</p>
                      <p className="text-xs text-muted-foreground">{myXP} vs {theirXP} XP</p>
                    </div>
                  </div>
                  <Badge variant={won ? "default" : "secondary"}>
                    {won ? "Victory" : b.winner_id ? "Defeat" : "Draw"}
                  </Badge>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {battles.length === 0 && friends.length > 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <Swords className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No battles yet. Challenge a friend to get started!</p>
        </div>
      )}
    </div>
  );
};

export default XPBattles;
