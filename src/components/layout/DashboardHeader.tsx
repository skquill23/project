import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { LogOut, Moon, Sun, Settings, Flame } from "lucide-react";
import { useTheme } from "next-themes";
import StreakTracker from "@/components/dashboard/StreakTracker";
import XPBar from "@/components/dashboard/XPBar";

interface DashboardHeaderProps {
  profileName: string;
  userId: string;
  xp: number;
  level: number;
  onSignOut: () => void;
}

const DashboardHeader = ({ profileName, userId, xp, level, onSignOut }: DashboardHeaderProps) => {
  const { theme, setTheme } = useTheme();

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

        <div className="flex items-center gap-2">
          <div className="hidden md:block">
            <XPBar xp={xp} level={level} />
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="rounded-xl text-muted-foreground hover:text-foreground"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <Sun className="h-[18px] w-[18px] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[18px] w-[18px] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-xl text-muted-foreground hover:text-foreground">
                <Settings className="h-[18px] w-[18px]" />
              </Button>
            </SheetTrigger>
            <SheetContent className="glass-strong">
              <SheetHeader>
                <SheetTitle className="text-lg font-bold">Settings</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-6">
                <div className="space-y-3">
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                    <Flame className="w-3.5 h-3.5" />
                    Streaks
                  </h3>
                  <StreakTracker userId={userId} />
                </div>

                <div className="pt-4 border-t border-border/50">
                  <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10" onClick={onSignOut}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
