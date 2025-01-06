import React from 'react';
import { Link } from 'react-router-dom';
import { Icons } from '../icons';
import { Button } from './ui/Button';
import { NavLink } from './NavLink';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

export function Navbar() {
  const { isAuthenticated } = useAuth();

  return (
    <motion.nav 
      className="fixed top-0 left-0 right-0 z-[9999] h-16 bg-[#0B0D12] border-b border-[#1A1D1F]"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Contenido del Navbar */}
      <div className="container mx-auto px-4 h-full">
        <div className="flex items-center justify-between h-full relative">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 z-10">
            <Icons.Store className="w-6 h-6 text-primary" />
            <span className="text-lg font-bold bg-gradient-to-r from-primary to-primary-hover text-transparent bg-clip-text">
              Lobomat
            </span>
          </Link>

          {/* Enlaces de navegación */}
          <div className="flex items-center gap-6 z-10">
            <NavLink to="/" icon={<Icons.Home className="w-4 h-4" />} text="Inicio" />
            <NavLink to="/store" icon={<Icons.Store className="w-4 h-4" />} text="Tienda" />
            <NavLink to="/tutorial" icon={<Icons.Book className="w-4 h-4" />} text="Tutorial" />
            <NavLink to="/bot" icon={<Icons.Bot className="w-4 h-4" />} text="Bot" />
          </div>

          {/* Botones de acción */}
          <div className="flex items-center gap-2 z-10">
            {!isAuthenticated && (
              <Button 
                variant="secondary"
                className="flex items-center gap-1 px-3 py-1.5 text-sm bg-primary/10 hover:bg-primary/20"
              >
                <Icons.LogIn className="w-4 h-4" />
                <span>Login</span>
              </Button>
            )}
            <Button className="flex items-center gap-1 px-3 py-1.5 text-sm">
              <Icons.ShoppingCart className="w-4 h-4" />
              <span>Cart</span>
            </Button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}