import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Activity, Swords, Users, Trophy, Flame, Dumbbell, Utensils, Droplets, Brain } from "lucide-react";
import { ActivityItem } from "@/hooks/useSocial";
import { formatDistanceToNow } from "date-fns";

interface ActivityFeedProps {
  activities: ActivityItem[];
  userId: string;
}

const ACTIVITY_CONFIG: Record<string, { icon: typeof Activity; color: string; bg: string }> = {
  friend_request: { icon: Users, color: "text-primary", bg: "bg-primary/10" },
  friend_accepted: { icon: Users, color: "text-success", bg: "bg-success/10" },
  battle_created: { icon: Swords, color: "text-accent", bg: "bg-accent/10" },
  battle_accepted: { icon: Flame, color: "text-warning", bg: "bg-warning/10" },
  battle_won: { icon: Trophy, color: "text-warning", bg: "bg-warning/10" },
  workout_completed: { icon: Dumbbell, color: "text-primary", bg: "bg-primary/10" },
  meal_logged: { icon: Utensils, color: "text-success", bg: "bg-success/10" },
  water_logged: { icon: Droplets, color: "text-primary", bg: "bg-primary/10" },
  achievement_unlocked: { icon: Trophy, color: "text-warning", bg: "bg-warning/10" },
  level_up: { icon: Flame, color: "text-accent", bg: "bg-accent/10" },
  wellness_logged: { icon: Brain, color: "text-primary", bg: "bg-primary/10" },
};

const ActivityFeed = ({ activities, userId }: ActivityFeedProps) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Activity className="w-5 h-5 text-primary" />
          Activity Feed
          <Badge variant="secondary" className="ml-auto text-xs">Live</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <div className="text-center py-12">
            <Activity className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No activity yet. Start training to see updates!</p>
          </div>
        ) : (
          <ScrollArea className="h-[500px] pr-3">
            <div className="space-y-3">
              {activities.map((item) => {
                const config = ACTIVITY_CONFIG[item.activity_type] || {
                  icon: Activity, color: "text-muted-foreground", bg: "bg-muted",
                };
                const Icon = config.icon;
                const isMe = item.user_id === userId;

                return (
                  <div
                    key={item.id}
                    className="flex gap-3 p-3 rounded-xl border bg-card hover:bg-muted/30 transition-colors"
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${config.bg}`}>
                      <Icon className={`w-5 h-5 ${config.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-lg leading-none">{item.user_emoji}</span>
                        <span className="font-semibold text-sm truncate">
                          {isMe ? "You" : item.user_name}
                        </span>
                        <span className="text-xs text-muted-foreground ml-auto shrink-0">
                          {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
                        </span>
                      </div>
                      <p className="text-sm font-medium">{item.title}</p>
                      {item.description && (
                        <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};

export default ActivityFeed;
