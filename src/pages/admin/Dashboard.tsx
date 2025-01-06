import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { apiConfig } from '../../config/api';
import toast from 'react-hot-toast';
import axios from 'axios';

interface ShopItem {
  offerId: string;
  title: string;
  price: number;
  rarity: string;
  images: {
    featured: string;
  };
}

interface GiftData {
  receiverId: string;
  offerId: string;
}

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [shopItems, setShopItems] = useState<ShopItem[]>([]);
  const [loadingShop, setLoadingShop] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ShopItem | null>(null);
  const [giftData, setGiftData] = useState<GiftData>({
    receiverId: '',
    offerId: '',
  });
  const [giftLoading, setGiftLoading] = useState(false);

  useEffect(() => {
    fetchShopCatalog();
  }, []);

  const handleGiftSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!giftData.receiverId || !giftData.offerId) {
      toast.error('Por favor ingresa el username del receptor y selecciona un item');
      return;
    }

    setGiftLoading(true);

    try {
      const response = await axios.post('/api/send-gift', {
        username: giftData.receiverId,
        offerId: giftData.offerId
      });
      
      if (response.data.success) {
        toast.success('Regalo enviado exitosamente');
        setGiftData({ receiverId: '', offerId: '' });
        setSelectedItem(null);
      } else {
        throw new Error(response.data.message);
      }
    } catch (error: any) {
      console.error('Error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Error al enviar el regalo';
      toast.error(errorMessage);
    } finally {
      setGiftLoading(false);
    }
  };

  const fetchShopCatalog = async () => {
    setLoadingShop(true);
    try {
      const response = await axios.get('/api/raw-catalog');
      if (response.data.success) {
        const allItems = response.data.items.map((item: any) => ({
          offerId: item.offerId,
          title: item.name,
          price: item.price,
          rarity: item.section,
          images: {
            featured: '/vbucks.png'
          }
        }));
        setShopItems(allItems);
      }
    } catch (error: any) {
      console.error('Error cargando el catálogo:', error);
      toast.error('Error al cargar el catálogo');
    } finally {
      setLoadingShop(false);
    }
  };

  const handleItemSelect = (offerId: string) => {
    setGiftData(prev => ({ ...prev, offerId }));
    const item = shopItems.find(item => item.offerId === offerId);
    if (item) {
      setSelectedItem(item);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('ID copiado al portapapeles');
  };

  return (
    <div className="min-h-screen bg-[#1A1D1F] text-white relative">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 to-transparent pointer-events-none"></div>
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Panel de Administración</h1>
          
          {/* Formulario de Regalo */}
          <div className="bg-[#1E2028] p-6 rounded-lg shadow-lg mb-8">
            <div className="flex flex-col md:flex-row gap-4 items-end mb-6">
              <div className="flex-1">
                <label className="block text-gray-400 mb-2">
                  Username del Receptor
                </label>
                <input
                  type="text"
                  value={giftData.receiverId}
                  onChange={(e) => setGiftData(prev => ({ ...prev, receiverId: e.target.value }))}
                  className="w-full bg-[#1A1D1F] text-white px-4 py-2 rounded-lg outline-none border border-gray-700"
                  placeholder="Ingresa el username del receptor"
                />
              </div>
              <div className="w-full md:w-auto">
                <button
                  onClick={handleGiftSubmit}
                  disabled={giftLoading || !giftData.receiverId || !giftData.offerId}
                  className={`w-full md:w-auto px-6 py-2 rounded-lg bg-blue-500 text-white font-medium transition-all duration-200 ${
                    giftLoading || !giftData.receiverId || !giftData.offerId
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:bg-blue-400'
                  }`}
                >
                  {giftLoading ? 'Enviando...' : 'Enviar Regalo'}
                </button>
              </div>
            </div>

            {/* Lista de Items */}
            <div className="mt-4">
              <h2 className="text-xl font-semibold mb-4">Items Disponibles</h2>
              {loadingShop ? (
                <div className="flex justify-center py-4">
                  <LoadingSpinner />
                </div>
              ) : (
                <div className="space-y-2 max-h-[500px] overflow-y-auto">
                  {shopItems.map((item) => (
                    <div
                      key={item.offerId}
                      className={`bg-[#1A1D1F] p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                        selectedItem?.offerId === item.offerId
                          ? 'border-2 border-blue-500'
                          : 'border border-gray-700'
                      }`}
                      onClick={() => handleItemSelect(item.offerId)}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-medium">{item.title}</h3>
                          <p className="text-sm text-gray-400">{item.rarity}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <img src="/vbucks.png" alt="V-Bucks" className="w-4 h-4" />
                            <span className="text-sm">{item.price}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-gray-500 max-w-[200px] truncate" title={item.offerId}>
                            {item.offerId}
                          </span>
                          <button
                            type="button"
                            className="text-sm text-blue-400 hover:text-blue-300 whitespace-nowrap"
                            onClick={(e) => {
                              e.stopPropagation();
                              copyToClipboard(item.offerId);
                            }}
                          >
                            Copiar ID
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
