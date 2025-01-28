import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { HighScoreBoard } from "@/components/HighScoreBoard";
import { useState, useEffect } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { supabase } from "@/integrations/supabase/client";
import { House } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface GuessDisplayProps {
  sentence: string[];
  aiGuess: string;
  currentWord: string;
  onNextRound: () => void;
  onPlayAgain: () => void;
  onBack?: () => void;
  currentScore: number;
  avgWordsPerRound: number;
  sessionId: string;
}

export const GuessDisplay = ({
  sentence,
  aiGuess,
  currentWord,
  onNextRound,
  onPlayAgain,
  onBack,
  currentScore,
  avgWordsPerRound,
  sessionId,
}: GuessDisplayProps) => {
  const isGuessCorrect = () => aiGuess.toLowerCase() === currentWord.toLowerCase();
  const isCheating = () => aiGuess === 'CHEATING';
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [hasSubmittedScore, setHasSubmittedScore] = useState(false);
  const t = useTranslation();

  useEffect(() => {
    const saveGameResult = async () => {
      try {
        const { error } = await supabase
          .from('game_results')
          .insert({
            target_word: currentWord,
            description: sentence.join(' '),
            ai_guess: aiGuess,
            is_correct: isGuessCorrect(),
            session_id: sessionId
          });

        if (error) {
          console.error('Error saving game result:', error);
        } else {
          console.log('Game result saved successfully');
        }
      } catch (error) {
        console.error('Error in saveGameResult:', error);
      }
    };

    saveGameResult();
  }, []); 

  const handleHomeClick = () => {
    if (currentScore > 0 && !hasSubmittedScore) {
      setShowConfirmDialog(true);
    } else {
      onBack?.();
    }
  };

  const handleScoreSubmitted = () => {
    setHasSubmittedScore(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center relative space-y-6"
    >
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleHomeClick}
          className="text-gray-600 hover:text-primary"
        >
          <House className="h-5 w-5" />
        </Button>
        <h2 className="text-2xl font-semibold text-gray-900">Think in Sync</h2>
        <div className="bg-primary/10 px-3 py-1 rounded-lg">
          <span className="text-sm font-medium text-primary">
            {t.game.round} {currentScore + 1}
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-sm text-gray-600">{t.guess.goalDescription}</p>
        <div className="overflow-hidden rounded-lg bg-secondary/10">
          <p className="p-4 text-2xl font-bold tracking-wider text-secondary">
            {currentWord}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-sm text-gray-600">{t.guess.providedDescription}</p>
        <div className="rounded-lg bg-gray-50">
          <p className="p-4 text-2xl tracking-wider text-gray-800">
            {sentence.join(" ")}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-sm text-gray-600">
          {isCheating() ? t.guess.cheatingDetected : t.guess.aiGuessedDescription}
        </p>
        <div className={`rounded-lg ${isGuessCorrect() ? 'bg-green-50' : 'bg-red-50'}`}>
          <p className={`p-4 text-2xl font-bold tracking-wider ${isGuessCorrect() ? 'text-green-600' : 'text-red-600'}`}>
            {aiGuess}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {isGuessCorrect() ? (
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
                  onScoreSubmitted={handleScoreSubmitted}
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

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t.game.leaveGameTitle}</AlertDialogTitle>
            <AlertDialogDescription>
              {t.game.leaveGameDescription}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t.game.cancel}</AlertDialogCancel>
            <AlertDialogAction onClick={() => onBack?.()}>
              {t.game.confirm}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
};