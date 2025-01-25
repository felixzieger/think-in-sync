import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { KeyboardEvent, useRef, useEffect } from "react";

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

  useEffect(() => {
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  }, []);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.shiftKey && e.key === 'Enter') {
      e.preventDefault();
      if (sentence.length > 0 && !isAiThinking) {
        onMakeGuess();
      }
    }
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
      <div className="mb-4 rounded-lg bg-secondary/10 p-4">
        <p className="text-2xl font-bold tracking-wider text-secondary">
          {currentWord}
        </p>
      </div>
      {successfulRounds > 0 && (
        <p className="mb-4 text-green-600">
          Successful rounds: {successfulRounds}
        </p>
      )}
      <div className="mb-6 rounded-lg bg-gray-50 p-4">
        <p className="text-lg text-gray-800">
          {sentence.length > 0 ? sentence.join(" ") : "Start your sentence..."}
        </p>
      </div>
      <form onSubmit={onSubmitWord} className="mb-4">
        <Input
          ref={inputRef}
          type="text"
          value={playerInput}
          onChange={(e) => onInputChange(e.target.value.replace(/\s/g, ''))}
          onKeyDown={handleKeyDown}
          placeholder="Enter your word..."
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
            disabled={sentence.length === 0 || isAiThinking}
          >
            {isAiThinking ? "AI is thinking..." : "Make AI Guess ⇧⏎"}
          </Button>
        </div>
      </form>
    </motion.div>
  );
};