interface GuessResultProps {
  aiGuess: string;
  isCorrect: boolean;
}

export const GuessResult = ({ aiGuess, isCorrect }: GuessResultProps) => {
  return (
    <div className="space-y-2">
      <p className="text-sm text-gray-600">
        {t.guess.aiGuessedDescription}
      </p> 
      <div className={`rounded-lg ${isCorrect ? 'bg-green-50' : 'bg-red-50'}`}>
        <p className={`p-4 text-2xl font-bold tracking-wider ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
          {aiGuess}
        </p>
      </div>
    </div>
  );
};