import { useLocation } from "react-router-dom";
import {
  BarChart3, Activity, Dumbbell, Brain, MessageSquare,
  Trophy, Users, Droplets, Swords, UserCircle, Zap,
} from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader, SidebarFooter, useSidebar,
} from "@/components/ui/sidebar";
import XPBar from "@/components/dashboard/XPBar";

interface DashboardSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  xp: number;
  level: number;
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
  { value: "profile", icon: UserCircle, label: "Profile" },
];

const DashboardSidebar = ({ activeTab, onTabChange, xp, level }: DashboardSidebarProps) => {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

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
      </SidebarContent>

      <SidebarFooter className="p-4">
        {!collapsed && <XPBar xp={xp} level={level} />}
      </SidebarFooter>
    </Sidebar>
  );
};

export default DashboardSidebar;
