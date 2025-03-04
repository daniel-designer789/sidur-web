"use client";

import { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import WeeklySchedule from '@/components/WeeklySchedule';
import { format, addDays, startOfWeek } from 'date-fns';
import { he, enUS } from 'date-fns/locale';

interface Shift {
  id: string;
  employeeId: number;
  employeeName: string;
  date: string;
  shiftType: 'morning' | 'evening' | 'closing';
}

export default function SchedulePage() {
  const { language, direction } = useLanguage();
  const [currentWeek, setCurrentWeek] = useState<Date>(startOfWeek(new Date(), { weekStartsOn: 0 }));
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading shifts data
    const loadShifts = () => {
      setIsLoading(true);
      // Mock data - in a real app, this would come from an API
      const mockShifts: Shift[] = [
        { id: '1', employeeId: 1, employeeName: 'ישראל ישראלי', date: format(addDays(currentWeek, 0), 'yyyy-MM-dd'), shiftType: 'morning' },
        { id: '2', employeeId: 2, employeeName: 'מיכל כהן', date: format(addDays(currentWeek, 0), 'yyyy-MM-dd'), shiftType: 'evening' },
        { id: '3', employeeId: 4, employeeName: 'רחל גולדברג', date: format(addDays(currentWeek, 0), 'yyyy-MM-dd'), shiftType: 'closing' },
        { id: '4', employeeId: 1, employeeName: 'ישראל ישראלי', date: format(addDays(currentWeek, 1), 'yyyy-MM-dd'), shiftType: 'morning' },
        { id: '5', employeeId: 3, employeeName: 'דוד לוי', date: format(addDays(currentWeek, 1), 'yyyy-MM-dd'), shiftType: 'evening' },
        { id: '6', employeeId: 2, employeeName: 'מיכל כהן', date: format(addDays(currentWeek, 2), 'yyyy-MM-dd'), shiftType: 'morning' },
        { id: '7', employeeId: 4, employeeName: 'רחל גולדברג', date: format(addDays(currentWeek, 2), 'yyyy-MM-dd'), shiftType: 'evening' },
        { id: '8', employeeId: 3, employeeName: 'דוד לוי', date: format(addDays(currentWeek, 3), 'yyyy-MM-dd'), shiftType: 'morning' },
        { id: '9', employeeId: 1, employeeName: 'ישראל ישראלי', date: format(addDays(currentWeek, 3), 'yyyy-MM-dd'), shiftType: 'evening' },
        { id: '10', employeeId: 2, employeeName: 'מיכל כהן', date: format(addDays(currentWeek, 4), 'yyyy-MM-dd'), shiftType: 'morning' },
        { id: '11', employeeId: 4, employeeName: 'רחל גולדברג', date: format(addDays(currentWeek, 4), 'yyyy-MM-dd'), shiftType: 'evening' },
        { id: '12', employeeId: 3, employeeName: 'דוד לוי', date: format(addDays(currentWeek, 5), 'yyyy-MM-dd'), shiftType: 'morning' },
        { id: '13', employeeId: 1, employeeName: 'ישראל ישראלי', date: format(addDays(currentWeek, 5), 'yyyy-MM-dd'), shiftType: 'evening' },
        { id: '14', employeeId: 2, employeeName: 'מיכל כהן', date: format(addDays(currentWeek, 6), 'yyyy-MM-dd'), shiftType: 'morning' },
        { id: '15', employeeId: 4, employeeName: 'רחל גולדברג', date: format(addDays(currentWeek, 6), 'yyyy-MM-dd'), shiftType: 'evening' },
      ];
      
      setTimeout(() => {
        setShifts(mockShifts);
        setIsLoading(false);
      }, 800);
    };

    loadShifts();
  }, [currentWeek]);

  const previousWeek = () => {
    setCurrentWeek(prev => {
      const newDate = new Date(prev);
      newDate.setDate(newDate.getDate() - 7);
      return newDate;
    });
  };

  const nextWeek = () => {
    setCurrentWeek(prev => {
      const newDate = new Date(prev);
      newDate.setDate(newDate.getDate() + 7);
      return newDate;
    });
  };

  const formatWeekRange = (date: Date) => {
    const endOfWeek = addDays(date, 6);
    const dateFormat = 'dd/MM/yyyy';
    const startStr = format(date, dateFormat, { locale: language === 'he' ? he : enUS });
    const endStr = format(endOfWeek, dateFormat, { locale: language === 'he' ? he : enUS });
    return `${startStr} - ${endStr}`;
  };

  const labels = {
    title: language === 'he' ? 'סידור עבודה שבועי' : 'Weekly Schedule',
    publishBtn: language === 'he' ? 'פרסם סידור' : 'Publish Schedule',
    autoAssignBtn: language === 'he' ? 'שיבוץ אוטומטי' : 'Auto Assign',
    exportBtn: language === 'he' ? 'ייצוא PDF' : 'Export PDF',
    prevWeek: language === 'he' ? 'שבוע קודם' : 'Previous Week',
    nextWeek: language === 'he' ? 'שבוע הבא' : 'Next Week',
    shifts: {
      morning: language === 'he' ? 'בוקר' : 'Morning',
      evening: language === 'he' ? 'ערב' : 'Evening',
      closing: language === 'he' ? 'סגירה' : 'Closing',
    },
    days: language === 'he' ? 
      ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'] : 
      ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    loading: language === 'he' ? 'טוען סידור עבודה...' : 'Loading schedule...',
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 md:mb-0">
            {labels.title}
          </h1>
          <div className="flex flex-wrap gap-3">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
              {labels.publishBtn}
            </button>
            <button className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
              {labels.autoAssignBtn}
            </button>
            <button className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
              {labels.exportBtn}
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
          <div className="p-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
            <button 
              onClick={previousWeek}
              className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            >
              <svg className={`h-6 w-6 transform ${direction === 'rtl' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
              </svg>
            </button>
            <div className="text-lg font-medium text-gray-900 dark:text-white">
              {formatWeekRange(currentWeek)}
            </div>
            <button 
              onClick={nextWeek}
              className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            >
              <svg className={`h-6 w-6 transform ${direction === 'rtl' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>
          </div>

          {isLoading ? (
            <div className="p-10 flex justify-center">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="sr-only">{labels.loading}</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {language === 'he' ? 'משמרת / יום' : 'Shift / Day'}
                    </th>
                    {[0, 1, 2, 3, 4, 5, 6].map((dayOffset) => (
                      <th 
                        key={dayOffset} 
                        className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                      >
                        {labels.days[dayOffset]}
                        <div className="text-xxs font-normal mt-1">
                          {format(addDays(currentWeek, dayOffset), 'dd/MM', { locale: language === 'he' ? he : enUS })}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {(['morning', 'evening', 'closing'] as const).map((shiftType) => (
                    <tr key={shiftType}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {labels.shifts[shiftType]}
                      </td>
                      {[0, 1, 2, 3, 4, 5, 6].map((dayOffset) => {
                        const dateStr = format(addDays(currentWeek, dayOffset), 'yyyy-MM-dd');
                        const shiftEmployees = shifts.filter(
                          s => s.date === dateStr && s.shiftType === shiftType
                        );
                        
                        return (
                          <td key={dayOffset} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                            {shiftEmployees.length > 0 ? (
                              <div className="space-y-1">
                                {shiftEmployees.map((shift) => (
                                  <div key={shift.id} className="flex items-center">
                                    <span className="text-gray-900 dark:text-white">{shift.employeeName}</span>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                                </svg>
                              </button>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 