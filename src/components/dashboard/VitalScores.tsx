import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { WellnessLog } from "@/hooks/useWellness";
import { Zap, Brain, Flame } from "lucide-react";

interface VitalScoresProps { todayLog: WellnessLog | null; onSave: (data: Partial<WellnessLog>) => Promise<void>; }

const VitalScores = ({ todayLog, onSave }: VitalScoresProps) => {
  const [motivation, setMotivation] = useState<number>(todayLog?.motivation_score || 5);
  const [energy, setEnergy] = useState<number>(todayLog?.energy_level || 5);
  const [stress, setStress] = useState<number>(todayLog?.stress_level || 5);
  const [saving, setSaving] = useState(false);

  const getColor = (val: number, inverse = false) => { const v = inverse ? 11 - val : val; if (v <= 3) return "text-destructive"; if (v <= 5) return "text-warning"; if (v <= 7) return "text-muted-foreground"; return "text-success"; };
  const getBarColor = (val: number, inverse = false) => { const v = inverse ? 11 - val : val; if (v <= 3) return "bg-destructive"; if (v <= 5) return "bg-warning"; if (v <= 7) return "bg-primary"; return "bg-success"; };

  const handleSave = async () => { setSaving(true); await onSave({ motivation_score: motivation, energy_level: energy, stress_level: stress }); setSaving(false); };

  const metrics = [
    { label: "Motivation", icon: Brain, value: motivation, setValue: setMotivation, color: getColor(motivation), barColor: getBarColor(motivation), low: "Low", high: "On Fire" },
    { label: "Energy Level", icon: Zap, value: energy, setValue: setEnergy, color: getColor(energy), barColor: getBarColor(energy), low: "Drained", high: "Supercharged" },
    { label: "Stress Level", icon: Flame, value: stress, setValue: setStress, color: getColor(stress, true), barColor: getBarColor(stress, true), low: "Zen", high: "Overwhelmed" },
  ];

  return (
    <Card className="glass">
      <CardHeader className="pb-3"><CardTitle className="text-lg flex items-center gap-2"><span className="text-2xl">⚡</span>Daily Vitals</CardTitle></CardHeader>
      <CardContent className="space-y-6">
        {metrics.map((m) => (
          <div key={m.label} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2"><m.icon className={`w-4 h-4 ${m.color}`} /><span className="text-sm font-semibold">{m.label}</span></div>
              <span className={`text-2xl font-extrabold font-mono ${m.color}`}>{m.value}/10</span>
            </div>
            <Slider value={[m.value]} onValueChange={(v) => m.setValue(v[0])} min={1} max={10} step={1} />
            <div className="flex justify-between text-[10px] text-muted-foreground"><span>{m.low}</span><span>{m.high}</span></div>
            <div className="flex gap-0.5 h-2">
              {Array.from({ length: 10 }, (_, i) => (
                <div key={i} className={`flex-1 rounded-full transition-all ${i < m.value ? m.barColor + " opacity-80" : "bg-muted"}`} />
              ))}
            </div>
          </div>
        ))}
        <Button onClick={handleSave} disabled={saving} className="w-full rounded-xl gradient-primary text-white">
          {saving ? "Saving..." : todayLog?.motivation_score ? "Update Scores" : "Log Scores"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default VitalScores;
