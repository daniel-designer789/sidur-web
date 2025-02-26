"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Dashboard from '@/components/Dashboard';
import WeeklySchedule from '@/components/WeeklySchedule';
import { format, addDays } from 'date-fns';
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
  const [autoScheduleSuccess, setAutoScheduleSuccess] = useState(false);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('adminLoggedIn');
    if (isLoggedIn !== 'true') {
      router.push('/');
      return;
    }

    // Load submissions from localStorage (in a real app, this would be from your backend)
    const loadSubmissions = () => {
      const savedSubmissions = localStorage.getItem('scheduleSubmissions');
      if (savedSubmissions) {
        setSubmissions(JSON.parse(savedSubmissions));
      }
    };

    loadSubmissions();
    // Set up polling to check for new submissions every 30 seconds
    const interval = setInterval(loadSubmissions, 30000);
    return () => clearInterval(interval);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn');
    router.push('/');
  };

  const handleAutoSchedule = (submission: ScheduleSubmission) => {
    // Get existing shifts
    const existingShifts = JSON.parse(localStorage.getItem('shifts') || '[]');
    const newShifts: Shift[] = [];

    // Go through each day's preferences
    Object.entries(submission.preferences).forEach(([date, pref]) => {
      // Add morning shift if preferred
      if (pref.morning) {
        newShifts.push({
          id: `${date}-morning-${submission.employeeName}`,
          employeeId: submission.employeeName, // Using name as ID for simplicity
          employeeName: submission.employeeName,
          type: 'morning',
          date: date
        });
      }
      // Add evening shift if preferred
      if (pref.evening) {
        newShifts.push({
          id: `${date}-evening-${submission.employeeName}`,
          employeeId: submission.employeeName,
          employeeName: submission.employeeName,
          type: 'evening',
          date: date
        });
      }
      // Add closing shift if preferred
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

    // Combine with existing shifts
    const updatedShifts = [...existingShifts, ...newShifts];
    localStorage.setItem('shifts', JSON.stringify(updatedShifts));

    // Show success message
    setAutoScheduleSuccess(true);
    setTimeout(() => setAutoScheduleSuccess(false), 3000);
  };

  const handleGraphClick = () => {
    router.push('/graphs');
  };

  return (
    <div className="container mx-auto py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">דשבורד מנהל</h1>
        <button onClick={handleLogout} className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700">
          התנתק
        </button>
      </div>

      {/* Layer 1 - Critical Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Weekly Schedule - Takes full width on mobile, half on desktop */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4">סידור עבודה שבועי</h2>
          <WeeklySchedule />
        </div>

        {/* New Submissions */}
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

              {selectedSubmission && (
                <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    פירוט הזמינות של {selectedSubmission.employeeName}
                  </h3>
                  <div className="grid gap-4">
                    {Object.entries(selectedSubmission.preferences).map(([date, pref]) => (
                      <div key={date} className="border dark:border-gray-700 rounded-lg p-4">
                        <div className="font-medium text-gray-900 dark:text-white mb-2">
                          {format(new Date(date), 'EEEE, d/M/yyyy', { locale: he })}
                        </div>
                        <div className="space-y-2">
                          <div className="flex gap-4">
                            {pref.morning && (
                              <span className="text-sm px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded">
                                משמרת בוקר
                              </span>
                            )}
                            {pref.evening && (
                              <span className="text-sm px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded">
                                משמרת ערב
                              </span>
                            )}
                            {pref.closing && (
                              <span className="text-sm px-2 py-1 bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 rounded">
                                משמרת סגירה
                              </span>
                            )}
                          </div>
                          {pref.notes && (
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              הערות: {pref.notes}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Layer 2 - Key Business Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Smart Graph Widget - Takes 2/3 of the width */}
        <div className="lg:col-span-2">
          <SmartGraphWidget onClick={handleGraphClick} />
        </div>
        
        {/* Daily Revenue - Takes 1/3 of the width */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-lg font-bold mb-4">הכנסות היום</h2>
          {/* Revenue component */}
        </div>
      </div>

      {/* Layer 3 - Operational Data */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Selling Items */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-lg font-bold mb-4">פריטים נמכרים</h2>
          {/* Top selling items component */}
        </div>

        {/* Non-Selling Items */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-lg font-bold mb-4">פריטים שלא נמכרו</h2>
          {/* Non-selling items component */}
        </div>
      </div>
    </div>
  );
} 