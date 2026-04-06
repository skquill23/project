import { Achievement, UserAchievement, DailyChallenge, getXPProgress, getLevelTitle } from "@/hooks/useGamification";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Zap, Trophy, Target, TrendingUp, RefreshCw } from "lucide-react";
import AchievementBadges from "./AchievementBadges";
import DailyChallenges from "./DailyChallenges";

interface GamificationTabProps {
  xp: number; level: number; achievements: Achievement[];
  unlockedAchievements: UserAchievement[]; dailyChallenges: DailyChallenge[];
  onRefreshChallenges: () => void; onCheckAchievements: () => void; loading?: boolean;
}

const GamificationTab = ({ xp, level, achievements, unlockedAchievements, dailyChallenges, onRefreshChallenges, onCheckAchievements, loading }: GamificationTabProps) => {
  const { progress, xpInLevel, xpNeeded } = getXPProgress(xp);
  const title = getLevelTitle(level);

  const statCards = [
    { label: "Total XP", value: xp.toLocaleString(), icon: Zap, color: "text-primary" },
    { label: "Level", value: level, icon: TrendingUp, color: "text-chart-2" },
    { label: "Badges", value: `${unlockedAchievements.length}/${achievements.length}`, icon: Trophy, color: "text-warning" },
    { label: "Challenges", value: dailyChallenges.filter((c) => c.is_completed).length, icon: Target, color: "text-success" },
  ];

  return (
    <div className="space-y-6">
      <Card className="glass relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-chart-2/5" />
        <CardContent className="relative p-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center glow-primary">
                <span className="text-2xl font-black text-white">{level}</span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                <Zap className="w-3.5 h-3.5 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Current Rank</p>
              <h2 className="text-xl font-extrabold tracking-tight">{title}</h2>
              <div className="mt-2">
                <div className="flex justify-between text-[10px] text-muted-foreground mb-1 font-mono">
                  <span>Lv.{level}</span><span>{xpInLevel} / {xpNeeded} XP</span><span>Lv.{level + 1}</span>
                </div>
                <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                  <div className="h-full gradient-primary rounded-full transition-all duration-1000 ease-out" style={{ width: `${Math.min(progress, 100)}%` }} />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {statCards.map((stat) => (
          <Card key={stat.label} className="glass card-hover">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">{stat.label}</p>
                  <p className="text-xl font-extrabold font-mono mt-0.5">{stat.value}</p>
                </div>
                <stat.icon className={`w-4 h-4 ${stat.color} opacity-60`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="glass"><CardContent className="p-4"><DailyChallenges challenges={dailyChallenges} onRefresh={onRefreshChallenges} loading={loading} /></CardContent></Card>

      <Card className="glass">
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-base">Badge Collection</CardTitle>
          <Button variant="outline" size="sm" onClick={onCheckAchievements} className="text-xs rounded-lg"><RefreshCw className="w-3 h-3 mr-1" />Check</Button>
        </CardHeader>
        <CardContent><AchievementBadges achievements={achievements} unlockedAchievements={unlockedAchievements} /></CardContent>
      </Card>
    </div>
  );
};

export default GamificationTab;
