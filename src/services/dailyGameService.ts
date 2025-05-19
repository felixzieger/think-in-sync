import { supabase } from "@/integrations/supabase/client";

interface DailyGameData {
  game_id: string;
  words: string[];
  theme: string;
  language: string;
}

export const getDailyGame = async (language: string = 'en'): Promise<DailyGameData> => {
  console.log('Fetching daily game for language:', language);

  try {
    // First try to get a daily challenge in the user's language
    let { data: dailyChallenge, error } = await supabase
      .from('daily_challenges')
      .select('game_id, games!inner(words, theme, language)')
      .eq('is_active', true)
      .eq('games.language', language)
      .maybeSingle();

    // If no challenge exists in user's language, fall back to English
    if (!dailyChallenge) {
      console.log('No daily challenge found for language:', language, 'falling back to English');
      const { data: englishChallenge, error: englishError } = await supabase
        .from('daily_challenges')
        .select('game_id, games!inner(words, theme, language)')
        .eq('is_active', true)
        .eq('games.language', 'en')
        .maybeSingle();

      if (englishError) throw englishError;
      if (!englishChallenge) throw new Error('No active daily challenge found');

      dailyChallenge = englishChallenge;
    }

    console.log('Found daily game:', dailyChallenge.game_id);
    return {
      game_id: dailyChallenge.game_id,
      words: dailyChallenge.games.words,
      theme: dailyChallenge.games.theme,
      language: dailyChallenge.games.language
    };
  } catch (error) {
    console.error('Error fetching daily game:', error);
    throw error;
  }
};

interface DailyGameInfo {
  game_id: string;
  language: string;
}

export const getDailyGames = async (): Promise<DailyGameInfo[]> => {
  try {
    const { data: dailyChallenges, error } = await supabase
      .from('daily_challenges')
      .select('game_id, games!inner(language)')
      .eq('is_active', true);

    if (error) throw error;
    if (!dailyChallenges) return [];

    return dailyChallenges.map(challenge => ({
      game_id: challenge.game_id,
      language: challenge.games.language
    }));
  } catch (error) {
    console.error('Error fetching daily games:', error);
    throw error;
  }
};