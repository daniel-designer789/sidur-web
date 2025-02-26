"use client";

import { useState } from 'react';

interface Employee {
  id: number;
  name: string;
  role: string;
  department: string;
  phone: string;
}

const mockEmployees: Employee[] = [
  {
    id: 1,
    name: 'ישראל ישראלי',
    role: 'מנהל משמרת',
    department: 'מטבח',
    phone: '050-1234567'
  },
  {
    id: 2,
    name: 'חיים כהן',
    role: 'טבח',
    department: 'מטבח',
    phone: '050-2345678'
  },
  {
    id: 3,
    name: 'שרה לוי',
    role: 'מלצרית',
    department: 'שירות',
    phone: '050-3456789'
  }
];

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [showAddModal, setShowAddModal] = useState(false);

  const handleDelete = (id: number) => {
    setEmployees(employees.filter(emp => emp.id !== id));
  };

  return (
    <div className="p-6 dark:bg-gray-900">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">ניהול עובדים</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center"
        >
          <span className="mr-2">+</span>
          הוסף עובד
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-right py-3 px-4 font-medium text-gray-900 dark:text-white">שם</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900 dark:text-white">תפקיד</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900 dark:text-white">מחלקה</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900 dark:text-white">טלפון</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900 dark:text-white">פעולות</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {employees.map((employee) => (
                <tr key={employee.id}>
                  <td className="py-3 px-4 text-gray-900 dark:text-white">{employee.name}</td>
                  <td className="py-3 px-4 text-gray-700 dark:text-gray-300">{employee.role}</td>
                  <td className="py-3 px-4 text-gray-700 dark:text-gray-300">{employee.department}</td>
                  <td className="py-3 px-4 text-gray-700 dark:text-gray-300">{employee.phone}</td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-3">
                      <button
                        onClick={() => {/* TODO: Implement edit */}}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                      >
                        ערוך
                      </button>
                      <button
                        onClick={() => handleDelete(employee.id)}
                        className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                      >
                        מחק
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">הוסף עובד חדש</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-gray-900 dark:text-white font-medium mb-2">שם</label>
                <input
                  type="text"
                  className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
                  placeholder="הזן שם מלא"
                />
              </div>
              
              <div>
                <label className="block text-gray-900 dark:text-white font-medium mb-2">תפקיד</label>
                <input
                  type="text"
                  className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
                  placeholder="הזן תפקיד"
                />
              </div>
              
              <div>
                <label className="block text-gray-900 dark:text-white font-medium mb-2">מחלקה</label>
                <select className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5">
                  <option value="kitchen">מטבח</option>
                  <option value="service">שירות</option>
                  <option value="bar">בר</option>
                </select>
              </div>
              
              <div>
                <label className="block text-gray-900 dark:text-white font-medium mb-2">טלפון</label>
                <input
                  type="tel"
                  className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
                  placeholder="הזן מספר טלפון"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                ביטול
              </button>
              <button
                onClick={() => {
                  // TODO: Implement add employee
                  setShowAddModal(false);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg"
              >
                הוסף
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 