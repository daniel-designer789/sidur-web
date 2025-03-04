import './globals.css'
import type { Metadata } from 'next'
import { Rubik } from 'next/font/google'
import Sidebar from '@/components/Sidebar';
import { AppProvider } from '@/contexts/AppContext';

const rubik = Rubik({ 
  subsets: ['latin', 'hebrew'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-rubik',
})

export const metadata: Metadata = {
  title: 'מערכת סידור עבודה',
  description: 'מערכת לניהול סידור עבודה',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="he" dir="rtl" className={`${rubik.variable} dark`}>
      <body className={`${rubik.className} antialiased bg-background text-foreground`}>
        <AppProvider>
          <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 mr-64">
              <div className="container py-8">
                {children}
              </div>
            </main>
          </div>
        </AppProvider>
      </body>
    </html>
  )
}
