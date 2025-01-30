import { useTranslation } from "@/hooks/useTranslation";
import { Button } from "@/components/ui/button";

interface GuessResultProps {
  aiGuess: string;
  isCorrect: boolean;
  onNextRound: () => void;
}

export const GuessResult = ({ aiGuess, isCorrect, onNextRound }: GuessResultProps) => {
  const t = useTranslation();

  return (
    <div className="space-y-4">
      <div className={`p-4 rounded-lg ${isCorrect ? 'bg-green-100' : 'bg-red-100'}`}>
        <p className="font-medium">
          {isCorrect ? t.guess.correct : t.guess.incorrect}
        </p>
      </div>
      <Button onClick={onNextRound} className="w-full">
        {t.game.nextRound} ⏎
      </Button>
    </div>
  );
};