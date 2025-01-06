import React from 'react';

interface VBucksCardProps {
  title: string;
  price: number;
  originalPrice: number;
  legendary?: boolean;
}

export function VBucksCard({ title, price, originalPrice, legendary }: VBucksCardProps) {
  return (
    <div className="bg-[#1E2028] rounded-xl p-4 w-64 shadow-xl">
      {legendary && (
        <div className="bg-[#FF00E5] text-white text-xs font-bold px-2 py-1 rounded absolute -top-2 -right-2">
          Legendary
        </div>
      )}
      <div className="flex items-start gap-4">
        <img 
          src="https://fortnite-api.com/images/vbucks.png" 
          alt="V-Bucks" 
          className="w-12 h-12"
        />
        <div>
          <h3 className="font-semibold">{title}</h3>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold">${price.toLocaleString()}</span>
            <span className="text-sm text-red-500 line-through">
              ${originalPrice.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}