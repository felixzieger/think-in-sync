import { useContext } from 'react';
import { LanguageContext } from '@/contexts/language-context';
import { translations } from '@/i18n/translations';

export const useTranslation = () => {
  const { language } = useContext(LanguageContext);
  return translations[language];
};
