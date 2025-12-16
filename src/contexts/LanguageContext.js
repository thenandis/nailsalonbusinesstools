import React, { createContext, useContext, useState, useEffect } from 'react';

// Create language context
const LanguageContext = createContext();

// Hook to use language context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Language provider component
export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    // Load saved language preference or default to English
    const saved = localStorage.getItem('app_language');
    return saved || 'en';
  });

  // Save language preference whenever it changes
  useEffect(() => {
    localStorage.setItem('app_language', language);
  }, [language]);

  const changeLanguage = (newLanguage) => {
    setLanguage(newLanguage);
  };

  const value = {
    language,
    changeLanguage,
    isVietnamese: language === 'vi',
    isEnglish: language === 'en'
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
