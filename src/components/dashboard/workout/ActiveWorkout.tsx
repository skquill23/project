import { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle2, Circle, Clock, Dumbbell, X, Trophy,
  Timer, SkipForward, Volume2, VolumeX
} from "lucide-react";
import type { WorkoutSession, SessionSet } from "@/hooks/useWorkoutBuilder";

interface ActiveWorkoutProps {
  session: WorkoutSession;
  sets: SessionSet[];
  onCompleteSet: (setId: string, reps: number, weight: number) => Promise<void>;
  onFinish: () => Promise<void>;
  onCancel: () => Promise<void>;
}

const ActiveWorkout = ({ session, sets, onCompleteSet, onFinish, onCancel }: ActiveWorkoutProps) => {
  const [elapsed, setElapsed] = useState(0);
  const [restTimer, setRestTimer] = useState(0);
  const [restDuration, setRestDuration] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [editingSet, setEditingSet] = useState<string | null>(null);
  const [editReps, setEditReps] = useState("");
  const [editWeight, setEditWeight] = useState("");
  const restIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioRef = useRef<AudioContext | null>(null);

  const completedSets = sets.filter(s => s.is_completed).length;
  const totalSets = sets.length;
  const progress = totalSets > 0 ? (completedSets / totalSets) * 100 : 0;

  // Elapsed timer
  useEffect(() => {
    const start = new Date(session.started_at).getTime();
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - start) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [session.started_at]);

  const playBeep = useCallback(() => {
    if (!soundEnabled) return;
    try {
      if (!audioRef.current) audioRef.current = new AudioContext();
      const ctx = audioRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 880;
      gain.gain.value = 0.3;
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch {}
  }, [soundEnabled]);

  // Rest timer
  useEffect(() => {
    if (isResting && restTimer > 0) {
      restIntervalRef.current = setInterval(() => {
        setRestTimer(prev => {
          if (prev <= 1) {
            setIsResting(false);
            playBeep();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => { if (restIntervalRef.current) clearInterval(restIntervalRef.current); };
  }, [isResting, restTimer, playBeep]);

  const startRest = (seconds: number) => {
    setRestDuration(seconds);
    setRestTimer(seconds);
    setIsResting(true);
  };

  const skipRest = () => {
    setIsResting(false);
    setRestTimer(0);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const handleCompleteSet = async (set: SessionSet) => {
    const reps = editingSet === set.id ? parseInt(editReps) || set.target_reps || 10 : set.target_reps || 10;
    const weight = editingSet === set.id ? parseFloat(editWeight) || set.weight_kg || 0 : set.weight_kg || 0;
    await onCompleteSet(set.id, reps, weight);
    setEditingSet(null);

    // Auto-start rest timer (find this exercise's rest from the next incomplete set)
    const exerciseSets = sets.filter(s => s.exercise_name === set.exercise_name);
    const nextIncomplete = exerciseSets.find(s => !s.is_completed && s.id !== set.id);
    if (nextIncomplete) {
      startRest(60); // default 60s rest
    }
  };

  // Group sets by exercise
  const exerciseGroups: { name: string; sets: SessionSet[] }[] = [];
  const seen = new Set<string>();
  for (const s of sets) {
    if (!seen.has(s.exercise_name)) {
      seen.add(s.exercise_name);
      exerciseGroups.push({
        name: s.exercise_name,
        sets: sets.filter(ss => ss.exercise_name === s.exercise_name),
      });
    }
  }

  const totalVolume = sets
    .filter(s => s.is_completed)
    .reduce((sum, s) => sum + (s.weight_kg || 0) * (s.reps_completed || 0), 0);

  return (
    <div className="space-y-4">
      {/* Workout Header */}
      <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-lg">{session.routine_name}</h3>
              <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {formatTime(elapsed)}
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {completedSets}/{totalSets} sets
                </span>
                <span className="flex items-center gap-1">
                  <Dumbbell className="w-3.5 h-3.5" />
                  {Math.round(totalVolume)} kg vol
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSoundEnabled(!soundEnabled)}>
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </Button>
              <Button variant="destructive" size="sm" onClick={onCancel}>
                <X className="w-3.5 h-3.5 mr-1" />
                Cancel
              </Button>
            </div>
          </div>
          <Progress value={progress} className="mt-3 h-2" />
        </CardContent>
      </Card>

      {/* Rest Timer Overlay */}
      {isResting && (
        <Card className="border-accent/40 bg-accent/5 animate-pulse">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Timer className="w-5 h-5 text-accent" />
              <span className="text-sm font-medium text-accent">Rest Timer</span>
            </div>
            <p className="text-4xl font-black text-accent">{formatTime(restTimer)}</p>
            <Progress value={((restDuration - restTimer) / restDuration) * 100} className="mt-3 h-1.5" />
            <div className="flex gap-2 justify-center mt-3">
              <Button variant="outline" size="sm" onClick={skipRest}>
                <SkipForward className="w-3.5 h-3.5 mr-1" />
                Skip
              </Button>
              <Button variant="outline" size="sm" onClick={() => startRest(restTimer + 30)}>
                +30s
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Exercise Groups */}
      {exerciseGroups.map(group => {
        const allComplete = group.sets.every(s => s.is_completed);
        return (
          <Card key={group.name} className={allComplete ? "border-success/30 bg-success/5" : ""}>
            <CardHeader className="pb-2 pt-4 px-4">
              <div className="flex items-center gap-2">
                <Dumbbell className="w-4 h-4 text-primary" />
                <CardTitle className="text-sm">{group.name}</CardTitle>
                {allComplete && <Badge className="bg-success/10 text-success text-[10px]">✓ Done</Badge>}
              </div>
            </CardHeader>
            <CardContent className="px-4 pb-4 space-y-1.5">
              <div className="grid grid-cols-[2rem_1fr_1fr_1fr_auto] gap-2 text-[10px] text-muted-foreground uppercase tracking-wider px-1">
                <span>Set</span>
                <span>Target</span>
                <span>Weight</span>
                <span>Reps</span>
                <span></span>
              </div>
              {group.sets.map(set => (
                <div
                  key={set.id}
                  className={`grid grid-cols-[2rem_1fr_1fr_1fr_auto] gap-2 items-center p-2 rounded-lg transition-colors ${
                    set.is_completed ? "bg-success/10" : "bg-muted/30 hover:bg-muted/50"
                  }`}
                >
                  <span className="text-sm font-mono text-center">{set.set_number}</span>
                  <span className="text-xs text-muted-foreground">{set.target_reps} reps</span>
                  {set.is_completed ? (
                    <>
                      <span className="text-sm font-medium">{set.weight_kg} kg</span>
                      <span className="text-sm font-medium">{set.reps_completed}</span>
                      <CheckCircle2 className="w-4 h-4 text-success" />
                    </>
                  ) : editingSet === set.id ? (
                    <>
                      <Input
                        type="number"
                        className="h-7 text-xs w-full"
                        value={editWeight}
                        onChange={e => setEditWeight(e.target.value)}
                        placeholder="kg"
                        min={0}
                      />
                      <Input
                        type="number"
                        className="h-7 text-xs w-full"
                        value={editReps}
                        onChange={e => setEditReps(e.target.value)}
                        placeholder="reps"
                        min={0}
                      />
                      <Button
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => handleCompleteSet(set)}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <span className="text-xs text-muted-foreground">{set.weight_kg || 0} kg</span>
                      <span className="text-xs text-muted-foreground">—</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => {
                          setEditingSet(set.id);
                          setEditWeight(String(set.weight_kg || 0));
                          setEditReps(String(set.target_reps || 10));
                        }}
                      >
                        <Circle className="w-3.5 h-3.5" />
                      </Button>
                    </>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        );
      })}

      {/* Finish Button */}
      {completedSets > 0 && (
        <Button className="w-full h-12 text-base gap-2" onClick={onFinish}>
          <Trophy className="w-5 h-5" />
          Finish Workout ({completedSets}/{totalSets} sets)
        </Button>
      )}
    </div>
  );
};

export default ActiveWorkout;
