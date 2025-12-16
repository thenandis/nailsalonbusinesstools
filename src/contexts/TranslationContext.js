import React, { createContext, useContext, useMemo, useState } from 'react';
import { getTranslations } from '../translations/translations';
import { useLanguage } from './LanguageContext';


const TranslationContext = createContext();


export function TranslationProvider({ children }) {
  const { language } = useLanguage();
  const [customTranslations, setCustomTranslations] = useState(null);

  // Merge default and custom translations ONLY if user has uploaded a file
  const translations = useMemo(() => {
    console.log('customTranslations:', customTranslations);
    // If no custom translations, always use translations.js logic
    if (!customTranslations) {
      return getTranslations(language);
    }
    // If user uploaded a file, merge as before
    let base = getTranslations(language);
    if (customTranslations.en || customTranslations.vi) {
      console.log('Merging custom translations for language:', language, customTranslations[language]);
      base = {
        ...base,
        ...(customTranslations[language] || customTranslations['en'] || {})
      };
    }
    return base;
  }, [language, customTranslations]);

  return (
    <TranslationContext.Provider value={{
      language,
      translations,
      setCustomTranslations
    }}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslationContext() {
  return useContext(TranslationContext);
}