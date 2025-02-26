"use client";

import { useState, useEffect } from 'react';
import { useApp } from '@/contexts/AppContext';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { format, startOfWeek, addDays } from 'date-fns';
import { he } from 'date-fns/locale';

interface Employee {
  id: string;
  name: string;
  department: string;
  avatar: string;
}

interface Shift {
  id: string;
  employeeId: string;
  employeeName: string;
  type: 'morning' | 'evening' | 'closing';
  date: string;
}

interface ShiftTypeConfig {
  label: string;
  startTime: string;
  endTime: string;
  color: string;
}

type ShiftType = 'morning' | 'evening' | 'closing';

const mockEmployees: Employee[] = [
  { id: '1', name: 'ישראל ישראלי', department: 'תפעול', avatar: '👨‍💼' },
  { id: '2', name: 'חיים כהן', department: 'תפעול', avatar: '👨‍🔧' },
  { id: '3', name: 'שרה לוי', department: 'שירות', avatar: '👩‍💼' },
  { id: '4', name: 'דוד דוידוב', department: 'תפעול', avatar: '👨‍💼' },
  { id: '5', name: 'רחל רחלי', department: 'שירות', avatar: '👩‍💼' },
];

const shiftTypes: Record<ShiftType, ShiftTypeConfig> = {
  morning: {
    label: 'משמרת בוקר',
    startTime: '08:00',
    endTime: '16:00',
    color: 'bg-blue-100 border-blue-300 text-blue-900 dark:bg-blue-900 dark:border-blue-700 dark:text-blue-200'
  },
  evening: {
    label: 'משמרת ערב',
    startTime: '16:00',
    endTime: '24:00',
    color: 'bg-purple-100 border-purple-300 text-purple-900 dark:bg-purple-900 dark:border-purple-700 dark:text-purple-200'
  },
  closing: {
    label: 'משמרת סגירה',
    startTime: '17:00',
    endTime: '01:00',
    color: 'bg-orange-100 border-orange-300 text-orange-900 dark:bg-orange-900 dark:border-orange-700 dark:text-orange-200'
  }
};

export default function WeeklySchedule() {
  const { theme } = useApp();
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [selectedShiftType, setSelectedShiftType] = useState<ShiftType>('morning');
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [isAddingShift, setIsAddingShift] = useState(false);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const weekStart = startOfWeek(new Date());
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const filteredEmployees = mockEmployees.filter(employee =>
    employee.name.includes(searchQuery) ||
    employee.department.includes(searchQuery)
  );

  useEffect(() => {
    // Load shifts from localStorage
    const loadShifts = () => {
      const savedShifts = localStorage.getItem('shifts');
      if (savedShifts) {
        setShifts(JSON.parse(savedShifts));
      }
    };

    loadShifts();
    // Set up polling to check for new shifts every 5 seconds
    const interval = setInterval(loadShifts, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleDayClick = (day: Date) => {
    setSelectedDay(day);
  };

  const handleAddShift = () => {
    if (selectedDay) {
      setIsAddingShift(true);
    }
  };

  const handleConfirmShift = () => {
    if (selectedEmployee && selectedShiftType && selectedDay) {
      const newShift: Shift = {
        id: Date.now().toString(),
        employeeId: selectedEmployee,
        employeeName: mockEmployees.find(emp => emp.id === selectedEmployee)?.name || 'עובד חדש',
        type: selectedShiftType,
        date: format(selectedDay, 'yyyy-MM-dd')
      };
      
      // Add new shift to existing shifts in localStorage
      const existingShifts = JSON.parse(localStorage.getItem('shifts') || '[]');
      const updatedShifts = [...existingShifts, newShift];
      localStorage.setItem('shifts', JSON.stringify(updatedShifts));
      
      setShifts(updatedShifts);
      setIsAddingShift(false);
      setSelectedEmployee('');
      setSelectedShiftType('morning');
      setSelectedDay(null);
    }
  };

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;
    
    const shift = shifts.find(s => s.id === active.id);
    if (shift) {
      const newShifts = shifts.filter(s => s.id !== active.id);
      const updatedShifts = [...newShifts, { ...shift, date: new Date(over.id).toISOString().split('T')[0] }];
      
      // Update shifts in localStorage
      localStorage.setItem('shifts', JSON.stringify(updatedShifts));
      setShifts(updatedShifts);
    }
  }

  function getShiftsForDay(day: Date) {
    return shifts.filter(shift => 
      format(new Date(shift.date), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
    );
  }

  return (
    <div className="p-4 relative">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">לוח משמרות שבועי</h2>
        <button
          onClick={handleAddShift}
          disabled={!selectedDay}
          className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
            selectedDay 
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
          }`}
        >
          {selectedDay ? 'הוסף משמרת ליום הנבחר' : 'בחר יום להוספת משמרת'}
        </button>
      </div>

      {isAddingShift && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl max-w-md w-full">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
              הוספת משמרת ליום {format(selectedDay!, 'd/M/yyyy')}
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2">בחר עובד</label>
                <select
                  value={selectedEmployee}
                  onChange={(e) => setSelectedEmployee(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg p-2.5"
                >
                  <option value="">בחר עובד</option>
                  {filteredEmployees.map((employee) => (
                    <option key={employee.id} value={employee.id}>{employee.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2">סוג משמרת</label>
                <select
                  value={selectedShiftType}
                  onChange={(e) => setSelectedShiftType(e.target.value as ShiftType)}
                  className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg p-2.5"
                >
                  <option value="morning">{shiftTypes.morning.label}</option>
                  <option value="evening">{shiftTypes.evening.label}</option>
                  <option value="closing">{shiftTypes.closing.label}</option>
                </select>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={() => {
                  setIsAddingShift(false);
                  setSelectedEmployee('');
                  setSelectedShiftType('morning');
                }}
                className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-medium py-2 px-4 rounded-lg ml-4"
              >
                ביטול
              </button>
              <button
                onClick={handleConfirmShift}
                disabled={!selectedEmployee || !selectedShiftType}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                אישור
              </button>
            </div>
          </div>
        </div>
      )}

      <DndContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-7 gap-4">
          {weekDays.map((day) => (
            <div
              key={day.toISOString()}
              onClick={() => handleDayClick(day)}
              className={`border rounded-lg p-4 min-h-[200px] transition-colors duration-200 cursor-pointer
                ${selectedDay && format(selectedDay, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
                  ? 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
                }
                hover:border-blue-300 dark:hover:border-blue-600`}
            >
              <h3 className="font-semibold text-center mb-2 text-gray-900 dark:text-white">
                {format(day, 'EEEE', { locale: he })}
              </h3>
              <p className="text-sm text-center text-gray-600 dark:text-gray-400 mb-4">
                {format(day, 'd/M/yyyy')}
              </p>
              <div className="space-y-2">
                {getShiftsForDay(day).map(shift => (
                  <div 
                    key={shift.id}
                    className={`p-3 rounded border ${shiftTypes[shift.type].color}`}
                  >
                    <div className="font-medium">{shift.employeeName}</div>
                    <div className="text-sm font-medium">
                      {shiftTypes[shift.type].label}
                    </div>
                    <div className="text-sm mt-1 text-gray-700 dark:text-gray-300">
                      {shiftTypes[shift.type].startTime} - {shiftTypes[shift.type].endTime}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </DndContext>
    </div>
  );
} 