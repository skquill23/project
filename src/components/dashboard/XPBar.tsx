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
      <div className="relative flex-shrink-0 w-9 h-9 rounded-xl gradient-primary flex items-center justify-center">
        <span className="text-xs font-bold text-white">{level}</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground truncate">
            {title}
          </span>
          <span className="text-[10px] text-muted-foreground flex items-center gap-0.5 font-mono">
            <Zap className="w-2.5 h-2.5 text-primary" />
            {xpInLevel}/{xpNeeded}
          </span>
        </div>
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full gradient-primary rounded-full transition-all duration-700 ease-out"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default XPBar;
