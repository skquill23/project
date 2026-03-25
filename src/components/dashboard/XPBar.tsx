import { getXPProgress, getLevelTitle } from "@/hooks/useGamification";
import { Zap } from "lucide-react";

interface XPBarProps {
  xp: number;
  level: number;
}

const XPBar = ({ xp, level }: XPBarProps) => {
  const { progress, xpInLevel, xpNeeded } = getXPProgress(xp);
  const title = getLevelTitle(level);

  return (
    <div className="flex items-center gap-3 w-full max-w-xs">
      <div className="relative flex-shrink-0 w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center border-2 border-primary/30">
        <span className="text-xs font-bold text-primary">{level}</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-0.5">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground truncate">
            {title}
          </span>
          <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
            <Zap className="w-2.5 h-2.5 text-primary" />
            {xpInLevel}/{xpNeeded}
          </span>
        </div>
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-chart-2 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default XPBar;
