"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import WeeklySchedule from '@/components/WeeklySchedule';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';
import SmartGraphWidget from '@/components/SmartGraphWidget';

interface ScheduleSubmission {
  employeeName: string;
  submittedAt: string;
  weekStart: string;
  preferences: {
    [date: string]: {
      morning: boolean;
      evening: boolean;
      closing: boolean;
      notes: string;
    };
  };
}

interface Shift {
  id: string;
  employeeId: string;
  employeeName: string;
  type: 'morning' | 'evening' | 'closing';
  date: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [submissions, setSubmissions] = useState<ScheduleSubmission[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<ScheduleSubmission | null>(null);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('adminLoggedIn');
    if (isLoggedIn !== 'true') {
      router.push('/');
      return;
    }

    const loadSubmissions = () => {
      const savedSubmissions = localStorage.getItem('scheduleSubmissions');
      if (savedSubmissions) {
        setSubmissions(JSON.parse(savedSubmissions));
      }
    };

    loadSubmissions();
    const interval = setInterval(loadSubmissions, 30000);
    return () => clearInterval(interval);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn');
    router.push('/');
  };

  const handleAutoSchedule = (submission: ScheduleSubmission) => {
    const existingShifts = JSON.parse(localStorage.getItem('shifts') || '[]');
    const newShifts: Shift[] = [];

    Object.entries(submission.preferences).forEach(([date, pref]) => {
      if (pref.morning) {
        newShifts.push({
          id: `${date}-morning-${submission.employeeName}`,
          employeeId: submission.employeeName,
          employeeName: submission.employeeName,
          type: 'morning',
          date: date
        });
      }
      if (pref.evening) {
        newShifts.push({
          id: `${date}-evening-${submission.employeeName}`,
          employeeId: submission.employeeName,
          employeeName: submission.employeeName,
          type: 'evening',
          date: date
        });
      }
      if (pref.closing) {
        newShifts.push({
          id: `${date}-closing-${submission.employeeName}`,
          employeeId: submission.employeeName,
          employeeName: submission.employeeName,
          type: 'closing',
          date: date
        });
      }
    });

    const updatedShifts = [...existingShifts, ...newShifts];
    localStorage.setItem('shifts', JSON.stringify(updatedShifts));
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">דשבורד מנהל</h1>
        <button onClick={handleLogout} className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700">
          התנתק
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4">סידור עבודה שבועי</h2>
          <WeeklySchedule />
        </div>

        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4">סידורי עבודה שהוגשו</h2>
          {submissions.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400">טרם הוגשו סידורי עבודה</p>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                {submissions.map((submission, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border ${
                      selectedSubmission === submission
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                    }`}
                  >
                    <div className="font-medium text-gray-900 dark:text-white">
                      {submission.employeeName}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      הוגש ב-{format(new Date(submission.submittedAt), 'dd/MM/yyyy HH:mm')}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      לשבוע המתחיל ב-{format(new Date(submission.weekStart), 'dd/MM/yyyy')}
                    </div>
                    <div className="mt-3 flex justify-between items-center">
                      <button
                        onClick={() => setSelectedSubmission(submission)}
                        className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm"
                      >
                        צפה בפרטים
                      </button>
                      <button
                        onClick={() => handleAutoSchedule(submission)}
                        className="bg-green-600 hover:bg-green-700 text-white text-sm px-3 py-1 rounded"
                      >
                        הוסף לסידור
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 