"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { format, addDays, startOfWeek } from 'date-fns';
import { he } from 'date-fns/locale';

interface ShiftPreference {
  morning: boolean;
  evening: boolean;
  closing: boolean;
  notes: string;
}

interface DayPreference {
  date: Date;
  preferences: ShiftPreference;
}

const shiftTypes = {
  morning: {
    label: 'משמרת בוקר',
    startTime: '08:00',
    endTime: '16:00',
  },
  evening: {
    label: 'משמרת ערב',
    startTime: '16:00',
    endTime: '24:00',
  },
  closing: {
    label: 'משמרת סגירה',
    startTime: '17:00',
    endTime: '01:00',
  }
};

export default function EmployeeDashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const employeeName = searchParams?.get('name') || '';
  const [weekStart] = useState(startOfWeek(new Date(), { locale: he }));
  const [days, setDays] = useState<DayPreference[]>([]);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  useEffect(() => {
    if (!employeeName) {
      router.push('/');
      return;
    }

    const newDays = Array.from({ length: 7 }).map((_, index) => ({
      date: addDays(weekStart, index),
      preferences: {
        morning: false,
        evening: false,
        closing: false,
        notes: ''
      }
    }));
    setDays(newDays);
  }, [weekStart, employeeName, router]);

  const handleShiftToggle = (dayIndex: number, shift: keyof ShiftPreference) => {
    setDays(prev => prev.map((day, idx) => 
      idx === dayIndex
        ? {
            ...day,
            preferences: {
              ...day.preferences,
              [shift]: !day.preferences[shift]
            }
          }
        : day
    ));
  };

  const handleNotesChange = (dayIndex: number, notes: string) => {
    setDays(prev => prev.map((day, idx) => 
      idx === dayIndex
        ? {
            ...day,
            preferences: {
              ...day.preferences,
              notes
            }
          }
        : day
    ));
  };

  const handleSubmit = async () => {
    setSubmitStatus('submitting');
    try {
      const submission = {
        employeeName,
        submittedAt: new Date().toISOString(),
        weekStart: weekStart.toISOString(),
        preferences: days.reduce((acc, day) => ({
          ...acc,
          [day.date.toISOString()]: day.preferences
        }), {})
      };

      const existingSubmissions = JSON.parse(localStorage.getItem('scheduleSubmissions') || '[]');
      localStorage.setItem('scheduleSubmissions', JSON.stringify([...existingSubmissions, submission]));

      setSubmitStatus('success');
      setTimeout(() => setSubmitStatus('idle'), 2000);
    } catch {
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus('idle'), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto py-4 sm:py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6 sm:mb-8">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              היי {employeeName}, בוא נקבע את המשמרות שלך
            </h1>
            <button
              onClick={() => {
                localStorage.removeItem('employeeName');
                router.push('/');
              }}
              className="px-4 py-2 rounded-lg text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20
                       transition-colors duration-200 text-sm sm:text-base"
            >
              התנתק
            </button>
          </div>

          <div className="space-y-4 sm:space-y-6">
            {days.map((day, dayIndex) => (
              <div
                key={day.date.toISOString()}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 sm:p-6"
              >
                <h3 className="text-base sm:text-lg font-medium mb-4 text-gray-900 dark:text-white">
                  {format(day.date, 'EEEE, d/M/yyyy', { locale: he })}
                </h3>

                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    {Object.entries(shiftTypes).map(([type, { label }]) => (
                      <button
                        key={type}
                        onClick={() => handleShiftToggle(dayIndex, type as keyof ShiftPreference)}
                        className={`
                          flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-lg transition-colors duration-200
                          text-sm sm:text-base font-medium
                          focus:outline-none focus:ring-2 focus:ring-offset-2
                          active:scale-95 touch-manipulation
                          ${day.preferences[type as keyof ShiftPreference]
                            ? 'bg-blue-500 text-white focus:ring-blue-500'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:ring-gray-500'}
                        `}
                      >
                        {label}
                      </button>
                    ))}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      הערות
                    </label>
                    <textarea
                      value={day.preferences.notes}
                      onChange={(e) => handleNotesChange(dayIndex, e.target.value)}
                      className="w-full px-4 py-3 border rounded-lg text-sm sm:text-base
                               bg-white dark:bg-gray-700 
                               border-gray-300 dark:border-gray-600 
                               text-gray-900 dark:text-white
                               focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                               focus:border-transparent
                               placeholder-gray-400 dark:placeholder-gray-500
                               resize-none"
                      rows={2}
                      placeholder="הוסף הערות או בקשות מיוחדות..."
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 sm:mt-8 flex justify-center">
            <button
              onClick={handleSubmit}
              disabled={submitStatus === 'submitting'}
              className={`
                w-full sm:w-auto px-6 sm:px-8 py-3 rounded-lg 
                font-medium text-base sm:text-lg text-white
                focus:outline-none focus:ring-2 focus:ring-offset-2
                active:scale-95 touch-manipulation
                transition-all duration-200
                ${submitStatus === 'submitting'
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600 focus:ring-blue-500'}
              `}
            >
              {submitStatus === 'submitting' ? 'שולח...' : 'שלח סידור'}
            </button>
          </div>

          {submitStatus === 'success' && (
            <div className="mt-4 p-4 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200 
                          rounded-lg text-center text-sm sm:text-base font-medium">
              הסידור נשלח בהצלחה!
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="mt-4 p-4 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 
                          rounded-lg text-center text-sm sm:text-base font-medium">
              אופס! משהו השתבש. נסה שוב.
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 