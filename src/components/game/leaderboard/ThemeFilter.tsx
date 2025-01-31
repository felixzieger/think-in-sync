import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/useTranslation";
import { Filter } from "lucide-react";

type ViewMode = 'daily' | 'all-time';

interface ThemeFilterProps {
  selectedMode: ViewMode;
  onModeChange: (mode: ViewMode) => void;
}

export const ThemeFilter = ({ selectedMode, onModeChange }: ThemeFilterProps) => {
  const t = useTranslation();

  const modes: ViewMode[] = ['daily', 'all-time'];

  return (
    <div className="flex flex-wrap gap-2 mb-4 items-center">
      <Filter className="h-4 w-4 text-gray-500" />
      {modes.map((mode) => (
        <Button
          key={mode}
          variant={selectedMode === mode ? "default" : "outline"}
          size="sm"
          onClick={() => onModeChange(mode)}
        >
          {t.leaderboard.modes[mode]}
        </Button>
      ))}
    </div>
  );
};