import { supabase } from "@/integrations/supabase/client";
import { getRandomWord } from "@/lib/words-standard";
import { getRandomSportsWord } from "@/lib/words-sports";
import { getRandomFoodWord } from "@/lib/words-food";
import { getThemedWord } from "./themeService";
import { Language } from "@/i18n/translations";

const generateWordsForTheme = async (theme: string, wordCount: number = 10, language: Language = 'en'): Promise<string[]> => {
  console.log('Generating words for theme:', theme, 'count:', wordCount, 'language:', language);

  const words: string[] = [];
  const usedWords: string[] = [];

  for (let i = 0; i < wordCount; i++) {
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
    words.push(word);
    usedWords.push(word);
  }

  return words;
};

export const createGame = async (theme: string, language: Language = 'en'): Promise<string> => {
  console.log('Creating new game with theme:', theme);

  const words = await generateWordsForTheme(theme, 25, language);

  const { data: game, error } = await supabase
    .from('games')
    .insert({
      theme,
      words
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating game:', error);
    throw error;
  }

  console.log('Game created successfully:', game);
  return game.id;
};

export const createSession = async (gameId: string): Promise<string> => {
  console.log('Creating new session for game:', gameId);

  const { data: session, error } = await supabase
    .from('sessions')
    .insert({
      game_id: gameId
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating session:', error);
    throw error;
  }

  console.log('Session created successfully:', session);
  return session.id;
};