import { useState } from "react";
import { getRandomWord } from "@/lib/words";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { generateAIResponse, guessWord, validateSentence } from "@/services/mistralService";
import { useToast } from "@/components/ui/use-toast";

type GameState = "welcome" | "showing-word" | "building-sentence" | "showing-guess" | "game-over";

export const GameContainer = () => {
  const [gameState, setGameState] = useState<GameState>("welcome");
  const [currentWord, setCurrentWord] = useState<string>("");
  const [sentence, setSentence] = useState<string[]>([]);
  const [playerInput, setPlayerInput] = useState<string>("");
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [aiGuess, setAiGuess] = useState<string>("");
  const { toast } = useToast();

  const handleStart = () => {
    const word = getRandomWord();
    setCurrentWord(word);
    setGameState("showing-word");
    console.log("Game started with word:", word);
  };

  const handlePlayerWord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerInput.trim()) return;

    const word = playerInput.trim();
    const newSentence = [...sentence, word];
    setSentence(newSentence);
    setPlayerInput("");

    // Check if the sentence is complete (ends with a period)
    if (word.endsWith('.')) {
      setIsAiThinking(true);
      try {
        const finalSentence = newSentence.join(' ');

        // Validate the sentence
        const isValid = await validateSentence(finalSentence);
        if (!isValid) {
          toast({
            title: "Invalid Sentence",
            description: "The sentence is not grammatically correct. Game Over!",
            variant: "destructive",
          });
          setGameState("game-over");
          setIsAiThinking(false);
          return;
        }

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
      return;
    }

    setIsAiThinking(true);
    try {
      const aiSentence = await generateAIResponse(currentWord, newSentence);
      const newSentenceLength = newSentence.length;
      const aiWords = aiSentence.split(' '); // Split aiSentence into words
      const aiWord = aiWords[newSentenceLength]; // Get the word at the index of newSentence length
      const newSentenceWithAi = [...newSentence, aiWord];
      setSentence(newSentenceWithAi);

      // Check if AI ended the sentence
      if (aiWord.endsWith('.')) {
        const finalSentence = newSentenceWithAi.join(' ');

        // Validate the sentence
        const isValid = await validateSentence(finalSentence);
        if (!isValid) {
          toast({
            title: "Invalid Sentence",
            description: "The AI generated an invalid sentence. Game Over!",
            variant: "destructive",
          });
          setGameState("game-over");
          setIsAiThinking(false);
          return;
        }

        const guess = await guessWord(finalSentence);
        setAiGuess(guess);
        setGameState("showing-guess");
      }
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

  const handlePlayAgain = () => {
    setGameState("welcome");
    setSentence([]);
    setAiGuess("");
    setCurrentWord("");
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
            <div className="mb-8 rounded-lg bg-secondary/10 p-6">
              <p className="text-4xl font-bold tracking-wider text-secondary">
                {currentWord}
              </p>
            </div>
            <p className="mb-6 text-gray-600">
              Remember this word! You'll take turns with AI to create a sentence
              that describes it. End the sentence with a period when you're done, and another AI will try to guess it!
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
            <div className="mb-4 rounded-lg bg-secondary/10 p-4">
              <p className="text-2xl font-bold tracking-wider text-secondary">
                {currentWord}
              </p>
            </div>
            <div className="mb-6 rounded-lg bg-gray-50 p-4">
              <p className="text-lg text-gray-800">
                {sentence.length > 0 ? sentence.join(" ") : "Start your sentence..."}
              </p>
            </div>
            <form onSubmit={handlePlayerWord} className="mb-4">
              <Input
                type="text"
                value={playerInput}
                onChange={(e) => setPlayerInput(e.target.value.replace(/\s/g, ''))}
                placeholder="Enter your word (end with . to finish)..."
                className="mb-4"
                disabled={isAiThinking}
              />
              <Button
                type="submit"
                className="w-full bg-primary text-lg hover:bg-primary/90"
                disabled={!playerInput.trim() || isAiThinking}
              >
                {isAiThinking ? "AI is thinking..." : "Add Word"}
              </Button>
            </form>
            <p className="text-sm text-gray-600">
              Take turns with AI to describe "{currentWord}" without using the word
              itself!
            </p>
          </motion.div>
        ) : gameState === "game-over" ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <h2 className="mb-4 text-2xl font-semibold text-gray-900">
              Game Over
            </h2>
            <div className="mb-6 rounded-lg bg-gray-50 p-4">
              <p className="mb-4 text-lg text-gray-800">
                Your sentence was not grammatically correct:
              </p>
              <p className="italic text-gray-600">
                {sentence.join(" ")}
              </p>
            </div>
            <Button
              onClick={handlePlayAgain}
              className="w-full bg-primary text-lg hover:bg-primary/90"
            >
              Play Again
            </Button>
          </motion.div>
        ) : (
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
                {aiGuess.toLowerCase() === currentWord.toLowerCase() ? (
                  <span className="text-green-600">Correct guess! 🎉</span>
                ) : (
                  <span className="text-red-600">Wrong! The word was {currentWord}</span>
                )}
              </p>
            </div>
            <Button
              onClick={handlePlayAgain}
              className="w-full bg-primary text-lg hover:bg-primary/90"
            >
              Play Again
            </Button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};