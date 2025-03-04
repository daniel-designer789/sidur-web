"use client";

import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function SettingsPage() {
  const { language } = useLanguage();
  const [generalSettings, setGeneralSettings] = useState({
    companyName: 'חברה לדוגמא בע"מ',
    workWeekStarts: 'sunday',
    darkMode: 'auto',
    language: 'he',
  });
  
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    schedulePublishedAlert: true,
    employeeSubmissionAlert: true,
    reminderBeforeShift: true,
  });
  
  const [shiftSettings, setShiftSettings] = useState({
    morningShiftStart: '08:00',
    morningShiftEnd: '16:00',
    eveningShiftStart: '16:00',
    eveningShiftEnd: '24:00',
    closingShiftStart: '21:00',
    closingShiftEnd: '01:00',
  });

  const handleGeneralChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setGeneralSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleNotificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setNotificationSettings(prev => ({
      ...prev,
      [name]: checked,
    }));
  };
  
  const handleShiftChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShiftSettings(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const saveSettings = () => {
    // In a real app, this would save settings to a backend
    alert(language === 'he' ? 'ההגדרות נשמרו בהצלחה!' : 'Settings saved successfully!');
  };

  const labels = {
    title: language === 'he' ? 'הגדרות מערכת' : 'System Settings',
    saveBtn: language === 'he' ? 'שמור שינויים' : 'Save Changes',
    resetBtn: language === 'he' ? 'אפס הגדרות' : 'Reset Settings',
    sections: {
      general: language === 'he' ? 'הגדרות כלליות' : 'General Settings',
      notifications: language === 'he' ? 'התראות' : 'Notifications',
      shifts: language === 'he' ? 'הגדרות משמרות' : 'Shift Settings',
    },
    fields: {
      companyName: language === 'he' ? 'שם החברה' : 'Company Name',
      workWeekStarts: language === 'he' ? 'תחילת שבוע עבודה' : 'Work Week Starts',
      darkMode: language === 'he' ? 'מצב כהה' : 'Dark Mode',
      languageSetting: language === 'he' ? 'שפה' : 'Language',
      emailNotifications: language === 'he' ? 'התראות במייל' : 'Email Notifications',
      schedulePublishedAlert: language === 'he' ? 'התראה על פרסום סידור עבודה' : 'Schedule Published Alert',
      employeeSubmissionAlert: language === 'he' ? 'התראה על הגשות עובדים' : 'Employee Submission Alert',
      reminderBeforeShift: language === 'he' ? 'תזכורת לפני משמרת' : 'Reminder Before Shift',
      morningShiftStart: language === 'he' ? 'תחילת משמרת בוקר' : 'Morning Shift Start',
      morningShiftEnd: language === 'he' ? 'סיום משמרת בוקר' : 'Morning Shift End',
      eveningShiftStart: language === 'he' ? 'תחילת משמרת ערב' : 'Evening Shift Start',
      eveningShiftEnd: language === 'he' ? 'סיום משמרת ערב' : 'Evening Shift End',
      closingShiftStart: language === 'he' ? 'תחילת משמרת סגירה' : 'Closing Shift Start',
      closingShiftEnd: language === 'he' ? 'סיום משמרת סגירה' : 'Closing Shift End',
    },
    options: {
      weekdays: {
        sunday: language === 'he' ? 'יום ראשון' : 'Sunday',
        monday: language === 'he' ? 'יום שני' : 'Monday',
      },
      darkMode: {
        auto: language === 'he' ? 'אוטומטי' : 'Auto',
        light: language === 'he' ? 'בהיר' : 'Light',
        dark: language === 'he' ? 'כהה' : 'Dark',
      },
      languages: {
        he: language === 'he' ? 'עברית' : 'Hebrew',
        en: language === 'he' ? 'אנגלית' : 'English',
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 md:mb-0">
            {labels.title}
          </h1>
          <div className="flex gap-4">
            <button 
              onClick={saveSettings}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              {labels.saveBtn}
            </button>
            <button className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-medium py-2 px-4 rounded-lg transition-colors">
              {labels.resetBtn}
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {/* General Settings */}
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                {labels.sections.general}
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {labels.fields.companyName}
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={generalSettings.companyName}
                  onChange={handleGeneralChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {labels.fields.workWeekStarts}
                </label>
                <select
                  name="workWeekStarts"
                  value={generalSettings.workWeekStarts}
                  onChange={handleGeneralChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="sunday">{labels.options.weekdays.sunday}</option>
                  <option value="monday">{labels.options.weekdays.monday}</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {labels.fields.darkMode}
                </label>
                <select
                  name="darkMode"
                  value={generalSettings.darkMode}
                  onChange={handleGeneralChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="auto">{labels.options.darkMode.auto}</option>
                  <option value="light">{labels.options.darkMode.light}</option>
                  <option value="dark">{labels.options.darkMode.dark}</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {labels.fields.languageSetting}
                </label>
                <select
                  name="language"
                  value={generalSettings.language}
                  onChange={handleGeneralChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="he">{labels.options.languages.he}</option>
                  <option value="en">{labels.options.languages.en}</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* Notification Settings */}
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                {labels.sections.notifications}
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="emailNotifications"
                  name="emailNotifications"
                  checked={notificationSettings.emailNotifications}
                  onChange={handleNotificationChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="emailNotifications" className="ms-2 block text-sm text-gray-700 dark:text-gray-300">
                  {labels.fields.emailNotifications}
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="schedulePublishedAlert"
                  name="schedulePublishedAlert"
                  checked={notificationSettings.schedulePublishedAlert}
                  onChange={handleNotificationChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="schedulePublishedAlert" className="ms-2 block text-sm text-gray-700 dark:text-gray-300">
                  {labels.fields.schedulePublishedAlert}
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="employeeSubmissionAlert"
                  name="employeeSubmissionAlert"
                  checked={notificationSettings.employeeSubmissionAlert}
                  onChange={handleNotificationChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="employeeSubmissionAlert" className="ms-2 block text-sm text-gray-700 dark:text-gray-300">
                  {labels.fields.employeeSubmissionAlert}
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="reminderBeforeShift"
                  name="reminderBeforeShift"
                  checked={notificationSettings.reminderBeforeShift}
                  onChange={handleNotificationChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="reminderBeforeShift" className="ms-2 block text-sm text-gray-700 dark:text-gray-300">
                  {labels.fields.reminderBeforeShift}
                </label>
              </div>
            </div>
          </div>
          
          {/* Shift Settings */}
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                {labels.sections.shifts}
              </h2>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {labels.fields.morningShiftStart}
                </label>
                <input
                  type="time"
                  name="morningShiftStart"
                  value={shiftSettings.morningShiftStart}
                  onChange={handleShiftChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {labels.fields.morningShiftEnd}
                </label>
                <input
                  type="time"
                  name="morningShiftEnd"
                  value={shiftSettings.morningShiftEnd}
                  onChange={handleShiftChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {labels.fields.eveningShiftStart}
                </label>
                <input
                  type="time"
                  name="eveningShiftStart"
                  value={shiftSettings.eveningShiftStart}
                  onChange={handleShiftChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {labels.fields.eveningShiftEnd}
                </label>
                <input
                  type="time"
                  name="eveningShiftEnd"
                  value={shiftSettings.eveningShiftEnd}
                  onChange={handleShiftChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {labels.fields.closingShiftStart}
                </label>
                <input
                  type="time"
                  name="closingShiftStart"
                  value={shiftSettings.closingShiftStart}
                  onChange={handleShiftChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {labels.fields.closingShiftEnd}
                </label>
                <input
                  type="time"
                  name="closingShiftEnd"
                  value={shiftSettings.closingShiftEnd}
                  onChange={handleShiftChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 