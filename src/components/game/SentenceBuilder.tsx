import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useRef } from "react";

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
  sentence,
  playerInput,
  isAiThinking,
  onInputChange,
  onSubmitWord,
  onMakeGuess,
}: SentenceBuilderProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isAiThinking && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isAiThinking]);

  return (
    <div className="relative space-y-6">
      <div className="absolute -top-2 right-0">
        <Badge variant="secondary" className="text-sm font-semibold px-3 py-1">
          Round {successfulRounds + 1}
        </Badge>
      </div>

      <div className="space-y-4">
        <p className="text-lg font-medium">
          Create a sentence that makes the AI guess:{" "}
          <span className="font-bold text-primary">{currentWord}</span>
        </p>

        <div className="space-y-2">
          {sentence.length > 0 && (
            <p className="text-sm text-gray-600">
              Current sentence: {sentence.join(" ")}
            </p>
          )}

          <form onSubmit={onSubmitWord} className="flex gap-2">
            <Input
              ref={inputRef}
              type="text"
              value={playerInput}
              onChange={(e) => onInputChange(e.target.value)}
              placeholder="Add a word..."
              disabled={isAiThinking}
              className="flex-1"
            />
            <Button type="submit" disabled={isAiThinking}>
              Add Word
            </Button>
          </form>
        </div>

        {sentence.length > 0 && (
          <Button
            onClick={onMakeGuess}
            disabled={isAiThinking}
            variant="secondary"
            className="w-full"
          >
            Let AI Guess
          </Button>
        )}

        {isAiThinking && (
          <p className="text-sm text-muted-foreground animate-pulse">
            AI is thinking...
          </p>
        )}
      </div>
    </div>
  );
};