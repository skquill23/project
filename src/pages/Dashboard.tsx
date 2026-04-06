import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { toast } from "sonner";
import { Activity } from "lucide-react";
import { SidebarProvider } from "@/components/ui/sidebar";
import DashboardSidebar from "@/components/layout/DashboardSidebar";
import DashboardHeader from "@/components/layout/DashboardHeader";
import NutritionTracker from "@/components/dashboard/NutritionTracker";
import AICoach from "@/components/dashboard/AICoach";
import ProfileSetup from "@/components/dashboard/ProfileSetup";
import WorkoutBuilder from "@/components/dashboard/WorkoutBuilder";
import MentalWellnessTab from "@/components/dashboard/MentalWellnessTab";
import ProgressCharts from "@/components/dashboard/ProgressCharts";
import GamificationTab from "@/components/dashboard/GamificationTab";
import { useGamification } from "@/hooks/useGamification";
import WaterIntakeTracker from "@/components/dashboard/WaterIntakeTracker";
import CommunityLeaderboard from "@/components/dashboard/CommunityLeaderboard";
import SocialChallenges from "@/components/dashboard/SocialChallenges";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasProfile, setHasProfile] = useState(false);
  const [profileName, setProfileName] = useState("");
  const [activeTab, setActiveTab] = useState("insights");
  const userId = user?.id || "";
  const gamification = useGamification(userId);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate("/auth"); return; }
      setUser(session.user);

      const { data: profile } = await supabase
        .from("profiles").select("*").eq("id", session.user.id).maybeSingle();

      setHasProfile(!!profile);
      setProfileName(profile?.full_name || "");
      setLoading(false);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) { navigate("/auth"); } else { setUser(session.user); }
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
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center glow-primary">
            <Activity className="w-6 h-6 text-white animate-pulse" />
          </div>
          <p className="text-sm text-muted-foreground font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!hasProfile) {
    return <ProfileSetup userId={userId} onComplete={() => setHasProfile(true)} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case "insights": return <ProgressCharts userId={userId} />;
      case "rewards": return (
        <GamificationTab
          xp={gamification.xp} level={gamification.level}
          achievements={gamification.achievements}
          unlockedAchievements={gamification.unlockedAchievements}
          dailyChallenges={gamification.dailyChallenges}
          onRefreshChallenges={gamification.refreshChallenges}
          onCheckAchievements={gamification.checkAndUnlockAchievements}
          loading={gamification.loading}
        />
      );
      case "leaderboard": return <CommunityLeaderboard userId={userId} />;
      case "social": return <SocialChallenges userId={userId} />;
      case "tracker": return <NutritionTracker userId={userId} />;
      case "water": return <WaterIntakeTracker userId={userId} />;
      case "workouts": return <WorkoutBuilder userId={userId} />;
      case "wellness": return <MentalWellnessTab userId={userId} />;
      case "coach": return <AICoach userId={userId} />;
      case "profile": return <ProfileSetup userId={userId} onComplete={() => toast.success("Profile updated!")} />;
      default: return <ProgressCharts userId={userId} />;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <DashboardSidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          xp={gamification.xp}
          level={gamification.level}
        />
        <div className="flex-1 flex flex-col min-w-0">
          <DashboardHeader
            profileName={profileName}
            userId={userId}
            xp={gamification.xp}
            level={gamification.level}
            onSignOut={handleSignOut}
          />
          <main className="flex-1 p-4 lg:p-6 overflow-auto scrollbar-thin">
            <div className="max-w-6xl mx-auto">
              {renderContent()}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
