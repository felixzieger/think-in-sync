import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { HighScoreBoard } from "@/components/HighScoreBoard";
import { useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";

interface ActionButtonsProps {
  isCorrect: boolean;
  onNextRound: () => void;
  onPlayAgain: () => void;
  currentScore: number;
  avgWordsPerRound: number;
  sessionId: string;
  onScoreSubmitted: () => void;
}

export const ActionButtons = ({
  isCorrect,
  onNextRound,
  onPlayAgain,
  currentScore,
  avgWordsPerRound,
  sessionId,
  onScoreSubmitted,
}: ActionButtonsProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const t = useTranslation();

  return (
    <div className="flex flex-col gap-4">
      {isCorrect ? (
        <Button
          onClick={onNextRound}
          className="w-full bg-primary text-lg hover:bg-primary/90"
        >
          {t.guess.nextRound} ⏎
        </Button>
      ) : (
        <>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                className="w-full bg-secondary text-lg hover:bg-secondary/90"
              >
                {t.guess.viewLeaderboard} 🏆
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md bg-white">
              <HighScoreBoard
                currentScore={currentScore}
                avgWordsPerRound={avgWordsPerRound}
                onClose={() => setIsDialogOpen(false)}
                onPlayAgain={() => {
                  setIsDialogOpen(false);
                  onPlayAgain();
                }}
                sessionId={sessionId}
                onScoreSubmitted={onScoreSubmitted}
              />
            </DialogContent>
          </Dialog>
          <Button
            onClick={onPlayAgain}
            className="w-full bg-primary text-lg hover:bg-primary/90"
          >
            {t.guess.playAgain} ⏎
          </Button>
        </>
      )}
    </div>
  );
};