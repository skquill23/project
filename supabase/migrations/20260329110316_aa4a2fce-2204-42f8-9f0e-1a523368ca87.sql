
-- Wellness logs table for mood, sleep, motivation, energy, stress
CREATE TABLE public.wellness_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  log_date DATE NOT NULL DEFAULT CURRENT_DATE,
  mood_score INTEGER CHECK (mood_score >= 1 AND mood_score <= 5),
  sleep_hours NUMERIC(3,1) CHECK (sleep_hours >= 0 AND sleep_hours <= 24),
  sleep_quality INTEGER CHECK (sleep_quality >= 1 AND sleep_quality <= 5),
  motivation_score INTEGER CHECK (motivation_score >= 1 AND motivation_score <= 10),
  energy_level INTEGER CHECK (energy_level >= 1 AND energy_level <= 10),
  stress_level INTEGER CHECK (stress_level >= 1 AND stress_level <= 10),
  notes TEXT,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, log_date)
);

-- Enable RLS
ALTER TABLE public.wellness_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own wellness logs" ON public.wellness_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own wellness logs" ON public.wellness_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own wellness logs" ON public.wellness_logs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own wellness logs" ON public.wellness_logs FOR DELETE USING (auth.uid() = user_id);
