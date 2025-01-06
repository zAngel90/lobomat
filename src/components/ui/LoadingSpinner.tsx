import React from 'react';

export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center">
      <div className="relative">
        {/* Anillo exterior */}
        <div className="w-12 h-12 rounded-full border-2 border-[#00A3FF]/20 animate-[spin_3s_linear_infinite]" />
        {/* Anillo medio con dirección opuesta */}
        <div className="absolute top-0 left-0 w-12 h-12 rounded-full border-2 border-t-[#00FFB3] border-r-[#00FFB3] border-b-transparent border-l-transparent animate-[spin_2s_linear_infinite_reverse]" />
        {/* Anillo interior */}
        <div className="absolute top-1 left-1 w-10 h-10 rounded-full border-2 border-t-[#00A3FF] border-r-transparent border-b-[#00A3FF] border-l-transparent animate-[spin_1.5s_linear_infinite]" />
      </div>
    </div>
  );
} 