import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useState } from "react";
import { HighScoreBoard } from "../HighScoreBoard";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface WelcomeScreenProps {
  onStart: () => void;
}

export const WelcomeScreen = ({ onStart }: WelcomeScreenProps) => {
  const [showHighScores, setShowHighScores] = useState(false);

  return (
    <>
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
        <div className="space-y-4">
          <Button
            onClick={onStart}
            className="w-full bg-primary text-lg hover:bg-primary/90"
          >
            Start Game ⏎
          </Button>
          <Button
            onClick={() => setShowHighScores(true)}
            variant="outline"
            className="w-full text-lg"
          >
            View High Scores 🏆
          </Button>
        </div>
      </motion.div>

      <Dialog open={showHighScores} onOpenChange={setShowHighScores}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
          <HighScoreBoard
            currentScore={0}
            avgWordsPerRound={0}
            onClose={() => setShowHighScores(false)}
            onPlayAgain={onStart}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};