import { createContext } from 'react';

export type Lang = 'fr' | 'en' | 'es';

export type LangContextValue = {
  lang: Lang;
  setLang: (l: Lang) => void;
};

export const LangContext = createContext<LangContextValue | null>(null);
