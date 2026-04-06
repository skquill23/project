import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { WellnessLog } from "@/hooks/useWellness";
import { Moon, Star } from "lucide-react";

const QUALITY_LABELS = [
  { score: 1, label: "Terrible", emoji: "😵" },
  { score: 2, label: "Poor", emoji: "😴" },
  { score: 3, label: "Fair", emoji: "😐" },
  { score: 4, label: "Good", emoji: "😌" },
  { score: 5, label: "Excellent", emoji: "🌟" },
];

interface SleepLoggerProps { todayLog: WellnessLog | null; onSave: (data: Partial<WellnessLog>) => Promise<void>; }

const SleepLogger = ({ todayLog, onSave }: SleepLoggerProps) => {
  const [hours, setHours] = useState<number>(todayLog?.sleep_hours || 7);
  const [quality, setQuality] = useState<number>(todayLog?.sleep_quality || 3);
  const [saving, setSaving] = useState(false);

  const getSleepMessage = (h: number) => {
    if (h < 5) return { msg: "You need more rest! 😟", color: "text-destructive" };
    if (h < 7) return { msg: "A bit short, aim for 7-9h", color: "text-warning" };
    if (h <= 9) return { msg: "Great sleep duration! 🎯", color: "text-success" };
    return { msg: "Oversleeping can affect energy", color: "text-warning" };
  };
  const sleepInfo = getSleepMessage(hours);

  const handleSave = async () => { setSaving(true); await onSave({ sleep_hours: hours, sleep_quality: quality }); setSaving(false); };

  return (
    <Card className="glass">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2"><Moon className="w-5 h-5 text-primary" />Sleep Tracker</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <div className="flex justify-between items-baseline mb-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Hours slept</p>
            <div className="text-right"><span className="text-3xl font-extrabold font-mono">{hours}</span><span className="text-sm text-muted-foreground ml-1">hrs</span></div>
          </div>
          <Slider value={[hours]} onValueChange={(v) => setHours(v[0])} min={0} max={14} step={0.5} className="my-2" />
          <p className={`text-xs font-semibold mt-1 ${sleepInfo.color}`}>{sleepInfo.msg}</p>
          <div className="mt-3 h-8 rounded-xl bg-muted overflow-hidden flex">
            {Array.from({ length: 14 }, (_, i) => (
              <div key={i} className={`flex-1 border-r border-background/20 transition-all ${i < hours ? (i < 5 ? "bg-destructive/60" : i < 7 ? "bg-warning/60" : i < 9 ? "bg-primary/60" : "bg-warning/60") : "bg-transparent"}`} />
            ))}
          </div>
          <div className="flex justify-between text-[10px] text-muted-foreground mt-1 font-mono"><span>0h</span><span>7h</span><span>14h</span></div>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Sleep quality</p>
          <div className="flex justify-between gap-2">
            {QUALITY_LABELS.map((q) => (
              <button key={q.score} onClick={() => setQuality(q.score)}
                className={`flex-1 flex flex-col items-center gap-1 p-2.5 rounded-xl border-2 transition-all ${quality === q.score ? "border-primary bg-primary/10 scale-105" : "border-transparent bg-muted/50 hover:bg-muted"}`}>
                <span className="text-xl">{q.emoji}</span>
                <span className="text-[10px] font-semibold">{q.label}</span>
                <div className="flex gap-0.5">{Array.from({ length: q.score }, (_, i) => <Star key={i} className="w-2 h-2 fill-primary text-primary" />)}</div>
              </button>
            ))}
          </div>
        </div>
        <Button onClick={handleSave} disabled={saving} className="w-full rounded-xl gradient-primary text-white">
          {saving ? "Saving..." : todayLog?.sleep_hours ? "Update Sleep" : "Log Sleep"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default SleepLogger;
