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

interface SentenceBuilderProps {
  currentWord: string;
  successfulRounds: number;
  sentence: string[];
  playerInput: string;
  isAiThinking: boolean;
  onInputChange: (value: string) => void;
  onSubmitWord: (e: React.FormEvent) => void;
  onMakeGuess: () => void;
  onBack?: () => void;
}

export const SentenceBuilder = ({
  currentWord,
  successfulRounds,
  sentence,
  playerInput,
  isAiThinking,
  onInputChange,
  onSubmitWord,
  onMakeGuess,
  onBack,
}: SentenceBuilderProps) => {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [hasMultipleWords, setHasMultipleWords] = useState(false);
  const [containsTargetWord, setContainsTargetWord] = useState(false);
  const t = useTranslation();

  // Input validation
  const validateInput = (input: string) => {
    setHasMultipleWords(input.trim().split(/\s+/).length > 1);
    setContainsTargetWord(
      input.toLowerCase().includes(currentWord.toLowerCase())
    );
  };

  const handleInputChange = (value: string) => {
    validateInput(value);
    onInputChange(value);
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
        onBack={onBack}
        showConfirmDialog={showConfirmDialog}
        setShowConfirmDialog={setShowConfirmDialog}
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
        isValidInput={isValidInput}
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
            <AlertDialogAction onClick={() => onBack?.()}>
              {t.game.confirm}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
};