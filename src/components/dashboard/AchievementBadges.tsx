import { Achievement, UserAchievement } from "@/hooks/useGamification";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Trophy, Utensils, Dumbbell, Flame, Target, Star, Crown, Shield,
  Zap, Medal, Award, TrendingUp, CalendarCheck, Sparkles, Lock, Check,
} from "lucide-react";
import { format } from "date-fns";

interface AchievementBadgesProps {
  achievements: Achievement[];
  unlockedAchievements: UserAchievement[];
}

const ICON_MAP: Record<string, React.ElementType> = {
  trophy: Trophy, utensils: Utensils, dumbbell: Dumbbell, flame: Flame,
  target: Target, star: Star, crown: Crown, shield: Shield, zap: Zap,
  medal: Medal, award: Award, "trending-up": TrendingUp, sparkles: Sparkles,
  "calendar-check": CalendarCheck, calendar: CalendarCheck,
  "chef-hat": Utensils, salad: Utensils, sun: Flame, gem: Star,
  "fire-extinguisher": Flame, "shield-check": Shield, swords: Zap,
};

const TIER_STYLES: Record<string, { border: string; bg: string; glow: string }> = {
  bronze: { border: "border-accent/50", bg: "bg-accent/10", glow: "shadow-accent/20" },
  silver: { border: "border-muted-foreground/50", bg: "bg-muted/30", glow: "shadow-muted-foreground/20" },
  gold: { border: "border-warning/50", bg: "bg-warning/10", glow: "shadow-warning/20" },
  platinum: { border: "border-primary/50", bg: "bg-primary/10", glow: "shadow-primary/20" },
};

const CATEGORIES = [
  { value: "all", label: "All" },
  { value: "nutrition", label: "Nutrition" },
  { value: "fitness", label: "Fitness" },
  { value: "consistency", label: "Streaks" },
  { value: "milestone", label: "Milestones" },
  { value: "challenges", label: "Challenges" },
];

const AchievementBadges = ({ achievements, unlockedAchievements }: AchievementBadgesProps) => {
  const unlockedMap = new Map(unlockedAchievements.map((u) => [u.achievement_id, u]));
  const totalUnlocked = unlockedAchievements.length;
  const totalAchievements = achievements.length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold">Achievements</h3>
          <p className="text-sm text-muted-foreground">
            {totalUnlocked}/{totalAchievements} unlocked
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          {["bronze", "silver", "gold", "platinum"].map((tier) => {
            const count = achievements.filter(
              (a) => a.tier === tier && unlockedMap.has(a.id)
            ).length;
            const total = achievements.filter((a) => a.tier === tier).length;
            return (
              <Badge key={tier} variant="outline" className="text-[10px] capitalize">
                {tier}: {count}/{total}
              </Badge>
            );
          })}
        </div>
      </div>

      <Tabs defaultValue="all">
        <TabsList className="grid grid-cols-6 w-full">
          {CATEGORIES.map((cat) => (
            <TabsTrigger key={cat.value} value={cat.value} className="text-xs">
              {cat.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {CATEGORIES.map((cat) => (
          <TabsContent key={cat.value} value={cat.value}>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {achievements
                .filter((a) => cat.value === "all" || a.category === cat.value)
                .map((ach) => {
                  const unlocked = unlockedMap.get(ach.id);
                  const Icon = ICON_MAP[ach.icon] || Trophy;
                  const tierStyle = TIER_STYLES[ach.tier] || TIER_STYLES.bronze;

                  return (
                    <Card
                      key={ach.id}
                      className={`relative overflow-hidden transition-all duration-300 group ${
                        unlocked
                          ? `${tierStyle.border} ${tierStyle.bg} hover:shadow-lg ${tierStyle.glow}`
                          : "border-border/50 opacity-50 grayscale hover:opacity-70"
                      }`}
                    >
                      {unlocked && (
                        <div className="absolute top-1.5 right-1.5">
                          <div className="w-4 h-4 rounded-full bg-success flex items-center justify-center">
                            <Check className="w-2.5 h-2.5 text-success-foreground" />
                          </div>
                        </div>
                      )}
                      <CardContent className="p-3 text-center">
                        <div className={`mx-auto w-10 h-10 rounded-xl flex items-center justify-center mb-2 ${
                          unlocked ? tierStyle.bg : "bg-muted"
                        }`}>
                          {unlocked ? (
                            <Icon className="w-5 h-5 text-primary" />
                          ) : (
                            <Lock className="w-4 h-4 text-muted-foreground" />
                          )}
                        </div>
                        <p className="text-xs font-semibold leading-tight">{ach.title}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight">{ach.description}</p>
                        <div className="flex items-center justify-center gap-1 mt-1.5">
                          <Zap className="w-2.5 h-2.5 text-primary" />
                          <span className="text-[10px] font-medium text-primary">+{ach.xp_reward} XP</span>
                        </div>
                        {unlocked && (
                          <p className="text-[9px] text-muted-foreground mt-1">
                            {format(new Date(unlocked.unlocked_at), "MMM d, yyyy")}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default AchievementBadges;
