import { useContext } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { guessWord } from "@/services/mistralService";
import { useToast } from "@/components/ui/use-toast";
import { WelcomeScreen } from "./game/WelcomeScreen";
import { ThemeSelector } from "./game/ThemeSelector";
import { SentenceBuilder } from "./game/SentenceBuilder";
import { GuessDisplay } from "./game/GuessDisplay";
import { GameReview } from "./game/GameReview";
import { GameInvitation } from "./game/GameInvitation";
import { LanguageContext } from "@/contexts/LanguageContext";
import { useGameState } from "@/hooks/useGameState";
import { useSentenceState } from "@/hooks/useSentenceState";
import { normalizeWord } from "@/utils/wordUtils";
import { supabase } from "@/integrations/supabase/client";

export const GameContainer = () => {
  const [searchParams] = useSearchParams();
  const fromSession = searchParams.get('from_session');
  const { language } = useContext(LanguageContext);
  const { toast } = useToast();

  const {
    gameState,
    setGameState,
    currentTheme,
    setCurrentTheme,
    sessionId,
    setSessionId,
    currentWord,
    setCurrentWord,
    usedWords,
    setUsedWords,
    successfulRounds,
    setSuccessfulRounds,
    totalWords,
    setTotalWords,
    getNewWord,
  } = useGameState(fromSession, language);

  const {
    sentence,
    setSentence,
    playerInput,
    setPlayerInput,
    isAiThinking,
    setIsAiThinking,
    aiGuess,
    setAiGuess,
    handlePlayerWord,
  } = useSentenceState(language);

  const handleStart = () => setGameState("theme-selection");

  const handleBack = () => {
    setGameState("welcome");
    setSentence([]);
    setAiGuess("");
    setCurrentWord("");
    setCurrentTheme("standard");
    setSuccessfulRounds(0);
    setTotalWords(0);
    setUsedWords([]);
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
      setCurrentWord(gameData.words[0]);
      setUsedWords(gameData.words);
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
      const word = await getNewWord(theme);
      setCurrentWord(word);
      setGameState("building-sentence");
      setSuccessfulRounds(0);
      setTotalWords(0);
      setUsedWords([word]);
      console.log("Game started with word:", word, "theme:", theme, "language:", language);
    } catch (error) {
      console.error('Error in theme selection:', error);
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

      const isCorrect = normalizeWord(guess) === normalizeWord(currentWord);
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

  const handleNextRound = async () => {
    const isCorrect = normalizeWord(aiGuess) === normalizeWord(currentWord);
    if (isCorrect) {
      setSuccessfulRounds(prev => prev + 1);
      try {
        const word = await getNewWord(currentTheme);
        setCurrentWord(word);
        setGameState("building-sentence");
        setSentence([]);
        setAiGuess("");
        setUsedWords(prev => [...prev, word]);
        console.log("Next round started with word:", word, "theme:", currentTheme);
      } catch (error) {
        console.error('Error getting new word:', error);
      }
    } else {
      setGameState("game-review");
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

  const getAverageWordsPerRound = () => {
    const totalRounds = usedWords.length;
    return totalRounds === 0 ? 0 : totalWords / totalRounds;
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
            onSubmitWord={(e) => handlePlayerWord(e, currentWord, setTotalWords)}
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
            onGameReview={() => setGameState("game-review")}
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