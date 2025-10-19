import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Activity, Sparkles, TrendingUp, Zap } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/dashboard");
      }
    };
    checkAuth();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10">
      <nav className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Activity className="w-8 h-8 text-primary" />
          <span className="text-2xl font-bold">FitTrack AI</span>
        </div>
        <Button onClick={() => navigate("/auth")}>Get Started</Button>
      </nav>

      <main className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            AI-Powered Fitness Tracking
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            Your Smart Fitness
            <br />
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Companion
            </span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Track meals with AI, get personalized workout recommendations, and chat with your
            virtual fitness coach. No manual entry required—just describe your food and let AI do
            the rest.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button size="lg" onClick={() => navigate("/auth")} className="text-lg">
              Start Your Journey
              <Zap className="w-5 h-5 ml-2" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/auth")}>
              Learn More
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-8 pt-16">
            <div className="p-6 rounded-2xl bg-card border-2 border-border hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 mx-auto">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">AI Meal Analysis</h3>
              <p className="text-muted-foreground">
                Simply describe your meal and AI automatically logs calories, macros, and nutrition
                data
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-card border-2 border-border hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-4 mx-auto">
                <TrendingUp className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-2">Smart Workouts</h3>
              <p className="text-muted-foreground">
                Get personalized workout recommendations based on your goals and fitness level
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-card border-2 border-border hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center mb-4 mx-auto">
                <Activity className="w-6 h-6 text-success" />
              </div>
              <h3 className="text-xl font-bold mb-2">AI Fitness Coach</h3>
              <p className="text-muted-foreground">
                Chat with your virtual coach for personalized advice on nutrition and wellness
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
