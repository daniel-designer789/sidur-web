"use client";

import { useState, useEffect } from 'react';

interface DashboardStats {
  totalEmployees: number;
  activeShifts: number;
  upcomingShifts: number;
  unassignedShifts: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalEmployees: 0,
    activeShifts: 0,
    upcomingShifts: 0,
    unassignedShifts: 0,
  });

  useEffect(() => {
    const loadStats = () => {
      setStats({
        totalEmployees: 15,
        activeShifts: 3,
        upcomingShifts: 8,
        unassignedShifts: 2,
      });
    };
    
    loadStats();
    const interval = setInterval(loadStats, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">דשבורד ניהול</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">סה&quot;כ עובדים</h3>
          <p className="text-3xl font-bold mt-2 text-gray-900 dark:text-white">{stats.totalEmployees}</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">משמרות פעילות</h3>
          <p className="text-3xl font-bold mt-2 text-green-600 dark:text-green-400">{stats.activeShifts}</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">משמרות קרובות</h3>
          <p className="text-3xl font-bold mt-2 text-blue-600 dark:text-blue-400">{stats.upcomingShifts}</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">משמרות לא משובצות</h3>
          <p className="text-3xl font-bold mt-2 text-orange-600 dark:text-orange-400">{stats.unassignedShifts}</p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">משמרות היום</h2>
          <div className="text-gray-700 dark:text-gray-300">טרם נוספו משמרות להיום</div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">התראות מערכת</h2>
          <div className="text-gray-700 dark:text-gray-300">אין התראות חדשות</div>
        </div>
      </div>
    </div>
  );
} 