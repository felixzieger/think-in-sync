interface GuessResultProps {
  aiGuess: string;
  isCorrect: boolean;
}

export const GuessResult = ({ aiGuess, isCorrect }: GuessResultProps) => {
  return (
    <div className={`rounded-lg ${isCorrect ? 'bg-green-50' : 'bg-red-50'}`}>
      <p className={`p-4 text-2xl font-bold tracking-wider ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
        {aiGuess}
      </p>
    </div>
  );
};