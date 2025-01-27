import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { KeyboardEvent, useRef, useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/hooks/useTranslation";
import { House } from "lucide-react";
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
  const inputRef = useRef<HTMLInputElement>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const imagePath = `/think_in_sync_assets/${currentWord.toLowerCase()}.jpg`;
  const { toast } = useToast();
  const t = useTranslation();

  useEffect(() => {
    const img = new Image();
    img.onload = () => setImageLoaded(true);
    img.src = imagePath;
    console.log("Attempting to load image:", imagePath);
  }, [imagePath]);

  useEffect(() => {
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  }, []);

  useEffect(() => {
    if (!isAiThinking && sentence.length > 0 && sentence.length % 2 === 0) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isAiThinking, sentence.length]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.shiftKey && e.key === 'Enter') {
      e.preventDefault();
      if (playerInput.trim()) {
        handleSubmit(e as any);
      }
      onMakeGuess();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const input = playerInput.trim().toLowerCase();
    const target = currentWord.toLowerCase();

    if (!/^[\p{L}]+$/u.test(input)) {
      toast({
        title: t.game.invalidWord,
        description: t.game.lettersOnly,
        variant: "destructive",
      });
      return;
    }

    if (input.includes(target)) {
      toast({
        title: t.game.invalidWord,
        description: `${t.game.cantUseTargetWord} "${currentWord}"`,
        variant: "destructive",
      });
      return;
    }

    onSubmitWord(e);
  };

  const handleHomeClick = () => {
    if (successfulRounds > 0) {
      setShowConfirmDialog(true);
    } else {
      onBack?.();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center relative"
    >
      <div className="absolute right-0 top-0 bg-primary/10 px-3 py-1 rounded-lg">
        <span className="text-sm font-medium text-primary">
          {t.game.round} {successfulRounds + 1}
        </span>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="absolute left-0 top-0 text-gray-600 hover:text-primary"
        onClick={handleHomeClick}
      >
        <House className="h-5 w-5" />
      </Button>

      <h2 className="mb-4 text-2xl font-semibold text-gray-900">
        Think in Sync
      </h2>
      <p className="mb-6 text-sm text-gray-600">
        Your goal is to describe the word
      </p>
      <div className="mb-4 overflow-hidden rounded-lg bg-secondary/10">
        {imageLoaded && (
          <img
            src={imagePath}
            alt={currentWord}
            className="mx-auto h-48 w-full object-cover"
          />
        )}
        <p className="p-4 text-2xl font-bold tracking-wider text-secondary">
          {currentWord}
        </p>
      </div>
      <form onSubmit={handleSubmit} className="mb-4">
        {sentence.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 text-left p-3 rounded-lg bg-gray-50"
          >
            <p className="text-gray-700">
              {sentence.join(" ")}
            </p>
          </motion.div>
        )}
        <div className="relative mb-4">
          <Input
            ref={inputRef}
            type="text"
            value={playerInput}
            onChange={(e) => {
              const value = e.target.value.replace(/[^a-zA-ZÀ-ÿ]/g, '');
              onInputChange(value);
            }}
            onKeyDown={handleKeyDown}
            placeholder={t.game.inputPlaceholder}
            className="w-full"
            disabled={isAiThinking}
          />
        </div>
        <div className="flex gap-4">
          <Button
            type="submit"
            className="flex-1 bg-primary text-lg hover:bg-primary/90"
            disabled={!playerInput.trim() || isAiThinking}
          >
            {isAiThinking ? t.game.aiThinking : `${t.game.addWord}  ⏎`}
          </Button>
          <Button
            type="button"
            onClick={onMakeGuess}
            className="flex-1 bg-secondary text-lg hover:bg-secondary/90"
            disabled={(!sentence.length && !playerInput.trim()) || isAiThinking}
          >
            {isAiThinking ? t.game.aiThinking : `${t.game.makeGuess} ⇧⏎`}
          </Button>
        </div>
      </form>

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