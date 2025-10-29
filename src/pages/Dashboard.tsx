import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { toast } from "sonner";
import { LogOut, Activity, TrendingUp, MessageSquare, User as UserIcon, BookOpen, Moon, Sun, Menu } from "lucide-react";
import { useTheme } from "next-themes";
import NutritionTracker from "@/components/dashboard/NutritionTracker";
import AICoach from "@/components/dashboard/AICoach";
import ProfileSetup from "@/components/dashboard/ProfileSetup";
import WorkoutRecommendations from "@/components/dashboard/WorkoutRecommendations";
import WellnessArticles from "@/components/dashboard/WellnessArticles";
import StreakTracker from "@/components/dashboard/StreakTracker";

const Dashboard = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasProfile, setHasProfile] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }

      setUser(session.user);

      // Check if user has a profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .maybeSingle();

      setHasProfile(!!profile);
      setLoading(false);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out successfully");
    navigate("/auth");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!hasProfile) {
    return <ProfileSetup userId={user?.id || ""} onComplete={() => setHasProfile(true)} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold">FitTrack AI</h1>
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Settings & Stats</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-6">
                <div className="space-y-3">
                  <h3 className="text-sm font-medium">Theme</h3>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  >
                    <Sun className="h-4 w-4 mr-2 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-4 w-4 ml-2 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="ml-6">Toggle theme</span>
                  </Button>
                </div>

                <div className="space-y-3">
                  <h3 className="text-sm font-medium">Your Streaks</h3>
                  <StreakTracker userId={user?.id || ""} />
                </div>

                <div className="pt-4 border-t">
                  <Button variant="destructive" className="w-full" onClick={handleSignOut}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="tracker" className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="tracker">
              <Activity className="w-4 h-4 mr-2" />
              Tracker
            </TabsTrigger>
            <TabsTrigger value="workouts">
              <TrendingUp className="w-4 h-4 mr-2" />
              Workouts
            </TabsTrigger>
            <TabsTrigger value="wellness">
              <BookOpen className="w-4 h-4 mr-2" />
              Wellness
            </TabsTrigger>
            <TabsTrigger value="coach">
              <MessageSquare className="w-4 h-4 mr-2" />
              AI Coach
            </TabsTrigger>
            <TabsTrigger value="profile">
              <UserIcon className="w-4 h-4 mr-2" />
              Profile
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tracker" className="space-y-6">
            <NutritionTracker userId={user?.id || ""} />
          </TabsContent>

          <TabsContent value="workouts" className="space-y-6">
            <WorkoutRecommendations userId={user?.id || ""} />
          </TabsContent>

          <TabsContent value="wellness" className="space-y-6">
            <WellnessArticles />
          </TabsContent>

          <TabsContent value="coach" className="space-y-6">
            <AICoach userId={user?.id || ""} />
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <ProfileSetup userId={user?.id || ""} onComplete={() => toast.success("Profile updated!")} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;
