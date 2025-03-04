"use client";

export default function ReportsPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">דוחות</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4">דוח שעות עבודה</h2>
          <p className="text-gray-600 dark:text-gray-400">
            סיכום שעות העבודה של כל העובדים
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4">דוח העדפות עובדים</h2>
          <p className="text-gray-600 dark:text-gray-400">
            ניתוח העדפות המשמרות של העובדים
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4">דוח יעילות סידור</h2>
          <p className="text-gray-600 dark:text-gray-400">
            השוואה בין העדפות לשיבוץ בפועל
          </p>
        </div>
      </div>
    </div>
  );
} 