import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWellness } from "@/hooks/useWellness";
import { Activity, Brain, Moon, Zap } from "lucide-react";
import MoodTracker from "./MoodTracker";
import SleepLogger from "./SleepLogger";
import VitalScores from "./VitalScores";
import WellnessDashboard from "./WellnessDashboard";
import WellnessArticles from "./WellnessArticles";

interface MentalWellnessTabProps { userId: string; }

const MentalWellnessTab = ({ userId }: MentalWellnessTabProps) => {
  const { logs, todayLog, insights, loading, saveLog } = useWellness(userId);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Brain className="w-5 h-5 text-primary animate-pulse" />
          </div>
          <p className="text-sm text-muted-foreground">Loading wellness data...</p>
        </div>
      </div>
    );
  }

  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="grid w-full grid-cols-5 mb-4 rounded-xl">
        {[
          { value: "overview", icon: Activity, label: "Overview" },
          { value: "mood", icon: Brain, label: "Mood" },
          { value: "sleep", icon: Moon, label: "Sleep" },
          { value: "vitals", icon: Zap, label: "Vitals" },
          { value: "learn", icon: Brain, label: "Learn" },
        ].map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value} className="rounded-lg flex items-center gap-1.5 text-xs sm:text-sm">
            <tab.icon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{tab.label}</span>
          </TabsTrigger>
        ))}
      </TabsList>
      <TabsContent value="overview"><WellnessDashboard insights={insights} logs={logs} /></TabsContent>
      <TabsContent value="mood"><MoodTracker todayLog={todayLog} onSave={saveLog} /></TabsContent>
      <TabsContent value="sleep"><SleepLogger todayLog={todayLog} onSave={saveLog} /></TabsContent>
      <TabsContent value="vitals"><VitalScores todayLog={todayLog} onSave={saveLog} /></TabsContent>
      <TabsContent value="learn"><WellnessArticles /></TabsContent>
    </Tabs>
  );
};

export default MentalWellnessTab;
