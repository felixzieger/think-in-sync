import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";

interface ActionButtonsProps {
  isCorrect: boolean;
  onNextRound: () => void;
  onGameReview: () => void;
  currentScore: number;
  avgWordsPerRound: number;
  sessionId: string;
  currentTheme: string;
}

export const ActionButtons = ({
  isCorrect,
  onNextRound,
  onGameReview,
}: ActionButtonsProps) => {
  const t = useTranslation();

  return (
    <div className="flex justify-center gap-4">
      <Button onClick={onNextRound} className="text-white">
        {isCorrect ? t.game.nextRound : t.game.nextWord} ⏎
      </Button>
    </div>
  );
};