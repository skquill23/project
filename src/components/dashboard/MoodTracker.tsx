import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { WellnessLog } from "@/hooks/useWellness";

const MOODS = [
  { score: 1, emoji: "😞", label: "Terrible", color: "bg-destructive/20 text-destructive border-destructive/30" },
  { score: 2, emoji: "😔", label: "Bad", color: "bg-warning/20 text-warning border-warning/30" },
  { score: 3, emoji: "😐", label: "Okay", color: "bg-muted text-muted-foreground border-border" },
  { score: 4, emoji: "😊", label: "Good", color: "bg-primary/20 text-primary border-primary/30" },
  { score: 5, emoji: "🤩", label: "Amazing", color: "bg-success/20 text-success border-success/30" },
];

const QUICK_TAGS = [
  "Energized", "Calm", "Anxious", "Focused", "Tired", "Happy",
  "Stressed", "Motivated", "Grateful", "Restless", "Confident", "Overwhelmed",
];

interface MoodTrackerProps {
  todayLog: WellnessLog | null;
  onSave: (data: Partial<WellnessLog>) => Promise<void>;
}

const MoodTracker = ({ todayLog, onSave }: MoodTrackerProps) => {
  const [selectedMood, setSelectedMood] = useState<number>(todayLog?.mood_score || 0);
  const [selectedTags, setSelectedTags] = useState<string[]>(todayLog?.tags || []);
  const [notes, setNotes] = useState(todayLog?.notes || "");
  const [saving, setSaving] = useState(false);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSave = async () => {
    if (!selectedMood) return;
    setSaving(true);
    await onSave({
      mood_score: selectedMood,
      tags: selectedTags,
      notes: notes || null,
    });
    setSaving(false);
  };

  return (
    <Card className="border-primary/10">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <span className="text-2xl">🧠</span>
          How are you feeling today?
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Mood Selector */}
        <div className="flex justify-between gap-2">
          {MOODS.map((mood) => (
            <button
              key={mood.score}
              onClick={() => setSelectedMood(mood.score)}
              className={`flex-1 flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all duration-200 hover:scale-105 ${
                selectedMood === mood.score
                  ? mood.color + " scale-105 shadow-md"
                  : "border-transparent bg-muted/50 hover:bg-muted"
              }`}
            >
              <span className="text-3xl">{mood.emoji}</span>
              <span className="text-xs font-medium">{mood.label}</span>
            </button>
          ))}
        </div>

        {/* Quick Tags */}
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-2">What's influencing your mood?</p>
          <div className="flex flex-wrap gap-2">
            {QUICK_TAGS.map((tag) => (
              <Badge
                key={tag}
                variant={selectedTags.includes(tag) ? "default" : "outline"}
                className={`cursor-pointer transition-all hover:scale-105 ${
                  selectedTags.includes(tag) ? "bg-primary text-primary-foreground" : ""
                }`}
                onClick={() => toggleTag(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-2">Journal (optional)</p>
          <Textarea
            placeholder="Write about your day, thoughts, or reflections..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="resize-none min-h-[80px]"
            maxLength={1000}
          />
        </div>

        <Button
          onClick={handleSave}
          disabled={!selectedMood || saving}
          className="w-full"
        >
          {saving ? "Saving..." : todayLog?.mood_score ? "Update Mood" : "Log Mood"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default MoodTracker;
