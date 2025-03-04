"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [role, setRole] = useState<'admin' | 'employee'>('employee');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (role === 'admin') {
      localStorage.setItem('adminLoggedIn', 'true');
      router.push('/admin/dashboard');
    } else {
      localStorage.setItem('employeeName', name);
      router.push(`/employee/dashboard?name=${encodeURIComponent(name)}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <div className="bg-white dark:bg-gray-800 p-4 sm:p-8 rounded-xl shadow-lg w-full max-w-md mx-auto">
        <h1 className="text-xl sm:text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">
          ברוכים הבאים למערכת סידור העבודה
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              תפקיד
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as 'admin' | 'employee')}
              className="w-full px-4 py-3 border rounded-lg text-base
                       bg-white dark:bg-gray-700 
                       border-gray-300 dark:border-gray-600 
                       text-gray-900 dark:text-white
                       focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                       focus:border-transparent
                       appearance-none"
            >
              <option value="employee">עובד</option>
              <option value="admin">מנהל</option>
            </select>
          </div>

          {role === 'employee' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                שם מלא
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg text-base
                         bg-white dark:bg-gray-700 
                         border-gray-300 dark:border-gray-600 
                         text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                         focus:border-transparent
                         placeholder-gray-400 dark:placeholder-gray-500"
                placeholder="הכנס את שמך המלא"
                required
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg
                     text-base font-medium
                     hover:bg-blue-600 active:bg-blue-700
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                     transition-colors duration-200
                     disabled:opacity-50 disabled:cursor-not-allowed
                     touch-manipulation"
            disabled={role === 'employee' && !name.trim()}
          >
            {role === 'admin' ? 'כניסה כמנהל' : 'כניסה כעובד'}
          </button>
        </form>

        <p className="mt-4 text-sm text-center text-gray-600 dark:text-gray-400">
          {role === 'admin' 
            ? 'כניסה למערכת ניהול סידור העבודה' 
            : 'הזן את שמך המלא כדי להגיש את העדפות המשמרות שלך'}
        </p>
      </div>
    </div>
  );
}
