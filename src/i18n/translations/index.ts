import { en } from './en';
import { fr } from './fr';
import { de } from './de';
import { it } from './it';
import { es } from './es';
import { pt } from './pt';

export const translations = {
  en,
  fr,
  de,
  it,
  es,
  pt,
} as const;

export type Language = keyof typeof translations;
export type Translation = typeof en;