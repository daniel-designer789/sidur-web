"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
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
  const [weekStart, setWeekStart] = useState(startOfWeek(new Date(), { locale: he }));
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
    } catch (error) {
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus('idle'), 3000);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            היי {employeeName}, בוא נקבע את המשמרות שלך
          </h1>
          <button
            onClick={() => {
              localStorage.removeItem('employeeName');
              router.push('/');
            }}
            className="text-red-500 hover:text-red-600"
          >
            התנתק
          </button>
        </div>

        <div className="space-y-6">
          {days.map((day, dayIndex) => (
            <div
              key={day.date.toISOString()}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4"
            >
              <h3 className="text-lg font-medium mb-4">
                {format(day.date, 'EEEE, d/M/yyyy', { locale: he })}
              </h3>

              <div className="space-y-4">
                <div className="flex flex-wrap gap-3">
                  {Object.entries(shiftTypes).map(([type, { label }]) => (
                    <button
                      key={type}
                      onClick={() => handleShiftToggle(dayIndex, type as keyof ShiftPreference)}
                      className={`
                        px-4 py-2 rounded-lg transition-colors
                        ${day.preferences[type as keyof ShiftPreference]
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}
                      `}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    הערות
                  </label>
                  <textarea
                    value={day.preferences.notes}
                    onChange={(e) => handleNotesChange(dayIndex, e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                    rows={2}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <button
            onClick={handleSubmit}
            disabled={submitStatus === 'submitting'}
            className={`
              px-8 py-3 rounded-lg font-medium text-white
              ${submitStatus === 'submitting'
                ? 'bg-gray-400'
                : 'bg-blue-500 hover:bg-blue-600'}
              transition-colors
            `}
          >
            {submitStatus === 'submitting' ? 'שולח...' : 'שלח סידור'}
          </button>
        </div>

        {submitStatus === 'success' && (
          <div className="mt-4 p-4 bg-green-100 text-green-800 rounded-lg text-center">
            הסידור נשלח בהצלחה!
          </div>
        )}

        {submitStatus === 'error' && (
          <div className="mt-4 p-4 bg-red-100 text-red-800 rounded-lg text-center">
            אופס! משהו השתבש. נסה שוב.
          </div>
        )}
      </div>
    </div>
  );
} 