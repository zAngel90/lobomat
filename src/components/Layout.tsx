import React from 'react';
import { Navbar } from './Navbar';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0B0D12]">
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
      <div className="max-w-[1800px] mx-auto relative z-10">
        {children}
      </div>
    </div>
  );
}
