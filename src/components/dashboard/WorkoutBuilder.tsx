import { Card, CardContent } from "@/components/ui/card";
import { Dumbbell, Loader2, Sparkles } from "lucide-react";
import { useWorkoutBuilder } from "@/hooks/useWorkoutBuilder";
import RoutineCreator from "./workout/RoutineCreator";
import RoutineList from "./workout/RoutineList";
import ActiveWorkout from "./workout/ActiveWorkout";
import WorkoutHistory from "./workout/WorkoutHistory";

interface WorkoutBuilderProps {
  userId: string;
}

const WorkoutBuilder = ({ userId }: WorkoutBuilderProps) => {
  const wb = useWorkoutBuilder(userId);

  if (wb.loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // If active session, show the workout tracker
  if (wb.activeSession) {
    return (
      <ActiveWorkout
        session={wb.activeSession}
        sets={wb.activeSets}
        onCompleteSet={wb.completeSet}
        onFinish={wb.finishSession}
        onCancel={wb.cancelSession}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Hero */}
      <Card className="relative overflow-hidden border-accent/20">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-primary/5" />
        <CardContent className="relative p-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center border-2 border-accent/30">
              <Dumbbell className="w-7 h-7 text-accent" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Workout Builder</h2>
              <p className="text-sm text-muted-foreground">
                Create custom routines, track every set & rep, with built-in rest timer
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <RoutineCreator onSave={wb.createRoutine} />

      <RoutineList
        routines={wb.routines}
        onStart={wb.startSession}
        onDelete={wb.deleteRoutine}
      />

      <WorkoutHistory sessions={wb.sessions} />
    </div>
  );
};

export default WorkoutBuilder;
