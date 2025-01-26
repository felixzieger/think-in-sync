import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useEffect } from "react";

interface GameOverProps {
  successfulRounds: number;
  onPlayAgain: () => void;
}

export const GameOver = ({
  successfulRounds,
  onPlayAgain,
}: GameOverProps) => {
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'enter') {
        onPlayAgain();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [onPlayAgain]);

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
          onClick={onPlayAgain}
          className="flex-1 bg-primary text-lg hover:bg-primary/90"
        >
          Play Again ⏎
        </Button>
      </div>
    </motion.div>
  );
};