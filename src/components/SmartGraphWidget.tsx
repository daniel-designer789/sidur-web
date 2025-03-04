"use client";

import React from 'react';
import { Line } from 'react-chartjs-2';
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
  const data: ChartDataType = {
    labels: ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני'],
    datasets: [
      {
        label: 'מספר משמרות',
        data: [12, 19, 3, 5, 2, 3],
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'נתוני משמרות',
      },
    },
  };

  return (
    <div 
      className="bg-white dark:bg-gray-800 rounded-xl p-4 cursor-pointer transition-transform hover:scale-[1.02]"
      onClick={onClick}
    >
      <Line data={data} options={options} />
    </div>
  );
} 