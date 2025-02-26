"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SmartGraphWidget from '@/components/SmartGraphWidget';

export default function Home() {
  const router = useRouter();
  const [loginType, setLoginType] = useState<'admin' | 'employee' | null>(null);
  const [password, setPassword] = useState('');
  const [employeeName, setEmployeeName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if user is already logged in
    const adminLoggedIn = localStorage.getItem('adminLoggedIn');
    const employeeName = localStorage.getItem('employeeName');

    if (adminLoggedIn === 'true') {
      router.push('/admin/dashboard');
    } else if (employeeName) {
      router.push(`/employee/dashboard?name=${encodeURIComponent(employeeName)}`);
    }
  }, [router]);

  const handleAdminLogin = () => {
    if (password === '1212') {
      localStorage.setItem('adminLoggedIn', 'true');
      router.push('/admin/dashboard');
    } else {
      setError('סיסמה שגויה');
    }
  };

  const handleEmployeeLogin = () => {
    if (employeeName.trim()) {
      localStorage.setItem('employeeName', employeeName.trim());
      router.push(`/employee/dashboard?name=${encodeURIComponent(employeeName)}`);
    } else {
      setError('נא להזין שם עובד');
    }
  };

  const handleGraphClick = () => {
    router.push('/graphs');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            מערכת ניהול משמרות
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            ברוכים הבאים! אנא בחרו את סוג הכניסה
          </p>
        </div>

        {!loginType ? (
          <div className="mt-8 space-y-4">
            <button
              onClick={() => setLoginType('admin')}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              כניסת מנהל
            </button>
            <button
              onClick={() => setLoginType('employee')}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              כניסת עובד
            </button>
          </div>
        ) : (
          <div className="mt-8 space-y-6 bg-white dark:bg-gray-800 py-8 px-4 shadow rounded-lg">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
                {loginType === 'admin' ? 'כניסת מנהל' : 'כניסת עובד'}
              </h2>
              
              {loginType === 'admin' ? (
                <div>
                  <label htmlFor="password" className="sr-only">
                    סיסמה
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    placeholder="הזן סיסמה"
                  />
                </div>
              ) : (
                <div>
                  <label htmlFor="employeeName" className="sr-only">
                    שם עובד
                  </label>
                  <input
                    id="employeeName"
                    type="text"
                    value={employeeName}
                    onChange={(e) => setEmployeeName(e.target.value)}
                    className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                    placeholder="הזן שם עובד"
                  />
                </div>
              )}

              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}

              <div className="flex space-x-4">
                <button
                  onClick={() => {
                    setLoginType(null);
                    setPassword('');
                    setEmployeeName('');
                    setError('');
                  }}
                  className="flex-1 py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  חזור
                </button>
                <button
                  onClick={loginType === 'admin' ? handleAdminLogin : handleEmployeeLogin}
                  className={`flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                    loginType === 'admin'
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : 'bg-green-600 hover:bg-green-700'
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    loginType === 'admin' ? 'focus:ring-blue-500' : 'focus:ring-green-500'
                  }`}
                >
                  כניסה
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
