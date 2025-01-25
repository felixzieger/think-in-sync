import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useState } from "react";
import { HighScoreBoard } from "../HighScoreBoard";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";

interface WelcomeScreenProps {
  onStart: () => void;
}

export const WelcomeScreen = ({ onStart }: WelcomeScreenProps) => {
  const [showHighScores, setShowHighScores] = useState(false);
  const [showHowToPlay, setShowHowToPlay] = useState(false);

  const HowToPlayContent = () => (
    <div className="space-y-6">
      <div className="grid gap-4 text-gray-600">
        <div>
          <h3 className="font-medium text-gray-800">The Setup</h3>
          <p>You'll work with two AIs: one as your partner giving clues, and another trying to guess the word.</p>
        </div>
        <div>
          <h3 className="font-medium text-gray-800">Your Goal</h3>
          <p>Help the AI guess the secret word using one-word clues. Each correct guess earns you a point!</p>
        </div>
        <div>
          <h3 className="font-medium text-gray-800">The Rules</h3>
          <ul className="list-disc list-inside space-y-1">
            <li>One word per clue only</li>
            <li>No parts of the secret word or translations</li>
            <li>Clues must relate to the word (be creative!)</li>
            <li>No spelling out the answer</li>
          </ul>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-2xl mx-auto text-center space-y-8"
      >
        <div>
          <h1 className="mb-4 text-4xl font-bold text-gray-900">Think in Sync</h1>
          <p className="text-lg text-gray-600">
            A modern twist on a classic children's game where you team up with AI to guess secret words!
          </p>
        </div>

        <div className="space-y-4">
          <Button
            onClick={onStart}
            className="w-full bg-primary text-lg hover:bg-primary/90"
          >
            Start Game ⏎
          </Button>
          <div className="grid grid-cols-2 gap-4">
            <Button
              onClick={() => setShowHowToPlay(true)}
              variant="outline"
              className="text-lg"
            >
              How to Play 📖
            </Button>
            <Button
              onClick={() => setShowHighScores(true)}
              variant="outline"
              className="text-lg"
            >
              Leaderboard 🏆
            </Button>
          </div>
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

      <Dialog open={showHowToPlay} onOpenChange={setShowHowToPlay}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-primary">How to Play</DialogTitle>
          </DialogHeader>
          <HowToPlayContent />
        </DialogContent>
      </Dialog>
    </>
  );
};