"use client";

import { useLanguage } from '@/contexts/LanguageContext';
import { useState } from 'react';

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage();
  const [isHovered, setIsHovered] = useState(false);

  const handleToggle = () => {
    setLanguage(language === 'he' ? 'en' : 'he');
  };

  return (
    <button
      onClick={handleToggle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="px-3 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg hover:from-blue-700 hover:to-blue-600 shadow-md hover:shadow-lg transition-all duration-300 flex items-center"
      aria-label={language === 'he' ? 'החלף לאנגלית' : 'Switch to Hebrew'}
    >
      <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
      </svg>
      <span className="transition-all duration-300">
        {isHovered ? (language === 'he' ? 'English' : 'עברית') : (language === 'he' ? 'EN' : 'HE')}
      </span>
    </button>
  );
} 