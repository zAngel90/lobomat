import React from 'react';
import { VBucksCard } from './cards/VBucksCard';

export function Hero() {
  return (
    <div className="relative flex-1">
      <div className="absolute inset-0 bg-gradient-to-br from-[#00A3FF]/20 to-transparent rounded-3xl" />
      <div className="relative">
        <img 
          src="https://images.unsplash.com/photo-1600861194942-f883de0dfe96?auto=format&fit=crop&w=2000&q=80" 
          alt="Fortnite Character"
          className="rounded-3xl object-cover w-full h-[600px]"
        />
        <div className="absolute top-1/4 -left-8 transform -translate-y-1/2">
          <VBucksCard
            title="Battle Pass"
            price={950}
            originalPrice={1200}
            legendary
          />
        </div>
        <div className="absolute bottom-1/4 -right-8 transform translate-y-1/2">
          <VBucksCard
            title="V-Bucks Pack"
            price={2800}
            originalPrice={3500}
            legendary
          />
        </div>
      </div>
    </div>
  );
}