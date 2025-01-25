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
      <h1 className="mb-6 text-4xl font-bold text-gray-900">Word Game</h1>
      <p className="mb-8 text-gray-600">
        Ready to play? Click start or press Enter to begin!
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