import { motion } from 'framer-motion';
import { Button } from './Button';
import React from 'react';

interface AnimatedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary';
  children: React.ReactNode;
}

export function AnimatedButton({ children, variant = 'default', className, ...props }: AnimatedButtonProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Button 
        variant={variant}
        className={`relative overflow-hidden group ${className}`}
        {...props}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#00A3FF] to-[#00FFB3] opacity-0 group-hover:opacity-20 transition-opacity" />
        <span className="relative z-10">{children}</span>
      </Button>
    </motion.div>
  );
} 