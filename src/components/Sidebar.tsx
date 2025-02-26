"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaUsers, FaHistory, FaCog, FaChartBar, FaChartPie } from 'react-icons/fa';
import { MdDashboard } from 'react-icons/md';

interface MenuItem {
  title: string;
  path: string;
  icon: string;
  description: string;
}

const menuItems: MenuItem[] = [
  { 
    title: 'דשבורד', 
    path: '/', 
    icon: '📊',
    description: 'סקירה כללית של המערכת'
  },
  { 
    title: 'עובדים', 
    path: '/employees', 
    icon: '👥',
    description: 'ניהול רשימת העובדים'
  },
  { 
    title: 'היסטוריית משמרות', 
    path: '/shifts-history', 
    icon: '📅',
    description: 'צפייה במשמרות שבוצעו'
  },
  { 
    title: 'הגדרות', 
    path: '/settings', 
    icon: '⚙️',
    description: 'הגדרות המערכת'
  },
  { 
    title: 'דוחות', 
    path: '/reports', 
    icon: '📈',
    description: 'הפקת דוחות וניתוח נתונים'
  },
  { 
    title: 'גרפים', 
    path: '/graphs', 
    icon: '📊',
    description: 'תצוגת גרפים וניתוח נתונים'
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  const links = [
    { href: '/', icon: MdDashboard, text: 'דשבורד' },
    { href: '/employees', icon: FaUsers, text: 'עובדים' },
    { href: '/shifts-history', icon: FaHistory, text: 'היסטוריית משמרות' },
    { href: '/settings', icon: FaCog, text: 'הגדרות' },
    { href: '/reports', icon: FaChartBar, text: 'דוחות' },
    { href: '/graphs', icon: FaChartPie, text: 'גרפים' },
  ];

  return (
    <aside className="fixed top-0 right-0 h-screen w-64 bg-white dark:bg-gray-700 border-l border-gray-200 dark:border-gray-600 transition-colors duration-200">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">ShiftManager</h1>
      </div>
      <nav className="mt-6">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center px-6 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200 ${
              isActive(link.href) ? 'bg-gray-100 dark:bg-gray-600' : ''
            }`}
          >
            <link.icon className="w-5 h-5 ml-3" />
            <span>{link.text}</span>
          </Link>
        ))}
      </nav>

      <div className="absolute bottom-0 right-0 w-full p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
            👤
          </div>
          <div>
            <div className="font-medium text-sm text-gray-900 dark:text-white">ישראל ישראלי</div>
            <div className="text-xs text-gray-700 dark:text-gray-300">מנהל מערכת</div>
          </div>
        </div>
      </div>
    </aside>
  );
} 