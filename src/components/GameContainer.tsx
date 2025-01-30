import { useState, KeyboardEvent, useEffect, useContext } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { generateAIResponse, guessWord } from "@/services/mistralService";
import { createGame, createSession } from "@/services/gameService";
import { useToast } from "@/components/ui/use-toast";
import { WelcomeScreen } from "./game/WelcomeScreen";
import { ThemeSelector } from "./game/ThemeSelector";
import { SentenceBuilder } from "./game/SentenceBuilder";
import { GuessDisplay } from "./game/GuessDisplay";
import { GameReview } from "./game/GameReview";
import { GameInvitation } from "./game/GameInvitation";
import { useTranslation } from "@/hooks/useTranslation";
import { LanguageContext } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";

type GameState = "welcome" | "theme-selection" | "building-sentence" | "showing-guess" | "game-review" | "invitation";

const normalizeWord = (word: string): string => {
  return word.normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z]/g, '')
    .trim();
};

export const GameContainer = () => {
  const [searchParams] = useSearchParams();
  const fromSession = searchParams.get('from_session');
  const [gameState, setGameState] = useState<GameState>(fromSession ? "invitation" : "welcome");
  const [currentTheme, setCurrentTheme] = useState<string>("standard");
  const [sessionId, setSessionId] = useState<string>("");
  const [gameId, setGameId] = useState<string>("");
  const [words, setWords] = useState<string[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);
  const [playerInput, setPlayerInput] = useState<string>("");
  const [sentence, setSentence] = useState<string[]>([]);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [aiGuess, setAiGuess] = useState<string>("");
  const [successfulRounds, setSuccessfulRounds] = useState<number>(0);
  const [totalWords, setTotalWords] = useState<number>(0);
  const { toast } = useToast();
  const t = useTranslation();
  const { language } = useContext(LanguageContext);

  const currentWord = words[currentWordIndex] || "";

  useEffect(() => {
    if (gameState === "theme-selection") {
      setGameId("");
      setSessionId("");
      setWords([]);
      setCurrentWordIndex(0);
    }
  }, [gameState]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        if (gameState === 'welcome') {
          handleStart();
        } else if (gameState === 'showing-guess' && isGuessCorrect()) {
          handleNextRound();
        } else if (gameState === 'showing-guess' && !isGuessCorrect()) {
          handleGameReview();
        } else if (gameState === 'game-review') {
          handlePlayAgain();
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
    setCurrentTheme("standard");
    setSuccessfulRounds(0);
    setTotalWords(0);
    setWords([]);
    setCurrentWordIndex(0);
    setGameId("");
    setSessionId("");
  };

  const handleInvitationContinue = async () => {
    if (!fromSession) return;
    
    try {
      const { data: sessionData, error: sessionError } = await supabase
        .from('sessions')
        .select('game_id')
        .eq('id', fromSession)
        .single();

      if (sessionError) throw sessionError;

      const { data: gameData, error: gameError } = await supabase
        .from('games')
        .select('theme, words')
        .eq('id', sessionData.game_id)
        .single();

      if (gameError) throw gameError;

      setCurrentTheme(gameData.theme);
      setWords(gameData.words);
      setCurrentWordIndex(0);
      setGameId(sessionData.game_id);
      setSessionId(fromSession);
      setGameState("building-sentence");
      console.log("Game started from invitation with session:", fromSession);
    } catch (error) {
      console.error('Error starting game from invitation:', error);
      toast({
        title: "Error",
        description: "Failed to start the game. Please try again.",
        variant: "destructive",
      });
      setGameState("welcome");
    }
  };

  const handleThemeSelect = async (theme: string) => {
    setCurrentTheme(theme);
    try {
      const newGameId = await createGame(theme, language);
      const newSessionId = await createSession(newGameId);
      
      const { data: gameData, error: gameError } = await supabase
        .from('games')
        .select('words')
        .eq('id', newGameId)
        .single();

      if (gameError) throw gameError;

      setGameId(newGameId);
      setSessionId(newSessionId);
      setWords(gameData.words);
      setCurrentWordIndex(0);
      setGameState("building-sentence");
      setSuccessfulRounds(0);
      setTotalWords(0);
      console.log("Game started with theme:", theme, "language:", language);
    } catch (error) {
      console.error('Error starting new game:', error);
      toast({
        title: "Error",
        description: "Failed to start the game. Please try again.",
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

  const saveGameResult = async (sentenceString: string, aiGuess: string, isCorrect: boolean) => {
    try {
      const { error } = await supabase
        .from('game_results')
        .insert({
          target_word: currentWord,
          description: sentenceString,
          ai_guess: aiGuess,
          is_correct: isCorrect,
          session_id: sessionId
        });

      if (error) {
        console.error('Error saving game result:', error);
      } else {
        console.log('Game result saved successfully');
      }
    } catch (error) {
      console.error('Error saving game result:', error);
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

      const isCorrect = normalizeWord(guess) === normalizeWord(currentWord)
      await saveGameResult(sentenceString, guess, isCorrect);

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
    if (isGuessCorrect()) {
      setSuccessfulRounds(prev => prev + 1);
      if (currentWordIndex < words.length - 1) {
        setCurrentWordIndex(prev => prev + 1);
        setGameState("building-sentence");
        setSentence([]);
        setAiGuess("");
        console.log("Next round started with word:", words[currentWordIndex + 1]);
      } else {
        handleGameReview();
      }
    } else {
      setGameState("game-review");
    }
  };

  const handlePlayAgain = () => {
    setGameState("theme-selection");
    setSentence([]);
    setAiGuess("");
    setCurrentTheme("standard");
    setSuccessfulRounds(0);
    setTotalWords(0);
    setWords([]);
    setCurrentWordIndex(0);
    setGameId("");
    setSessionId("");
  };

  const handleGameReview = () => {
    setGameState("game-review");
  }

  const isGuessCorrect = () => {
    return normalizeWord(aiGuess) === normalizeWord(currentWord);
  };

  const getAverageWordsPerRound = () => {
    const totalRounds = currentWordIndex + 1;
    if (totalRounds === 0) return 0;
    return totalWords / totalRounds;
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
        ) : gameState === "invitation" ? (
          <GameInvitation onContinue={handleInvitationContinue} onBack={handleBack} />
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
            normalizeWord={normalizeWord}
            onBack={handleBack}
          />
        ) : gameState === "showing-guess" ? (
          <GuessDisplay
            sentence={sentence}
            aiGuess={aiGuess}
            currentWord={currentWord}
            onNextRound={handleNextRound}
            onGameReview={handleGameReview}
            onBack={handleBack}
            currentScore={successfulRounds}
            avgWordsPerRound={getAverageWordsPerRound()}
            sessionId={sessionId}
            currentTheme={currentTheme}
            normalizeWord={normalizeWord}
          />
        ) : (
          <GameReview
            currentScore={successfulRounds}
            avgWordsPerRound={getAverageWordsPerRound()}
            onPlayAgain={handlePlayAgain}
            sessionId={sessionId}
            currentTheme={currentTheme}
          />
        )}
      </motion.div>
    </div>
  );
};
