import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslation } from "@/hooks/useTranslation";

interface ScoreSubmissionFormProps {
  playerName: string;
  setPlayerName: (name: string) => void;
  isSubmitting: boolean;
  hasSubmitted: boolean;
  onSubmit: () => Promise<void>;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export const ScoreSubmissionForm = ({
  playerName,
  setPlayerName,
  isSubmitting,
  hasSubmitted,
  onSubmit,
  onKeyDown,
}: ScoreSubmissionFormProps) => {
  const t = useTranslation();

  return (
    <div className="flex gap-4 mb-6">
      <Input
        placeholder={t.leaderboard.enterName}
        value={playerName}
        onChange={(e) => {
          const value = e.target.value.replace(/[^a-zA-ZÀ-ÿ0-9-]/g, "");
          setPlayerName(value);
        }}
        onKeyDown={onKeyDown}
        className="flex-1"
        maxLength={20}
        autoComplete="words"
      />
      <Button
        onClick={onSubmit}
        disabled={isSubmitting || !playerName.trim() || hasSubmitted}
      >
        {isSubmitting ? t.leaderboard.submitting : t.leaderboard.submit}
      </Button>
    </div>
  );
};