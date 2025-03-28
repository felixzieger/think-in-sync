import { useTranslation } from "@/hooks/useTranslation";
import { getModelDisplayName } from "@/lib/modelNames";

interface GuessResultProps {
  aiGuess: string;
  isCorrect: boolean;
  onNextRound: () => void;
  model?: string;
}

export const GuessResult = ({ aiGuess, isCorrect, onNextRound, model }: GuessResultProps) => {
  const t = useTranslation();

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600">
        {t.guess.aiGuessedDescription.prefix}{" "}
        {model ? getModelDisplayName(model) : t.guess.aiGuessedDescription.aiName}{" "}
        {t.guess.aiGuessedDescription.suffix}
      </p>
      <div className={`rounded-lg ${isCorrect ? 'bg-green-50' : 'bg-red-50'}`}>
        <p className={`p-4 text-2xl font-bold tracking-wider ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
          {aiGuess}
        </p>
      </div>
    </div>
  );
};