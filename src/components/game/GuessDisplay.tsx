import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { HighScoreBoard } from "@/components/HighScoreBoard";

interface GuessDisplayProps {
  sentence: string[];
  aiGuess: string;
  currentWord: string;
  onNextRound: () => void;
  onPlayAgain: () => void;
  currentScore: number;
  avgWordsPerRound: number;
}

export const GuessDisplay = ({
  sentence,
  aiGuess,
  currentWord,
  onNextRound,
  onPlayAgain,
  currentScore,
  avgWordsPerRound,
}: GuessDisplayProps) => {
  const isGuessCorrect = () => aiGuess.toLowerCase() === currentWord.toLowerCase();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center"
    >
      <h2 className="mb-4 text-2xl font-semibold text-gray-900">AI's Guess</h2>
      <div className="mb-6 rounded-lg bg-gray-50 p-4">
        <p className="mb-4 text-lg text-gray-800">
          Your sentence: {sentence.join(" ")}
        </p>
        <p className="text-xl font-bold text-primary">AI guessed: {aiGuess}</p>
        <p className="mt-4 text-lg">
          {isGuessCorrect() ? (
            <span className="text-green-600">
              Correct guess! 🎉 Ready for the next round? Press Enter
            </span>
          ) : (
            <span className="text-red-600">
              Game Over! Press Enter to play again
            </span>
          )}
        </p>
      </div>
      <div className="flex flex-col gap-4">
        {isGuessCorrect() ? (
          <Button
            onClick={onNextRound}
            className="w-full bg-primary text-lg hover:bg-primary/90"
          >
            Next Round ⏎
          </Button>
        ) : (
          <>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  className="w-full bg-secondary text-lg hover:bg-secondary/90"
                >
                  View High Scores
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md bg-white">
                <HighScoreBoard
                  currentScore={currentScore}
                  avgWordsPerRound={avgWordsPerRound}
                  onClose={() => {}}
                  onPlayAgain={onPlayAgain}
                />
              </DialogContent>
            </Dialog>
            <Button
              onClick={onPlayAgain}
              className="w-full bg-primary text-lg hover:bg-primary/90"
            >
              Play Again ⏎
            </Button>
          </>
        )}
      </div>
    </motion.div>
  );
};