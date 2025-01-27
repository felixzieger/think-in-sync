import { supabase } from "@/integrations/supabase/client";

export const generateAIResponse = async (currentWord: string, currentSentence: string[], language: string = 'en'): Promise<string> => {
  console.log('Calling generate-word function with:', { currentWord, currentSentence, language });
  
  const { data, error } = await supabase.functions.invoke('generate-word', {
    body: { 
      currentWord, 
      currentSentence: currentSentence.join(' '),
      language 
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
  console.log('Processing guess for sentence:', sentence);
  
  // Check for potential fraud if the sentence has less than 3 words
  const words = sentence.trim().split(/\s+/);
  if (words.length < 3) {
    console.log('Short description detected, checking for fraud...');
    
    try {
      const { data: fraudData, error: fraudError } = await supabase.functions.invoke('detect-fraud', {
        body: { 
          sentence, 
          targetWord: words[0], // First word is usually the target in cheating attempts
          language 
        }
      });

      if (fraudError) throw fraudError;
      
      if (fraudData?.verdict === 'cheating') {
        console.log('Fraud detected!');
        return 'CHEATING';
      }
    } catch (error) {
      console.error('Error in fraud detection:', error);
      // Continue with normal guessing if fraud detection fails
    }
  }

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