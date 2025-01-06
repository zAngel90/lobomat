import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import axios from 'axios';

export function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const item = location.state?.item;
  const [payerInfo, setPayerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    document_type: 'CC',
    document: '',
    state: '',
    city: '',
    zip_code: '',
    address: ''
  });

  const documentTypes = [
    { value: 'CC', label: 'Cédula de Ciudadanía' },
    { value: 'CE', label: 'Cédula de Extranjería' },
    { value: 'NIT', label: 'NIT' },
    { value: 'PP', label: 'Pasaporte' },
    { value: 'TI', label: 'Tarjeta de Identidad' }
  ];

  if (!item) {
    navigate('/store');
    return null;
  }

  const handlePayment = async () => {
    try {
      setLoading(true);

      // Validar campos requeridos
      if (!payerInfo.name || !payerInfo.email || !payerInfo.document) {
        toast.error('Por favor completa todos los campos requeridos');
        return;
      }

      // Crear orden de pago con dLocal
      const orderId = `ORDER-${Date.now()}`;
      const amount = item.price.finalPrice * 0.01; // Convertir V-Bucks a USD

      const paymentData = {
        amount,
        currency: 'USD',
        country: 'CO',
        order_id: orderId,
        description: `Compra de ${item.displayName}`,
        success_url: `${window.location.origin}/checkout`,
        back_url: `${window.location.origin}/store`,
        payer: {
          name: payerInfo.name,
          email: payerInfo.email,
          document: payerInfo.document,
          document_type: payerInfo.document_type,
          address: {
            state: payerInfo.state || 'NA',
            city: payerInfo.city || 'NA',
            zip_code: payerInfo.zip_code || '00000',
            street: payerInfo.address || 'NA'
          }
        }
      };

      // Enviar solicitud a través del proxy del bot
      const response = await axios.post(
        `${import.meta.env.VITE_BOT2_API_URL}/dlocal-proxy`,
        paymentData
      );

      if (response.data && response.data.id) {
        // Guardar información del pago
        localStorage.setItem('pendingItem', JSON.stringify({
          item,
          paymentId: response.data.id,
          orderId,
          amount,
          status: response.data.status,
          created_date: new Date().toISOString(),
          epicOfferId: item.offerId,
          itemInfo: {
            price: item.price.finalPrice,
            displayName: item.displayName,
            displayAssets: item.displayAssets
          }
        }));

        // Redirigir según el estado del pago
        if (response.data.status === 'PAID') {
          navigate('/checkout', { 
            state: { 
              item,
              paymentVerified: true
            } 
          });
        } else {
          // Redirigir a la URL de pago de dLocal si es necesario
          if (response.data.redirect_url) {
            window.location.href = response.data.redirect_url;
          } else {
            toast.error('Error al procesar el pago');
          }
        }
      } else {
        throw new Error('Respuesta inválida del servidor de pagos');
      }
    } catch (error: any) {
      console.error('Error:', error);
      toast.error(error.response?.data?.message || 'Error al procesar el pago');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0D12] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#1A1D1F] rounded-2xl p-8"
        >
          <h1 className="text-3xl font-bold text-white mb-8">Procesar Pago</h1>
          
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
                <p className="text-lg text-gray-400">
                  {item.price.finalPrice} V-Bucks (${(item.price.finalPrice * 0.01).toFixed(2)} USD)
                </p>
              </div>
            </div>

            {/* Payment Info */}
            <div className="space-y-6">
              <div className="bg-[#2A2D2F] p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-white mb-4">Información de Pago</h3>
                
                {/* Formulario de información del pagador */}
                <form className="space-y-4">
                  <input
                    type="text"
                    placeholder="Nombre completo"
                    value={payerInfo.name}
                    onChange={e => setPayerInfo({...payerInfo, name: e.target.value})}
                    className="w-full px-4 py-2 bg-[#1A1D1F] rounded text-white"
                    required
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={payerInfo.email}
                    onChange={e => setPayerInfo({...payerInfo, email: e.target.value})}
                    className="w-full px-4 py-2 bg-[#1A1D1F] rounded text-white"
                    required
                  />
                  <select
                    value={payerInfo.document_type}
                    onChange={e => setPayerInfo({...payerInfo, document_type: e.target.value})}
                    className="w-full px-4 py-2 bg-[#1A1D1F] rounded text-white"
                    required
                  >
                    {documentTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    placeholder="Número de documento"
                    value={payerInfo.document}
                    onChange={e => setPayerInfo({...payerInfo, document: e.target.value})}
                    className="w-full px-4 py-2 bg-[#1A1D1F] rounded text-white"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Ciudad"
                    value={payerInfo.city}
                    onChange={e => setPayerInfo({...payerInfo, city: e.target.value})}
                    className="w-full px-4 py-2 bg-[#1A1D1F] rounded text-white"
                  />
                  <input
                    type="text"
                    placeholder="Dirección"
                    value={payerInfo.address}
                    onChange={e => setPayerInfo({...payerInfo, address: e.target.value})}
                    className="w-full px-4 py-2 bg-[#1A1D1F] rounded text-white"
                  />
                </form>
              </div>

              <button
                onClick={handlePayment}
                disabled={loading}
                className={`w-full px-6 py-3 rounded-lg font-semibold text-white transition
                  ${loading 
                    ? 'bg-gray-600 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700'}`}
              >
                {loading ? 'Procesando...' : 'Proceder al Pago'}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 