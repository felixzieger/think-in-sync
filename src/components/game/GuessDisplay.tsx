import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { RoundHeader } from "./sentence-builder/RoundHeader";
import { WordDisplay } from "./sentence-builder/WordDisplay";
import { GuessDescription } from "./guess-display/GuessDescription";
import { GuessResult } from "./guess-display/GuessResult";
import { ActionButtons } from "./guess-display/ActionButtons";

interface GuessDisplayProps {
  currentScore: number;
  currentWord: string;
  sentence: string[];
  aiGuess: string;
  avgWordsPerRound: number;
  sessionId: string;
  currentTheme: string;
  onNextRound: () => void;
  onGameReview: () => void;
  onBack?: () => void;
  normalizeWord: (word: string) => string;
}

export const GuessDisplay = ({
  currentScore,
  currentWord,
  sentence,
  aiGuess,
  avgWordsPerRound,
  sessionId,
  currentTheme,
  onNextRound,
  onBack,
  onGameReview,
  normalizeWord,
}: GuessDisplayProps) => {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const t = useTranslation();

  const handleSetShowConfirmDialog = (show: boolean) => {
    setShowConfirmDialog(show);
  };

  const handleCancel = () => {
    setShowConfirmDialog(false);
  };

  const isGuessCorrect = () => normalizeWord(aiGuess) === normalizeWord(currentWord);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        if (isGuessCorrect()) {
          onNextRound();
        } else {
          onGameReview();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isGuessCorrect, onNextRound, onGameReview]);

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
        onCancel={handleCancel}
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
        onGameReview={onGameReview}
        currentScore={currentScore}
        avgWordsPerRound={avgWordsPerRound}
        sessionId={sessionId}
        currentTheme={currentTheme}
      />

    </motion.div>
  );
};