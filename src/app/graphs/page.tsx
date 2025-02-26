"use client";

import React, { useState, useEffect } from 'react';
import { Bar, Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  ChartData
} from 'chart.js';
import { Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

// רישום הקומפוננטות הנדרשות של Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// הגדרת טיפוסים לנתונים
interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor?: string | string[];
  borderColor?: string;
  tension?: number;
}

interface ChartDataType {
  labels: string[];
  datasets: ChartDataset[];
}

interface AdvancedChartData extends ChartDataType {
  insights: {
    total: number;
    trend: number;
    comparison: string;
    recommendation?: string;
  };
}

interface FullScreenGraphProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const FullScreenGraph: React.FC<FullScreenGraphProps> = ({ isOpen, onClose, title, children }) => {
  return (
    <Dialog
      fullScreen
      open={isOpen}
      onClose={onClose}
      className="bg-white dark:bg-gray-800"
    >
      <DialogTitle className="flex justify-between items-center">
        <span className="text-xl font-semibold">{title}</span>
        <IconButton onClick={onClose} className="text-gray-500">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent className="p-8">
        <div className="w-full h-[80vh]">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default function GraphsPage() {
  const [topSellingItems, setTopSellingItems] = useState<AdvancedChartData>({
    labels: [],
    datasets: [],
    insights: {
      total: 0,
      trend: 0,
      comparison: '',
      recommendation: ''
    }
  });
  const [dailyTips, setDailyTips] = useState<AdvancedChartData>({
    labels: [],
    datasets: [],
    insights: {
      total: 0,
      trend: 0,
      comparison: '',
      recommendation: ''
    }
  });
  const [revenue, setRevenue] = useState<AdvancedChartData>({
    labels: [],
    datasets: [],
    insights: {
      total: 0,
      trend: 0,
      comparison: '',
      recommendation: ''
    }
  });
  const [nonSellingItems, setNonSellingItems] = useState<AdvancedChartData>({
    labels: [],
    datasets: [],
    insights: {
      total: 0,
      trend: 0,
      comparison: '',
      recommendation: ''
    }
  });
  const [activeGraph, setActiveGraph] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const mockData = {
        topSelling: {
          labels: ['פיצה', 'המבורגר', 'סלט', 'פסטה', 'קינוח'],
          data: [50, 40, 30, 25, 20],
          insights: {
            total: 165,
            trend: 15,
            comparison: "20% יותר ממוצע החודשי",
            recommendation: "כדאי להגדיל מלאי של פיצה והמבורגר"
          }
        },
        tips: {
          labels: ['8:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00'],
          data: [100, 150, 300, 400, 350, 500, 450],
          insights: {
            total: 2250,
            trend: 8,
            comparison: "שיא חדש לשבוע זה",
            recommendation: "שעות השיא הן 14:00-20:00"
          }
        },
        dailyRevenue: {
          labels: ['ברוטו', 'נטו'],
          data: [5000, 4200],
          insights: {
            total: 4200,
            trend: -3,
            comparison: "ירידה של 3% מאתמול",
            recommendation: "לבדוק עלויות תפעוליות"
          }
        },
        oldItems: {
          labels: ['סושי', 'מרק', 'טופו', 'סלט יווני'],
          data: [30, 25, 20, 15],
          insights: {
            total: 90,
            trend: 0,
            comparison: "לא נמכרו מעל 15 ימים",
            recommendation: "לשקול הסרה מהתפריט או מבצע מיוחד"
          }
        }
      };

      setTopSellingItems({
        labels: mockData.topSelling.labels,
        datasets: [{
          label: 'פריטים נמכרים ביותר',
          data: mockData.topSelling.data,
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
        }],
        insights: mockData.topSelling.insights
      });

      setDailyTips({
        labels: mockData.tips.labels,
        datasets: [{
          label: 'טיפים לאורך היום',
          data: mockData.tips.data,
          borderColor: 'rgba(75, 192, 192, 1)',
          tension: 0.1
        }],
        insights: mockData.tips.insights
      });

      setRevenue({
        labels: mockData.dailyRevenue.labels,
        datasets: [{
          label: 'הכנסות יומיות',
          data: mockData.dailyRevenue.data,
          backgroundColor: ['rgba(255, 99, 132, 0.5)', 'rgba(75, 192, 192, 0.5)'],
        }],
        insights: mockData.dailyRevenue.insights
      });

      setNonSellingItems({
        labels: mockData.oldItems.labels,
        datasets: [{
          label: 'ימים מאז המכירה האחרונה',
          data: mockData.oldItems.data,
          backgroundColor: 'rgba(255, 159, 64, 0.5)',
        }],
        insights: mockData.oldItems.insights
      });
    } catch (error) {
      console.error('שגיאה בטעינת הנתונים:', error);
    }
  };

