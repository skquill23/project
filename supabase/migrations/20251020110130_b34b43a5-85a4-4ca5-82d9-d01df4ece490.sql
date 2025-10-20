-- Create workout exercises table to store user's selected exercises for their workout split
CREATE TABLE public.workout_exercises (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  exercise_name TEXT NOT NULL,
  exercise_type TEXT NOT NULL,
  is_selected BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.workout_exercises ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own workout exercises" 
ON public.workout_exercises 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own workout exercises" 
ON public.workout_exercises 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own workout exercises" 
ON public.workout_exercises 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own workout exercises" 
ON public.workout_exercises 
FOR DELETE 
USING (auth.uid() = user_id);

-- Add trigger for automatic timestamp updates
CREATE TRIGGER update_workout_exercises_updated_at
BEFORE UPDATE ON public.workout_exercises
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();