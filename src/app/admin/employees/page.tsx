"use client";

import { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface Employee {
  id: number;
  name: string;
  role: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive';
}

export default function EmployeesPage() {
  const { language } = useLanguage();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading employee data
    const loadEmployees = () => {
      setIsLoading(true);
      // Mock data - in a real app, this would come from an API
      const mockEmployees: Employee[] = [
        { id: 1, name: 'ישראל ישראלי', role: 'מנהל משמרת', email: 'israel@example.com', phone: '050-1234567', status: 'active' },
        { id: 2, name: 'מיכל כהן', role: 'עובד', email: 'michal@example.com', phone: '052-7654321', status: 'active' },
        { id: 3, name: 'דוד לוי', role: 'עובד', email: 'david@example.com', phone: '054-9876543', status: 'inactive' },
        { id: 4, name: 'רחל גולדברג', role: 'מנהלת', email: 'rachel@example.com', phone: '053-1122334', status: 'active' },
      ];
      
      setTimeout(() => {
        setEmployees(mockEmployees);
        setIsLoading(false);
      }, 800);
    };

    loadEmployees();
  }, []);

  const labels = {
    title: language === 'he' ? 'ניהול עובדים' : 'Employees Management',
    searchPlaceholder: language === 'he' ? 'חיפוש עובדים...' : 'Search employees...',
    addEmployeeBtn: language === 'he' ? 'הוסף עובד' : 'Add Employee',
    tableHeaders: {
      name: language === 'he' ? 'שם' : 'Name',
      role: language === 'he' ? 'תפקיד' : 'Role',
      email: language === 'he' ? 'אימייל' : 'Email',
      phone: language === 'he' ? 'טלפון' : 'Phone',
      status: language === 'he' ? 'סטטוס' : 'Status',
      actions: language === 'he' ? 'פעולות' : 'Actions',
    },
    status: {
      active: language === 'he' ? 'פעיל' : 'Active',
      inactive: language === 'he' ? 'לא פעיל' : 'Inactive',
    },
    noEmployees: language === 'he' ? 'לא נמצאו עובדים' : 'No employees found',
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 md:mb-0">
            {labels.title}
          </h1>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative">
              <input
                type="text"
                className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 rounded-lg py-2 px-4 block w-full appearance-none leading-normal focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={labels.searchPlaceholder}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
              {labels.addEmployeeBtn}
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
          {isLoading ? (
            <div className="p-10 flex justify-center">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : employees.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {labels.tableHeaders.name}
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {labels.tableHeaders.role}
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {labels.tableHeaders.email}
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {labels.tableHeaders.phone}
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {labels.tableHeaders.status}
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {labels.tableHeaders.actions}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {employees.map((employee) => (
                    <tr key={employee.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {employee.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {employee.role}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {employee.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {employee.phone}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          employee.status === 'active' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}>
                          {employee.status === 'active' ? labels.status.active : labels.status.inactive}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2 rtl:space-x-reverse">
                          <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                            </svg>
                          </button>
                          <button className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-10 text-center text-gray-500 dark:text-gray-400">
              {labels.noEmployees}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 