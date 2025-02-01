import { createContext, useState, useEffect, ReactNode } from 'react';
import { Language } from '@/i18n/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
}

export const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
});

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    const savedLang = localStorage.getItem('language') as Language;
    console.log('[LanguageContext] Initial load - Saved language:', savedLang);
    if (savedLang && ['en', 'fr', 'de', 'it', 'es'].includes(savedLang)) {
      setLanguage(savedLang);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    console.log('[LanguageContext] Setting new language:', lang);
    setLanguage(lang);
    localStorage.setItem('language', lang);
    console.log('[LanguageContext] Updated localStorage:', localStorage.getItem('language'));
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};