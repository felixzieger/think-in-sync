import { useState, KeyboardEvent, useEffect, useContext } from "react";
import { getRandomWord } from "@/lib/words";
import { motion } from "framer-motion";
import { generateAIResponse, guessWord } from "@/services/mistralService";
import { getThemedWord } from "@/services/themeService";
import { useToast } from "@/components/ui/use-toast";
import { WelcomeScreen } from "./game/WelcomeScreen";
import { ThemeSelector } from "./game/ThemeSelector";
import { SentenceBuilder } from "./game/SentenceBuilder";
import { GuessDisplay } from "./game/GuessDisplay";
import { GameOver } from "./game/GameOver";
import { useTranslation } from "@/hooks/useTranslation";
import { LanguageContext } from "@/contexts/LanguageContext";

type GameState = "welcome" | "theme-selection" | "building-sentence" | "showing-guess" | "game-over";

export const GameContainer = () => {
  const [gameState, setGameState] = useState<GameState>("welcome");
  const [currentWord, setCurrentWord] = useState<string>("");
  const [currentTheme, setCurrentTheme] = useState<string>("standard");
  const [sentence, setSentence] = useState<string[]>([]);
  const [playerInput, setPlayerInput] = useState<string>("");
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [aiGuess, setAiGuess] = useState<string>("");
  const [successfulRounds, setSuccessfulRounds] = useState<number>(0);
  const [totalWords, setTotalWords] = useState<number>(0);
  const [usedWords, setUsedWords] = useState<string[]>([]);
  const { toast } = useToast();
  const t = useTranslation();
  const { language } = useContext(LanguageContext);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        if (gameState === 'welcome') {
          handleStart();
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
    setGameState("theme-selection");
  };

  const handleBack = () => {
    setGameState("welcome");
    setSentence([]);
    setAiGuess("");
    setCurrentWord("");
    setCurrentTheme("standard");
    setSuccessfulRounds(0);
    setTotalWords(0);
    setUsedWords([]);
  };

  const handleThemeSelect = async (theme: string) => {
    setCurrentTheme(theme);
    try {
      const word = theme === "standard" ? 
        getRandomWord() : 
        await getThemedWord(theme, usedWords, language);
      setCurrentWord(word);
      setGameState("building-sentence");
      setSuccessfulRounds(0);
      setTotalWords(0);
      setUsedWords([word]);
      console.log("Game started with word:", word, "theme:", theme, "language:", language);
    } catch (error) {
      console.error('Error getting themed word:', error);
      toast({
        title: "Error",
        description: "Failed to get a word for the selected theme. Please try again.",
        variant: "destructive",
      });
    }
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
      const aiWord = await generateAIResponse(currentWord, newSentence, language);
      const newSentenceWithAi = [...newSentence, aiWord];
      setSentence(newSentenceWithAi);
      setTotalWords(prev => prev + 1);
    } catch (error) {
      console.error('Error in AI turn:', error);
      toast({
        title: t.game.aiThinking,
        description: t.game.aiDelayed,
        variant: "default",
      });
    } finally {
      setIsAiThinking(false);
    }
  };

  const handleMakeGuess = async () => {
    setIsAiThinking(true);
    try {
      let finalSentence = sentence;
      if (playerInput.trim()) {
        finalSentence = [...sentence, playerInput.trim()];
        setSentence(finalSentence);
        setPlayerInput("");
        setTotalWords(prev => prev + 1);
      }

      if (finalSentence.length === 0) return;

      const sentenceString = finalSentence.join(' ');
      const guess = await guessWord(sentenceString, language);
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
      const getNewWord = async () => {
        try {
          const word = currentTheme === "standard" ? 
            getRandomWord() : 
            await getThemedWord(currentTheme, usedWords, language);
          setCurrentWord(word);
          setGameState("building-sentence");
          setSentence([]);
          setAiGuess("");
          setUsedWords(prev => [...prev, word]);
          console.log("Next round started with word:", word, "theme:", currentTheme);
        } catch (error) {
          console.error('Error getting new word:', error);
          toast({
            title: "Error",
            description: "Failed to get a new word. Please try again.",
            variant: "destructive",
          });
        }
      };
      getNewWord();
    } else {
      setGameState("game-over");
    }
  };

  const handlePlayAgain = () => {
    setGameState("theme-selection");
    setSentence([]);
    setAiGuess("");
    setCurrentWord("");
    setCurrentTheme("standard");
    setSuccessfulRounds(0);
    setTotalWords(0);
    setUsedWords([]);
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
        ) : gameState === "theme-selection" ? (
          <ThemeSelector onThemeSelect={handleThemeSelect} onBack={handleBack} />
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
            onBack={handleBack}
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
