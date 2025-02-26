"use client";

import { useState } from 'react';

interface Shift {
  id: number;
  date: string;
  employeeName: string;
  hours: string;
  department: string;
  status: 'completed' | 'pending' | 'cancelled';
}

const mockShifts: Shift[] = [
  {
    id: 1,
    date: '2024-03-01',
    employeeName: 'ישראל ישראלי',
    hours: '08:00-16:00',
    department: 'מטבח',
    status: 'completed'
  },
  {
    id: 2,
    date: '2024-03-02',
    employeeName: 'חיים כהן',
    hours: '16:00-24:00',
    department: 'שירות',
    status: 'pending'
  },
  {
    id: 3,
    date: '2024-03-03',
    employeeName: 'שרה לוי',
    hours: '10:00-18:00',
    department: 'בר',
    status: 'cancelled'
  }
];

export default function ShiftsHistoryPage() {
  const [shifts] = useState<Shift[]>(mockShifts);

  const getStatusStyle = (status: Shift['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
      case 'pending':
        return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200';
      case 'cancelled':
        return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200';
      default:
        return 'bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200';
    }
  };

  const getStatusText = (status: Shift['status']) => {
    switch (status) {
      case 'completed':
        return 'הושלם';
      case 'pending':
        return 'ממתין';
      case 'cancelled':
        return 'בוטל';
      default:
        return status;
    }
  };

  return (
    <div className="p-6 dark:bg-gray-900">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">היסטוריית משמרות</h1>
          <p className="text-gray-700 dark:text-gray-300 mt-2">צפייה בהיסטוריית המשמרות במערכת</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-right py-3 px-4 font-medium text-gray-900 dark:text-white">תאריך</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900 dark:text-white">שם העובד</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900 dark:text-white">שעות</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900 dark:text-white">מחלקה</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900 dark:text-white">סטטוס</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {shifts.map((shift) => (
                <tr key={shift.id}>
                  <td className="py-3 px-4 text-gray-900 dark:text-white">
                    {new Date(shift.date).toLocaleDateString('he-IL')}
                  </td>
                  <td className="py-3 px-4 text-gray-700 dark:text-gray-300">{shift.employeeName}</td>
                  <td className="py-3 px-4 text-gray-700 dark:text-gray-300">{shift.hours}</td>
                  <td className="py-3 px-4 text-gray-700 dark:text-gray-300">{shift.department}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm ${getStatusStyle(shift.status)}`}>
                      {getStatusText(shift.status)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 