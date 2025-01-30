import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RoundHeader } from "./sentence-builder/RoundHeader";
import { WordDisplay } from "./sentence-builder/WordDisplay";
import { GuessDescription } from "./guess-display/GuessDescription";
import { GuessResult } from "./guess-display/GuessResult";
import { ActionButtons } from "./guess-display/ActionButtons";
import { HighScoreBoard } from "@/components/HighScoreBoard";

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
  currentTheme: string;
  onHighScoreDialogChange?: (isOpen: boolean) => void;
  normalizeWord: (word: string) => string;
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
  currentTheme,
  onHighScoreDialogChange,
  normalizeWord,
}: GuessDisplayProps) => {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [hasSubmittedScore, setHasSubmittedScore] = useState(false);
  const [showHighScores, setShowHighScores] = useState(false);
  const t = useTranslation();

  useEffect(() => {
    onHighScoreDialogChange?.(showHighScores);
  }, [showHighScores, onHighScoreDialogChange]);

  const handleSetShowConfirmDialog = (show: boolean) => {
    setShowConfirmDialog(show);
  };

  const isGuessCorrect = () => normalizeWord(aiGuess) === normalizeWord(currentWord);

  const handleScoreSubmitted = () => {
    setHasSubmittedScore(true);
  };

  const handleShowHighScores = () => {
    setShowHighScores(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center relative space-y-6"
    >
      <RoundHeader
        successfulRounds={currentScore}
        onBack={onBack}
        showConfirmDialog={showConfirmDialog}
        setShowConfirmDialog={handleSetShowConfirmDialog}
      />

      <WordDisplay currentWord={currentWord} />

      <GuessDescription sentence={sentence} aiGuess={aiGuess} />

      <GuessResult 
        aiGuess={aiGuess} 
        isCorrect={isGuessCorrect()} 
        onNextRound={onNextRound}
      />

      <ActionButtons
        isCorrect={isGuessCorrect()}
        onNextRound={onNextRound}
        onPlayAgain={onPlayAgain}
        currentScore={currentScore}
        avgWordsPerRound={avgWordsPerRound}
        sessionId={sessionId}
        currentTheme={currentTheme}
        onScoreSubmitted={handleScoreSubmitted}
        onShowHighScores={handleShowHighScores}
      />

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
            onScoreSubmitted={handleScoreSubmitted}
          />
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};