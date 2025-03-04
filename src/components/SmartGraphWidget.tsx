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
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        rtl: true,
        labels: {
          font: {
            family: 'Rubik',
            size: 12,
          },
          padding: 16,
          boxWidth: 32,
          boxHeight: 16,
        },
      },
      title: {
        display: true,
        text: 'נתוני משמרות',
        font: {
          family: 'Rubik',
          size: 14,
          weight: 'bold' as const,
        },
        padding: { top: 10, bottom: 20 },
      },
      tooltip: {
        bodyFont: {
          family: 'Rubik',
          size: 12,
        },
        titleFont: {
          family: 'Rubik',
          size: 12,
          weight: 'bold' as const,
        },
        padding: 12,
        rtl: true,
        textDirection: 'rtl',
        displayColors: true,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        ticks: {
          font: {
            family: 'Rubik',
            size: 11,
          },
          maxRotation: 45,
          minRotation: 45,
        },
        grid: {
          display: false,
        },
      },
      y: {
        ticks: {
          font: {
            family: 'Rubik',
            size: 11,
          },
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
    },
    interaction: {
      mode: 'index' as const,
      axis: 'x' as const,
      intersect: false,
    },
  };

  return (
    <div 
      className="bg-white dark:bg-gray-800 rounded-xl p-2 sm:p-4 cursor-pointer transition-transform hover:scale-[1.02] active:scale-[0.98] touch-manipulation"
      onClick={onClick}
    >
      <div className="h-[200px] sm:h-[300px]">
        <Line data={data} options={options} />
      </div>
    </div>
  );
} 