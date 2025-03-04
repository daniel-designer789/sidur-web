"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import WeeklySchedule from '@/components/WeeklySchedule';
import { format } from 'date-fns';
import { he, enUS } from 'date-fns/locale';
import { Bar, Line } from 'react-chartjs-2';
import { useLanguage } from '@/contexts/LanguageContext';
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

export default function AdminDashboard() {
  const router = useRouter();
  const { t, language, direction } = useLanguage();
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

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        rtl: direction === 'rtl',
        labels: {
          font: {
            family: 'Rubik',
            size: 11
          },
          padding: 10,
          boxWidth: 20,
          boxHeight: 10
        }
      },
      tooltip: {
        bodyFont: {
          family: 'Rubik',
          size: 12
        },
        titleFont: {
          family: 'Rubik',
          size: 12
        },
        padding: 8,
        rtl: direction === 'rtl',
        textDirection: direction
      }
    },
    scales: {
      x: {
        ticks: {
          font: {
            family: 'Rubik',
            size: 10
          },
          maxRotation: 45,
          minRotation: 45
        }
      },
      y: {
        ticks: {
          font: {
            family: 'Rubik',
            size: 10
          }
        }
      }
    }
  };

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
      labels: [
        t('day.sunday'),
        t('day.monday'),
        t('day.tuesday'),
        t('day.wednesday'),
        t('day.thursday'),
        t('day.friday'),
        t('day.saturday')
      ],
      datasets: [{
        label: t('activity.employee'),
        data: [12, 15, 13, 14, 11, 9, 8],
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }]
    });

    // Mock shift distribution data
    setShiftDistributionData({
      labels: [
        t('shift.morning'),
        t('shift.evening'),
        t('shift.closing')
      ],
      datasets: [{
        label: t('shifts.distribution'),
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
      <nav className="lg:hidden bg-white dark:bg-gray-800 shadow-lg fixed top-0 left-0 right-0 z-40">
        <div className="px-4 py-3">
          <div className="flex justify-between items-center">
            <h1 className="text-lg font-bold text-gray-900 dark:text-white">{t('dashboard.title')}</h1>
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
            >
              {t('dashboard.logout')}
            </button>
          </div>
        </div>
      </nav>

      <div className={`container mx-auto px-2 sm:px-4 py-4 sm:py-8 mt-14 lg:mt-0`}>
        {/* Desktop Header - hidden on mobile */}
        <div className="hidden lg:flex justify-between items-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">{t('dashboard.title')}</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
          >
            {t('dashboard.logout')}
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 md:p-6 transition-transform duration-300 hover:shadow-lg hover:-translate-y-1">
            <h3 className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{t('stats.totalEmployees')}</h3>
            <p className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">{stats.totalEmployees}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 md:p-6 transition-transform duration-300 hover:shadow-lg hover:-translate-y-1">
            <h3 className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{t('stats.scheduledShifts')}</h3>
            <p className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">{stats.scheduledShifts}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 md:p-6 transition-transform duration-300 hover:shadow-lg hover:-translate-y-1">
            <h3 className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{t('stats.pendingRequests')}</h3>
            <p className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">{stats.pendingRequests}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 md:p-6 transition-transform duration-300 hover:shadow-lg hover:-translate-y-1">
            <h3 className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{t('stats.completedSchedules')}</h3>
            <p className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">{stats.completedSchedules}</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {/* Weekly Schedule - Full width on all screens */}
          <div className="md:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 md:p-6">
            <h2 className="text-base md:text-lg font-bold mb-3 md:mb-4 text-gray-900 dark:text-white flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {t('schedule.weekly')}
            </h2>
            <div className="relative overflow-hidden rounded-lg border border-gray-100 dark:border-gray-700">
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-transparent via-transparent to-white dark:to-gray-800 z-10 opacity-70 w-12 right-0"></div>
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-l from-transparent via-transparent to-white dark:to-gray-800 z-10 opacity-70 w-12 left-0"></div>
              <div className="h-[400px] overflow-x-auto overflow-y-hidden pb-4 custom-scrollbar">
                <WeeklySchedule />
              </div>
            </div>
          </div>

          {/* Employee Activity Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 md:p-6 h-auto">
            <h2 className="text-base md:text-lg font-bold mb-3 md:mb-4 text-gray-900 dark:text-white flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              {t('activity.employee')}
            </h2>
            <div className="h-[250px] md:h-[300px]">
              {employeeActivityData && (
                <Line data={employeeActivityData} options={chartOptions} />
              )}
            </div>
          </div>

          {/* Shift Distribution */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 md:p-6 h-auto">
            <h2 className="text-base md:text-lg font-bold mb-3 md:mb-4 text-gray-900 dark:text-white flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
              </svg>
              {t('shifts.distribution')}
            </h2>
            <div className="h-[250px] md:h-[300px]">
              {shiftDistributionData && (
                <Bar data={shiftDistributionData} options={chartOptions} />
              )}
            </div>
          </div>

          {/* Recent Submissions */}
          <div className="md:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 md:p-6">
            <h2 className="text-base md:text-lg font-bold mb-3 md:mb-4 text-gray-900 dark:text-white flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              {t('submissions.recent')}
            </h2>
            <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
              {submissions.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                  <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{t('submissions.empty')}</p>
                </div>
              ) : (
                submissions.map((submission, index) => (
                  <div
                    key={index}
                    className="p-3 md:p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 transition-colors bg-white dark:bg-gray-800 shadow-sm hover:shadow-md"
                  >
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-3 md:space-y-0">
                      <div>
                        <div className="text-sm font-semibold text-gray-900 dark:text-white">
                          {submission.employeeName}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400 mt-1 flex items-center">
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {t('submissions.submittedAt')}
                          {format(new Date(submission.submittedAt), 'dd/MM/yyyy HH:mm', { locale: language === 'he' ? he : enUS })}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400 mt-1 flex items-center">
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {t('submissions.weekStarting')}
                          {format(new Date(submission.weekStart), 'dd/MM/yyyy', { locale: language === 'he' ? he : enUS })}
                        </div>
                      </div>
                      <button
                        onClick={() => handleAutoSchedule(submission)}
                        className="w-full md:w-auto px-3 py-1.5 text-xs md:text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        {t('schedule.addToSchedule')}
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