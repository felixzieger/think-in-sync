import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface WordDisplayProps {
  currentWord: string;
  successfulRounds: number;
  onContinue: () => void;
}

export const WordDisplay = ({ currentWord, successfulRounds, onContinue }: WordDisplayProps) => {
  const imagePath = `/think_in_sync_assets/${currentWord.toLowerCase()}.jpg`;

  // Function to check if image exists
  const imageExists = new Image();
  imageExists.src = imagePath;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center"
    >
      <h2 className="mb-4 text-2xl font-semibold text-gray-900">Your Word</h2>
      <div className="mb-4 overflow-hidden rounded-lg bg-secondary/10">
        {imageExists.complete && (
          <img
            src={imagePath}
            alt={currentWord}
            className="mx-auto h-48 w-full object-cover"
          />
        )}
        <p className="p-6 text-4xl font-bold tracking-wider text-secondary">
          {currentWord}
        </p>
      </div>
      {successfulRounds > 0 && (
        <p className="mb-4 text-green-600">
          Successful rounds: {successfulRounds}
        </p>
      )}
      <p className="mb-8 text-gray-600">
        You'll take turns with AI to create a sentence that describes this word.
      </p>
      <p className="mb-8 text-gray-600">
        Click the "Make AI Guess" button to see if another AI can guess it!
      </p>
      <Button
        onClick={onContinue}
        className="w-full bg-primary text-lg hover:bg-primary/90"
      >
        Continue ⏎
      </Button>
    </motion.div>
  );
};