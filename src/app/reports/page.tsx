"use client";

import { useState } from 'react';

interface ReportCard {
  title: string;
  description: string;
  icon: string;
}

const reportTypes: ReportCard[] = [
  {
    title: 'דוח שעות עבודה',
    description: 'סיכום שעות העבודה של כל העובדים לפי תאריכים',
    icon: '⏰',
  },
  {
    title: 'דוח נוכחות',
    description: 'פירוט הגעה, איחורים והיעדרויות של עובדים',
    icon: '📋',
  },
  {
    title: 'דוח עלויות',
    description: 'ניתוח עלויות משמרות ושכר עובדים',
    icon: '💰',
  },
  {
    title: 'דוח תפוסה',
    description: 'ניתוח תפוסת משמרות ויעילות העבודה',
    icon: '📊',
  },
];

export default function ReportsPage() {
  return (
    <div className="p-6 dark:bg-gray-900">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">דוחות</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* דוח משמרות */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div className="text-4xl mb-4">📊</div>
          <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">דוח משמרות</h3>
          <p className="text-gray-700 dark:text-gray-300 mb-4">סיכום משמרות לפי עובדים ומחלקות</p>
          <button className="text-blue-600 dark:text-blue-400 font-medium hover:text-blue-700 dark:hover:text-blue-300">צפה בדוח &rarr;</button>
        </div>

        {/* דוח נוכחות */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div className="text-4xl mb-4">📅</div>
          <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">דוח נוכחות</h3>
          <p className="text-gray-700 dark:text-gray-300 mb-4">סיכום נוכחות עובדים לפי תאריכים</p>
          <button className="text-blue-600 dark:text-blue-400 font-medium hover:text-blue-700 dark:hover:text-blue-300">צפה בדוח &rarr;</button>
        </div>

        {/* דוח עלויות */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div className="text-4xl mb-4">💰</div>
          <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">דוח עלויות</h3>
          <p className="text-gray-700 dark:text-gray-300 mb-4">ניתוח עלויות משמרות ושכר עובדים</p>
          <button className="text-blue-600 dark:text-blue-400 font-medium hover:text-blue-700 dark:hover:text-blue-300">צפה בדוח &rarr;</button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">דוחות אחרונים</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-right py-3 px-4 font-medium text-gray-900 dark:text-white">שם הדוח</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900 dark:text-white">תאריך</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900 dark:text-white">נוצר על ידי</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900 dark:text-white">פעולות</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              <tr>
                <td className="py-3 px-4 text-gray-900 dark:text-white">דוח משמרות חודשי</td>
                <td className="py-3 px-4 text-gray-700 dark:text-gray-300">01/03/2024</td>
                <td className="py-3 px-4 text-gray-700 dark:text-gray-300">ישראל ישראלי</td>
                <td className="py-3 px-4">
                  <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">הורד</button>
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-gray-900 dark:text-white">דוח נוכחות שבועי</td>
                <td className="py-3 px-4 text-gray-700 dark:text-gray-300">28/02/2024</td>
                <td className="py-3 px-4 text-gray-700 dark:text-gray-300">חיים כהן</td>
                <td className="py-3 px-4">
                  <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">הורד</button>
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-gray-900 dark:text-white">דוח עלויות רבעוני</td>
                <td className="py-3 px-4 text-gray-700 dark:text-gray-300">25/02/2024</td>
                <td className="py-3 px-4 text-gray-700 dark:text-gray-300">שרה לוי</td>
                <td className="py-3 px-4">
                  <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">הורד</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 