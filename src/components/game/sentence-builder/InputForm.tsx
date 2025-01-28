import { KeyboardEvent, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/useTranslation";

interface InputFormProps {
  playerInput: string;
  onInputChange: (value: string) => void;
  onSubmitWord: (e: React.FormEvent) => void;
  onMakeGuess: () => void;
  isAiThinking: boolean;
  hasMultipleWords: boolean;
  containsTargetWord: boolean;
  isValidInput: boolean;
}

export const InputForm = ({
  playerInput,
  onInputChange,
  onSubmitWord,
  onMakeGuess,
  isAiThinking,
  hasMultipleWords,
  containsTargetWord,
  isValidInput
}: InputFormProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const t = useTranslation();

  useEffect(() => {
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  }, []);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.shiftKey && e.key === 'Enter') {
      e.preventDefault();
      if (!hasMultipleWords && !containsTargetWord && !isAiThinking && isValidInput) {
        onMakeGuess();
      }
    }
  };

  const getInputError = () => {
    if (hasMultipleWords) return t.game.singleWordOnly;
    if (containsTargetWord) return t.game.cantUseTargetWord;
    if (!isValidInput && playerInput) return t.game.lettersOnly;
    return null;
  };

  const error = getInputError();

  return (
    <form onSubmit={onSubmitWord} className="mb-4">
      <div className="relative mb-4">
        <Input
          ref={inputRef}
          type="text"
          value={playerInput}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t.game.inputPlaceholder}
          className={`w-full ${error ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
          disabled={isAiThinking}
        />
        {error && (
          <p className="text-sm text-red-500 mt-1">
            {error}
          </p>
        )}
      </div>
      <div className="flex gap-4">
        <Button
          type="submit"
          className="flex-1 bg-primary text-lg hover:bg-primary/90"
          disabled={!playerInput.trim() || isAiThinking || hasMultipleWords || containsTargetWord || !isValidInput}
        >
          {isAiThinking ? t.game.aiThinking : `${t.game.addWord}  ⏎`}
        </Button>
        <Button
          type="button"
          onClick={onMakeGuess}
          className="flex-1 bg-secondary text-lg hover:bg-secondary/90"
          disabled={(!playerInput.trim() && !playerInput.trim()) || isAiThinking || hasMultipleWords || containsTargetWord || !isValidInput}
        >
          {isAiThinking ? t.game.aiThinking : `${t.game.makeGuess} ⇧⏎`}
        </Button>
      </div>
    </form>
  );
};