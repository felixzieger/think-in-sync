import { supabase } from "@/integrations/supabase/client";

export const generateAIResponse = async (currentWord: string, currentSentence: string[]): Promise<string> => {
  const { data, error } = await supabase.functions.invoke('generate-word', {
    body: { currentWord, currentSentence }
  });

  if (error) {
    console.error('Error generating AI response:', error);
    throw error;
  }

  if (!data.word) {
    throw new Error('No word generated');
  }

  console.log('AI generated word:', data.word);
  return data.word;
};

export const guessWord = async (sentence: string): Promise<string> => {
  const { data, error } = await supabase.functions.invoke('guess-word', {
    body: { sentence }
  });

  if (error) {
    console.error('Error getting AI guess:', error);
    throw error;
  }

  if (!data.guess) {
    throw new Error('No guess generated');
  }

  console.log('AI guessed:', data.guess);
  return data.guess;
};