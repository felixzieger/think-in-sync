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