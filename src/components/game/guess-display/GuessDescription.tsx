import { useTranslation } from "@/hooks/useTranslation";
import { getModelDisplayName } from "@/lib/modelNames";

interface GuessDescriptionProps {
  sentence: string[];
  model?: string;
}

export const GuessDescription = ({ sentence, model }: GuessDescriptionProps) => {
  const t = useTranslation();

  return (
    <div className="space-y-2">
      <p className="text-sm text-gray-600">
        <span className="inline-block border-b-2 border-blue-500">{t.guess.you}</span>
        {" "}{t.guess.and}{" "}
        <span className="inline-block border-b-2 border-green-500">{model ? getModelDisplayName(model) : t.guess.aiModel}</span>
        {" "}{t.guess.providedDescription}
      </p>
      <div className="rounded-lg bg-gray-50">
        <p className="p-4 text-2xl tracking-wider text-gray-800 flex flex-wrap gap-1">
          {sentence.map((word, index) => (
            <span
              key={index}
              className={`inline-block ${
                index % 2 === 0
                  ? "border-b-2 border-blue-500" // Player words (even indices)
                  : "border-b-2 border-green-500" // AI words (odd indices)
              }`}
            >
              {word}
            </span>
          ))}
        </p>
      </div>
    </div>
  );
};