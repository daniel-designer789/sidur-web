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
  Legend
} from 'chart.js';

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

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
      rtl: true,
      labels: {
        font: {
          family: 'Rubik'
        }
      }
    },
  },
  scales: {
    x: {
      ticks: {
        font: {
          family: 'Rubik'
        }
      }
    },
    y: {
      ticks: {
        font: {
          family: 'Rubik'
        }
      }
    }
  }
};

export default function Graphs() {
  const [topSellingItems, setTopSellingItems] = useState<any>({});
  const [dailyTips, setDailyTips] = useState<any>({});
  const [revenue, setRevenue] = useState<any>({});
  const [nonSellingItems, setNonSellingItems] = useState<any>({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const mockData = {
        topSelling: {
          labels: ['פיצה', 'המבורגר', 'סלט', 'פסטה', 'קינוח'],
          data: [50, 40, 30, 25, 20]
        },
        tips: {
          labels: ['8:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00'],
          data: [100, 150, 300, 400, 350, 500, 450]
        },
        dailyRevenue: {
          labels: ['ברוטו', 'נטו'],
          data: [5000, 4200]
        },
        oldItems: {
          labels: ['סושי', 'מרק', 'טופו', 'סלט יווני'],
          data: [30, 25, 20, 15]
        }
      };

      setTopSellingItems({
        labels: mockData.topSelling.labels,
        datasets: [{
          label: 'פריטים נמכרים ביותר',
          data: mockData.topSelling.data,
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
        }]
      });

      setDailyTips({
        labels: mockData.tips.labels,
        datasets: [{
          label: 'טיפים לאורך היום',
          data: mockData.tips.data,
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          tension: 0.1,
          fill: true
        }]
      });

      setRevenue({
        labels: mockData.dailyRevenue.labels,
        datasets: [{
          label: 'הכנסות יומיות',
          data: mockData.dailyRevenue.data,
          backgroundColor: ['rgba(255, 99, 132, 0.5)', 'rgba(75, 192, 192, 0.5)'],
        }]
      });

      setNonSellingItems({
        labels: mockData.oldItems.labels,
        datasets: [{
          label: 'ימים מאז המכירה האחרונה',
          data: mockData.oldItems.data,
          backgroundColor: 'rgba(255, 159, 64, 0.5)',
        }]
      });
    } catch (error) {
      console.error('שגיאה בטעינת הנתונים:', error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-center">נתוני המסעדה</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">פריטים נמכרים ביותר</h2>
          <div className="h-[300px]">
            <Bar data={topSellingItems} options={options} />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">טיפים לאורך היום</h2>
          <div className="h-[300px]">
            <Line data={dailyTips} options={options} />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">הכנסות יומיות</h2>
          <div className="h-[300px]">
            <Pie data={revenue} options={options} />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">פריטים שלא נמכרו זמן רב</h2>
          <div className="h-[300px]">
            <Bar data={nonSellingItems} options={options} />
          </div>
        </div>
      </div>
    </div>
  );
} 