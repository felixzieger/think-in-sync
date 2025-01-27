import { supabase } from "@/integrations/supabase/client";

export const generateAIResponse = async (currentWord: string, currentSentence: string[]): Promise<string> => {
  console.log('Calling generate-word function with:', { currentWord, currentSentence });
  
  const { data, error } = await supabase.functions.invoke('generate-word', {
    body: { 
      currentWord, 
      currentSentence: currentSentence.join(' ') 
    }
  });

  if (error) {
    console.error('Error generating AI response:', error);
    if (error.message?.includes('rate limit')) {
      throw new Error('The AI service is currently busy. Please try again in a few moments.');
    }
    throw error;
  }

  if (!data?.word) {
    console.error('No word generated in response:', data);
    throw new Error('No word generated');
  }

  console.log('AI generated word:', data.word);
  return data.word;
};

export const guessWord = async (sentence: string, language: string): Promise<string> => {
  console.log('Calling guess-word function with sentence:', sentence, 'language:', language);
  
  const { data, error } = await supabase.functions.invoke('guess-word', {
    body: { sentence, language }
  });

  if (error) {
    console.error('Error getting AI guess:', error);
    if (error.message?.includes('rate limit')) {
      throw new Error('The AI service is currently busy. Please try again in a few moments.');
    }
    throw error;
  }

  if (!data?.guess) {
    console.error('No guess generated in response:', data);
    throw new Error('No guess generated');
  }

  console.log('AI guessed:', data.guess);
  return data.guess;
};