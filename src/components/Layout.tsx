import React from 'react';
import { Navbar } from './Navbar';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-[#0A0A0B]">
      {/* Background */}
      <div 
        className="fixed inset-0 bg-cover bg-center opacity-10 z-0"
        style={{
          backgroundImage: 'url("/background.webp")'
        }}
      />
      
      {/* Navbar */}
      <Navbar />
      
      {/* Main Content */}
      <main className="relative z-10">
        {children}
      </main>
    </div>
  );
}
