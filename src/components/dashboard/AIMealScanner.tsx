import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Camera, Upload, Loader2, Sparkles, X, Utensils, Zap } from "lucide-react";

interface AIMealScannerProps {
  userId: string;
  onMealLogged?: () => void;
}

interface AnalysisResult {
  calories: number;
  protein_g: number;
  carbs_g: number;
  fats_g: number;
  meal_type: string;
}

const AIMealScanner = ({ userId, onMealLogged }: AIMealScannerProps) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setImagePreview(dataUrl);
      // Extract base64 without the data:image/... prefix
      setImageBase64(dataUrl.split(",")[1]);
      setResult(null);
    };
    reader.readAsDataURL(file);
  };

  const clearImage = () => {
    setImagePreview(null);
    setImageBase64(null);
    setResult(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (cameraInputRef.current) cameraInputRef.current.value = "";
  };

  const analyzeMeal = async () => {
    if (!imageBase64 && !description.trim()) {
      toast.error("Please add a photo or description of your meal");
      return;
    }

    setAnalyzing(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke("analyze-meal", {
        body: {
          mealDescription: description || undefined,
          imageBase64: imageBase64 || undefined,
        },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      setResult(data.data);
      toast.success("Meal analyzed and logged! 🎉");
      onMealLogged?.();
    } catch (error: any) {
      console.error("Analyze error:", error);
      toast.error(error.message || "Failed to analyze meal");
    } finally {
      setAnalyzing(false);
    }
  };

  const reset = () => {
    clearImage();
    setDescription("");
    setResult(null);
  };

  return (
    <div className="space-y-6">
      {/* Hero Card */}
      <Card className="relative overflow-hidden border-accent/20">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-primary/5" />
        <CardContent className="relative p-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center border-2 border-accent/30">
              <Sparkles className="w-7 h-7 text-accent" />
            </div>
            <div>
              <h2 className="text-xl font-bold">AI Meal Scanner</h2>
              <p className="text-sm text-muted-foreground">
                Snap a photo or describe your meal — AI instantly estimates calories & macros
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Input Card */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Camera className="w-4 h-4 text-primary" />
              Scan Your Meal
            </CardTitle>
            <CardDescription>Take a photo or describe what you ate</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Image Upload Area */}
            {!imagePreview ? (
              <div className="border-2 border-dashed rounded-xl p-8 text-center space-y-3 hover:border-primary/50 transition-colors">
                <div className="w-12 h-12 mx-auto rounded-xl bg-muted flex items-center justify-center">
                  <Camera className="w-6 h-6 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">Upload a meal photo for instant AI analysis</p>
                <div className="flex gap-2 justify-center">
                  <Button variant="outline" size="sm" onClick={() => cameraInputRef.current?.click()}>
                    <Camera className="w-4 h-4 mr-1" />
                    Camera
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                    <Upload className="w-4 h-4 mr-1" />
                    Upload
                  </Button>
                </div>
                <input
                  ref={cameraInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={handleFileSelect}
                />
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileSelect}
                />
              </div>
            ) : (
              <div className="relative rounded-xl overflow-hidden">
                <img
                  src={imagePreview}
                  alt="Meal preview"
                  className="w-full h-48 object-cover rounded-xl"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 h-7 w-7 rounded-full"
                  onClick={clearImage}
                >
                  <X className="w-3.5 h-3.5" />
                </Button>
                <div className="absolute bottom-2 left-2">
                  <Badge className="bg-background/80 text-foreground backdrop-blur-sm text-xs">
                    📸 Photo ready
                  </Badge>
                </div>
              </div>
            )}

            {/* Description */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Meal Description <span className="text-muted-foreground">(optional with photo)</span>
              </label>
              <Textarea
                placeholder="e.g., 2 chapatis with dal, 1 bowl rice, chicken curry..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="resize-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              {result && (
                <Button variant="outline" className="flex-1" onClick={reset}>
                  Scan Another
                </Button>
              )}
              <Button
                className="flex-1"
                onClick={analyzeMeal}
                disabled={analyzing || (!imageBase64 && !description.trim())}
              >
                {analyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    Analyze & Log
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Card */}
        <Card className={result ? "border-success/30" : ""}>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Utensils className="w-4 h-4 text-success" />
              Analysis Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            {analyzing ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-3">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full border-4 border-muted border-t-primary animate-spin" />
                  <Sparkles className="w-6 h-6 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>
                <p className="text-sm text-muted-foreground">AI is analyzing your meal...</p>
                <p className="text-xs text-muted-foreground">This usually takes 5-10 seconds</p>
              </div>
            ) : result ? (
              <div className="space-y-4">
                {/* Meal Type */}
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="capitalize text-xs">
                    {result.meal_type}
                  </Badge>
                  <Badge className="bg-success/10 text-success border-success/20 text-xs">
                    ✅ Logged automatically
                  </Badge>
                </div>

                {/* Calories Hero */}
                <div className="text-center p-4 rounded-xl bg-gradient-to-br from-accent/10 to-primary/5 border">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Total Calories</p>
                  <p className="text-4xl font-black text-accent mt-1">{result.calories}</p>
                  <p className="text-xs text-muted-foreground">kcal</p>
                </div>

                {/* Macros */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Protein", value: result.protein_g, unit: "g", color: "text-chart-1", bg: "bg-chart-1/10" },
                    { label: "Carbs", value: result.carbs_g, unit: "g", color: "text-chart-2", bg: "bg-chart-2/10" },
                    { label: "Fats", value: result.fats_g, unit: "g", color: "text-chart-3", bg: "bg-chart-3/10" },
                  ].map((macro) => (
                    <div key={macro.label} className={`p-3 rounded-xl ${macro.bg} text-center`}>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{macro.label}</p>
                      <p className={`text-xl font-bold ${macro.color} mt-0.5`}>
                        {Math.round(macro.value * 10) / 10}
                      </p>
                      <p className="text-[10px] text-muted-foreground">{macro.unit}</p>
                    </div>
                  ))}
                </div>

                {/* Calorie Breakdown Bar */}
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Calorie source breakdown</p>
                  <div className="h-3 rounded-full overflow-hidden flex">
                    {(() => {
                      const proteinCal = result.protein_g * 4;
                      const carbsCal = result.carbs_g * 4;
                      const fatsCal = result.fats_g * 9;
                      const total = proteinCal + carbsCal + fatsCal || 1;
                      return (
                        <>
                          <div className="bg-chart-1 h-full" style={{ width: `${(proteinCal / total) * 100}%` }} />
                          <div className="bg-chart-2 h-full" style={{ width: `${(carbsCal / total) * 100}%` }} />
                          <div className="bg-chart-3 h-full" style={{ width: `${(fatsCal / total) * 100}%` }} />
                        </>
                      );
                    })()}
                  </div>
                  <div className="flex justify-between text-[10px] text-muted-foreground">
                    <span>Protein {Math.round((result.protein_g * 4 / (result.protein_g * 4 + result.carbs_g * 4 + result.fats_g * 9 || 1)) * 100)}%</span>
                    <span>Carbs {Math.round((result.carbs_g * 4 / (result.protein_g * 4 + result.carbs_g * 4 + result.fats_g * 9 || 1)) * 100)}%</span>
                    <span>Fats {Math.round((result.fats_g * 9 / (result.protein_g * 4 + result.carbs_g * 4 + result.fats_g * 9 || 1)) * 100)}%</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 space-y-3 text-center">
                <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center">
                  <Sparkles className="w-7 h-7 text-muted-foreground/50" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Upload a meal photo or type a description, then hit "Analyze & Log"
                </p>
                <p className="text-xs text-muted-foreground">
                  AI will estimate calories, protein, carbs & fats instantly
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AIMealScanner;
