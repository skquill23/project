
-- Water intake logs table
CREATE TABLE public.water_intake (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  amount_ml INTEGER NOT NULL DEFAULT 250,
  logged_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.water_intake ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own water intake" ON public.water_intake FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own water intake" ON public.water_intake FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own water intake" ON public.water_intake FOR DELETE USING (auth.uid() = user_id);

-- Leaderboard profiles table (anonymous display names for privacy)
CREATE TABLE public.leaderboard_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  display_name TEXT NOT NULL DEFAULT 'Anonymous Athlete',
  avatar_emoji TEXT NOT NULL DEFAULT '🏃',
  is_visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.leaderboard_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view visible leaderboard profiles" ON public.leaderboard_profiles FOR SELECT USING (is_visible = true);
CREATE POLICY "Users can insert own leaderboard profile" ON public.leaderboard_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own leaderboard profile" ON public.leaderboard_profiles FOR UPDATE USING (auth.uid() = user_id);

-- Allow reading user_xp for leaderboard (already has RLS for own user, add public read for leaderboard)
CREATE POLICY "Anyone can view xp for leaderboard" ON public.user_xp FOR SELECT USING (true);
-- Drop the old restrictive select policy
DROP POLICY IF EXISTS "Users can view own xp" ON public.user_xp;

-- Enable realtime for leaderboard
ALTER PUBLICATION supabase_realtime ADD TABLE public.leaderboard_profiles;
