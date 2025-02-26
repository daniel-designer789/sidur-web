"use client";

import { useState, useEffect } from "react";
import { useApp } from '@/contexts/AppContext';
import { FaMoon, FaBell, FaGlobe, FaBuilding, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

export default function SettingsPage() {
  const [notifications, setNotifications] = useState(true);
  const { theme, setTheme, language, setLanguage } = useApp();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleThemeToggle = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  // Prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-8">הגדרות</h1>
      
      <div className="space-y-6">
        {/* Theme Settings */}
        <div className="bg-white dark:bg-gray-700 rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
            <FaMoon className="inline-block ml-2 mb-1" />
            מצב תצוגה
          </h2>
          <div className="flex items-center">
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={theme === 'dark'}
                onChange={handleThemeToggle}
                className="sr-only peer" 
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              <span className="mr-3 text-sm font-medium text-gray-700 dark:text-gray-200">מצב כהה</span>
            </label>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white dark:bg-gray-700 rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
            <FaBell className="inline-block ml-2 mb-1" />
            התראות
          </h2>
          <div className="space-y-4">
            <label className="flex items-center">
              <input 
                type="checkbox"
                checked={notifications}
                onChange={(e) => setNotifications(e.target.checked)}
                className="form-checkbox h-5 w-5 text-blue-600 rounded border-gray-300 dark:border-gray-500" 
              />
              <span className="mr-3 text-gray-700 dark:text-gray-200">התראות על משמרות חדשות</span>
            </label>
          </div>
        </div>

        {/* Language Settings */}
        <div className="bg-white dark:bg-gray-700 rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
            <FaGlobe className="inline-block ml-2 mb-1" />
            שפה
          </h2>
          <select 
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-200"
          >
            <option value="he">עברית</option>
            <option value="en">English</option>
            <option value="ar">العربية</option>
          </select>
        </div>

        {/* Company Settings */}
        <div className="bg-white dark:bg-gray-700 rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
            <FaBuilding className="inline-block ml-2 mb-1" />
            פרטי החברה
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">שם החברה</label>
              <input type="text" className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-500 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-200" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                <FaMapMarkerAlt className="inline-block ml-1" />
                כתובת
              </label>
              <input type="text" className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-500 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-200" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                <FaPhone className="inline-block ml-1" />
                טלפון
              </label>
              <input type="tel" className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-500 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-200" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 