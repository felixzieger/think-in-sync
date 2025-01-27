import { supabase } from "@/integrations/supabase/client";
import { Language } from "@/i18n/translations";

export const getThemedWord = async (theme: string, usedWords: string[] = [], language: Language = 'en'): Promise<string> => {
  if (theme === "standard") {
    throw new Error("Standard theme should use the words list");
  }

  console.log('Getting themed word for:', theme, 'language:', language, 'excluding:', usedWords);
  
  const { data, error } = await supabase.functions.invoke('generate-themed-word', {
    body: { theme, usedWords, language }
  });

  if (error) {
    console.error('Error generating themed word:', error);
    throw error;
  }

  if (!data?.word) {
    console.error('No word generated in response:', data);
    throw new Error('No word generated');
  }

  console.log('Generated themed word:', data.word);
  return data.word;
};