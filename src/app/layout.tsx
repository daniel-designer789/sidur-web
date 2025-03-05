import './globals.css'
import type { Metadata } from 'next'
import { Rubik } from 'next/font/google'
import ClientLayout from '@/components/ClientLayout'
import { LanguageProvider } from '@/contexts/LanguageContext'

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
        <LanguageProvider>
          <ClientLayout>
            {children}
          </ClientLayout>
        </LanguageProvider>
      </body>
    </html>
  )
}
