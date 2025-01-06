import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';

// Definir los bots disponibles
const bots = [
  { id: 'bot1', url: 'http://localhost:3001' },
  { id: 'bot2', url: 'http://localhost:3003' }
];

// Definir la función tryNextBot
const tryNextBot = async (botIndex: number, pendingGift: any) => {
  if (botIndex >= bots.length) {
    toast.error('No hay bots disponibles para enviar el regalo');
    return false;
  }

  const currentBot = bots[botIndex];
  
  try {
    // Intentar enviar el regalo con el bot actual
    const giftResponse = await axios.post(`${currentBot.url}/api/send-gift`, {
      username: pendingGift.username,
      offerId: pendingGift.epicOfferId,
      price: pendingGift.itemInfo.price,
      isBundle: pendingGift.itemInfo.isBundle || false,
      bundleData: pendingGift.itemInfo.bundleData
    });

    if (giftResponse.data.success) {
      return true;
    }
  } catch (error: any) {
    console.error(`Error con ${currentBot.id}:`, error);
    
    // Si es error de balance o amistad, intentar con el siguiente bot
    if (error.response?.data?.error === 'insufficient_vbucks' ||
        error.response?.data?.error === 'not_friend') {
      return tryNextBot(botIndex + 1, pendingGift);
    }

    // Para otros errores, mostrar el mensaje
    throw new Error(error.response?.data?.message || 'Error al enviar el regalo');
  }

  // Si llegamos aquí sin éxito, intentar con el siguiente bot
  return tryNextBot(botIndex + 1, pendingGift);
};

export function Success() {
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(true);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        // Recuperar la información guardada
        const pendingItemStr = localStorage.getItem('pendingItem');
        if (!pendingItemStr) {
          throw new Error('No hay información del regalo pendiente');
        }

        const pendingGift = JSON.parse(pendingItemStr);
        
        // Verificar que el pago está marcado como completado
        if (pendingGift.status === 'PAID') {
          // Intentar enviar el regalo
          const result = await tryNextBot(0, pendingGift);
          
          if (result) {
            toast.success('¡Regalo enviado con éxito!');
            localStorage.removeItem('pendingItem');
          } else {
            throw new Error('No se pudo enviar el regalo');
          }
        } else {
          throw new Error(`Pago no completado. Estado: ${pendingGift.status}`);
        }
      } catch (error: any) {
        console.error('Error al procesar el regalo:', error);
        toast.error(error.message || 'Error al procesar el regalo');
        navigate('/store');
      } finally {
        setProcessing(false);
      }
    };

    verifyPayment();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#0B0D12] flex items-center justify-center">
      <div className="bg-[#1A1D1F] p-8 rounded-2xl max-w-md w-full">
        <h1 className="text-2xl font-bold text-white mb-4">
          {processing ? 'Procesando tu regalo...' : '¡Pago completado!'}
        </h1>
        <p className="text-gray-400">
          {processing 
            ? 'Por favor, espera mientras procesamos tu regalo...'
            : 'Tu regalo ha sido enviado con éxito. ¡Disfrútalo!'}
        </p>
      </div>
    </div>
  );
} 