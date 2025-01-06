import { motion } from 'framer-motion';
import React from 'react';

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function AnimatedCard({ children, className = '', onClick }: AnimatedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -5 }}
      transition={{ duration: 0.2 }}
      className={`relative bg-[#1A1D1F]/95 rounded-xl overflow-hidden border border-white/10 hover:border-[#00A3FF]/50 ${className}`}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
} 