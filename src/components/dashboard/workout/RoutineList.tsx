import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dumbbell, Play, Trash2, Clock, ListChecks } from "lucide-react";
import type { Routine } from "@/hooks/useWorkoutBuilder";

interface RoutineListProps {
  routines: Routine[];
  onStart: (routine: Routine) => void;
  onDelete: (routineId: string) => void;
  disabled?: boolean;
}

const RoutineList = ({ routines, onStart, onDelete, disabled }: RoutineListProps) => {
  if (routines.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 space-y-3 text-center">
          <div className="w-14 h-14 rounded-2xl bg-muted/50 flex items-center justify-center">
            <Dumbbell className="w-7 h-7 text-muted-foreground/50" />
          </div>
          <p className="text-sm text-muted-foreground">No routines yet. Create your first workout routine above!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Your Routines</h3>
      {routines.map(routine => {
        const totalSets = routine.exercises.reduce((s, e) => s + e.target_sets, 0);
        const estimatedMins = Math.round(totalSets * 1.5 + routine.exercises.length * 0.5);
        return (
          <Card key={routine.id} className="group hover:border-primary/30 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold truncate">{routine.name}</h4>
                    <Badge variant="outline" className="text-[10px] shrink-0">
                      {routine.exercises.length} exercises
                    </Badge>
                  </div>
                  {routine.description && (
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">{routine.description}</p>
                  )}
                  <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <ListChecks className="w-3 h-3" />
                      {totalSets} sets
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      ~{estimatedMins} min
                    </span>
                  </div>
                  {/* Exercise preview */}
                  <div className="flex flex-wrap gap-1 mt-2">
                    {routine.exercises.slice(0, 5).map(ex => (
                      <Badge key={ex.id} variant="secondary" className="text-[10px] font-normal">
                        {ex.exercise_name}
                      </Badge>
                    ))}
                    {routine.exercises.length > 5 && (
                      <Badge variant="secondary" className="text-[10px] font-normal">
                        +{routine.exercises.length - 5} more
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex gap-1.5">
                  <Button
                    size="sm"
                    onClick={() => onStart(routine)}
                    disabled={disabled}
                    className="gap-1"
                  >
                    <Play className="w-3.5 h-3.5" />
                    Start
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => onDelete(routine.id)}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default RoutineList;
