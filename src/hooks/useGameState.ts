import { useState } from "react";
import { getRandomWord } from "@/lib/words-standard";
import { getRandomSportsWord } from "@/lib/words-sports";
import { getRandomFoodWord } from "@/lib/words-food";
import { getThemedWord } from "@/services/themeService";
import { useToast } from "@/components/ui/use-toast";
import { Language } from "@/i18n/translations";

export type GameState = "welcome" | "theme-selection" | "building-sentence" | "showing-guess" | "game-review" | "invitation";

export const useGameState = (fromSession: string | null, language: Language) => {
  const [gameState, setGameState] = useState<GameState>(fromSession ? "invitation" : "welcome");
  const [currentTheme, setCurrentTheme] = useState<string>("standard");
  const [sessionId, setSessionId] = useState<string>("");
  const [currentWord, setCurrentWord] = useState<string>("");
  const [usedWords, setUsedWords] = useState<string[]>([]);
  const [successfulRounds, setSuccessfulRounds] = useState<number>(0);
  const [totalWords, setTotalWords] = useState<number>(0);
  const { toast } = useToast();

  const getNewWord = async (theme: string) => {
    try {
      let word;
      switch (theme) {
        case "sports":
          word = getRandomSportsWord(language);
          break;
        case "food":
          word = getRandomFoodWord(language);
          break;
        case "standard":
          word = getRandomWord(language);
          break;
        default:
          word = await getThemedWord(theme, usedWords, language);
      }
      return word;
    } catch (error) {
      console.error('Error getting themed word:', error);
      toast({
        title: "Error",
        description: "Failed to get a word for the selected theme. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  return {
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
  };
};