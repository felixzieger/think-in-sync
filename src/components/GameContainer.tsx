import { useState, useRef, KeyboardEvent } from "react";
import { getRandomWord } from "@/lib/words";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { generateAIResponse, guessWord } from "@/services/mistralService";
import { useToast } from "@/components/ui/use-toast";

type GameState = "welcome" | "showing-word" | "building-sentence" | "showing-guess" | "game-over";

export const GameContainer = () => {
  const [gameState, setGameState] = useState<GameState>("welcome");
  const [currentWord, setCurrentWord] = useState<string>("");
  const [sentence, setSentence] = useState<string[]>([]);
  const [playerInput, setPlayerInput] = useState<string>("");
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [aiGuess, setAiGuess] = useState<string>("");
  const [successfulRounds, setSuccessfulRounds] = useState<number>(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleStart = () => {
    const word = getRandomWord();
    setCurrentWord(word);
    setGameState("showing-word");
    setSuccessfulRounds(0);
    console.log("Game started with word:", word);
  };

  const handlePlayerWord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerInput.trim()) return;

    const word = playerInput.trim();
    const newSentence = [...sentence, word];
    setSentence(newSentence);
    setPlayerInput("");

    setIsAiThinking(true);
    try {
      const aiWord = await generateAIResponse(currentWord, newSentence);
      const newSentenceWithAi = [...newSentence, aiWord];
      setSentence(newSentenceWithAi);
      // Focus the input after AI's turn
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } catch (error) {
      console.error('Error in AI turn:', error);
      toast({
        title: "Error",
        description: "Failed to get AI's response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAiThinking(false);
    }
  };

  const handleMakeGuess = async () => {
    if (sentence.length === 0) return;

    setIsAiThinking(true);
    try {
      const finalSentence = sentence.join(' ');
      const guess = await guessWord(finalSentence);
      setAiGuess(guess);
      setGameState("showing-guess");
    } catch (error) {
      console.error('Error getting AI guess:', error);
      toast({
        title: "Error",
        description: "Failed to get AI's guess. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAiThinking(false);
    }
  };

  const handleNextRound = () => {
    const word = getRandomWord();
    setCurrentWord(word);
    setGameState("showing-word");
    setSentence([]);
    setAiGuess("");
    console.log("Next round started with word:", word);
  };

  const handlePlayAgain = () => {
    setGameState("welcome");
    setSentence([]);
    setAiGuess("");
    setCurrentWord("");
    setSuccessfulRounds(0);
  };

  const handleContinue = () => {
    setGameState("building-sentence");
    setSentence([]);
  };

  const isGuessCorrect = () => {
    return aiGuess.toLowerCase() === currentWord.toLowerCase();
  };

  const handleGuessComplete = () => {
    if (isGuessCorrect()) {
      setSuccessfulRounds(prev => prev + 1);
      return true;
    }
    setGameState("game-over");
    return false;
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.shiftKey && e.key === 'Enter') {
      e.preventDefault();
      if (sentence.length > 0 && !isAiThinking) {
        handleMakeGuess();
      }
    }
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
              Ready to play? Click start to begin!
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
              Your Word
            </h2>
            <div className="mb-4 rounded-lg bg-secondary/10 p-6">
              <p className="text-4xl font-bold tracking-wider text-secondary">
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
              onClick={handleContinue}
              className="w-full bg-primary text-lg hover:bg-primary/90"
            >
              Continue
            </Button>
          </motion.div>
        ) : gameState === "building-sentence" ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <h2 className="mb-4 text-2xl font-semibold text-gray-900">
              Build a Description
            </h2>
            <p className="mb-6 text-sm text-gray-600">
              Take turns with AI to describe your word without using the word
              itself!
            </p>
            <div className="mb-4 rounded-lg bg-secondary/10 p-4">
              <p className="text-2xl font-bold tracking-wider text-secondary">
                {currentWord}
              </p>
            </div>
            {successfulRounds > 0 && (
              <p className="mb-4 text-green-600">
                Successful rounds: {successfulRounds}
              </p>
            )}
            <div className="mb-6 rounded-lg bg-gray-50 p-4">
              <p className="text-lg text-gray-800">
                {sentence.length > 0 ? sentence.join(" ") : "Start your sentence..."}
              </p>
            </div>
            <form onSubmit={handlePlayerWord} className="mb-4">
              <Input
                ref={inputRef}
                type="text"
                value={playerInput}
                onChange={(e) => setPlayerInput(e.target.value.replace(/\s/g, ''))}
                onKeyDown={handleKeyDown}
                placeholder="Enter your word..."
                className="mb-4"
                disabled={isAiThinking}
              />
              <div className="flex gap-4">
                <Button
                  type="submit"
                  className="flex-1 bg-primary text-lg hover:bg-primary/90"
                  disabled={!playerInput.trim() || isAiThinking}
                >
                  {isAiThinking ? "AI is thinking..." : "Add Word ⏎"}
                </Button>
                <Button
                  type="button"
                  onClick={handleMakeGuess}
                  className="flex-1 bg-secondary text-lg hover:bg-secondary/90"
                  disabled={sentence.length === 0 || isAiThinking}
                >
                  {isAiThinking ? "AI is thinking..." : "Make AI Guess ⇧⏎"}
                </Button>
              </div>
            </form>
          </motion.div>
        ) : gameState === "showing-guess" ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <h2 className="mb-4 text-2xl font-semibold text-gray-900">
              AI's Guess
            </h2>
            <div className="mb-6 rounded-lg bg-gray-50 p-4">
              <p className="mb-4 text-lg text-gray-800">
                Your sentence: {sentence.join(" ")}
              </p>
              <p className="text-xl font-bold text-primary">
                AI guessed: {aiGuess}
              </p>
              <p className="mt-4 text-lg">
                {isGuessCorrect() ? (
                  <span className="text-green-600">
                    Correct guess! 🎉 Ready for the next round?
                  </span>
                ) : (
                  <span className="text-red-600">
                    Game Over! You completed {successfulRounds} rounds successfully!
                  </span>
                )}
              </p>
            </div>
            <Button
              onClick={() => {
                const correct = handleGuessComplete();
                if (correct) {
                  handleNextRound();
                } else {
                  handlePlayAgain();
                }
              }}
              className="w-full bg-primary text-lg hover:bg-primary/90"
            >
              {isGuessCorrect() ? "Next Round" : "Play Again"}
            </Button>
          </motion.div>
        ) : gameState === "game-over" ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <h2 className="mb-4 text-2xl font-semibold text-gray-900">
              Game Over!
            </h2>
            <p className="mb-6 text-lg text-gray-800">
              You completed {successfulRounds} rounds successfully!
            </p>
            <Button
              onClick={handlePlayAgain}
              className="w-full bg-primary text-lg hover:bg-primary/90"
            >
              Play Again
            </Button>
          </motion.div>
        ) : null}
      </motion.div>
    </div>
  );
};
