import { useState, ReactNode } from 'react';
import { Language } from '@/i18n/translations';
import { LanguageContext } from '@/contexts/language-context';

const supportedLanguages = ['en', 'fr', 'de', 'it', 'es', 'pt'] as const;

function getInitialLanguage(): Language {
  if (typeof window === 'undefined') {
    return 'en';
  }

  const savedLang = localStorage.getItem('language');
  return supportedLanguages.includes(savedLang as Language)
    ? (savedLang as Language)
    : 'en';
}

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const [language, setLanguage] = useState<Language>(getInitialLanguage);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
