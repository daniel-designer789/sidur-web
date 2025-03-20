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
  unassignedShifts: number;
  employeeSatisfactionRate: number;
  upcomingTimeOffRequests: number;
  overdueSchedules: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const { t, language, direction } = useLanguage();
  const [submissions, setSubmissions] = useState<ScheduleSubmission[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalEmployees: 0,
    scheduledShifts: 0,
    pendingRequests: 0,
    completedSchedules: 0,
    unassignedShifts: 0,
    employeeSatisfactionRate: 0,
    upcomingTimeOffRequests: 0,
    overdueSchedules: 0
  });
  const [employeeActivityData, setEmployeeActivityData] = useState<any>(null);
  const [shiftDistributionData, setShiftDistributionData] = useState<any>(null);
  const [weeklyComparisonData, setWeeklyComparisonData] = useState<any>(null);
  const [overallUtilizationData, setOverallUtilizationData] = useState<any>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState<Date>(new Date());
  const [showShiftDetails, setShowShiftDetails] = useState<boolean>(false);
  const [selectedShift, setSelectedShift] = useState<any>(null);
  const [isAddingShift, setIsAddingShift] = useState<boolean>(false);

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

    // Enhanced mock stats data
    setStats({
      totalEmployees: 15,
      scheduledShifts: 42,
      pendingRequests: 3,
      completedSchedules: 8,
      unassignedShifts: 5,
      employeeSatisfactionRate: 87,
      upcomingTimeOffRequests: 2,
      overdueSchedules: 1
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

    // Weekly comparison data
    setWeeklyComparisonData({
      labels: [t('week.previous'), t('week.current')],
      datasets: [
        {
          label: t('shifts.scheduled'),
          data: [36, 42],
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        },
        {
          label: t('requests.timeOff'),
          data: [4, 2],
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1
        },
        {
          label: t('shifts.unassigned'),
          data: [8, 5],
          backgroundColor: 'rgba(255, 206, 86, 0.5)',
          borderColor: 'rgba(255, 206, 86, 1)',
          borderWidth: 1
        }
      ]
    });

    // Overall utilization data
    setOverallUtilizationData({
      labels: ['Daniel', 'Yael', 'Moshe', 'Sarah', 'David'],
      datasets: [{
        label: t('employee.utilization'),
        data: [85, 92, 78, 90, 82],
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgba(75, 192, 192, 1)',
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

  const handlePreviousWeek = () => {
    const prevWeek = new Date(selectedWeek);
    prevWeek.setDate(prevWeek.getDate() - 7);
    setSelectedWeek(prevWeek);
  };

  const handleNextWeek = () => {
    const nextWeek = new Date(selectedWeek);
    nextWeek.setDate(nextWeek.getDate() + 7);
    setSelectedWeek(nextWeek);
  };

  const handleShiftClick = (shift: any) => {
    setSelectedShift(shift);
    setShowShiftDetails(true);
  };

  const handleAddShift = () => {
    setIsAddingShift(true);
  };

  const formatWeekRange = (date: Date) => {
    const startOfWeek = new Date(date);
    const endOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay()); // Sunday
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Saturday
    
    return `${format(startOfWeek, 'MMM d')} - ${format(endOfWeek, 'MMM d, yyyy')}`;
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

        {/* Enhanced Stats Cards */}
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
            <h3 className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{t('stats.unassignedShifts')}</h3>
            <p className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">{stats.unassignedShifts}</p>
            {stats.unassignedShifts > 0 && (
              <span className="inline-flex items-center text-xs font-medium text-red-500 mt-1">
                <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                {t('action.required')}
              </span>
            )}
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 md:p-6 transition-transform duration-300 hover:shadow-lg hover:-translate-y-1">
            <h3 className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{t('stats.pendingRequests')}</h3>
            <p className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">{stats.pendingRequests}</p>
            {stats.pendingRequests > 0 && (
              <span className="inline-flex items-center text-xs font-medium text-yellow-500 mt-1">
                <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {t('status.pending')}
              </span>
            )}
          </div>
        </div>

        {/* Priority Action Items */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 md:p-6 mb-6 md:mb-8">
          <h2 className="text-base md:text-lg font-bold mb-3 md:mb-4 text-gray-900 dark:text-white flex items-center">
            <svg className="w-5 h-5 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            {t('dashboard.priorityActions')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {stats.unassignedShifts > 0 && (
              <div className="flex items-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-800">
                <div className="flex-shrink-0 mr-3">
                  <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-800 flex items-center justify-center">
                    <svg className="w-5 h-5 text-red-600 dark:text-red-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-red-800 dark:text-red-200">{stats.unassignedShifts} {t('shifts.unassigned')}</h3>
                  <p className="text-xs text-red-600 dark:text-red-300">{t('shifts.needAssignment')}</p>
                </div>
              </div>
            )}
            {stats.pendingRequests > 0 && (
              <div className="flex items-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-100 dark:border-yellow-800">
                <div className="flex-shrink-0 mr-3">
                  <div className="w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-800 flex items-center justify-center">
                    <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">{stats.pendingRequests} {t('requests.pending')}</h3>
                  <p className="text-xs text-yellow-600 dark:text-yellow-300">{t('requests.needReview')}</p>
                </div>
              </div>
            )}
            {stats.upcomingTimeOffRequests > 0 && (
              <div className="flex items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
                <div className="flex-shrink-0 mr-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-800 flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600 dark:text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">{stats.upcomingTimeOffRequests} {t('timeOff.upcoming')}</h3>
                  <p className="text-xs text-blue-600 dark:text-blue-300">{t('timeOff.planAhead')}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {/* Enhanced Weekly Schedule - Full width on all screens */}
          <div className="md:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 md:p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
              <h2 className="text-base md:text-lg font-bold mb-3 md:mb-0 text-gray-900 dark:text-white flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {t('schedule.weekly')}
              </h2>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                  <button 
                    onClick={handlePreviousWeek}
                    className="p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    aria-label={t('navigation.previousWeek')}
                  >
                    <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <span className="px-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    {formatWeekRange(selectedWeek)}
                  </span>
                  <button 
                    onClick={handleNextWeek}
                    className="p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    aria-label={t('navigation.nextWeek')}
                  >
                    <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
                <div className="relative">
                  <button
                    onClick={handleAddShift}
                    className="flex items-center text-sm font-medium text-white bg-blue-600 rounded-lg px-3 py-1.5 hover:bg-blue-700 transition-colors"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    {t('schedule.addShift')}
                  </button>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-2 mb-3">
              <div className="flex justify-between mb-2">
                {['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'].map((day) => (
                  <div key={day} className="flex-1 text-center">
                    <div className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase mb-1">
                      {t(`day.${day}`)}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {format(
                        (() => {
                          const date = new Date(selectedWeek);
                          const dayOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'].indexOf(day);
                          date.setDate(date.getDate() - date.getDay() + dayOfWeek);
                          return date;
                        })(),
                        'MMM d'
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative overflow-hidden rounded-lg border border-gray-100 dark:border-gray-700">
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-transparent via-transparent to-white dark:to-gray-800 z-10 opacity-70 w-12 right-0"></div>
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-l from-transparent via-transparent to-white dark:to-gray-800 z-10 opacity-70 w-12 left-0"></div>
              <div className="h-[400px] overflow-x-auto overflow-y-hidden pb-4 custom-scrollbar">
                <WeeklySchedule 
                  selectedWeek={selectedWeek}
                  onShiftClick={handleShiftClick}
                  className="w-full"
                />
              </div>
            </div>
            
            <div className="mt-4 grid grid-cols-3 gap-4">
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-blue-500 mr-2"></div>
                <span className="text-xs text-gray-700 dark:text-gray-300">{t('shift.morning')}</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
                <span className="text-xs text-gray-700 dark:text-gray-300">{t('shift.evening')}</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-purple-500 mr-2"></div>
                <span className="text-xs text-gray-700 dark:text-gray-300">{t('shift.closing')}</span>
              </div>
            </div>
            
            {/* Shift Details Modal */}
            {showShiftDetails && selectedShift && (
              <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6 relative">
                  <button 
                    onClick={() => setShowShiftDetails(false)}
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    {t('shift.details')}
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {t('employee.name')}
                      </div>
                      <div className="text-base text-gray-900 dark:text-white">
                        {selectedShift.employeeName}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {t('shift.type')}
                      </div>
                      <div className="text-base text-gray-900 dark:text-white capitalize">
                        {selectedShift.type}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {t('shift.date')}
                      </div>
                      <div className="text-base text-gray-900 dark:text-white">
                        {format(new Date(selectedShift.date), 'PPPP', { locale: language === 'he' ? he : enUS })}
                      </div>
                    </div>
                    
                    <div className="flex space-x-3 pt-2">
                      <button
                        className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        {t('shift.edit')}
                      </button>
                      <button
                        className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                      >
                        {t('shift.delete')}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Add Shift Modal */}
            {isAddingShift && (
              <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6 relative">
                  <button 
                    onClick={() => setIsAddingShift(false)}
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    {t('shift.addNew')}
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t('employee.select')}
                      </label>
                      <select className="w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white">
                        <option value="">{t('employee.selectOption')}</option>
                        <option value="1">Daniel Cohen</option>
                        <option value="2">Yael Levi</option>
                        <option value="3">Moshe Goldberg</option>
                        <option value="4">Sarah Mizrahi</option>
                        <option value="5">David Peretz</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t('shift.type')}
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        <button className="py-2 px-3 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-md hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors text-xs font-medium">
                          {t('shift.morning')}
                        </button>
                        <button className="py-2 px-3 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-xs font-medium">
                          {t('shift.evening')}
                        </button>
                        <button className="py-2 px-3 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-xs font-medium">
                          {t('shift.closing')}
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t('shift.date')}
                      </label>
                      <input 
                        type="date" 
                        className="w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    
                    <div className="pt-2">
                      <button
                        className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        {t('shift.add')}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Weekly Comparison */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 md:p-6 h-auto">
            <h2 className="text-base md:text-lg font-bold mb-3 md:mb-4 text-gray-900 dark:text-white flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              {t('comparison.weekly')}
            </h2>
            <div className="h-[250px] md:h-[300px]">
              {weeklyComparisonData && (
                <Bar data={weeklyComparisonData} options={chartOptions} />
              )}
            </div>
          </div>

          {/* Employee Utilization */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 md:p-6 h-auto">
            <h2 className="text-base md:text-lg font-bold mb-3 md:mb-4 text-gray-900 dark:text-white flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {t('employee.utilization')}
            </h2>
            <div className="h-[250px] md:h-[300px]">
              {overallUtilizationData && (
                <Bar data={overallUtilizationData} options={chartOptions} />
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