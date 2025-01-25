import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface GameOverProps {
  successfulRounds: number;
  onViewHighScores: () => void;
  onPlayAgain: () => void;
}

export const GameOver = ({
  successfulRounds,
  onViewHighScores,
  onPlayAgain,
}: GameOverProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center"
    >
      <h2 className="mb-4 text-2xl font-semibold text-gray-900">Game Over!</h2>
      <p className="mb-6 text-lg text-gray-800">
        You completed {successfulRounds} rounds successfully!
      </p>
      <div className="flex gap-4">
        <Button
          onClick={onViewHighScores}
          className="flex-1 bg-secondary text-lg hover:bg-secondary/90"
        >
          View High Scores
        </Button>
        <Button
          onClick={onPlayAgain}
          className="flex-1 bg-primary text-lg hover:bg-primary/90"
        >
          Play Again ⏎
        </Button>
      </div>
    </motion.div>
  );
};