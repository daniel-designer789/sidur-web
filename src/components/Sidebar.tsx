"use client";

import { useRouter } from 'next/navigation';

export default function Sidebar() {
  const router = useRouter();

  return (
    <div className="bg-white dark:bg-gray-800 h-screen w-64 fixed right-0 top-0 shadow-lg">
      <div className="p-4">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-8">תפריט ניהול</h1>
        
        <nav className="space-y-2">
          <button
            onClick={() => router.push('/admin/dashboard')}
            className="w-full text-right px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            דשבורד
          </button>
          
          <button
            onClick={() => router.push('/employees')}
            className="w-full text-right px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            עובדים
          </button>
          
          <button
            onClick={() => router.push('/shifts-history')}
            className="w-full text-right px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            היסטוריית משמרות
          </button>
          
          <button
            onClick={() => router.push('/reports')}
            className="w-full text-right px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            דוחות
          </button>
          
          <button
            onClick={() => router.push('/settings')}
            className="w-full text-right px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            הגדרות
          </button>
        </nav>
      </div>
    </div>
  );
} 