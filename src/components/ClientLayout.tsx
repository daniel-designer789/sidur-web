"use client";

import Sidebar from '@/components/Sidebar';
import { AppProvider } from '@/contexts/AppContext';
import { useState, useEffect } from 'react';
import MobileMenu from '@/components/MobileMenu';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isMobileMenuOpen && !target.closest('.mobile-sidebar') && !target.closest('.mobile-menu-button')) {
        setIsMobileMenuOpen(false);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMobileMenuOpen]);

  // Close sidebar when window is resized
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobileMenuOpen]);

  return (
    <AppProvider>
      <div className="relative min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Language Toggle - Will be handled in a separate component */}
        <div className="fixed top-4 right-4 z-50">
          <MobileMenu 
            isOpen={isMobileMenuOpen} 
            setIsOpen={setIsMobileMenuOpen} 
          />
        </div>
        
        <div className="flex">
          {/* Sidebar for desktop */}
          <div className="hidden lg:block right-0 w-64 fixed h-screen">
            <Sidebar />
          </div>
          
          {/* Mobile Sidebar */}
          <div 
            className={`lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          >
            <div 
              className={`fixed top-0 right-0 h-full w-64 bg-white dark:bg-gray-800 shadow-xl transform transition-transform duration-300 ease-in-out mobile-sidebar ${
                isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
              }`}
            >
              <Sidebar />
            </div>
          </div>
          
          {/* Main Content */}
          <main className="flex-1 w-full lg:mr-64 transition-all duration-300">
            <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-7xl">
              {children}
            </div>
          </main>
        </div>
      </div>
    </AppProvider>
  );
} 