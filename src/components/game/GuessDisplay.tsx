import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { supabase } from "@/integrations/supabase/client";
import { House } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { RoundHeader } from "./sentence-builder/RoundHeader";
import { WordDisplay } from "./sentence-builder/WordDisplay";
import { GuessDescription } from "./guess-display/GuessDescription";
import { GuessResult } from "./guess-display/GuessResult";
import { ActionButtons } from "./guess-display/ActionButtons";

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
  const isGuessCorrect = () => aiGuess.toLowerCase() === currentWord.toLowerCase();

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
    console.log('Home button clicked', { currentScore, hasSubmittedScore });
    if (currentScore > 0 && !hasSubmittedScore) {
      setShowConfirmDialog(true);
    } else {
      if (onBack) {
        console.log('Navigating back to welcome screen');
        onBack();
      }
    }
  };

  const handleScoreSubmitted = () => {
    console.log('Score submitted, updating state');
    setHasSubmittedScore(true);
  };

  const handleConfirmHome = () => {
    console.log('Confirmed navigation to home');
    setShowConfirmDialog(false);
    if (onBack) {
      onBack();
    }
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
        setShowConfirmDialog={setShowConfirmDialog}
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
            <AlertDialogAction onClick={handleConfirmHome}>
              {t.game.confirm}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
};