import { DailyChallenge } from "@/hooks/useGamification";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Zap, CheckCircle2, Target, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DailyChallengesProps {
  challenges: DailyChallenge[];
  onRefresh: () => void;
  loading?: boolean;
}

const DailyChallenges = ({ challenges, onRefresh, loading }: DailyChallengesProps) => {
  const completed = challenges.filter((c) => c.is_completed).length;
  const total = challenges.length;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-bold">Daily Challenges</h3>
          <span className="text-xs text-muted-foreground">
            {completed}/{total} done
          </span>
        </div>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onRefresh} disabled={loading}>
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
        </Button>
      </div>

      <div className="space-y-2">
        {challenges.map((challenge) => {
          const progress = Math.min((challenge.current_value / challenge.target_value) * 100, 100);
          return (
            <Card
              key={challenge.id}
              className={`transition-all duration-300 ${
                challenge.is_completed
                  ? "border-success/30 bg-success/5"
                  : "hover:border-primary/30"
              }`}
            >
              <CardContent className="p-3">
                <div className="flex items-start justify-between mb-1.5">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      {challenge.is_completed ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-success flex-shrink-0" />
                      ) : (
                        <Target className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                      )}
                      <p className={`text-xs font-semibold truncate ${
                        challenge.is_completed ? "line-through text-muted-foreground" : ""
                      }`}>
                        {challenge.challenge_title}
                      </p>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-0.5 ml-5">
                      {challenge.challenge_description}
                    </p>
                  </div>
                  <div className="flex items-center gap-0.5 flex-shrink-0 ml-2">
                    <Zap className="w-2.5 h-2.5 text-primary" />
                    <span className="text-[10px] font-medium text-primary">+{challenge.xp_reward}</span>
                  </div>
                </div>
                <div className="ml-5 flex items-center gap-2">
                  <Progress value={progress} className="h-1.5 flex-1" />
                  <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                    {challenge.current_value}/{challenge.target_value}
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {completed === total && total > 0 && (
        <div className="text-center py-2 rounded-lg bg-success/10 border border-success/20">
          <p className="text-xs font-semibold text-success">🎉 All challenges completed!</p>
        </div>
      )}
    </div>
  );
};

export default DailyChallenges;
