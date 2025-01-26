import { useState, KeyboardEvent, useEffect } from "react";
import { getRandomWord } from "@/lib/words";
import { motion } from "framer-motion";
import { generateAIResponse, guessWord } from "@/services/mistralService";
import { useToast } from "@/components/ui/use-toast";
import { WelcomeScreen } from "./game/WelcomeScreen";
import { WordDisplay } from "./game/WordDisplay";
import { SentenceBuilder } from "./game/SentenceBuilder";
import { GuessDisplay } from "./game/GuessDisplay";
import { GameOver } from "./game/GameOver";

type GameState = "welcome" | "showing-word" | "building-sentence" | "showing-guess" | "game-over";

export const GameContainer = () => {
  const [gameState, setGameState] = useState<GameState>("welcome");
  const [currentWord, setCurrentWord] = useState<string>("");
  const [sentence, setSentence] = useState<string[]>([]);
  const [playerInput, setPlayerInput] = useState<string>("");
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [aiGuess, setAiGuess] = useState<string>("");
  const [successfulRounds, setSuccessfulRounds] = useState<number>(0);
  const [totalWords, setTotalWords] = useState<number>(0);
  const { toast } = useToast();

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        if (gameState === 'welcome') {
          handleStart();
        } else if (gameState === 'showing-word') {
          handleContinue();
        } else if (gameState === 'game-over' || gameState === 'showing-guess') {
          const correct = isGuessCorrect();
          if (correct) {
            handleNextRound();
          } else {
            setGameState("game-over");
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress as any);
    return () => window.removeEventListener('keydown', handleKeyPress as any);
  }, [gameState, aiGuess, currentWord]);

  const handleStart = () => {
    const word = getRandomWord();
    setCurrentWord(word);
    setGameState("showing-word");
    setSuccessfulRounds(0);
    setTotalWords(0);
    console.log("Game started with word:", word);
  };

  const handlePlayerWord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerInput.trim()) return;

    const word = playerInput.trim();
    const newSentence = [...sentence, word];
    setSentence(newSentence);
    setPlayerInput("");
    setTotalWords(prev => prev + 1);

    setIsAiThinking(true);
    try {
      const aiWord = await generateAIResponse(currentWord, newSentence);
      const newSentenceWithAi = [...newSentence, aiWord];
      setSentence(newSentenceWithAi);
      setTotalWords(prev => prev + 1);
    } catch (error) {
      console.error('Error in AI turn:', error);
      toast({
        title: "AI Response Delayed",
        description: "The AI is currently busy. Please try adding another word or wait a moment.",
        variant: "default",
      });
    } finally {
      setIsAiThinking(false);
    }
  };

  const handleMakeGuess = async () => {
    // If there's input, add it to the sentence first
    let finalSentence = sentence;
    if (playerInput.trim()) {
      finalSentence = [...sentence, playerInput.trim()];
      setSentence(finalSentence);
      setPlayerInput("");
      setTotalWords(prev => prev + 1);
    }

    if (finalSentence.length === 0) return;

    setIsAiThinking(true);
    try {
      const sentenceString = finalSentence.join(' ');
      const guess = await guessWord(sentenceString);
      setAiGuess(guess);
      setGameState("showing-guess");
    } catch (error) {
      console.error('Error getting AI guess:', error);
      toast({
        title: "AI Response Delayed",
        description: "The AI is currently busy. Please try again in a moment.",
        variant: "default",
      });
    } finally {
      setIsAiThinking(false);
    }
  };

  const handleNextRound = () => {
    if (handleGuessComplete()) {
      const word = getRandomWord();
      setCurrentWord(word);
      setGameState("showing-word");
      setSentence([]);
      setAiGuess("");
      console.log("Next round started with word:", word);
    } else {
      setGameState("game-over");
    }
  };

  const handlePlayAgain = () => {
    setGameState("welcome");
    setSentence([]);
    setAiGuess("");
    setCurrentWord("");
    setSuccessfulRounds(0);
    setTotalWords(0);
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
    return false;
  };

  const getAverageWordsPerRound = () => {
    if (successfulRounds === 0) return 0;
    return totalWords / (successfulRounds + 1);
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg"
      >
        {gameState === "welcome" ? (
          <WelcomeScreen onStart={handleStart} />
        ) : gameState === "showing-word" ? (
          <WordDisplay
            currentWord={currentWord}
            successfulRounds={successfulRounds}
            onContinue={handleContinue}
          />
        ) : gameState === "building-sentence" ? (
          <SentenceBuilder
            currentWord={currentWord}
            successfulRounds={successfulRounds}
            sentence={sentence}
            playerInput={playerInput}
            isAiThinking={isAiThinking}
            onInputChange={setPlayerInput}
            onSubmitWord={handlePlayerWord}
            onMakeGuess={handleMakeGuess}
          />
        ) : gameState === "showing-guess" ? (
          <GuessDisplay
            sentence={sentence}
            aiGuess={aiGuess}
            currentWord={currentWord}
            onNextRound={handleNextRound}
            onPlayAgain={handlePlayAgain}
            currentScore={successfulRounds}
            avgWordsPerRound={getAverageWordsPerRound()}
          />
        ) : gameState === "game-over" ? (
          <GameOver
            successfulRounds={successfulRounds}
            onPlayAgain={handlePlayAgain}
          />
        ) : null}
      </motion.div>
    </div>
  );
};