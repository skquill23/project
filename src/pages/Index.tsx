import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Zap, Sparkles, TrendingUp, Activity, ArrowRight } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) navigate("/dashboard");
    };
    checkAuth();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full -translate-y-1/2 blur-3xl" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-accent/5 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl" />

      <nav className="container mx-auto px-4 py-6 flex justify-between items-center relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center glow-primary">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-extrabold tracking-tight">FitTrack AI</span>
        </div>
        <Button onClick={() => navigate("/auth")} className="gradient-primary text-white rounded-xl px-6">
          Get Started
        </Button>
      </nav>

      <main className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm font-medium text-primary">
            <Sparkles className="w-4 h-4" />
            AI-Powered Fitness Platform
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter leading-[0.9]">
            Your Smart Fitness
            <br />
            <span className="gradient-text">Companion</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Track meals with AI, crush custom workouts, battle friends for XP, and get personalized coaching — all in one sleek platform.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button size="lg" onClick={() => navigate("/auth")} className="text-base gradient-primary text-white rounded-xl px-8 h-12 glow-primary">
              Start Your Journey
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-6 pt-16">
            {[
              { icon: Sparkles, title: "AI Meal Tracking", desc: "Describe your food and AI auto-logs calories, macros, and nutrition data", color: "primary" },
              { icon: TrendingUp, title: "Custom Workouts", desc: "Build routines, track sets & reps with rest timers, and monitor progress", color: "accent" },
              { icon: Activity, title: "AI Fitness Coach", desc: "Get personalized advice from your virtual coach powered by advanced AI", color: "success" },
            ].map((item) => (
              <div key={item.title} className="p-6 rounded-2xl glass card-hover group">
                <div className={`w-12 h-12 rounded-xl bg-${item.color}/10 flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}>
                  <item.icon className={`w-6 h-6 text-${item.color}`} />
                </div>
                <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
