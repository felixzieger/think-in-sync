import { useState } from "react";
import { getRandomWord } from "@/lib/words";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

type GameState = "welcome" | "showing-word";

export const GameContainer = () => {
  const [gameState, setGameState] = useState<GameState>("welcome");
  const [currentWord, setCurrentWord] = useState<string>("");

  const handleStart = () => {
    const word = getRandomWord();
    setCurrentWord(word);
    setGameState("showing-word");
    console.log("Game started with word:", word);
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg"
      >
        {gameState === "welcome" ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <h1 className="mb-6 text-4xl font-bold text-gray-900">Word Game</h1>
            <p className="mb-8 text-gray-600">
              Ready for Player 1? Click start to begin!
            </p>
            <Button
              onClick={handleStart}
              className="w-full bg-primary text-lg hover:bg-primary/90"
            >
              Start Game
            </Button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <h2 className="mb-4 text-2xl font-semibold text-gray-900">
              Player 1's Word
            </h2>
            <div className="mb-8 rounded-lg bg-secondary/10 p-6">
              <p className="text-4xl font-bold tracking-wider text-secondary">
                {currentWord}
              </p>
            </div>
            <p className="text-gray-600">
              Remember this word! You'll need to describe it to Player 2.
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};