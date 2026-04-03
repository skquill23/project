import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Routine {
  id: string;
  name: string;
  description: string | null;
  estimated_duration_minutes: number | null;
  created_at: string;
  exercises: RoutineExercise[];
}

export interface RoutineExercise {
  id: string;
  routine_id: string;
  exercise_name: string;
  exercise_type: string;
  target_sets: number;
  target_reps: number;
  target_weight_kg: number | null;
  rest_seconds: number;
  sort_order: number;
  notes: string | null;
}

export interface WorkoutSession {
  id: string;
  routine_id: string | null;
  routine_name: string;
  started_at: string;
  completed_at: string | null;
  duration_seconds: number | null;
  total_volume_kg: number | null;
  notes: string | null;
}

export interface SessionSet {
  id: string;
  session_id: string;
  exercise_name: string;
  set_number: number;
  target_reps: number | null;
  reps_completed: number | null;
  weight_kg: number | null;
  is_completed: boolean;
  completed_at: string | null;
}

export const useWorkoutBuilder = (userId: string) => {
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [sessions, setSessions] = useState<WorkoutSession[]>([]);
  const [activeSession, setActiveSession] = useState<WorkoutSession | null>(null);
  const [activeSets, setActiveSets] = useState<SessionSet[]>([]);
  const [loading, setLoading] = useState(true);

  const loadRoutines = useCallback(async () => {
    if (!userId) return;
    const { data: routineData } = await supabase
      .from("workout_routines")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (!routineData) { setRoutines([]); return; }

    const routinesWithExercises: Routine[] = [];
    for (const r of routineData) {
      const { data: exercises } = await supabase
        .from("routine_exercises")
        .select("*")
        .eq("routine_id", r.id)
        .order("sort_order");
      routinesWithExercises.push({ ...r, exercises: exercises || [] });
    }
    setRoutines(routinesWithExercises);
  }, [userId]);

  const loadSessions = useCallback(async () => {
    if (!userId) return;
    const { data } = await supabase
      .from("workout_sessions")
      .select("*")
      .eq("user_id", userId)
      .order("started_at", { ascending: false })
      .limit(20);
    setSessions(data || []);

    // Check for active (uncompleted) session
    const active = data?.find(s => !s.completed_at);
    if (active) {
      setActiveSession(active);
      const { data: sets } = await supabase
        .from("session_sets")
        .select("*")
        .eq("session_id", active.id)
        .order("set_number");
      setActiveSets(sets || []);
    }
  }, [userId]);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([loadRoutines(), loadSessions()]);
      setLoading(false);
    };
    init();
  }, [loadRoutines, loadSessions]);

  const createRoutine = async (name: string, description: string, exercises: Omit<RoutineExercise, "id" | "routine_id">[]) => {
    const { data: routine, error } = await supabase
      .from("workout_routines")
      .insert({ user_id: userId, name, description: description || null })
      .select()
      .single();
    if (error || !routine) { toast.error("Failed to create routine"); return; }

    if (exercises.length > 0) {
      const rows = exercises.map((ex, i) => ({
        routine_id: routine.id,
        user_id: userId,
        exercise_name: ex.exercise_name,
        exercise_type: ex.exercise_type,
        target_sets: ex.target_sets,
        target_reps: ex.target_reps,
        target_weight_kg: ex.target_weight_kg,
        rest_seconds: ex.rest_seconds,
        sort_order: i,
        notes: ex.notes,
      }));
      await supabase.from("routine_exercises").insert(rows);
    }

    toast.success("Routine created! 💪");
    await loadRoutines();
  };

  const deleteRoutine = async (routineId: string) => {
    await supabase.from("workout_routines").delete().eq("id", routineId);
    toast.success("Routine deleted");
    await loadRoutines();
  };

  const startSession = async (routine: Routine) => {
    const { data: session, error } = await supabase
      .from("workout_sessions")
      .insert({
        user_id: userId,
        routine_id: routine.id,
        routine_name: routine.name,
      })
      .select()
      .single();
    if (error || !session) { toast.error("Failed to start workout"); return; }

    // Pre-create all sets
    const setRows: any[] = [];
    for (const ex of routine.exercises) {
      for (let s = 1; s <= ex.target_sets; s++) {
        setRows.push({
          session_id: session.id,
          user_id: userId,
          exercise_name: ex.exercise_name,
          set_number: s,
          target_reps: ex.target_reps,
          weight_kg: ex.target_weight_kg || 0,
          is_completed: false,
        });
      }
    }
    if (setRows.length > 0) {
      await supabase.from("session_sets").insert(setRows);
    }

    const { data: sets } = await supabase
      .from("session_sets")
      .select("*")
      .eq("session_id", session.id)
      .order("set_number");

    setActiveSession(session);
    setActiveSets(sets || []);
    toast.success("Workout started! Let's go! 🔥");
  };

  const completeSet = async (setId: string, repsCompleted: number, weightKg: number) => {
    await supabase
      .from("session_sets")
      .update({
        reps_completed: repsCompleted,
        weight_kg: weightKg,
        is_completed: true,
        completed_at: new Date().toISOString(),
      })
      .eq("id", setId);

    setActiveSets(prev =>
      prev.map(s => s.id === setId
        ? { ...s, reps_completed: repsCompleted, weight_kg: weightKg, is_completed: true, completed_at: new Date().toISOString() }
        : s
      )
    );
  };

  const finishSession = async () => {
    if (!activeSession) return;
    const startTime = new Date(activeSession.started_at).getTime();
    const durationSeconds = Math.round((Date.now() - startTime) / 1000);
    const totalVolume = activeSets
      .filter(s => s.is_completed)
      .reduce((sum, s) => sum + (s.weight_kg || 0) * (s.reps_completed || 0), 0);

    await supabase
      .from("workout_sessions")
      .update({
        completed_at: new Date().toISOString(),
        duration_seconds: durationSeconds,
        total_volume_kg: totalVolume,
      })
      .eq("id", activeSession.id);

    toast.success("Workout complete! Great job! 🏆");
    setActiveSession(null);
    setActiveSets([]);
    await loadSessions();
  };

  const cancelSession = async () => {
    if (!activeSession) return;
    await supabase.from("workout_sessions").delete().eq("id", activeSession.id);
    setActiveSession(null);
    setActiveSets([]);
    toast.info("Workout cancelled");
  };

  return {
    routines,
    sessions,
    activeSession,
    activeSets,
    loading,
    createRoutine,
    deleteRoutine,
    startSession,
    completeSet,
    finishSession,
    cancelSession,
    reload: () => Promise.all([loadRoutines(), loadSessions()]),
  };
};
