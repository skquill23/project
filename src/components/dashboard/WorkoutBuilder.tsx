import { Card, CardContent } from "@/components/ui/card";
import { Dumbbell, Loader2 } from "lucide-react";
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

  if (wb.activeSession) {
    return (
      <ActiveWorkout
        session={wb.activeSession} sets={wb.activeSets}
        onCompleteSet={wb.completeSet} onFinish={wb.finishSession} onCancel={wb.cancelSession}
      />
    );
  }

  return (
    <div className="space-y-6">
      <Card className="glass relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-primary/5" />
        <CardContent className="relative p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl gradient-accent flex items-center justify-center glow-accent">
              <Dumbbell className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold tracking-tight">Workout Builder</h2>
              <p className="text-sm text-muted-foreground">Create routines, track sets & reps, built-in rest timer</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <RoutineCreator onSave={wb.createRoutine} />
      <RoutineList routines={wb.routines} onStart={wb.startSession} onDelete={wb.deleteRoutine} />
      <WorkoutHistory sessions={wb.sessions} />
    </div>
  );
};

export default WorkoutBuilder;
