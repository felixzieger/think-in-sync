import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { KeyboardEvent, useRef, useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface SentenceBuilderProps {
  currentWord: string;
  successfulRounds: number;
  sentence: string[];
  playerInput: string;
  isAiThinking: boolean;
  onInputChange: (value: string) => void;
  onSubmitWord: (e: React.FormEvent) => void;
  onMakeGuess: () => void;
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
}: SentenceBuilderProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const imagePath = `/think_in_sync_assets/${currentWord.toLowerCase()}.jpg`;
  const { toast } = useToast();

  useEffect(() => {
    const img = new Image();
    img.onload = () => setImageLoaded(true);
    img.src = imagePath;
    console.log("Attempting to load image:", imagePath);
  }, [imagePath]);

  // Focus input on initial render
  useEffect(() => {
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  }, []);

  // Focus input after AI finishes thinking
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
      // Make the guess immediately without waiting for AI response
      onMakeGuess();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const input = playerInput.trim().toLowerCase();
    const target = currentWord.toLowerCase();

    // Check if the input contains only letters
    if (!/^[a-zA-Z]+$/.test(input)) {
      toast({
        title: "Invalid Word",
        description: "Please use only letters (no numbers or special characters)",
        variant: "destructive",
      });
      return;
    }

    if (input.includes(target)) {
      toast({
        title: "Invalid Word",
        description: `You cannot use words that contain "${currentWord}"`,
        variant: "destructive",
      });
      return;
    }

    onSubmitWord(e);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center"
    >
      <h2 className="mb-4 text-2xl font-semibold text-gray-900">
        Build a Description
      </h2>
      <p className="mb-6 text-sm text-gray-600">
        Take turns with AI to describe your word without using the word itself!
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
      <div className="mb-6 rounded-lg bg-gray-50 p-4">
        <p className="text-lg text-gray-800">
          {sentence.length > 0 ? sentence.join(" ") : "Start your sentence..."}
        </p>
      </div>
      <form onSubmit={handleSubmit} className="mb-4">
        <Input
          ref={inputRef}
          type="text"
          value={playerInput}
          onChange={(e) => {
            // Only allow letters in the input
            const value = e.target.value.replace(/[^a-zA-Z]/g, '');
            onInputChange(value);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Enter your word (letters only)..."
          className="mb-4"
          disabled={isAiThinking}
        />
        <div className="flex gap-4">
          <Button
            type="submit"
            className="flex-1 bg-primary text-lg hover:bg-primary/90"
            disabled={!playerInput.trim() || isAiThinking}
          >
            {isAiThinking ? "AI is thinking..." : "Add Word ⏎"}
          </Button>
          <Button
            type="button"
            onClick={onMakeGuess}
            className="flex-1 bg-secondary text-lg hover:bg-secondary/90"
            disabled={(!sentence.length && !playerInput.trim()) || isAiThinking}
          >
            {isAiThinking ? "AI is thinking..." : "Make AI Guess ⇧⏎"}
          </Button>
        </div>
      </form>
    </motion.div>
  );
};