import { useState, KeyboardEvent, useEffect, useContext } from "react";
import { useSearchParams, useParams, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { generateAIResponse, guessWord } from "@/services/aiService";
import { createGame, createSession } from "@/services/gameService";
import { getDailyGame } from "@/services/dailyGameService";
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
import { Language } from "@/i18n/translations";
import { normalizeWord } from "@/lib/wordProcessing";

type GameState = "welcome" | "theme-selection" | "building-sentence" | "showing-guess" | "game-review" | "invitation";

export const GameContainer = () => {
  const [searchParams] = useSearchParams();
  const { gameId: urlGameId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const fromSessionParam = searchParams.get('from_session');
  const [fromSession, setFromSession] = useState<string | null>(fromSessionParam);
  const [gameState, setGameState] = useState<GameState>(fromSessionParam ? "invitation" : "welcome");
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
  const [totalWordsInSuccessfulRounds, setTotalWordsInSuccessfulRounds] = useState<number>(0);
  const [lives, setLives] = useState<number>(3);
  const { toast } = useToast();
  const t = useTranslation();
  const { language, setLanguage } = useContext(LanguageContext);

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
    if (urlGameId && !gameId) {
      handleLoadGameFromUrl();
    }
  }, [urlGameId]);

  useEffect(() => {
    if (location.pathname === '/' && gameId) {
      console.log("Location changed to root with active gameId, handling back navigation");
      handleBack();
    }
  }, [location.pathname, gameId]);

  const handleStartDaily = async () => {
    try {
      const dailyGameId = await getDailyGame(language);
      handlePlayAgain(dailyGameId);
    } catch (error) {
      console.error('Error starting daily game:', error);
      toast({
        title: "Error",
        description: "Failed to start the daily challenge. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleLoadGameFromUrl = async () => {
    if (!urlGameId) return;

    try {
      const { data: gameData, error: gameError } = await supabase
        .from('games')
        .select('theme, words, language')
        .eq('id', urlGameId)
        .single();

      if (gameError) throw gameError;

      const { data: sessionData, error: sessionError } = await supabase
        .from('sessions')
        .select('id, lives')
        .eq('game_id', urlGameId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      const newSessionId = sessionData?.id || await createSession(urlGameId);
      const currentLives = sessionData?.lives ?? 3;

      // Set the language to match the game's language
      if (gameData.language) {
        console.log("Setting language to match game's language:", gameData.language);
        setLanguage(gameData.language as Language);
      }

      setCurrentTheme(gameData.theme);
      setWords(gameData.words);
      setCurrentWordIndex(0);
      setGameId(urlGameId);
      setSessionId(newSessionId);
      setLives(currentLives);
      setGameState("building-sentence");
      console.log("Game started from URL with game ID:", urlGameId);
    } catch (error) {
      console.error('Error loading game from URL:', error);
      toast({
        title: "Error",
        description: "Failed to load the game. Please try again.",
        variant: "destructive",
      });
      navigate('/');
    }
  };

  const handleStart = () => {
    setGameState("theme-selection");
  };

  const handleBack = () => {
    console.log("Handling back navigation, resetting game state");
    setGameState("welcome");
    setSentence([]);
    setAiGuess("");
    setCurrentTheme("standard");
    setSuccessfulRounds(0);
    setTotalWordsInSuccessfulRounds(0);
    setWords([]);
    setCurrentWordIndex(0);
    setGameId("");
    setSessionId("");
    setFromSession(null);
    navigate('/');
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

      navigate(`/game/${sessionData.game_id}`);
      console.log("Redirecting to game with ID:", sessionData.game_id);
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

      navigate(`/game/${newGameId}`);

      setGameId(newGameId);
      setSessionId(newSessionId);
      setWords(gameData.words);
      setCurrentWordIndex(0);
      setGameState("building-sentence");
      setSuccessfulRounds(0);
      setTotalWordsInSuccessfulRounds(0);
      setLives(3);
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

    setIsAiThinking(true);
    try {
      const aiWord = await generateAIResponse(currentWord, newSentence, language);
      const newSentenceWithAi = [...newSentence, aiWord];
      setSentence(newSentenceWithAi);
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
      }

      if (finalSentence.length === 0) return;

      const sentenceString = finalSentence.join(' ');
      const guess = await guessWord(sentenceString, language);
      setAiGuess(guess);

      const isCorrect = normalizeWord(guess, language) === normalizeWord(currentWord, language);

      if (isCorrect) {
        setTotalWordsInSuccessfulRounds(prev => prev + finalSentence.length);
      } else {
        const newLives = lives - 1;
        setLives(newLives);
        // Update lives in the database
        await supabase
          .from('sessions')
          .update({ lives: newLives })
          .eq('id', sessionId);
      }

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
    } else if (lives > 1) {
      setGameState("building-sentence");
      setSentence([]);
      setAiGuess("");
    } else {
      setGameState("game-review");
    }
  };

  const handlePlayAgain = (gameId?: string, fromSession?: string) => {
    setSentence([]);
    setAiGuess("");
    setSuccessfulRounds(0);
    setTotalWordsInSuccessfulRounds(0);
    setWords([]);
    setCurrentWordIndex(0);
    setSessionId("");
    if (fromSession) {
      setFromSession(fromSession);
    } else {
      setFromSession(null);
    }
    if (gameId) {
      navigate(`/game/${gameId}`);
      handleLoadGameFromUrl()
    }
    else {
      setGameState("theme-selection");
      setCurrentTheme("standard");
      setGameId("");
      navigate(`/`);
    }
  };

  const handleGameReview = () => {
    setGameState("game-review");
  }

  const isGuessCorrect = () => {
    return normalizeWord(aiGuess, language) === normalizeWord(currentWord, language);
  };

  const getAverageWordsPerRound = () => {
    if (successfulRounds === 0) return 0;
    return totalWordsInSuccessfulRounds / successfulRounds;
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-1 md:p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full md:max-w-md rounded-none md:rounded-xl bg-transparent md:bg-white p-4 md:p-8 md:shadow-lg"
      >
        {gameState === "welcome" ? (
          <WelcomeScreen onStartDaily={handleStartDaily} onStartNew={handleStart} />
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
            normalizeWord={(word: string) => normalizeWord(word, language)}
            onBack={handleBack}
            onClose={handleBack}
            lives={lives}
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
            normalizeWord={(word: string) => normalizeWord(word, language)}
            lives={lives}
          />
        ) : (
          <GameReview
            currentScore={successfulRounds}
            avgWordsPerRound={getAverageWordsPerRound()}
            onPlayAgain={handlePlayAgain}
            onBack={handleBack}
            gameId={gameId}
            sessionId={sessionId}
            currentTheme={currentTheme}
            fromSession={fromSession}
          />
        )}
      </motion.div>
    </div>
  );
};
