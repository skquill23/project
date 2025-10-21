import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { Loader2, Plus, Utensils, Camera, X } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";

interface NutritionTrackerProps {
  userId: string;
}

const NutritionTracker = ({ userId }: NutritionTrackerProps) => {
  const [mealInput, setMealInput] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [todayData, setTodayData] = useState<any>(null);
  const [calorieTarget, setCalorieTarget] = useState(2000);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadTodayData();
    loadProfile();
  }, [userId]);

  const loadProfile = async () => {
    const { data } = await supabase
      .from("profiles")
      .select("daily_calorie_target")
      .eq("id", userId)
      .single();

    if (data?.daily_calorie_target) {
      setCalorieTarget(data.daily_calorie_target);
    }
  };

  const loadTodayData = async () => {
    const today = new Date().toISOString().split("T")[0];
    
    const { data } = await supabase
      .from("daily_nutrition_summary")
      .select("*")
      .eq("user_id", userId)
      .eq("date", today)
      .maybeSingle();

    setTodayData(data || {
      total_calories: 0,
      total_protein_g: 0,
      total_carbs_g: 0,
      total_fats_g: 0,
      meals_count: 0,
    });
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5242880) {
        toast.error("Image must be less than 5MB");
        return;
      }
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const analyzeMeal = async () => {
    if (!mealInput.trim() && !selectedImage) {
      toast.error("Please describe your meal or upload an image");
      return;
    }

    setAnalyzing(true);
    try {
      let imageBase64 = null;
      
      if (selectedImage) {
        const reader = new FileReader();
        imageBase64 = await new Promise<string>((resolve) => {
          reader.onloadend = () => {
            const base64 = reader.result as string;
            resolve(base64.split(',')[1]); // Remove data:image/jpeg;base64, prefix
          };
          reader.readAsDataURL(selectedImage);
        });
      }

      // Get the current session to ensure we have a valid token
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !sessionData.session) {
        toast.error("Please log in again");
        return;
      }

      const { data, error } = await supabase.functions.invoke("analyze-meal", {
        body: { 
          mealDescription: mealInput,
          imageBase64: imageBase64
        },
        headers: {
          Authorization: `Bearer ${sessionData.session.access_token}`
        }
      });

      if (error) throw error;

      toast.success("Meal logged successfully!");
      setMealInput("");
      clearImage();
      await loadTodayData();
    } catch (error: any) {
      console.error("Meal analysis error:", error);
      toast.error(error.message || "Failed to analyze meal");
    } finally {
      setAnalyzing(false);
    }
  };

  const macroData = [
    { name: "Protein", value: todayData?.total_protein_g || 0, color: "hsl(var(--chart-1))" },
    { name: "Carbs", value: todayData?.total_carbs_g || 0, color: "hsl(var(--chart-2))" },
    { name: "Fats", value: todayData?.total_fats_g || 0, color: "hsl(var(--chart-3))" },
  ];

  const calorieProgress = ((todayData?.total_calories || 0) / calorieTarget) * 100;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Utensils className="w-5 h-5" />
            AI Meal Logger
          </CardTitle>
          <CardDescription>
            Simply type what you ate (e.g., "2 eggs, 1 toast, coffee") or upload a photo. AI will automatically calculate calories and macros - no need to search a database!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex gap-2">
              <Input
                placeholder="e.g., 2 scrambled eggs, 2 toast slices, 1 banana, coffee with milk"
                value={mealInput}
                onChange={(e) => setMealInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && !selectedImage && analyzeMeal()}
              />
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleImageSelect}
                className="hidden"
              />
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={analyzing}
              >
                <Camera className="w-4 h-4" />
              </Button>
              <Button onClick={analyzeMeal} disabled={analyzing}>
                {analyzing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
              </Button>
            </div>
            
            {imagePreview && (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Meal preview"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={clearImage}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Today's Calories</CardTitle>
            <CardDescription>
              {todayData?.total_calories || 0} / {calorieTarget} kcal
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Progress value={calorieProgress} className="h-3" />
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-sm text-muted-foreground">Protein</p>
                <p className="text-xl font-bold text-chart-1">{todayData?.total_protein_g || 0}g</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Carbs</p>
                <p className="text-xl font-bold text-chart-2">{todayData?.total_carbs_g || 0}g</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Fats</p>
                <p className="text-xl font-bold text-chart-3">{todayData?.total_fats_g || 0}g</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Macro Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={macroData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {macroData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NutritionTracker;
