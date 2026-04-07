import { SidebarTrigger } from "@/components/ui/sidebar";
import { Flame } from "lucide-react";
import StreakTracker from "@/components/dashboard/StreakTracker";
import XPBar from "@/components/dashboard/XPBar";

interface DashboardHeaderProps {
  profileName: string;
  userId: string;
  xp: number;
  level: number;
  onSignOut: () => void;
}

const DashboardHeader = ({ profileName, userId, xp, level }: DashboardHeaderProps) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <header className="sticky top-0 z-50 glass-strong">
      <div className="flex items-center justify-between px-4 lg:px-6 h-16">
        <div className="flex items-center gap-3">
          <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
          <div className="hidden sm:block">
            <p className="text-sm text-muted-foreground">{getGreeting()},</p>
            <p className="text-sm font-semibold -mt-0.5">{profileName || "Champion"}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-3">
            <StreakTracker userId={userId} />
          </div>

          <div className="hidden md:block">
            <XPBar xp={xp} level={level} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
