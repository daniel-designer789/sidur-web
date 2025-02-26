import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import "./globals.css";
import Sidebar from '@/components/Sidebar';
import { AppProvider } from '@/contexts/AppContext';

const rubik = Rubik({ 
  subsets: ["latin", "hebrew"],
  weight: ['300', '400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: "מערכת ניהול משמרות",
  description: "מערכת מתקדמת לניהול משמרות בארגון שלך",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="he" dir="rtl" suppressHydrationWarning>
      <head>
        <meta name="color-scheme" content="light dark" />
      </head>
      <body className={`${rubik.className} antialiased`}>
        <AppProvider>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-800 transition-colors duration-200">
            <Sidebar />
            <main className="mr-64 p-6 transition-all duration-200">
              {children}
            </main>
          </div>
        </AppProvider>
      </body>
    </html>
  );
}
