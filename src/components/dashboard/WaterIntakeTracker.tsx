import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Droplets, Minus, TrendingUp } from "lucide-react";
import { useWaterIntake } from "@/hooks/useWaterIntake";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, ReferenceLine, Cell } from "recharts";

interface WaterIntakeTrackerProps { userId: string; }

const QUICK_ADD = [
  { label: "Small Glass", ml: 150, icon: "🥛" },
  { label: "Glass", ml: 250, icon: "🥤" },
  { label: "Bottle", ml: 500, icon: "🍶" },
  { label: "Large Bottle", ml: 750, icon: "💧" },
];

const WaterIntakeTracker = ({ userId }: WaterIntakeTrackerProps) => {
  const { todayTotal, dailyGoal, progress, entries, weeklyData, addWater, removeEntry, loading } = useWaterIntake(userId);
  const remaining = Math.max(0, dailyGoal - todayTotal);
  const circumference = 2 * Math.PI * 70;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="space-y-6">
      <Card className="glass relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-chart-2/5 via-transparent to-primary/5" />
        <CardContent className="relative p-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative w-44 h-44 flex-shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
                <circle cx="80" cy="80" r="70" fill="none" stroke="hsl(var(--muted))" strokeWidth="10" />
                <circle cx="80" cy="80" r="70" fill="none" stroke="hsl(var(--chart-2))" strokeWidth="10" strokeLinecap="round"
                  strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} className="transition-all duration-1000 ease-out" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <Droplets className="w-6 h-6 text-chart-2 mb-1" />
                <span className="text-2xl font-extrabold font-mono">{todayTotal}</span>
                <span className="text-[10px] text-muted-foreground font-mono">/ {dailyGoal} ml</span>
              </div>
            </div>
            <div className="flex-1 space-y-4 w-full">
              <div>
                <h3 className="text-lg font-extrabold tracking-tight">Hydration Today</h3>
                <p className="text-sm text-muted-foreground">{progress >= 100 ? "🎉 Goal reached!" : `${remaining}ml remaining`}</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {QUICK_ADD.map((item) => (
                  <Button key={item.ml} variant="outline" className="h-auto py-3 flex flex-col items-center gap-1 rounded-xl hover:border-chart-2 hover:bg-chart-2/5 transition-all"
                    onClick={() => addWater(item.ml)} disabled={loading}>
                    <span className="text-lg">{item.icon}</span>
                    <span className="text-xs font-semibold">{item.label}</span>
                    <span className="text-[10px] text-muted-foreground font-mono">{item.ml}ml</span>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="glass card-hover">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2"><TrendingUp className="w-4 h-4 text-chart-2" />Weekly</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={weeklyData}>
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} />
                <YAxis hide />
                <ReferenceLine y={dailyGoal} stroke="hsl(var(--muted-foreground))" strokeDasharray="3 3" strokeOpacity={0.5} />
                <Bar dataKey="amount" radius={[6, 6, 0, 0]} maxBarSize={32}>
                  {weeklyData.map((entry, i) => (
                    <Cell key={i} fill={entry.amount >= dailyGoal ? "hsl(var(--success))" : "hsl(var(--chart-2))"} opacity={entry.amount >= dailyGoal ? 1 : 0.6} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="glass card-hover">
          <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><Droplets className="w-4 h-4 text-chart-2" />Today's Log</CardTitle></CardHeader>
          <CardContent>
            {entries.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">No water logged yet</p>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-thin">
                {entries.map((entry) => (
                  <div key={entry.id} className="flex items-center justify-between p-2 rounded-xl bg-muted/30">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">💧</span>
                      <span className="text-sm font-semibold font-mono">{entry.amount_ml}ml</span>
                      <span className="text-[10px] text-muted-foreground font-mono">{new Date(entry.logged_at).toLocaleTimeString("en", { hour: "2-digit", minute: "2-digit" })}</span>
                    </div>
                    <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg" onClick={() => removeEntry(entry.id)}><Minus className="w-3 h-3" /></Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WaterIntakeTracker;
