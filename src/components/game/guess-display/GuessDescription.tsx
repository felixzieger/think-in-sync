import { useTranslation } from "@/hooks/useTranslation";

interface GuessDescriptionProps {
  sentence: string[];
  aiGuess: string;
}

export const GuessDescription = ({ sentence, aiGuess }: GuessDescriptionProps) => {
  const t = useTranslation();

  return (
    <div className="space-y-2">
      <p className="text-sm text-gray-600">{t.guess.providedDescription}</p>
      <div className="rounded-lg bg-gray-50">
        <p className="p-4 text-2xl tracking-wider text-gray-800">
          {sentence.join(" ")}
        </p>
      </div>
    </div>
  );
};