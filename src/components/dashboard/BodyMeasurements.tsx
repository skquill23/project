import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Plus, Ruler, TrendingUp, TrendingDown, Minus, Trash2, Calendar } from "lucide-react";
import { format } from "date-fns";

interface BodyMeasurementsProps {
  userId: string;
}

interface Measurement {
  id: string;
  weight_kg: number | null;
  body_fat_percentage: number | null;
  chest_cm: number | null;
  waist_cm: number | null;
  hips_cm: number | null;
  bicep_cm: number | null;
  thigh_cm: number | null;
  neck_cm: number | null;
  measurement_date: string;
  notes: string | null;
}

const FIELDS = [
  { key: "weight_kg", label: "Weight (kg)", icon: "⚖️" },
  { key: "body_fat_percentage", label: "Body Fat %", icon: "📊" },
  { key: "chest_cm", label: "Chest (cm)", icon: "📏" },
  { key: "waist_cm", label: "Waist (cm)", icon: "📏" },
  { key: "hips_cm", label: "Hips (cm)", icon: "📏" },
  { key: "bicep_cm", label: "Bicep (cm)", icon: "💪" },
  { key: "thigh_cm", label: "Thigh (cm)", icon: "🦵" },
  { key: "neck_cm", label: "Neck (cm)", icon: "📏" },
] as const;

const BodyMeasurements = ({ userId }: BodyMeasurementsProps) => {
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<Record<string, string>>({
    weight_kg: "", body_fat_percentage: "", chest_cm: "", waist_cm: "",
    hips_cm: "", bicep_cm: "", thigh_cm: "", neck_cm: "", notes: "",
  });

  useEffect(() => {
    fetchMeasurements();
  }, [userId]);

  const fetchMeasurements = async () => {
    const { data, error } = await supabase
      .from("body_measurements")
      .select("*")
      .eq("user_id", userId)
      .order("measurement_date", { ascending: false })
      .limit(20);
    if (!error && data) setMeasurements(data);
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const insertData: any = { user_id: userId, measurement_date: new Date().toISOString().split("T")[0] };
      FIELDS.forEach(f => {
        const val = parseFloat(formData[f.key]);
        if (!isNaN(val)) insertData[f.key] = val;
      });
      if (formData.notes?.trim()) insertData.notes = formData.notes.trim();

      const { error } = await supabase.from("body_measurements").insert(insertData);
      if (error) throw error;
      toast.success("Measurements saved!");
      setShowForm(false);
      setFormData({ weight_kg: "", body_fat_percentage: "", chest_cm: "", waist_cm: "", hips_cm: "", bicep_cm: "", thigh_cm: "", neck_cm: "", notes: "" });
      fetchMeasurements();
    } catch (err: any) { toast.error(err.message || "Failed to save"); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("body_measurements").delete().eq("id", id);
    if (!error) { toast.success("Deleted"); fetchMeasurements(); }
  };

  const getDelta = (key: string): { value: number; direction: "up" | "down" | "same" } | null => {
    if (measurements.length < 2) return null;
    const curr = (measurements[0] as any)[key];
    const prev = (measurements[1] as any)[key];
    if (curr == null || prev == null) return null;
    const diff = curr - prev;
    if (diff === 0) return { value: 0, direction: "same" };
    return { value: Math.abs(diff), direction: diff > 0 ? "up" : "down" };
  };

  const latest = measurements[0];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Ruler className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-bold">Body Measurements</h3>
        </div>
        <Button
          variant={showForm ? "secondary" : "default"}
          size="sm"
          onClick={() => setShowForm(!showForm)}
          className="rounded-lg text-xs"
        >
          <Plus className="w-3.5 h-3.5 mr-1" />
          {showForm ? "Cancel" : "Log Measurements"}
        </Button>
      </div>

      {showForm && (
        <Card className="glass border-primary/20">
          <CardContent className="p-5 space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {FIELDS.map(f => (
                <div key={f.key} className="space-y-1.5">
                  <Label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {f.icon} {f.label}
                  </Label>
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="—"
                    value={formData[f.key]}
                    onChange={(e) => setFormData(prev => ({ ...prev, [f.key]: e.target.value }))}
                    className="h-9 text-sm font-mono"
                  />
                </div>
              ))}
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Notes</Label>
              <Textarea
                placeholder="Any notes about this measurement..."
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                className="h-16 text-sm resize-none"
              />
            </div>
            <Button onClick={handleSave} disabled={saving} className="w-full gradient-primary text-white font-semibold h-10 rounded-lg">
              {saving ? "Saving..." : "Save Measurements"}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Latest stats cards */}
      {latest && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {FIELDS.map(f => {
            const val = (latest as any)[f.key];
            if (val == null) return null;
            const delta = getDelta(f.key);
            const isWeightOrFat = f.key === "weight_kg" || f.key === "body_fat_percentage";
            return (
              <Card key={f.key} className="glass card-hover">
                <CardContent className="p-3">
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-1">{f.label}</p>
                  <div className="flex items-end justify-between">
                    <p className="text-xl font-extrabold font-mono">{Number(val).toFixed(1)}</p>
                    {delta && delta.direction !== "same" && (
                      <div className={`flex items-center gap-0.5 text-[10px] font-mono ${
                        (isWeightOrFat ? delta.direction === "down" : delta.direction === "up")
                          ? "text-emerald-500" : "text-red-400"
                      }`}>
                        {delta.direction === "up" ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {delta.value.toFixed(1)}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          }).filter(Boolean)}
        </div>
      )}

      {/* History */}
      {measurements.length > 0 && (
        <Card className="glass">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold">Measurement History</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border/30">
              {measurements.slice(0, 10).map((m) => (
                <div key={m.id} className="flex items-center justify-between px-5 py-3 hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-xs font-medium">{format(new Date(m.measurement_date), "MMM d, yyyy")}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    {m.weight_kg && <span className="text-xs font-mono text-muted-foreground">{Number(m.weight_kg).toFixed(1)} kg</span>}
                    {m.body_fat_percentage && <span className="text-xs font-mono text-muted-foreground">{Number(m.body_fat_percentage).toFixed(1)}% BF</span>}
                    {m.waist_cm && <span className="text-xs font-mono text-muted-foreground">{Number(m.waist_cm).toFixed(1)} cm waist</span>}
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => handleDelete(m.id)}>
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {!loading && measurements.length === 0 && !showForm && (
        <Card className="glass">
          <CardContent className="p-8 text-center">
            <Ruler className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No measurements yet. Start tracking your body composition!</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BodyMeasurements;
