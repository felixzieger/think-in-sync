import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface WelcomeScreenProps {
  onStart: () => void;
}

export const WelcomeScreen = ({ onStart }: WelcomeScreenProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center"
    >
      <h1 className="mb-6 text-4xl font-bold text-gray-900">Think in Sync</h1>
      <p className="mb-8 text-gray-600">
        This game is a variation of a classical childrens game.
        You will be given a secret word. Your goal is to describe this secret word so that an AI can guess it.
        However, you are only allowed to say one word at the time, taking turns with another AI.
      </p>
      <Button
        onClick={onStart}
        className="w-full bg-primary text-lg hover:bg-primary/90"
      >
        Start Game ⏎
      </Button>
    </motion.div>
  );
};
