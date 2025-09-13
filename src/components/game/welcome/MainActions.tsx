import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/useTranslation";

interface MainActionsProps {
  onStartDaily: () => void;
  onStartNew: () => void;
  onShowHowToPlay: () => void;
  onShowHighScores: () => void;
}

export const MainActions = ({ onStartDaily: onStartDaily, onStartNew: onStartNew, onShowHowToPlay, onShowHighScores }: MainActionsProps) => {
  const t = useTranslation();

  return (
    <div className="space-y-4">
      <Button
        onClick={onStartDaily}
        className="w-full bg-primary text-lg hover:bg-primary/90"
      >
        {t.welcome.startDailyButton} ⏎
      </Button>
      <Button
        onClick={onStartNew}
        className="w-full bg-secondary text-lg hover:bg-secondary/90"
      >
        {t.welcome.startNewButton}
      </Button>
      <div className="grid grid-cols-2 gap-4">
        <Button
          onClick={onShowHowToPlay}
          variant="outline"
          className="text-lg !hover:bg-primary !hover:text-primary-foreground"
        >
          {t.welcome.howToPlay} 📖
        </Button>
        <Button
          onClick={onShowHighScores}
          variant="outline"
          className="text-lg !hover:bg-primary !hover:text-primary-foreground"
        >
          {t.welcome.leaderboard} 🏆
        </Button>
      </div>
    </div>
  );
};
