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

const Graphs = () => {
  const [topSellingItems, setTopSellingItems] = useState({});
  const [dailyTips, setDailyTips] = useState({});
  const [revenue, setRevenue] = useState({});
  const [nonSellingItems, setNonSellingItems] = useState({});

  useEffect(() => {
    // כאן יהיה הקוד שמביא את הנתונים מהשרת
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // כאן צריך להוסיף את הקריאות API האמיתיות שלך
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
          data: [30, 25, 20, 15] // ימים מאז המכירה האחרונה
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
          tension: 0.1
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
    <div className="graphs-container" style={{ padding: '20px' }}>
      <h1>נתוני המסעדה</h1>
      
      <div style={{ marginBottom: '30px' }}>
        <h2>פריטים נמכרים ביותר</h2>
        <Bar data={topSellingItems} />
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h2>טיפים לאורך היום</h2>
        <Line data={dailyTips} />
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h2>הכנסות יומיות</h2>
        <Pie data={revenue} />
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h2>פריטים שלא נמכרו זמן רב</h2>
        <Bar data={nonSellingItems} />
      </div>
    </div>
  );
};

export default Graphs; 