  const handleGraphClick = (graphId: string) => {
    setActiveGraph(graphId);
  };

  const handleCloseGraph = () => {
    setActiveGraph(null);
  };

  const renderInsights = (insights: AdvancedChartData['insights']) => (
    <div className="mt-4 space-y-2 text-sm">
      <div className="flex justify-between">
        <span className="text-gray-600 dark:text-gray-300">סה"כ: {insights.total}</span>
        <span className={`${insights.trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {insights.trend >= 0 ? '↑' : '↓'} {Math.abs(insights.trend)}%
        </span>
      </div>
      <div className="text-gray-600 dark:text-gray-300">{insights.comparison}</div>
      {insights.recommendation && (
        <div className="text-blue-600 dark:text-blue-400">
          💡 {insights.recommendation}
        </div>
      )}
    </div>
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">נתוני המסעדה</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">פריטים נמכרים ביותר</h2>
          <Bar data={topSellingItems} options={{
            responsive: true,
            plugins: {
              legend: {
                display: false
              }
            }
          }} />
          {renderInsights(topSellingItems.insights)}
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">טיפים לאורך היום</h2>
          <Line data={dailyTips} options={{
            responsive: true,
            plugins: {
              legend: {
                display: false
              }
            }
          }} />
          {renderInsights(dailyTips.insights)}
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">הכנסות יומיות</h2>
          <Pie data={revenue} options={{
            responsive: true,
            plugins: {
              legend: {
                position: 'bottom'
              }
            }
          }} />
          {renderInsights(revenue.insights)}
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">פריטים שלא נמכרו זמן רב</h2>
          <Bar data={nonSellingItems} options={{
            responsive: true,
            plugins: {
              legend: {
                display: false
              }
            }
          }} />
          {renderInsights(nonSellingItems.insights)}
        </div>
      </div>

      {/* Full Screen Modals */}
      <FullScreenGraph
        isOpen={activeGraph === 'topSelling'}
        onClose={handleCloseGraph}
        title="פריטים נמכרים ביותר"
      >
        <Bar data={topSellingItems} options={{ maintainAspectRatio: false }} />
      </FullScreenGraph>

      <FullScreenGraph
        isOpen={activeGraph === 'tips'}
        onClose={handleCloseGraph}
        title="טיפים לאורך היום"
      >
        <Line data={dailyTips} options={{ maintainAspectRatio: false }} />
      </FullScreenGraph>

      <FullScreenGraph
        isOpen={activeGraph === 'revenue'}
        onClose={handleCloseGraph}
        title="הכנסות יומיות"
      >
        <Pie data={revenue} options={{ maintainAspectRatio: false }} />
      </FullScreenGraph>

      <FullScreenGraph
        isOpen={activeGraph === 'nonSelling'}
        onClose={handleCloseGraph}
        title="פריטים שלא נמכרו זמן רב"
      >
        <Bar data={nonSellingItems} options={{ maintainAspectRatio: false }} />
      </FullScreenGraph>
    </div>
  );
} 