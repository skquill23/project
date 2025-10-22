import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { Loader2, Plus, Utensils, Search } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
import { Badge } from "@/components/ui/badge";

interface NutritionTrackerProps {
  userId: string;
}

const NutritionTracker = ({ userId }: NutritionTrackerProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const [todayData, setTodayData] = useState<any>(null);
  const [calorieTarget, setCalorieTarget] = useState(2000);
  const [selectedFood, setSelectedFood] = useState<any>(null);
  const [quantity, setQuantity] = useState("1");
  const [logging, setLogging] = useState(false);

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

  const searchFoods = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setSearching(true);
    try {
      const { data, error } = await supabase
        .from("foods")
        .select("*")
        .ilike("name", `%${query}%`)
        .limit(10);

      if (error) throw error;
      setSearchResults(data || []);
    } catch (error: any) {
      console.error("Search error:", error);
      toast.error("Failed to search foods");
    } finally {
      setSearching(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    if (value.length >= 2) {
      searchFoods(value);
    } else {
      setSearchResults([]);
    }
  };

  const selectFood = (food: any) => {
    setSelectedFood(food);
    setQuantity("1");
    setSearchResults([]);
    setSearchQuery("");
  };

  const logMeal = async () => {
    if (!selectedFood) {
      toast.error("Please select a food");
      return;
    }

    const qty = parseFloat(quantity);
    if (isNaN(qty) || qty <= 0) {
      toast.error("Please enter a valid quantity");
      return;
    }

    setLogging(true);
    try {
      const calories = Math.round(selectedFood.calories * qty);
      const protein = selectedFood.protein_g * qty;
      const carbs = selectedFood.carbs_g * qty;
      const fats = selectedFood.fats_g * qty;

      const { error: mealError } = await supabase.from("meals").insert({
        user_id: userId,
        food_id: selectedFood.id,
        meal_description: `${qty} x ${selectedFood.serving_size} ${selectedFood.serving_unit} ${selectedFood.name}`,
        calories,
        protein_g: protein,
        carbs_g: carbs,
        fats_g: fats,
        quantity: qty,
      });

      if (mealError) throw mealError;

      const today = new Date().toISOString().split("T")[0];
      const { data: existingSummary } = await supabase
        .from("daily_nutrition_summary")
        .select("*")
        .eq("user_id", userId)
        .eq("date", today)
        .maybeSingle();

      if (existingSummary) {
        await supabase
          .from("daily_nutrition_summary")
          .update({
            total_calories: existingSummary.total_calories + calories,
            total_protein_g: existingSummary.total_protein_g + protein,
            total_carbs_g: existingSummary.total_carbs_g + carbs,
            total_fats_g: existingSummary.total_fats_g + fats,
            meals_count: existingSummary.meals_count + 1,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existingSummary.id);
      } else {
        await supabase.from("daily_nutrition_summary").insert({
          user_id: userId,
          date: today,
          total_calories: calories,
          total_protein_g: protein,
          total_carbs_g: carbs,
          total_fats_g: fats,
          meals_count: 1,
        });
      }

      toast.success("Meal logged successfully!");
      setSelectedFood(null);
      setQuantity("1");
      await loadTodayData();
    } catch (error: any) {
      console.error("Log meal error:", error);
      toast.error(error.message || "Failed to log meal");
    } finally {
      setLogging(false);
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
            Food Logger
          </CardTitle>
          <CardDescription>
            Search for foods from our database and log your meals
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!selectedFood ? (
            <div className="space-y-3">
              <div className="flex gap-2">
                <Input
                  placeholder="Search for food (e.g., chicken, apple, rice)..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                />
                <Button variant="outline" disabled>
                  {searching ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Search className="w-4 h-4" />
                  )}
                </Button>
              </div>

              {searchResults.length > 0 && (
                <div className="border rounded-lg divide-y max-h-80 overflow-y-auto">
                  {searchResults.map((food) => (
                    <div
                      key={food.id}
                      className="p-3 hover:bg-accent cursor-pointer transition-colors"
                      onClick={() => selectFood(food)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="space-y-1 flex-1">
                          <p className="font-medium">{food.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {food.serving_size} {food.serving_unit}
                            {food.brand && ` • ${food.brand}`}
                          </p>
                          <div className="flex gap-2 text-xs">
                            <Badge variant="secondary">{food.calories} cal</Badge>
                            <Badge variant="outline">P: {food.protein_g}g</Badge>
                            <Badge variant="outline">C: {food.carbs_g}g</Badge>
                            <Badge variant="outline">F: {food.fats_g}g</Badge>
                          </div>
                        </div>
                        {food.category && (
                          <Badge className="ml-2">{food.category}</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 border rounded-lg bg-muted/50">
                <div className="space-y-2">
                  <p className="font-medium text-lg">{selectedFood.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Per {selectedFood.serving_size} {selectedFood.serving_unit}
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant="secondary">{selectedFood.calories} cal</Badge>
                    <Badge variant="outline">P: {selectedFood.protein_g}g</Badge>
                    <Badge variant="outline">C: {selectedFood.carbs_g}g</Badge>
                    <Badge variant="outline">F: {selectedFood.fats_g}g</Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Number of servings
                </label>
                <Input
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="1"
                />
                <p className="text-sm text-muted-foreground">
                  Total: {Math.round(selectedFood.calories * parseFloat(quantity || "1"))} calories
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setSelectedFood(null)}
                  disabled={logging}
                >
                  Cancel
                </Button>
                <Button className="flex-1" onClick={logMeal} disabled={logging}>
                  {logging ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Log Meal
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
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
