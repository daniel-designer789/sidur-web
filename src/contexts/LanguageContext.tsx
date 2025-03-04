"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'he' | 'en';
type Direction = 'rtl' | 'ltr';

interface LanguageContextType {
  language: Language;
  direction: Direction;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  he: {
    // Dashboard
    'dashboard.title': 'דשבורד מנהל',
    'dashboard.logout': 'התנתק',
    'stats.totalEmployees': 'סה"כ עובדים',
    'stats.scheduledShifts': 'משמרות מתוכננות',
    'stats.pendingRequests': 'בקשות ממתינות',
    'stats.completedSchedules': 'סידורים הושלמו',
    'schedule.weekly': 'סידור עבודה שבועי',
    'schedule.addToSchedule': 'הוסף לסידור',
    'activity.employee': 'פעילות עובדים',
    'shifts.distribution': 'התפלגות משמרות',
    'submissions.recent': 'הגשות אחרונות',
    'submissions.empty': 'טרם הוגשו סידורי עבודה',
    'submissions.submittedAt': 'הוגש ב-',
    'submissions.weekStarting': 'לשבוע המתחיל ב-',
    
    // Shifts
    'shift.morning': 'משמרת בוקר',
    'shift.evening': 'משמרת ערב',
    'shift.closing': 'משמרת סגירה',
    
    // Days
    'day.sunday': 'ראשון',
    'day.monday': 'שני',
    'day.tuesday': 'שלישי',
    'day.wednesday': 'רביעי',
    'day.thursday': 'חמישי',
    'day.friday': 'שישי',
    'day.saturday': 'שבת',
    
    // Common
    'common.loading': 'טוען...',
    'common.error': 'שגיאה',
    'common.success': 'הצלחה',
    'common.cancel': 'ביטול',
    'common.save': 'שמור',
    'common.edit': 'ערוך',
    'common.delete': 'מחק',
  },
  en: {
    // Dashboard
    'dashboard.title': 'Admin Dashboard',
    'dashboard.logout': 'Logout',
    'stats.totalEmployees': 'Total Employees',
    'stats.scheduledShifts': 'Scheduled Shifts',
    'stats.pendingRequests': 'Pending Requests',
    'stats.completedSchedules': 'Completed Schedules',
    'schedule.weekly': 'Weekly Schedule',
    'schedule.addToSchedule': 'Add to Schedule',
    'activity.employee': 'Employee Activity',
    'shifts.distribution': 'Shifts Distribution',
    'submissions.recent': 'Recent Submissions',
    'submissions.empty': 'No schedule submissions yet',
    'submissions.submittedAt': 'Submitted at',
    'submissions.weekStarting': 'Week starting',
    
    // Shifts
    'shift.morning': 'Morning Shift',
    'shift.evening': 'Evening Shift',
    'shift.closing': 'Closing Shift',
    
    // Days
    'day.sunday': 'Sunday',
    'day.monday': 'Monday',
    'day.tuesday': 'Tuesday',
    'day.wednesday': 'Wednesday',
    'day.thursday': 'Thursday',
    'day.friday': 'Friday',
    'day.saturday': 'Saturday',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('he');
  const direction = language === 'he' ? 'rtl' : 'ltr';

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage) {
      setLanguageState(savedLanguage);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
    document.documentElement.dir = lang === 'he' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['he']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, direction, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
} 