"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import WeeklySchedule from '@/components/WeeklySchedule';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

interface ScheduleSubmission {
  employeeName: string;
  submittedAt: string;
  weekStart: string;
  preferences: {
    [date: string]: {
      morning: boolean;
      evening: boolean;
      closing: boolean;
      notes: string;
    };
  };
}

interface DashboardStats {
  totalEmployees: number;
  scheduledShifts: number;
  pendingRequests: number;
  completedSchedules: number;
}

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
      rtl: true,
      labels: {
        font: {
          family: 'Rubik',
          size: 14
        },
        padding: 20
      }
    },
    tooltip: {
      bodyFont: {
        family: 'Rubik',
        size: 14
      },
      titleFont: {
        family: 'Rubik',
        size: 14
      },
      padding: 12,
      rtl: true,
      textDirection: 'rtl'
    }
  },
  scales: {
    x: {
      ticks: {
        font: {
          family: 'Rubik',
          size: 12
        },
        maxRotation: 45,
        minRotation: 45
      }
    },
    y: {
      ticks: {
        font: {
          family: 'Rubik',
          size: 12
        }
      }
    }
  }
};

export default function AdminDashboard() {
  const router = useRouter();
  const [submissions, setSubmissions] = useState<ScheduleSubmission[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalEmployees: 0,
    scheduledShifts: 0,
    pendingRequests: 0,
    completedSchedules: 0
  });
  const [employeeActivityData, setEmployeeActivityData] = useState<any>(null);
  const [shiftDistributionData, setShiftDistributionData] = useState<any>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('adminLoggedIn');
    if (isLoggedIn !== 'true') {
      router.push('/');
      return;
    }

    loadDashboardData();
    const interval = setInterval(loadDashboardData, 30000);
    return () => clearInterval(interval);
  }, [router]);

  const loadDashboardData = () => {
    // Load submissions
    const savedSubmissions = localStorage.getItem('scheduleSubmissions');
    if (savedSubmissions) {
      setSubmissions(JSON.parse(savedSubmissions));
    }

    // Mock stats data
    setStats({
      totalEmployees: 15,
      scheduledShifts: 42,
      pendingRequests: 3,
      completedSchedules: 8
    });

    // Mock employee activity data
    setEmployeeActivityData({
      labels: ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'],
      datasets: [{
        label: 'פעילות עובדים',
        data: [12, 15, 13, 14, 11, 9, 8],
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }]
    });

    // Mock shift distribution data
    setShiftDistributionData({
      labels: ['בוקר', 'ערב', 'סגירה'],
      datasets: [{
        label: 'התפלגות משמרות',
        data: [25, 30, 15],
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(255, 159, 64, 0.5)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(255, 159, 64, 1)'
        ],
        borderWidth: 1
      }]
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn');
    router.push('/');
  };

  const handleAutoSchedule = (submission: ScheduleSubmission) => {
    const existingShifts = JSON.parse(localStorage.getItem('shifts') || '[]');
    const newShifts = Object.entries(submission.preferences).flatMap(([date, pref]) => {
      const shifts = [];
      if (pref.morning) shifts.push({ type: 'morning', date });
      if (pref.evening) shifts.push({ type: 'evening', date });
      if (pref.closing) shifts.push({ type: 'closing', date });
      return shifts.map(shift => ({
        id: `${date}-${shift.type}-${submission.employeeName}`,
        employeeId: submission.employeeName,
        employeeName: submission.employeeName,
        type: shift.type,
        date: date
      }));
    });

    localStorage.setItem('shifts', JSON.stringify([...existingShifts, ...newShifts]));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile Navigation */}
      <nav className="lg:hidden bg-white dark:bg-gray-800 shadow-lg fixed top-0 left-0 right-0 z-50">
        <div className="px-4 py-3">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">דשבורד מנהל</h1>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label="תפריט"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
          </div>
          {isMobileMenuOpen && (
            <div className="mt-3 space-y-2">
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
              >
                התנתק
              </button>
            </div>
          )}
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 mt-16 lg:mt-0">
        {/* Desktop Header */}
        <div className="hidden lg:flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">דשבורד מנהל</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
          >
            התנתק
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 lg:p-6">
            <h3 className="text-sm lg:text-lg font-semibold text-gray-600 dark:text-gray-300 mb-2">סה"כ עובדים</h3>
            <p className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">{stats.totalEmployees}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 lg:p-6">
            <h3 className="text-sm lg:text-lg font-semibold text-gray-600 dark:text-gray-300 mb-2">משמרות מתוכננות</h3>
            <p className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">{stats.scheduledShifts}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 lg:p-6">
            <h3 className="text-sm lg:text-lg font-semibold text-gray-600 dark:text-gray-300 mb-2">בקשות ממתינות</h3>
            <p className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">{stats.pendingRequests}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 lg:p-6">
            <h3 className="text-sm lg:text-lg font-semibold text-gray-600 dark:text-gray-300 mb-2">סידורים הושלמו</h3>
            <p className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">{stats.completedSchedules}</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Weekly Schedule */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 lg:p-6">
            <h2 className="text-lg lg:text-xl font-bold mb-4 text-gray-900 dark:text-white">סידור עבודה שבועי</h2>
            <div className="h-[300px] lg:h-[400px]">
              <WeeklySchedule />
            </div>
          </div>

          {/* Employee Activity Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 lg:p-6">
            <h2 className="text-lg lg:text-xl font-bold mb-4 text-gray-900 dark:text-white">פעילות עובדים</h2>
            <div className="h-[300px] lg:h-[400px]">
              {employeeActivityData && (
                <Line data={employeeActivityData} options={chartOptions} />
              )}
            </div>
          </div>

          {/* Shift Distribution */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 lg:p-6">
            <h2 className="text-lg lg:text-xl font-bold mb-4 text-gray-900 dark:text-white">התפלגות משמרות</h2>
            <div className="h-[300px] lg:h-[400px]">
              {shiftDistributionData && (
                <Bar data={shiftDistributionData} options={chartOptions} />
              )}
            </div>
          </div>

          {/* Recent Submissions */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 lg:p-6">
            <h2 className="text-lg lg:text-xl font-bold mb-4 text-gray-900 dark:text-white">הגשות אחרונות</h2>
            <div className="space-y-4 max-h-[300px] lg:max-h-[400px] overflow-y-auto">
              {submissions.length === 0 ? (
                <p className="text-gray-600 dark:text-gray-400">טרם הוגשו סידורי עבודה</p>
              ) : (
                submissions.map((submission, index) => (
                  <div
                    key={index}
                    className="p-3 lg:p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 transition-colors"
                  >
                    <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start space-y-3 lg:space-y-0">
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {submission.employeeName}
                        </div>
                        <div className="text-xs lg:text-sm text-gray-600 dark:text-gray-400">
                          הוגש ב-{format(new Date(submission.submittedAt), 'dd/MM/yyyy HH:mm')}
                        </div>
                        <div className="text-xs lg:text-sm text-gray-600 dark:text-gray-400">
                          לשבוע המתחיל ב-{format(new Date(submission.weekStart), 'dd/MM/yyyy')}
                        </div>
                      </div>
                      <button
                        onClick={() => handleAutoSchedule(submission)}
                        className="w-full lg:w-auto px-3 py-1 text-sm font-medium text-white bg-green-600 rounded hover:bg-green-700 transition-colors"
                      >
                        הוסף לסידור
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 