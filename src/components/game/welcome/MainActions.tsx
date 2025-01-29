import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/useTranslation";

interface MainActionsProps {
  onStart: () => void;
  onShowHowToPlay: () => void;
  onShowHighScores: () => void;
}

export const MainActions = ({ onStart, onShowHowToPlay, onShowHighScores }: MainActionsProps) => {
  const t = useTranslation();
  
  return (
    <div className="space-y-4">
      <Button
        onClick={onStart}
        className="w-full bg-primary text-lg hover:bg-primary/90"
      >
        {t.welcome.startButton} ⏎
      </Button>
      <div className="grid grid-cols-2 gap-4">
        <Button
          onClick={onShowHowToPlay}
          variant="outline"
          className="text-lg"
        >
          {t.welcome.howToPlay} 📖
        </Button>
        <Button
          onClick={onShowHighScores}
          variant="outline"
          className="text-lg"
        >
          {t.welcome.leaderboard} 🏆
        </Button>
      </div>
    </div>
  );
};