
import { supabase } from "@/integrations/supabase/client";

export const generateAIResponse = async (currentWord: string, currentSentence: string[], language: string = 'en', model?: string): Promise<string> => {
  console.log('Calling generate-word function with:', { currentWord, currentSentence, language });

  const { data, error } = await supabase.functions.invoke('generate-word', {
    body: {
      currentWord,
      currentSentence: currentSentence.join(' '),
      language,
      model
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

  console.log('AI generated word:', data.word, 'using model:', data.model);
  return data.word;
};

export const guessWord = async (sentence: string, language: string, model?: string): Promise<{ guess: string; model: string }> => {
  console.log('Processing guess for sentence:', sentence);

  const words = sentence.trim().split(/\s+/);

  console.log('Calling guess-word function with sentence:', sentence, 'language:', language);

  const { data, error } = await supabase.functions.invoke('guess-word', {
    body: {
      sentence,
      language,
      model
    }
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

  console.log('AI guessed:', data.guess, 'using model:', data.model);
  return { guess: data.guess, model: data.model };
};
