import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EXERCISE_LIBRARY, EXERCISE_CATEGORIES, ExerciseDefinition } from "@/data/exerciseLibrary";
import { Plus, Trash2, GripVertical, Search, Dumbbell } from "lucide-react";
import type { RoutineExercise } from "@/hooks/useWorkoutBuilder";

interface RoutineCreatorProps {
  onSave: (name: string, description: string, exercises: Omit<RoutineExercise, "id" | "routine_id">[]) => Promise<void>;
}

interface DraftExercise {
  exercise_name: string;
  exercise_type: string;
  target_sets: number;
  target_reps: number;
  target_weight_kg: number | null;
  rest_seconds: number;
  sort_order: number;
  notes: string | null;
}

const RoutineCreator = ({ onSave }: RoutineCreatorProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [exercises, setExercises] = useState<DraftExercise[]>([]);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [pickerOpen, setPickerOpen] = useState(false);

  const filteredExercises = EXERCISE_LIBRARY.filter(ex => {
    const matchesSearch = ex.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || ex.category === categoryFilter;
    const notAdded = !exercises.some(e => e.exercise_name === ex.name);
    return matchesSearch && matchesCategory && notAdded;
  });

  const addExercise = (ex: ExerciseDefinition) => {
    setExercises(prev => [
      ...prev,
      {
        exercise_name: ex.name,
        exercise_type: ex.category,
        target_sets: 3,
        target_reps: ex.category === "Cardio" ? 1 : 10,
        target_weight_kg: null,
        rest_seconds: 60,
        sort_order: prev.length,
        notes: null,
      },
    ]);
  };

  const removeExercise = (index: number) => {
    setExercises(prev => prev.filter((_, i) => i !== index));
  };

  const updateExercise = (index: number, field: keyof DraftExercise, value: any) => {
    setExercises(prev => prev.map((ex, i) => i === index ? { ...ex, [field]: value } : ex));
  };

  const moveExercise = (index: number, direction: -1 | 1) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= exercises.length) return;
    const copy = [...exercises];
    [copy[index], copy[newIndex]] = [copy[newIndex], copy[index]];
    setExercises(copy.map((ex, i) => ({ ...ex, sort_order: i })));
  };

  const handleSave = async () => {
    if (!name.trim()) return;
    if (exercises.length === 0) return;
    setSaving(true);
    await onSave(name, description, exercises);
    setName("");
    setDescription("");
    setExercises([]);
    setSaving(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Plus className="w-4 h-4 text-primary" />
          Create New Routine
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Routine Name</label>
            <Input
              placeholder="e.g., Push Day, Upper Body A..."
              value={name}
              onChange={e => setName(e.target.value)}
              maxLength={100}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Description <span className="text-muted-foreground">(optional)</span></label>
            <Input
              placeholder="e.g., Heavy compounds + accessories"
              value={description}
              onChange={e => setDescription(e.target.value)}
              maxLength={200}
            />
          </div>
        </div>

        {/* Exercise List */}
        {exercises.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Exercises ({exercises.length})</p>
            {exercises.map((ex, i) => (
              <div key={i} className="flex items-center gap-2 p-3 rounded-lg border bg-muted/30">
                <div className="flex flex-col gap-0.5">
                  <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => moveExercise(i, -1)} disabled={i === 0}>
                    <GripVertical className="w-3 h-3" />
                  </Button>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{ex.exercise_name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center gap-1">
                      <Input
                        type="number"
                        className="w-14 h-7 text-xs text-center"
                        value={ex.target_sets}
                        onChange={e => updateExercise(i, "target_sets", parseInt(e.target.value) || 1)}
                        min={1}
                        max={20}
                      />
                      <span className="text-xs text-muted-foreground">sets</span>
                    </div>
                    <span className="text-muted-foreground">×</span>
                    <div className="flex items-center gap-1">
                      <Input
                        type="number"
                        className="w-14 h-7 text-xs text-center"
                        value={ex.target_reps}
                        onChange={e => updateExercise(i, "target_reps", parseInt(e.target.value) || 1)}
                        min={1}
                        max={100}
                      />
                      <span className="text-xs text-muted-foreground">reps</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Input
                        type="number"
                        className="w-16 h-7 text-xs text-center"
                        value={ex.target_weight_kg ?? ""}
                        onChange={e => updateExercise(i, "target_weight_kg", e.target.value ? parseFloat(e.target.value) : null)}
                        placeholder="kg"
                        min={0}
                      />
                      <span className="text-xs text-muted-foreground">kg</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Input
                        type="number"
                        className="w-14 h-7 text-xs text-center"
                        value={ex.rest_seconds}
                        onChange={e => updateExercise(i, "rest_seconds", parseInt(e.target.value) || 30)}
                        min={0}
                        max={600}
                      />
                      <span className="text-xs text-muted-foreground">s rest</span>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => removeExercise(i)}>
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Add Exercise Picker */}
        <Dialog open={pickerOpen} onOpenChange={setPickerOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full border-dashed">
              <Plus className="w-4 h-4 mr-2" />
              Add Exercise
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[70vh] flex flex-col">
            <DialogHeader>
              <DialogTitle>Exercise Library</DialogTitle>
            </DialogHeader>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search exercises..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {EXERCISE_CATEGORIES.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="overflow-y-auto flex-1 space-y-1 pr-1">
              {filteredExercises.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No exercises found</p>
              ) : (
                filteredExercises.map(ex => (
                  <button
                    key={ex.name}
                    onClick={() => { addExercise(ex); setPickerOpen(false); setSearchQuery(""); }}
                    className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 text-left transition-colors"
                  >
                    <Dumbbell className="w-4 h-4 text-primary shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{ex.name}</p>
                      <p className="text-xs text-muted-foreground">{ex.muscleGroups.join(", ")}</p>
                    </div>
                    <div className="flex gap-1">
                      <Badge variant="outline" className="text-[10px]">{ex.equipment}</Badge>
                      <Badge variant="secondary" className="text-[10px]">{ex.difficulty}</Badge>
                    </div>
                  </button>
                ))
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Save Button */}
        <Button
          className="w-full"
          onClick={handleSave}
          disabled={saving || !name.trim() || exercises.length === 0}
        >
          {saving ? "Saving..." : "Save Routine"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default RoutineCreator;
