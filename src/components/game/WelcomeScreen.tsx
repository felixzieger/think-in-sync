import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useState } from "react";
import { HighScoreBoard } from "../HighScoreBoard";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";

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
        className="max-w-2xl mx-auto text-center space-y-8"
      >
        <div>
          <h1 className="mb-4 text-4xl font-bold text-gray-900">Think in Sync</h1>
          <p className="text-lg text-gray-600">
            A modern twist on a classic children's game where you team up with AI to guess secret words!
          </p>
        </div>

        <Card className="bg-white/50 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="space-y-6 text-left">
              <div>
                <h2 className="text-xl font-semibold text-primary mb-2">How to Play</h2>
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
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4 pt-4">
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
            View Leaderboard 🏆
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