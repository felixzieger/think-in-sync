import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { RoundHeader } from "./sentence-builder/RoundHeader";
import { WordDisplay } from "./sentence-builder/WordDisplay";
import { GuessDescription } from "./guess-display/GuessDescription";
import { GuessResult } from "./guess-display/GuessResult";
import { ActionButtons } from "./guess-display/ActionButtons";

interface SentenceWord {
  word: string;
  provider: 'player' | 'ai';
}

interface GuessDisplayProps {
  currentScore: number;
  currentWord: string;
  sentence: SentenceWord[];
  aiGuess: string;
  avgWordsPerRound: number;
  sessionId: string;
  currentTheme: string;
  totalRounds: number;
  wrongGuesses: number;
  guessSequence: Array<'success' | 'wrong'>;
  onNextRound: () => void;
  onGameReview: () => void;
  onBack?: () => void;
  normalizeWord: (word: string) => string;
  aiModel?: string;
}

export const GuessDisplay = ({
  currentScore,
  currentWord,
  sentence,
  aiGuess,
  avgWordsPerRound,
  sessionId,
  currentTheme,
  totalRounds,
  wrongGuesses,
  guessSequence,
  onNextRound,
  onBack,
  onGameReview,
  normalizeWord,
  aiModel,
}: GuessDisplayProps) => {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const t = useTranslation();

  const handleSetShowConfirmDialog = (show: boolean) => {
    setShowConfirmDialog(show);
  };

  const isGuessCorrect = () => normalizeWord(aiGuess) === normalizeWord(currentWord);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        onNextRound();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [onNextRound]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center relative space-y-6"
    >
      <RoundHeader
        successfulRounds={currentScore}
        totalRounds={totalRounds}
        wrongGuesses={wrongGuesses}
        guessSequence={guessSequence}
        onBack={onBack}
        showConfirmDialog={showConfirmDialog}
        setShowConfirmDialog={handleSetShowConfirmDialog}
      />

      <WordDisplay currentWord={currentWord} />

      <GuessDescription sentence={sentence} model={aiModel} />

      <GuessResult
        aiGuess={aiGuess}
        isCorrect={isGuessCorrect()}
        onNextRound={onNextRound}
        model={aiModel}
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