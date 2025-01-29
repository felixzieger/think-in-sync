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
}: ActionButtonsProps) => {
  const [showHighScores, setShowHighScores] = useState(false);
  const t = useTranslation();

  return (
    <>
      <div className="flex justify-center gap-4">
        {isCorrect ? (
          <Button onClick={onNextRound}>{t.game.nextRound}</Button>
        ) : (
          <>
            <Button onClick={onPlayAgain} variant="secondary">
              {t.game.playAgain} ⏎
            </Button>
            <Button onClick={() => setShowHighScores(true)}>
              {t.game.saveScore}
            </Button>
          </>
        )}
      </div>

      <Dialog open={showHighScores} onOpenChange={setShowHighScores}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
          <HighScoreBoard
            currentScore={currentScore}
            avgWordsPerRound={avgWordsPerRound}
            onClose={() => setShowHighScores(false)}
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