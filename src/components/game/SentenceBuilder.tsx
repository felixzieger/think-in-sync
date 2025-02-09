
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
import { Hearts } from "./sentence-builder/Hearts";

interface SentenceBuilderProps {
  currentWord: string;
  successfulRounds: number;
  sentence: string[];
  playerInput: string;
  isAiThinking: boolean;
  onInputChange: (value: string) => void;
  onSubmitWord: (e: React.FormEvent) => void;
  onMakeGuess: () => void;
  normalizeWord: (word: string) => string;
  onBack?: () => void;
  onClose: () => void;
  lives: number;
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
  normalizeWord,
  onBack,
  onClose,
  lives,
}: SentenceBuilderProps) => {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [hasMultipleWords, setHasMultipleWords] = useState(false);
  const t = useTranslation();

  const handleInputChange = (value: string) => {
    setHasMultipleWords(value.trim().includes(" "));
    onInputChange(value);
  };

  const handleClose = () => {
    if (sentence.length > 0) {
      setShowConfirmDialog(true);
    } else {
      onClose();
    }
  };

  return (
    <div className="space-y-6">
      <RoundHeader
        currentWord={currentWord}
        successfulRounds={successfulRounds}
        onBack={onBack}
        onClose={handleClose}
      />

      <Hearts lives={lives} />

      <WordDisplay currentWord={currentWord} normalizeWord={normalizeWord} />

      <SentenceDisplay sentence={sentence} />

      <InputForm
        playerInput={playerInput}
        onInputChange={handleInputChange}
        onSubmitWord={onSubmitWord}
        onMakeGuess={onMakeGuess}
        isAiThinking={isAiThinking}
        hasMultipleWords={hasMultipleWords}
      />

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t.game.exitTitle}</AlertDialogTitle>
            <AlertDialogDescription>
              {t.game.exitDescription}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t.common.cancel}</AlertDialogCancel>
            <AlertDialogAction onClick={onClose}>
              {t.common.confirm}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
