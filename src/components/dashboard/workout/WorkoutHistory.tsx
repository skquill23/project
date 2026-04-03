import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Dumbbell, Calendar, Trophy } from "lucide-react";
import type { WorkoutSession } from "@/hooks/useWorkoutBuilder";

interface WorkoutHistoryProps {
  sessions: WorkoutSession[];
}

const WorkoutHistory = ({ sessions }: WorkoutHistoryProps) => {
  const completedSessions = sessions.filter(s => s.completed_at);

  if (completedSessions.length === 0) {
    return null;
  }

  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    if (m >= 60) {
      const h = Math.floor(m / 60);
      const rm = m % 60;
      return `${h}h ${rm}m`;
    }
    return `${m}m ${s}s`;
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const days = Math.floor(diff / 86400000);
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  // Stats
  const totalWorkouts = completedSessions.length;
  const totalVolume = completedSessions.reduce((s, w) => s + (w.total_volume_kg || 0), 0);
  const totalTime = completedSessions.reduce((s, w) => s + (w.duration_seconds || 0), 0);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Trophy className="w-4 h-4 text-accent" />
          Workout History
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Workouts", value: totalWorkouts, icon: Calendar },
            { label: "Total Volume", value: `${Math.round(totalVolume).toLocaleString()} kg`, icon: Dumbbell },
            { label: "Total Time", value: formatDuration(totalTime), icon: Clock },
          ].map(stat => (
            <div key={stat.label} className="text-center p-3 rounded-xl bg-muted/30 border">
              <stat.icon className="w-4 h-4 mx-auto text-muted-foreground mb-1" />
              <p className="text-lg font-bold">{stat.value}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Session list */}
        <div className="space-y-2">
          {completedSessions.slice(0, 10).map(session => (
            <div key={session.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/20 border">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Dumbbell className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{session.routine_name}</p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                  <span>{formatDate(session.started_at)}</span>
                  {session.duration_seconds && <span>{formatDuration(session.duration_seconds)}</span>}
                  {session.total_volume_kg ? <span>{Math.round(session.total_volume_kg).toLocaleString()} kg</span> : null}
                </div>
              </div>
              <Badge variant="secondary" className="text-[10px]">
                ✅ Done
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkoutHistory;
