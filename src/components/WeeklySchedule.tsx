"use client";

import { useEffect, useState } from 'react';
import { format, addDays, startOfWeek } from 'date-fns';
import { he, enUS } from 'date-fns/locale';
import { useLanguage } from '@/contexts/LanguageContext';

interface Shift {
  id: string;
  employeeId: string;
  employeeName: string;
  type: 'morning' | 'evening' | 'closing';
  date: string;
}

export default function WeeklySchedule() {
  const { t, language, direction } = useLanguage();
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [weekStart, setWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 0 }));
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [weekOffset, setWeekOffset] = useState(0);

  useEffect(() => {
    const savedShifts = localStorage.getItem('shifts');
    if (savedShifts) {
      setShifts(JSON.parse(savedShifts));
    }
  }, []);

  useEffect(() => {
    const newWeekStart = startOfWeek(new Date(), { weekStartsOn: 0 });
    newWeekStart.setDate(newWeekStart.getDate() + (weekOffset * 7));
    setWeekStart(newWeekStart);
  }, [weekOffset]);

  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const getShiftsForDay = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return shifts.filter(shift => shift.date === dateStr);
  };

  const getShiftStyle = (type: string) => {
    switch (type) {
      case 'morning':
        return 'bg-blue-500 text-white border-blue-600';
      case 'evening':
        return 'bg-purple-500 text-white border-purple-600';
      case 'closing':
        return 'bg-orange-500 text-white border-orange-600';
      default:
        return 'bg-gray-500 text-white border-gray-600';
    }
  };

  const getShiftLabel = (type: string) => {
    switch (type) {
      case 'morning':
        return t('shift.morning');
      case 'evening':
        return t('shift.evening');
      case 'closing':
        return t('shift.closing');
      default:
        return type;
    }
  };

  const getShiftTime = (type: string) => {
    switch (type) {
      case 'morning':
        return '08:00 - 16:00';
      case 'evening':
        return '16:00 - 24:00';
      case 'closing':
        return '17:00 - 01:00';
      default:
        return '';
    }
  };

  const handleClearAllShifts = () => {
    setShowConfirmDialog(true);
  };

  const confirmClearAllShifts = () => {
    localStorage.removeItem('shifts');
    setShifts([]);
    setShowConfirmDialog(false);
  };

  const navigateWeek = (direction: number) => {
    setWeekOffset(prev => prev + direction);
  };

  return (
    <div className="relative">
      {/* Week Navigation Controls */}
      <div className="absolute top-0 left-0 z-20 flex items-center space-x-2">
        <button
          onClick={() => navigateWeek(-1)}
          className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          aria-label={language === 'he' ? 'שבוע קודם' : 'Previous Week'}
        >
          <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {language === 'he' ? 'שבוע' : 'Week'} {format(weekStart, 'd/M')} - {format(addDays(weekStart, 6), 'd/M')}
        </span>
        <button
          onClick={() => navigateWeek(1)}
          className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          aria-label={language === 'he' ? 'שבוע הבא' : 'Next Week'}
        >
          <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Clear All Button */}
      <div className="absolute top-0 right-0 z-20">
        <button
          onClick={handleClearAllShifts}
          className="px-3 py-1.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors flex items-center"
        >
          <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          {language === 'he' ? 'מחק הכל' : 'Clear All'}
        </button>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full mx-4 shadow-2xl">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              {language === 'he' ? 'האם אתה בטוח?' : 'Are you sure?'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {language === 'he' 
                ? 'פעולה זו תמחק את כל המשמרות מהסידור. לא ניתן לבטל פעולה זו.'
                : 'This action will delete all shifts from the schedule. This cannot be undone.'}
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                {language === 'he' ? 'ביטול' : 'Cancel'}
              </button>
              <button
                onClick={confirmClearAllShifts}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
              >
                {language === 'he' ? 'כן, מחק הכל' : 'Yes, Clear All'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="w-full overflow-x-auto pt-12">
        <div className="min-w-[768px]">
          <div className="grid grid-cols-7 gap-3 mb-3">
            {days.map((day, index) => (
              <div key={index} className="text-center">
                <div className="font-medium text-gray-900 dark:text-white mb-1 text-sm">
                  {format(day, 'EEEE', { locale: language === 'he' ? he : enUS })}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 rounded-full py-1 px-2 inline-block">
                  {format(day, 'd/M/yyyy')}
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-3">
            {days.map((day, dayIndex) => {
              const dayShifts = getShiftsForDay(day);
              return (
                <div
                  key={dayIndex}
                  className={`min-h-[200px] bg-gray-50 dark:bg-gray-800/50 rounded-lg p-2 border border-gray-100 dark:border-gray-700 transition-all duration-300 ${
                    format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
                      ? 'ring-2 ring-blue-400 dark:ring-blue-600'
                      : ''
                  }`}
                >
                  <div className="space-y-2">
                    {dayShifts.length === 0 ? (
                      <div className="h-full min-h-[60px] flex items-center justify-center">
                        <span className="text-xs text-gray-400 dark:text-gray-500">
                          {language === 'he' ? 'אין משמרות' : 'No shifts'}
                        </span>
                      </div>
                    ) : (
                      dayShifts.map((shift, shiftIndex) => (
                        <div
                          key={`${dayIndex}-${shiftIndex}`}
                          className={`rounded-lg p-2 ${getShiftStyle(shift.type)} border shadow-sm`}
                        >
                          <div className="text-sm font-medium">{shift.employeeName}</div>
                          <div className="text-xs opacity-90">{getShiftLabel(shift.type)}</div>
                          <div className="text-xs mt-1 opacity-80">{getShiftTime(shift.type)}</div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
} 