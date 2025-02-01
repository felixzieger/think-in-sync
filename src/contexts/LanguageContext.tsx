import { createContext, useState, useEffect, ReactNode } from 'react';
import { Language } from '@/i18n/translations';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  setGameLanguage: (gameId: string | null) => Promise<void>;
}

export const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  setGameLanguage: async () => {},
});

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const [language, setLanguage] = useState<Language>('en');
  const [searchParams] = useSearchParams();
  const fromSession = searchParams.get('from_session');

  useEffect(() => {
    const initializeLanguage = async () => {
      // If we're loading from a session, we need to get the game ID first
      if (fromSession) {
        const { data: sessionData } = await supabase
          .from('sessions')
          .select('game_id')
          .eq('id', fromSession)
          .single();

        if (sessionData?.game_id) {
          await setGameLanguage(sessionData.game_id);
          return;
        }
      }

      // If no game is being loaded, use localStorage preference
      const savedLang = localStorage.getItem('language') as Language;
      console.log('[LanguageContext] Initial load - Saved language:', savedLang);
      if (savedLang && ['en', 'fr', 'de', 'it', 'es'].includes(savedLang)) {
        setLanguage(savedLang);
      }
    };

    initializeLanguage();
  }, [fromSession]);

  const handleSetLanguage = (lang: Language) => {
    console.log('[LanguageContext] Setting new language:', lang);
    setLanguage(lang);
    localStorage.setItem('language', lang);
    console.log('[LanguageContext] Updated localStorage:', localStorage.getItem('language'));
  };

  const setGameLanguage = async (gameId: string | null) => {
    if (!gameId) {
      console.log('[LanguageContext] No game ID provided, keeping current language');
      return;
    }

    console.log('[LanguageContext] Fetching game language for game:', gameId);
    const { data: gameData } = await supabase
      .from('games')
      .select('language')
      .eq('id', gameId)
      .single();

    if (gameData?.language && ['en', 'fr', 'de', 'it', 'es'].includes(gameData.language)) {
      console.log('[LanguageContext] Setting game language:', gameData.language);
      setLanguage(gameData.language as Language);
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, setGameLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};