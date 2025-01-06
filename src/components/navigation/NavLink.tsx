import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface NavLinkProps {
  icon: React.ReactNode;
  text: string;
  to: string;
}

export function NavLink({ icon, text, to }: NavLinkProps) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link 
      to={to} 
      className={`flex items-center gap-2 transition-colors ${
        isActive 
          ? 'text-white' 
          : 'text-[#8A8F98] hover:text-white'
      }`}
    >
      {icon}
      <span>{text}</span>
    </Link>
  );
}