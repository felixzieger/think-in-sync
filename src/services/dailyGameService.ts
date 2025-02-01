import { supabase } from "@/integrations/supabase/client";

export const getDailyGame = async (language: string = 'en'): Promise<string> => {
  console.log('Fetching daily game for language:', language);
  
  try {
    // First try to get a daily challenge in the user's language
    let { data: dailyChallenge, error } = await supabase
      .from('daily_challenges')
      .select('game_id, games!inner(language)')
      .eq('is_active', true)
      .eq('games.language', language)
      .single();

    // If no challenge exists in user's language, fall back to English
    if (!dailyChallenge) {
      console.log('No daily challenge found for language:', language, 'falling back to English');
      const { data: englishChallenge, error: englishError } = await supabase
        .from('daily_challenges')
        .select('game_id')
        .eq('is_active', true)
        .single();

      if (englishError) throw englishError;
      if (!englishChallenge) throw new Error('No active daily challenge found');
      
      dailyChallenge = englishChallenge;
    }

    console.log('Found daily game:', dailyChallenge.game_id);
    return dailyChallenge.game_id;
  } catch (error) {
    console.error('Error fetching daily game:', error);
    throw error;
  }
};