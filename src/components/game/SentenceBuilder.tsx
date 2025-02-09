
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
  const