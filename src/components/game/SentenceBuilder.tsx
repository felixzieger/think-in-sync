import { useState } from "react";
import { motion } from "framer-motion";
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
import { useTranslation } from "@/hooks/useTranslation";
import { RoundHeader } from "./sentence-builder/RoundHeader";
import { WordDisplay } from "./sentence-builder/WordDisplay";
import { SentenceDisplay } from "./sentence-builder/SentenceDisplay";
import { InputForm } from "./sentence-builder/InputForm";
import { Button } from "@/components/ui/button";

interface SentenceWord {
  word: string;
  provider: 'player' | 'ai';
}

interface SentenceBuilderProps {
  currentWord: string;
  successfulRounds: number;
  totalRounds: number;
  wrongGuesses: number;
  guessSequence: Array<'success' | 'wrong'>;
  sentence: SentenceWord[];
  playerInput: string;
  isAiThinking: boolean;
  onInputChange: (value: string) => void;
  onSubmitWord: (e: React.FormEvent) => void;
  onMakeGuess: () => void;
  normalizeWord: (word: string) => string;
  onBack?: () => void;
  onClose: () => void;
}

export const SentenceBuilder = ({
  currentWord,
  successfulRounds,
  totalRounds,
  wrongGuesses,
  guessSequence,
  sentence,
  playerInput,
  isAiThinking,
  onInputChange,
  onSubmitWord,
  onMakeGuess,
  normalizeWord,
  onBack,
  onClose,
}: SentenceBuilderProps) => {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [hasMultipleWords, setHasMultipleWords] = useState(false);
  const [containsTargetWord, setContainsTargetWord] = useState(false);
  const [isTooLong, setIsTooLong] = useState(false);
  const t = useTranslation();

  const validateInput = (input: string) => {
    setHasMultipleWords(input.trim().split(/\s+/).length > 1);
    setContainsTargetWord(
      normalizeWord(input).includes(normalizeWord(currentWord))
    );
    setIsTooLong(input.trim().length >= 30);
  };

  const handleInputChange = (value: string) => {
    validateInput(value);
    onInputChange(value);
  };

  const handleSetShowConfirmDialog = (show: boolean) => {
    console.log("SentenceBuilder - Setting showConfirmDialog to:", show);
    setShowConfirmDialog(show);
  };

  const isValidInput = !playerInput || /^[\p{L} ]+$/u.test(playerInput);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center relative"
    >
      <RoundHeader
        successfulRounds={successfulRounds}
        totalRounds={totalRounds}
        wrongGuesses={wrongGuesses}
        guessSequence={guessSequence}
        onBack={onBack}
        showConfirmDialog={showConfirmDialog}
        setShowConfirmDialog={handleSetShowConfirmDialog}
      />

      <WordDisplay currentWord={currentWord} />

      <SentenceDisplay sentence={sentence} />

      <InputForm
        playerInput={playerInput}
        onInputChange={handleInputChange}
        onSubmitWord={onSubmitWord}
        onMakeGuess={onMakeGuess}
        isAiThinking={isAiThinking}
        hasMultipleWords={hasMultipleWords}
        containsTargetWord={containsTargetWord}
        isTooLong={isTooLong}
        isValidInput={isValidInput}
        sentence={sentence}
      />

      <div className="mt-4 flex justify-center gap-4 text-sm">
        <Button
          variant="link"
          className="text-muted-foreground hover:text-primary"
          onClick={onClose}
        >
          {t.game.finishGame}
        </Button>
      </div>

      <AlertDialog open={showConfirmDialog} onOpenChange={handleSetShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t.game.leaveGameTitle}</AlertDialogTitle>
            <AlertDialogDescription>
              {t.game.leaveGameDescription}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowConfirmDialog(false)}>
              {t.game.cancel}
            </AlertDialogCancel>
            <AlertDialogAction onClick={onBack}>
              {t.game.confirm}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
};