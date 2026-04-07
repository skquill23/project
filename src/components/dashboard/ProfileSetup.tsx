import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import BodyMeasurements from "./BodyMeasurements";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Zap } from "lucide-react";

interface ProfileSetupProps {
  userId: string;
  onComplete: () => void;
}

const ProfileSetup = ({ userId, onComplete }: ProfileSetupProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "", age: "", height_cm: "", current_weight_kg: "",
    target_weight_kg: "", fitness_goal: "", activity_level: "",
  });

  useEffect(() => {
    const loadProfile = async () => {
      const { data } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle();
      if (data) {
        setFormData({
          full_name: data.full_name || "", age: data.age?.toString() || "",
          height_cm: data.height_cm?.toString() || "", current_weight_kg: data.current_weight_kg?.toString() || "",
          target_weight_kg: data.target_weight_kg?.toString() || "", fitness_goal: data.fitness_goal || "",
          activity_level: data.activity_level || "",
        });
      }
    };
    loadProfile();
  }, [userId]);

  const calculateCalories = () => {
    const weight = parseFloat(formData.current_weight_kg);
    const activityMultiplier = { sedentary: 1.2, lightly_active: 1.375, moderately_active: 1.55, very_active: 1.725, extremely_active: 1.9 }[formData.activity_level] || 1.5;
    const goalAdjustment = { weight_loss: -500, maintenance: 0, muscle_gain: 500 }[formData.fitness_goal] || 0;
    return Math.round(weight * 24 * activityMultiplier + goalAdjustment);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const calories = calculateCalories();
      const { error } = await supabase.from("profiles").upsert({
        id: userId, full_name: formData.full_name, age: parseInt(formData.age),
        height_cm: parseFloat(formData.height_cm), current_weight_kg: parseFloat(formData.current_weight_kg),
        target_weight_kg: parseFloat(formData.target_weight_kg), fitness_goal: formData.fitness_goal,
        activity_level: formData.activity_level, daily_calorie_target: calories, updated_at: new Date().toISOString(),
      });
      if (error) throw error;
      toast.success("Profile saved successfully!");
      onComplete();
    } catch (error: any) { toast.error(error.message || "Failed to save profile"); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background relative overflow-hidden">
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-accent/5 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl" />
      <Card className="w-full max-w-2xl glass relative z-10">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-3">
            <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center glow-primary">
              <Zap className="w-7 h-7 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-extrabold tracking-tight">Complete Your Profile</CardTitle>
          <CardDescription>Help us personalize your fitness journey</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { id: "full_name", label: "Full Name", type: "text", key: "full_name" as const },
                { id: "age", label: "Age", type: "number", key: "age" as const },
                { id: "height", label: "Height (cm)", type: "number", key: "height_cm" as const },
                { id: "current_weight", label: "Current Weight (kg)", type: "number", key: "current_weight_kg" as const },
                { id: "target_weight", label: "Target Weight (kg)", type: "number", key: "target_weight_kg" as const },
              ].map(field => (
                <div key={field.id} className="space-y-2">
                  <Label htmlFor={field.id} className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{field.label}</Label>
                  <Input id={field.id} type={field.type} step={field.type === "number" ? "0.1" : undefined}
                    value={formData[field.key]} onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })} required className="h-11" />
                </div>
              ))}
              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Fitness Goal</Label>
                <Select value={formData.fitness_goal} onValueChange={(v) => setFormData({ ...formData, fitness_goal: v })} required>
                  <SelectTrigger className="h-11"><SelectValue placeholder="Select goal" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weight_loss">Weight Loss</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="muscle_gain">Muscle Gain</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Activity Level</Label>
                <Select value={formData.activity_level} onValueChange={(v) => setFormData({ ...formData, activity_level: v })} required>
                  <SelectTrigger className="h-11"><SelectValue placeholder="Select activity level" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sedentary">Sedentary (little to no exercise)</SelectItem>
                    <SelectItem value="lightly_active">Lightly Active (1-3 days/week)</SelectItem>
                    <SelectItem value="moderately_active">Moderately Active (3-5 days/week)</SelectItem>
                    <SelectItem value="very_active">Very Active (6-7 days/week)</SelectItem>
                    <SelectItem value="extremely_active">Extremely Active (athlete level)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button type="submit" className="w-full h-11 gradient-primary text-white font-semibold" disabled={loading}>
              {loading ? "Saving..." : "Save Profile"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Body Measurements Section */}
      <div className="w-full max-w-2xl relative z-10 mt-6">
        <BodyMeasurements userId={userId} />
      </div>
    </div>
  );
};

export default ProfileSetup;
