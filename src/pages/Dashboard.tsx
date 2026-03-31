import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { toast } from "sonner";
import {
  LogOut, Activity, TrendingUp, MessageSquare, User as UserIcon,
  BookOpen, Moon, Sun, Menu, BarChart3, Zap, Trophy,
} from "lucide-react";
import { useTheme } from "next-themes";
import NutritionTracker from "@/components/dashboard/NutritionTracker";
import AICoach from "@/components/dashboard/AICoach";
import ProfileSetup from "@/components/dashboard/ProfileSetup";
import WorkoutRecommendations from "@/components/dashboard/WorkoutRecommendations";
import MentalWellnessTab from "@/components/dashboard/MentalWellnessTab";
import StreakTracker from "@/components/dashboard/StreakTracker";
import ProgressCharts from "@/components/dashboard/ProgressCharts";
import GamificationTab from "@/components/dashboard/GamificationTab";
import XPBar from "@/components/dashboard/XPBar";
import { useGamification } from "@/hooks/useGamification";
import WaterIntakeTracker from "@/components/dashboard/WaterIntakeTracker";
import CommunityLeaderboard from "@/components/dashboard/CommunityLeaderboard";

const Dashboard = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasProfile, setHasProfile] = useState(false);
  const [profileName, setProfileName] = useState("");
  const userId = user?.id || "";
  const gamification = useGamification(userId);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        navigate("/auth");
        return;
      }

      setUser(session.user);

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .maybeSingle();

      setHasProfile(!!profile);
      setProfileName(profile?.full_name || "");
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

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <Activity className="w-10 h-10 text-primary animate-pulse" />
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!hasProfile) {
    return <ProfileSetup userId={user?.id || ""} onComplete={() => setHasProfile(true)} />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-md">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-bold leading-tight">FitTrack AI</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">Your intelligent fitness companion</p>
            </div>
          </div>
          <div className="hidden sm:block">
            <XPBar xp={gamification.xp} level={gamification.level} />
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Settings & Stats</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-6">
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Theme</h3>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  >
                    <Sun className="h-4 w-4 mr-2 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-4 w-4 ml-2 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="ml-6">{theme === "dark" ? "Switch to Light" : "Switch to Dark"}</span>
                  </Button>
                </div>

                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Your Streaks</h3>
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

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Welcome Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/15 via-primary/5 to-transparent border p-6 md:p-8">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="relative">
            <p className="text-sm font-medium text-primary">{getGreeting()}</p>
            <h2 className="text-2xl md:text-3xl font-bold mt-1">
              {profileName || "Champion"} 💪
            </h2>
            <p className="text-muted-foreground mt-1 text-sm max-w-md">
              Track your nutrition, crush workouts, and watch your progress unfold. Every day is a step closer to your goals.
            </p>
          </div>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="insights" className="w-full">
          <TabsList className="grid w-full grid-cols-9 mb-6 h-auto p-1">
            {[
              { value: "insights", icon: BarChart3, label: "Insights" },
              { value: "rewards", icon: Trophy, label: "Rewards" },
              { value: "leaderboard", icon: UserIcon, label: "Rankings" },
              { value: "tracker", icon: Activity, label: "Tracker" },
              { value: "water", icon: Zap, label: "Water" },
              { value: "workouts", icon: TrendingUp, label: "Workouts" },
              { value: "wellness", icon: BookOpen, label: "Mind" },
              { value: "coach", icon: MessageSquare, label: "AI Coach" },
              { value: "profile", icon: UserIcon, label: "Profile" },
            ].map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value} className="flex flex-col sm:flex-row items-center gap-1 py-2 text-xs sm:text-sm">
                <tab.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="insights" className="space-y-6">
            <ProgressCharts userId={userId} />
          </TabsContent>

          <TabsContent value="rewards" className="space-y-6">
            <GamificationTab
              xp={gamification.xp}
              level={gamification.level}
              achievements={gamification.achievements}
              unlockedAchievements={gamification.unlockedAchievements}
              dailyChallenges={gamification.dailyChallenges}
              onRefreshChallenges={gamification.refreshChallenges}
              onCheckAchievements={gamification.checkAndUnlockAchievements}
              loading={gamification.loading}
            />
          </TabsContent>

          <TabsContent value="tracker" className="space-y-6">
            <NutritionTracker userId={userId} />
          </TabsContent>

          <TabsContent value="workouts" className="space-y-6">
            <WorkoutRecommendations userId={userId} />
          </TabsContent>

          <TabsContent value="wellness" className="space-y-6">
            <MentalWellnessTab userId={userId} />
          </TabsContent>

          <TabsContent value="coach" className="space-y-6">
            <AICoach userId={userId} />
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <ProfileSetup userId={userId} onComplete={() => toast.success("Profile updated!")} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;
