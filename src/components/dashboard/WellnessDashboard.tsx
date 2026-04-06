import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WellnessInsights, WellnessLog } from "@/hooks/useWellness";
import { TrendingUp, TrendingDown, Minus, Flame, Heart } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from "recharts";

interface WellnessDashboardProps { insights: WellnessInsights; logs: WellnessLog[]; }

const TrendIcon = ({ trend }: { trend: "up" | "down" | "stable" }) => {
  if (trend === "up") return <TrendingUp className="w-4 h-4 text-success" />;
  if (trend === "down") return <TrendingDown className="w-4 h-4 text-destructive" />;
  return <Minus className="w-4 h-4 text-muted-foreground" />;
};

const WellnessDashboard = ({ insights, logs }: WellnessDashboardProps) => {
  const getScoreColor = (score: number) => { if (score >= 75) return "text-success"; if (score >= 50) return "text-primary"; if (score >= 25) return "text-warning"; return "text-destructive"; };
  const getScoreLabel = (score: number) => { if (score >= 80) return "Thriving ✨"; if (score >= 60) return "Good Shape 💪"; if (score >= 40) return "Room to Grow 🌱"; if (score >= 20) return "Needs Attention 💛"; return "Check In 🤗"; };

  const chartData = logs.slice(0, 14).reverse().map((log) => ({
    date: new Date(log.log_date).toLocaleDateString("en", { month: "short", day: "numeric" }),
    mood: log.mood_score ? log.mood_score * 20 : null,
    energy: log.energy_level ? log.energy_level * 10 : null,
    stress: log.stress_level ? (10 - log.stress_level) * 10 : null,
  }));

  const radarData = [
    { metric: "Mood", value: (insights.avgMood / 5) * 100, fullMark: 100 },
    { metric: "Sleep", value: Math.min((insights.avgSleep / 9) * 100, 100), fullMark: 100 },
    { metric: "Energy", value: (insights.avgEnergy / 10) * 100, fullMark: 100 },
    { metric: "Motivation", value: (insights.avgMotivation / 10) * 100, fullMark: 100 },
    { metric: "Calm", value: ((10 - insights.avgStress) / 10) * 100, fullMark: 100 },
  ];

  return (
    <div className="space-y-4">
      <Card className="glass relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <CardContent className="relative pt-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative w-32 h-32 flex-shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
                <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--primary))" strokeWidth="8" strokeLinecap="round"
                  strokeDasharray={`${insights.wellnessScore * 2.64} 264`} className="transition-all duration-1000" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-3xl font-extrabold font-mono ${getScoreColor(insights.wellnessScore)}`}>{insights.wellnessScore}</span>
                <span className="text-[10px] text-muted-foreground font-mono">/ 100</span>
              </div>
            </div>
            <div className="text-center sm:text-left flex-1 space-y-2">
              <h3 className="text-xl font-extrabold tracking-tight">Wellness Score</h3>
              <p className="text-lg font-semibold">{getScoreLabel(insights.wellnessScore)}</p>
              <div className="flex flex-wrap gap-4 justify-center sm:justify-start">
                <div className="flex items-center gap-1.5"><Flame className="w-4 h-4 text-accent" /><span className="text-sm font-semibold">{insights.streak} day streak</span></div>
                <div className="flex items-center gap-1.5"><Heart className="w-4 h-4 text-primary" /><span className="text-sm font-semibold">{insights.totalLogs} logs</span></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: "Avg Mood", value: insights.avgMood.toFixed(1), max: "/5", trend: insights.moodTrend },
          { label: "Avg Sleep", value: insights.avgSleep.toFixed(1), max: "hrs", trend: insights.sleepTrend },
          { label: "Motivation", value: insights.avgMotivation.toFixed(1), max: "/10", trend: "stable" as const },
          { label: "Energy", value: insights.avgEnergy.toFixed(1), max: "/10", trend: "stable" as const },
          { label: "Stress", value: insights.avgStress.toFixed(1), max: "/10", trend: "stable" as const },
        ].map((stat) => (
          <Card key={stat.label} className="glass card-hover">
            <CardContent className="pt-4 pb-3 px-3 text-center">
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">{stat.label}</p>
              <div className="flex items-baseline justify-center gap-0.5 mt-1">
                <span className="text-2xl font-extrabold font-mono">{stat.value}</span>
                <span className="text-xs text-muted-foreground">{stat.max}</span>
              </div>
              <div className="flex justify-center mt-1"><TrendIcon trend={stat.trend} /></div>
            </CardContent>
          </Card>
        ))}
      </div>

      {chartData.length > 2 && (
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="glass">
            <CardHeader className="pb-2"><CardTitle className="text-sm">14-Day Trends</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="moodGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.3} /><stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} /></linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.5} />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                  <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} domain={[0, 100]} />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "12px", fontSize: "12px" }} />
                  <Area type="monotone" dataKey="mood" name="Mood" stroke="hsl(var(--primary))" fill="url(#moodGrad)" strokeWidth={2} connectNulls />
                  <Area type="monotone" dataKey="energy" name="Energy" stroke="hsl(var(--chart-4))" fill="none" strokeWidth={2} connectNulls />
                  <Area type="monotone" dataKey="stress" name="Calm" stroke="hsl(var(--chart-5))" fill="none" strokeWidth={2} strokeDasharray="5 5" connectNulls />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card className="glass">
            <CardHeader className="pb-2"><CardTitle className="text-sm">Wellness Radar</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="hsl(var(--border))" strokeOpacity={0.5} />
                  <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                  <Radar name="Wellness" dataKey="value" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.15} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}

      {logs.length > 0 && (
        <Card className="glass">
          <CardHeader className="pb-2"><CardTitle className="text-sm">Recent Entries</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-[200px] overflow-y-auto scrollbar-thin pr-1">
              {logs.slice(0, 7).map((log) => (
                <div key={log.id} className="flex items-center justify-between p-2.5 rounded-xl bg-muted/30 text-sm">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{log.mood_score === 5 ? "🤩" : log.mood_score === 4 ? "😊" : log.mood_score === 3 ? "😐" : log.mood_score === 2 ? "😔" : log.mood_score === 1 ? "😞" : "—"}</span>
                    <div>
                      <p className="font-semibold text-xs">{new Date(log.log_date).toLocaleDateString("en", { weekday: "short", month: "short", day: "numeric" })}</p>
                      {log.tags.length > 0 && <p className="text-[10px] text-muted-foreground">{log.tags.slice(0, 3).join(", ")}</p>}
                    </div>
                  </div>
                  <div className="flex gap-3 text-[10px] text-muted-foreground font-mono">
                    {log.sleep_hours && <span>💤 {log.sleep_hours}h</span>}
                    {log.energy_level && <span>⚡ {log.energy_level}</span>}
                    {log.stress_level && <span>🔥 {log.stress_level}</span>}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default WellnessDashboard;
