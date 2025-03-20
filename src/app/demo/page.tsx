"use client";

import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import Link from 'next/link';
import { format } from 'date-fns';
import { he, enUS } from 'date-fns/locale';

// Demo components for showcasing the interface
const Card = ({ title, value, icon, color }: { title: string; value: string | number; icon: React.ReactNode; color: string }) => {
  const { direction } = useLanguage();
  
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-5 ${direction === 'rtl' ? 'text-right' : 'text-left'}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

const DemoSchedule = () => {
  const { language, direction } = useLanguage();
  const locale = language === 'he' ? he : enUS;
  const today = new Date();
  const days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() - today.getDay() + i);
    return date;
  });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-5 overflow-x-auto">
      <h3 className="text-lg font-semibold mb-4">
        {language === 'he' ? 'סידור עבודה שבועי' : 'Weekly Schedule'}
      </h3>
      <div className="grid grid-cols-7 gap-2 min-w-[700px]">
        {days.map((day) => (
          <div key={day.toString()} className="text-center">
            <div className="font-medium">
              {format(day, 'EEEE', { locale })}
            </div>
            <div className="text-sm text-gray-500">
              {format(day, 'd MMM', { locale })}
            </div>
          </div>
        ))}
        
        {days.map((day) => (
          <div key={day.toString() + '-slots'} className="border border-gray-200 dark:border-gray-700 rounded-md p-2">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded mb-2 text-sm">
              {language === 'he' ? 'משמרת בוקר' : 'Morning Shift'}
            </div>
            <div className="bg-indigo-50 dark:bg-indigo-900/20 p-2 rounded mb-2 text-sm">
              {language === 'he' ? 'משמרת ערב' : 'Evening Shift'}
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/20 p-2 rounded text-sm">
              {language === 'he' ? 'משמרת סגירה' : 'Closing Shift'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const DemoEmployeeList = () => {
  const { language } = useLanguage();
  const demoEmployees = [
    { id: 1, name: 'דניאל כהן', name_en: 'Daniel Cohen', position: language === 'he' ? 'מנהל משמרת' : 'Shift Manager', availability: 5 },
    { id: 2, name: 'מיכל לוי', name_en: 'Michal Levi', position: language === 'he' ? 'עובד/ת' : 'Employee', availability: 3 },
    { id: 3, name: 'יוסי אברהם', name_en: 'Yossi Abraham', position: language === 'he' ? 'עובד/ת' : 'Employee', availability: 4 },
    { id: 4, name: 'שירה גולן', name_en: 'Shira Golan', position: language === 'he' ? 'מנהל/ת' : 'Manager', availability: 6 },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-5">
      <h3 className="text-lg font-semibold mb-4">
        {language === 'he' ? 'רשימת עובדים' : 'Employee List'}
      </h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {language === 'he' ? 'שם' : 'Name'}
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {language === 'he' ? 'תפקיד' : 'Position'}
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {language === 'he' ? 'זמינות שבועית' : 'Weekly Availability'}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {demoEmployees.map((employee) => (
              <tr key={employee.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {language === 'he' ? employee.name : employee.name_en}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500 dark:text-gray-300">{employee.position}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex space-x-1 rtl:space-x-reverse">
                    {Array.from({ length: 7 }).map((_, idx) => (
                      <div 
                        key={idx} 
                        className={`w-4 h-4 rounded-full ${idx < employee.availability ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-600'}`}
                      />
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default function DemoPage() {
  const { language, direction } = useLanguage();
  const [currentDate, setCurrentDate] = useState<string>('');

  useEffect(() => {
    const now = new Date();
    const locale = language === 'he' ? he : enUS;
    setCurrentDate(format(now, 'EEEE, MMMM d, yyyy', { locale }));
  }, [language]);

  return (
    <div className={`w-full ${direction === 'rtl' ? 'text-right' : 'text-left'}`}>
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {language === 'he' ? 'דמו ממשק המערכת' : 'Interface Demo'}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          {currentDate}
        </p>
      </header>

      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          {language === 'he' ? 'כרטיסי מידע' : 'Info Cards'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card 
            title={language === 'he' ? 'סה"כ עובדים' : 'Total Employees'} 
            value={24} 
            color="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            }
          />
          <Card 
            title={language === 'he' ? 'משמרות מתוכננות' : 'Scheduled Shifts'} 
            value={42} 
            color="bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            }
          />
          <Card 
            title={language === 'he' ? 'בקשות ממתינות' : 'Pending Requests'} 
            value={7} 
            color="bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          <Card 
            title={language === 'he' ? 'סידורים הושלמו' : 'Completed Schedules'} 
            value={16} 
            color="bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            }
          />
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          {language === 'he' ? 'סידור עבודה' : 'Schedule'}
        </h2>
        <DemoSchedule />
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          {language === 'he' ? 'עובדים' : 'Employees'}
        </h2>
        <DemoEmployeeList />
      </div>

      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <div className="flex items-center">
          <svg className="w-6 h-6 text-blue-500 mr-2 rtl:ml-2 rtl:mr-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="font-medium">
            {language === 'he' 
              ? 'שים לב: זהו דף דמו להצגת ממשק המשתמש של המערכת. השתמש בכפתור החלפת השפה בסרגל הצד לבדיקת תמיכה דו-כיוונית ותרגום.' 
              : 'Note: This is a demo page showcasing the system UI. Use the language toggle in the sidebar to test bidirectional support and translations.'}
          </span>
        </div>
      </div>
    </div>
  );
} 