"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

interface AppContextType {
  language: string;
  setLanguage: (lang: string) => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [language, setLanguage] = useState('he');
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  // Handle initial mount and system preferences
  useEffect(() => {
    // Check system preference for dark mode
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Get saved theme or use system preference
    const savedTheme = localStorage.getItem('theme');
    const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
    
    // Apply initial theme
    setTheme(initialTheme as 'light' | 'dark');
    if (initialTheme === 'dark') {
      document.documentElement.classList.add('dark');
    }

    // Get saved language
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }

    setMounted(true);
  }, []);

  // Handle theme changes
  const handleThemeChange = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    
    const root = document.documentElement;
    if (newTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  };

  // Handle language changes
  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
    document.documentElement.lang = newLanguage;
    document.documentElement.dir = newLanguage === 'he' || newLanguage === 'ar' ? 'rtl' : 'ltr';
  };

  if (!mounted) {
    return null;
  }

  return (
    <AppContext.Provider 
      value={{ 
        language, 
        setLanguage: handleLanguageChange, 
        theme, 
        setTheme: handleThemeChange 
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
} 