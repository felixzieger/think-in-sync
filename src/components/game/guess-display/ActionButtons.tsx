import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";

interface ActionButtonsProps {
  isCorrect: boolean;
  onNextRound: () => void;
  onPlayAgain: () => void;
  currentScore: number;
  avgWordsPerRound: number;
  sessionId: string;
  currentTheme: string;
  onScoreSubmitted?: () => void;
  onShowHighScores: () => void;
}

export const ActionButtons = ({
  isCorrect,
  onNextRound,
  onPlayAgain,
  onShowHighScores,
}: ActionButtonsProps) => {
  const t = useTranslation();

  return (
    <div className="flex justify-center gap-4">
      {isCorrect ? (
        <Button onClick={onNextRound} className="text-white">{t.game.nextRound} ⏎</Button>
      ) : (
        <>
          <Button onClick={onPlayAgain} className="text-white">
            {t.game.playAgain} ⏎
          </Button>
          <Button onClick={onShowHighScores} variant="secondary" className="text-white">
            {t.game.saveScore}
          </Button>
        </>
      )}
    </div>
  );
};