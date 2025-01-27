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

interface GuessDisplayProps {
  sentence: string[];
  aiGuess: string;
  currentWord: string;
  onNextRound: () => void;
  onPlayAgain: () => void;
  currentScore: number;
  avgWordsPerRound: number;
}

export const GuessDisplay = ({
  sentence,
  aiGuess,
  currentWord,
  onNextRound,
  onPlayAgain,
  currentScore,
  avgWordsPerRound,
}: GuessDisplayProps) => {
  const isGuessCorrect = () => aiGuess.toLowerCase() === currentWord.toLowerCase();
  const isCheating = () => aiGuess === 'CHEATING';
  const [isDialogOpen, setIsDialogOpen] = useState(false);
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
            is_correct: isGuessCorrect()
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center relative space-y-6"
    >
      <div className="absolute right-0 top-0 bg-primary/10 px-3 py-1 rounded-lg">
        <span className="text-sm font-medium text-primary">
          {t.game.round} {currentScore + 1}
        </span>
      </div>

      <div>
        <h2 className="mb-4 text-2xl font-semibold text-gray-900">Think in Sync</h2>

        <div className="space-y-2">
          <p className="text-sm text-gray-600">{t.guess.goalDescription}</p>
          <div className="overflow-hidden rounded-lg bg-secondary/10">
            <p className="p-4 text-2xl font-bold tracking-wider text-secondary">
              {currentWord}
            </p>
          </div>
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
    </motion.div>
  );
};