import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { HighScoreBoard } from "../../HighScoreBoard";

interface ActionButtonsProps {
  isCorrect: boolean;
  onNextRound: () => void;
  onPlayAgain: () => void;
  currentScore: number;
  avgWordsPerRound: number;
  sessionId: string;
  currentTheme: string;
  onScoreSubmitted?: () => void;
  onHighScoreDialogChange?: (isOpen: boolean) => void;
}

export const ActionButtons = ({
  isCorrect,
  onNextRound,
  onPlayAgain,
  currentScore,
  avgWordsPerRound,
  sessionId,
  currentTheme,
  onScoreSubmitted,
  onHighScoreDialogChange,
}: ActionButtonsProps) => {
  const [showHighScores, setShowHighScores] = useState(false);
  const t = useTranslation();

  const handleShowHighScores = () => {
    setShowHighScores(true);
    onHighScoreDialogChange?.(true);
  };

  const handleCloseHighScores = () => {
    setShowHighScores(false);
    onHighScoreDialogChange?.(false);
  };

  return (
    <>
      <div className="flex justify-center gap-4">
        {isCorrect ? (
          <Button onClick={onNextRound} className="text-white">{t.game.nextRound} ⏎</Button>
        ) : (
          <>
            <Button onClick={onPlayAgain} className="text-white">
              {t.game.playAgain} ⏎
            </Button>
            <Button onClick={handleShowHighScores} variant="secondary" className="text-white">
              {t.game.saveScore}
            </Button>
          </>
        )}
      </div>

      <Dialog open={showHighScores} onOpenChange={handleCloseHighScores}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
          <HighScoreBoard
            currentScore={currentScore}
            avgWordsPerRound={avgWordsPerRound}
            onClose={handleCloseHighScores}
            onPlayAgain={onPlayAgain}
            sessionId={sessionId}
            showThemeFilter={false}
            initialTheme={currentTheme}
            onScoreSubmitted={onScoreSubmitted}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};