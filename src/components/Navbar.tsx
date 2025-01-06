import React from 'react';
import { Link } from 'react-router-dom';
import { Icons } from '../icons';
import { Button } from './ui/Button';
import { motion } from 'framer-motion';

export function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-[#0A0A0B]/95 backdrop-blur-lg border-b border-white/10 z-50">
      <div className="container h-full mx-auto px-4 xl:px-8 2xl:px-16">
        <div className="flex items-center justify-between h-full">
          <Link to="/" className="flex items-center gap-2">
            <img 
              src="https://imgur.com/5lQixNR.png" 
              alt="Lobomat Logo" 
              className="h-10 w-auto"
            />
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link 
              to="/" 
              className="text-[#8A8F98] hover:text-white transition-colors"
            >
              Inicio
            </Link>
            <Link 
              to="/store" 
              className="text-[#8A8F98] hover:text-white transition-colors"
            >
              Tienda
            </Link>
            <Link 
              to="/tutorial" 
              className="text-[#8A8F98] hover:text-white transition-colors"
            >
              Tutorial
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                variant="secondary"
                className="px-4 py-2"
              >
                <Icons.ShoppingCart className="w-5 h-5" />
              </Button>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button className="px-4 py-2">
                Conectar
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </header>
  );
}