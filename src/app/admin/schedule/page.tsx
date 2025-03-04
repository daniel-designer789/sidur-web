"use client";

import { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import WeeklySchedule from '@/components/WeeklySchedule';
import { format, addDays, startOfWeek } from 'date-fns';
import { he, enUS } from 'date-fns/locale';

interface Employee {
  id: number;
  name: string;
  role: string;
}

interface Shift {
  id: string;
  employeeId: number;
  employeeName: string;
  date: string;
  shiftType: 'morning' | 'evening' | 'closing';
}

interface ShiftFormData {
  employeeId: number;
  date: string;
  shiftType: 'morning' | 'evening' | 'closing';
}

export default function SchedulePage() {
  const { language, direction } = useLanguage();
  const [currentWeek, setCurrentWeek] = useState<Date>(startOfWeek(new Date(), { weekStartsOn: 0 }));
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [showAddShiftModal, setShowAddShiftModal] = useState(false);
  const [currentShiftForm, setCurrentShiftForm] = useState<ShiftFormData>({
    employeeId: 0,
    date: '',
    shiftType: 'morning'
  });
  const [isPublishing, setIsPublishing] = useState(false);
  const [isAutoAssigning, setIsAutoAssigning] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    // Mock employees data
    const mockEmployees: Employee[] = [
      { id: 1, name: 'ישראל ישראלי', role: 'מנהל משמרת' },
      { id: 2, name: 'מיכל כהן', role: 'עובד' },
      { id: 3, name: 'דוד לוי', role: 'עובד' },
      { id: 4, name: 'רחל גולדברג', role: 'מנהלת' },
    ];
    setEmployees(mockEmployees);
  }, []);

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

  const handleAddShift = (date: string, shiftType: 'morning' | 'evening' | 'closing') => {
    setCurrentShiftForm({
      employeeId: 0,
      date,
      shiftType
    });
    setShowAddShiftModal(true);
  };

  const handleShiftFormChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCurrentShiftForm(prev => ({
      ...prev,
      [name]: name === 'employeeId' ? parseInt(value, 10) : value
    }));
  };

  const submitShiftForm = () => {
    // Validate form
    if (currentShiftForm.employeeId ===.0) {
      alert(language === 'he' ? 'יש לבחור עובד' : 'Please select an employee');
      return;
    }

    // Find employee name
    const employee = employees.find(e => e.id === currentShiftForm.employeeId);
    if (!employee) return;

    // Create new shift
    const newShift: Shift = {
      id: Date.now().toString(), // simple ID generation
      employeeId: currentShiftForm.employeeId,
      employeeName: employee.name,
      date: currentShiftForm.date,
      shiftType: currentShiftForm.shiftType
    };

    // Add to shifts
    setShifts(prev => [...prev, newShift]);
    
    // Close modal
    setShowAddShiftModal(false);
  };

  const publishSchedule = () => {
    setIsPublishing(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsPublishing(false);
      alert(language === 'he' ? 'סידור העבודה פורסם בהצלחה!' : 'Schedule published successfully!');
    }, 1500);
  };

  const autoAssignShifts = () => {
    setIsAutoAssigning(true);
    
    // Simulate API call
    setTimeout(() => {
      // Add some random shifts
      const daysOfWeek = [0, 1, 2, 3, 4, 5, 6];
      const shiftTypes: ('morning' | 'evening' | 'closing')[] = ['morning', 'evening', 'closing'];
      
      // Create a copy of existing shifts
      const existingShifts = [...shifts];
      
      // Generate new shifts
      const newShifts: Shift[] = [];
      
      daysOfWeek.forEach(day => {
        shiftTypes.forEach(shiftType => {
          const dateStr = format(addDays(currentWeek, day), 'yyyy-MM-dd');
          
          // Check if shift already exists
          const shiftExists = existingShifts.some(
            s => s.date === dateStr && s.shiftType === shiftType
          );
          
          // If shift doesn't exist, assign random employee
          if (!shiftExists) {
            const randomEmployeeIndex = Math.floor(Math.random() * employees.length);
            const employee = employees[randomEmployeeIndex];
            
            newShifts.push({
              id: `auto-${Date.now()}-${day}-${shiftType}`,
              employeeId: employee.id,
              employeeName: employee.name,
              date: dateStr,
              shiftType: shiftType
            });
          }
        });
      });
      
      // Update shifts
      setShifts([...existingShifts, ...newShifts]);
      setIsAutoAssigning(false);
      
      alert(language === 'he' ? 'הסידור נוצר באופן אוטומטי!' : 'Schedule auto-assigned successfully!');
    }, 2000);
  };

  const exportToPDF = () => {
    setIsExporting(true);
    
    // Simulate PDF generation
    setTimeout(() => {
      setIsExporting(false);
      alert(language === 'he' ? 'הסידור יוצא ל-PDF בהצלחה!' : 'Schedule exported to PDF successfully!');
    }, 1500);
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
    addShift: language === 'he' ? 'הוסף משמרת' : 'Add Shift',
    selectEmployee: language === 'he' ? 'בחר עובד' : 'Select Employee',
    submit: language === 'he' ? 'הוסף' : 'Add',
    cancel: language === 'he' ? 'ביטול' : 'Cancel',
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 md:mb-0">
            {labels.title}
          </h1>
          <div className="flex flex-wrap gap-3">
            <button 
              onClick={publishSchedule}
              disabled={isPublishing}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isPublishing && (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {labels.publishBtn}
            </button>
            <button 
              onClick={autoAssignShifts}
              disabled={isAutoAssigning}
              className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isAutoAssigning && (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {labels.autoAssignBtn}
            </button>
            <button 
              onClick={exportToPDF}
              disabled={isExporting}
              className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isExporting && (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
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
                              <button 
                                onClick={() => handleAddShift(dateStr, shiftType)}
                                className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                                aria-label={`${labels.addShift} ${labels.shifts[shiftType]} ${format(addDays(currentWeek, dayOffset), 'EEEE', { locale: language === 'he' ? he : enUS })}`}
                              >
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

      {/* Add Shift Modal */}
      {showAddShiftModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              {labels.addShift}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {labels.selectEmployee}
                </label>
                <select
                  name="employeeId"
                  value={currentShiftForm.employeeId}
                  onChange={handleShiftFormChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value={0}>{language === 'he' ? '-- בחר עובד --' : '-- Select Employee --'}</option>
                  {employees.map(employee => (
                    <option key={employee.id} value={employee.id}>
                      {employee.name} ({employee.role})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end space-x-3 rtl:space-x-reverse">
                <button
                  onClick={() => setShowAddShiftModal(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  {labels.cancel}
                </button>
                <button
                  onClick={submitShiftForm}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
                >
                  {labels.submit}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 