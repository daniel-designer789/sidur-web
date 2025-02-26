"use client";

import React from 'react';
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

interface SmartGraphWidgetProps {
  onClick?: () => void;
}

export default function SmartGraphWidget({ onClick }: SmartGraphWidgetProps) {
  const [data, setData] = React.useState<ChartDataType>({
    labels: [],
    datasets: []
  });

  React.useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    // כאן יהיה הקוד שמביא את הנתונים העדכניים ביותר
    const mockData = {
      labels: ['8:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00'],
      data: [100, 150, 300, 400, 350, 500, 450]
    };

    setData({
      labels: mockData.labels,
      datasets: [{
        label: 'טיפים היום',
        data: mockData.data,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.1
      }]
    });
  };

  return (
    <div 
      className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-sm font-semibold">טיפים היום</h2>
        <span className="text-xs text-gray-500">לחץ להרחבה</span>
      </div>
      <div className="h-32">
        <Line data={data} options={{
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            x: {
              display: false
            },
            y: {
              display: false
            }
          }
        }} />
      </div>
      <div className="mt-2 flex justify-between items-center text-xs">
        <span className="text-gray-600 dark:text-gray-300">סה"כ: ₪450</span>
        <span className="text-green-600">↑ 15%</span>
      </div>
    </div>
  );
} 