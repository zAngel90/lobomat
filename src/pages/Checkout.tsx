import React, { useState, useEffect, ReactElement } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import axios from 'axios';
import { apiConfig } from '../config/api';

interface ItemInfo {
  mainId: string;
  offerId?: string;
  displayName: string;
  displayAssets?: Array<{ url: string }>;
  price?: {
    finalPrice: number;
    regularPrice: number;
  };
}

interface CheckoutItemInfo {
  price: number;
  isBundle: boolean;
  originalOfferId: string | null;
  finalOfferId: string;
  displayName: string;
  displayAssets?: Array<{ url: string }>;
}

interface Bot {
  id: string;
  name: string;
  url: string;
}

// Función para extraer precio del devName
const extractPriceFromDevName = (devName: string) => {
  if (!devName) return null;
  
  const match = devName.match(/for (\d+) (\w+)/);
  if (match) {
    return {
      basePrice: parseInt(match[1]),
      currencyType: match[2]
    };
  }
  return null;
};

export function CheckoutPage(): ReactElement {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const item = location.state?.item;

  useEffect(() => {
    // Verificar si viene de un pago exitoso
    const pendingItemStr = localStorage.getItem('pendingItem');
    const paymentVerified = location.state?.paymentVerified;

    if (!pendingItemStr || !paymentVerified) {
      navigate('/store');
      return;
    }

    const pendingItem = JSON.parse(pendingItemStr);
    if (pendingItem.status !== 'PAID') {
      toast.error('El pago no ha sido completado');
      navigate('/store');
    }
  }, [navigate, location]);

  const tryNextBot = async (botIndex: number) => {
    const bots = [
      { id: 'bot1', name: 'Bot 1', url: 'http://localhost:3001' },
      { id: 'bot2', name: 'Bot 2', url: 'http://localhost:3003' }
    ];

    if (botIndex >= bots.length) {
      toast.error('No hay bots disponibles para enviar el regalo');
      setLoading(false);
      return;
    }

    const currentBot = bots[botIndex];
    console.log(`Intentando con ${currentBot.name}...`);

    try {
      // Verificar amistad primero
      const friendshipResponse = await axios.get(`${currentBot.url}/api/check-friendship/${username}`);
      
      if (!friendshipResponse.data.success) {
        toast.error(`Debes agregar a ${currentBot.name} como amigo para recibir regalos`);
        setLoading(false);
        return;
      }

      if (!friendshipResponse.data.hasMinTime) {
        const hoursLeft = 48 - (friendshipResponse.data.friendshipHours || 0);
        toast.error(`Debes esperar ${Math.ceil(hoursLeft)} horas más antes de poder recibir regalos de ${currentBot.name}`);
        setLoading(false);
        return;
      }

      // Intentar enviar el regalo
      const giftResponse = await axios.post(`${currentBot.url}/api/send-gift`, {
        username,
        offerId: item.offerId,
        price: item.price.finalPrice,
        isBundle: false
      });

      if (giftResponse.data.success) {
        toast.success('¡Regalo enviado con éxito!');
        localStorage.removeItem('pendingItem');
        setLoading(false);
        navigate('/store');
        return;
      }

    } catch (giftError: any) {
      console.error('Error al intentar con bot:', currentBot.name, giftError);
      
      // Si es un error de balance o amistad, intentar con el siguiente bot
      if (giftError.response?.data?.error === 'insufficient_vbucks' ||
          giftError.response?.data?.error === 'not_friend') {
        return tryNextBot(botIndex + 1);
      }

      // Para otros errores, mostrar el mensaje
      toast.error(giftError.response?.data?.message || 'Error al enviar el regalo');
      setLoading(false);
      return;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!item?.offerId) {
      toast.error('Item no disponible para regalo');
      return;
    }
    if (!username.trim()) {
      toast.error('Por favor ingresa tu username');
      return;
    }

    setLoading(true);
    tryNextBot(0);
  };

  if (!item) {
    return (
      <div className="min-h-screen bg-[#0B0D12] flex items-center justify-center">
        <div className="text-white">
          No hay item seleccionado para regalo
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0D12] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#1A1D1F] rounded-2xl overflow-hidden shadow-xl"
        >
          <div className="p-8">
            <h1 className="text-3xl font-bold text-white mb-8">Confirmar Regalo</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Item Preview */}
              <div className="space-y-6">
                <div className="aspect-square relative rounded-xl overflow-hidden bg-[#2A2D2F]">
                  <img
                    src={item.displayAssets?.[0]?.url}
                    alt={item.displayName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold text-white">{item.displayName}</h2>
                  {item.price?.finalPrice && (
                    <p className="text-lg text-gray-400">
                      {item.price.finalPrice} V-Bucks
                    </p>
                  )}
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-400">
                    Username de Epic Games
                  </label>
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={loading}
                    className="mt-1 block w-full px-4 py-3 bg-[#2A2D2F] border border-[#3A3D3F] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                    placeholder="Ingresa tu username"
                  />
                </div>

                <div className="space-y-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full px-6 py-3 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 transition disabled:opacity-50"
                  >
                    {loading ? 'Enviando regalo...' : 'Enviar Regalo'}
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => navigate('/store')}
                    disabled={loading}
                    className="w-full px-6 py-3 rounded-lg font-semibold text-white bg-[#2A2D2F] hover:bg-[#3A3D3F] transition disabled:opacity-50"
                  >
                    Volver a la Tienda
                  </button>
                </div>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
