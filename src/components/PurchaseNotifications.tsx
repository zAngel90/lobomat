import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icons } from '../icons';

// Datos para generar notificaciones aleatorias
const items = [
  { type: 'vbucks', amounts: [500, 1000, 2000, 5000, 13500] },
  { type: 'skin', items: ['Skin Legendaria', 'Skin Épica', 'Skin Rara', 'Bundle Exclusivo', 'Pack Especial'] },
  { type: 'emote', items: ['Emote Raro', 'Baile Épico', 'Gesto Legendario', 'Pack de Emotes', 'Emote Exclusivo'] }
];

// Función para generar un ID de usuario aleatorio
const generateUserId = () => {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 3; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result + '***';
};

// Función para generar una notificación aleatoria
const generateRandomNotification = () => {
  const itemType = items[Math.floor(Math.random() * items.length)];
  const userId = generateUserId();

  if (itemType.type === 'vbucks') {
    const amount = itemType.amounts[Math.floor(Math.random() * itemType.amounts.length)];
    return {
      id: Date.now(),
      userId,
      message: `ha comprado ${amount} V-Bucks`,
      type: 'vbucks',
      amount
    };
  } else {
    const item = itemType.items[Math.floor(Math.random() * itemType.items.length)];
    return {
      id: Date.now(),
      userId,
      message: `ha comprado ${item}`,
      type: itemType.type,
      item
    };
  }
};

export function PurchaseNotifications() {
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    // Generar una notificación cada 3-7 segundos
    const interval = setInterval(() => {
      const notification = generateRandomNotification();
      setNotifications(prev => [...prev, notification]);

      // Eliminar la notificación después de 5 segundos
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== notification.id));
      }, 5000);
    }, Math.random() * 4000 + 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: -100, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -100, scale: 0.8 }}
            className="mb-2 bg-secondary-dark/90 backdrop-blur-lg border border-primary/20 rounded-lg p-4 shadow-lg shadow-primary/5 flex items-center gap-3 text-sm"
          >
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              {notification.type === 'vbucks' ? (
                <Icons.Money className="w-4 h-4" />
              ) : notification.type === 'skin' ? (
                <Icons.User className="w-4 h-4" />
              ) : (
                <Icons.Dance className="w-4 h-4" />
              )}
            </div>
            <div>
              <span className="font-semibold text-primary">{notification.userId}</span>
              <span className="text-white/80"> {notification.message}</span>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
