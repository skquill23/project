import {
  BarChart3, Activity, Dumbbell, Brain, MessageSquare,
  Trophy, Users, Droplets, Swords, UserCircle, Zap, LogOut, Moon, Sun, Settings,
} from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader, SidebarFooter, useSidebar,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "next-themes";
import XPBar from "@/components/dashboard/XPBar";

interface DashboardSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  xp: number;
  level: number;
  onSignOut: () => void;
}

const NAV_ITEMS = [
  { value: "insights", icon: BarChart3, label: "Insights" },
  { value: "tracker", icon: Activity, label: "Nutrition" },
  { value: "water", icon: Droplets, label: "Hydration" },
  { value: "workouts", icon: Dumbbell, label: "Workouts" },
  { value: "wellness", icon: Brain, label: "Wellness" },
  { value: "rewards", icon: Trophy, label: "Rewards" },
  { value: "leaderboard", icon: Users, label: "Rankings" },
  { value: "social", icon: Swords, label: "Social" },
  { value: "coach", icon: MessageSquare, label: "AI Coach" },
];

const DashboardSidebar = ({ activeTab, onTabChange, xp, level, onSignOut }: DashboardSidebarProps) => {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { theme, setTheme } = useTheme();

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center shrink-0 glow-primary">
            <Zap className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <h1 className="text-base font-extrabold tracking-tight truncate">FitTrack AI</h1>
              <p className="text-[10px] text-muted-foreground">Smart Fitness Platform</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV_ITEMS.map((item) => {
                const isActive = activeTab === item.value;
                return (
                  <SidebarMenuItem key={item.value}>
                    <SidebarMenuButton
                      onClick={() => onTabChange(item.value)}
                      className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                      tooltip={item.label}
                    >
                      {isActive && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full gradient-primary" />
                      )}
                      <item.icon className={`w-[18px] h-[18px] shrink-0 transition-colors ${
                        isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                      }`} />
                      {!collapsed && <span className="truncate">{item.label}</span>}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {!collapsed && <Separator className="mx-2 my-2 bg-border/50" />}

        <SidebarGroup>
          {!collapsed && <SidebarGroupLabel className="text-[10px] uppercase tracking-widest text-muted-foreground/60 px-3">Account</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => onTabChange("profile")}
                  className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                    activeTab === "profile"
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                  tooltip="Profile"
                >
                  {activeTab === "profile" && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full gradient-primary" />
                  )}
                  <UserCircle className={`w-[18px] h-[18px] shrink-0 ${activeTab === "profile" ? "text-primary" : "text-muted-foreground"}`} />
                  {!collapsed && <span className="truncate">Profile</span>}
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-200"
                  tooltip={theme === "dark" ? "Light Mode" : "Dark Mode"}
                >
                  {theme === "dark" ? (
                    <Sun className="w-[18px] h-[18px] shrink-0" />
                  ) : (
                    <Moon className="w-[18px] h-[18px] shrink-0" />
                  )}
                  {!collapsed && <span className="truncate">{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>}
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={onSignOut}
                  className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/10 hover:text-destructive transition-all duration-200"
                  tooltip="Sign Out"
                >
                  <LogOut className="w-[18px] h-[18px] shrink-0" />
                  {!collapsed && <span className="truncate">Sign Out</span>}
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        {!collapsed && <XPBar xp={xp} level={level} />}
      </SidebarFooter>
    </Sidebar>
  );
};

export default DashboardSidebar;
