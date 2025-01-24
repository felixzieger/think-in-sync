import { useState } from "react";
import { getRandomWord } from "@/lib/words";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

type GameState = "welcome" | "showing-word" | "building-sentence";

export const GameContainer = () => {
  const [gameState, setGameState] = useState<GameState>("welcome");
  const [currentWord, setCurrentWord] = useState<string>("");
  const [sentence, setSentence] = useState<string[]>([]);
  const [playerInput, setPlayerInput] = useState<string>("");

  const handleStart = () => {
    const word = getRandomWord();
    setCurrentWord(word);
    setGameState("showing-word");
    console.log("Game started with word:", word);
  };

  const getAIWord = (currentSentence: string[]) => {
    // Simple AI that adds connecting words or basic descriptive words
    const connectingWords = ["is", "looks", "appears", "seems", "feels"];
    const descriptiveWords = ["very", "quite", "really", "extremely", "notably"];
    
    if (currentSentence.length === 0) {
      return "this";
    } else if (currentSentence.length === 1) {
      return connectingWords[Math.floor(Math.random() * connectingWords.length)];
    } else {
      return descriptiveWords[Math.floor(Math.random() * descriptiveWords.length)];
    }
  };

  const handlePlayerWord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerInput.trim()) return;

    // Add player's word to sentence
    const newSentence = [...sentence, playerInput.trim()];
    setSentence(newSentence);
    setPlayerInput("");

    // AI's turn
    setTimeout(() => {
      const aiWord = getAIWord(newSentence);
      setSentence([...newSentence, aiWord]);
    }, 1000);
  };

  const handleContinue = () => {
    setGameState("building-sentence");
    setSentence([]);
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
        ) : gameState === "showing-word" ? (
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
            <p className="mb-6 text-gray-600">
              Remember this word! You'll take turns with AI to create a sentence
              that describes it without using the word itself.
            </p>
            <Button
              onClick={handleContinue}
              className="w-full bg-primary text-lg hover:bg-primary/90"
            >
              Continue
            </Button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <h2 className="mb-4 text-2xl font-semibold text-gray-900">
              Build a Description
            </h2>
            <div className="mb-6 rounded-lg bg-gray-50 p-4">
              <p className="text-lg text-gray-800">
                {sentence.length > 0 ? sentence.join(" ") : "Start your sentence..."}
              </p>
            </div>
            <form onSubmit={handlePlayerWord} className="mb-4">
              <Input
                type="text"
                value={playerInput}
                onChange={(e) => setPlayerInput(e.target.value)}
                placeholder="Enter your word..."
                className="mb-4"
              />
              <Button
                type="submit"
                className="w-full bg-primary text-lg hover:bg-primary/90"
                disabled={!playerInput.trim()}
              >
                Add Word
              </Button>
            </form>
            <p className="text-sm text-gray-600">
              Take turns with AI to describe "{currentWord}" without using the word
              itself!
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};