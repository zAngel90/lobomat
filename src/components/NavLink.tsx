import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface NavLinkProps {
  to: string;
  icon: React.ReactNode;
  text: string;
}

export function NavLink({ to, icon, text }: NavLinkProps) {
  return (
    <Link to={to}>
      <motion.div
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-white/70 hover:text-white hover:bg-white/10 transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {icon}
        <span>{text}</span>
      </motion.div>
    </Link>
  );
}
