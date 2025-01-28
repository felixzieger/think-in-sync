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
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [hasSubmittedScore, setHasSubmittedScore] = useState(false);
  const t = useTranslation();

  console.log("GuessDisplay - Rendering with showConfirmDialog:", showConfirmDialog);

  const handleSetShowConfirmDialog = (show: boolean) => {
    console.log("GuessDisplay - Setting showConfirmDialog to:", show);
    setShowConfirmDialog(show);
  };

  useEffect(() => {
    console.log("GuessDisplay - showConfirmDialog changed to:", showConfirmDialog);
  }, [showConfirmDialog]);

  const isGuessCorrect = () => aiGuess.toLowerCase() === currentWord.toLowerCase();

  const handleScoreSubmitted = () => {
    console.log('Score submitted, updating state');
    setHasSubmittedScore(true);
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
      
      <GuessResult aiGuess={aiGuess} isCorrect={isGuessCorrect()} />

      <ActionButtons
        isCorrect={isGuessCorrect()}
        onNextRound={onNextRound}
        onPlayAgain={onPlayAgain}
        currentScore={currentScore}
        avgWordsPerRound={avgWordsPerRound}
        sessionId={sessionId}
        onScoreSubmitted={handleScoreSubmitted}
      />
    </motion.div>
  );
};