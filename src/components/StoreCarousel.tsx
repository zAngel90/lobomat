import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const messages = [
  "🌟 Somos la mejor tienda de pavos de Fortnite",
  "💎 Los mejores precios en V-Bucks",
  "🚀 Entrega instantánea garantizada",
  "🔒 Compra segura y confiable"
];

export function StoreCarousel() {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % messages.length);
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-gradient-to-r from-primary/10 to-primary/5 backdrop-blur-sm">
      <div className="container mx-auto h-10 flex items-center justify-center overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.p
            key={currentIndex}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="text-sm font-medium text-primary/80"
          >
            {messages[currentIndex]}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}
