import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useApi } from '../hooks/useApi';
import { apiService } from '../services/api';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Flame, ShoppingBag } from 'lucide-react';
import { StoreCarousel } from '../components/StoreCarousel';

interface ShopItem {
  mainId: string;
  mainType?: string;
  displayType?: string;
  displayName: string;
  displayAssets?: Array<{ url: string }>;
  granted?: Array<{
    type?: {
      name?: string;
      id?: string;
    };
    images?: {
      icon?: string;
      background?: string;
    };
    mainId?: string;
  }>;
  price?: {
    finalPrice: number;
  };
  rarity?: {
    name: string;
  };
  offerId?: string;
  section?: {
    id: string;
    name: string;
    category?: string;
  };
  bundle?: {
    name: string;
    info: string;
    image: string;
  };
  storeName?: string;
  displayDescription?: string;
}

export function StorePage() {
  const { data: shopData, loading } = useApi(() => apiService.getShop());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGame, setSelectedGame] = useState('fortnite');
  const [activeCategory, setActiveCategory] = useState('all');
  const navigate = useNavigate();

  // Función para verificar si es un bundle genuino
  const isBundle = (item: ShopItem) => {
    const hasMultipleItems = item.granted && item.granted.length > 1;
    const bundleKeywords = ['bundle', 'pack', 'set', 'paquete', 'conjunto'];
    const nameHasBundleKeyword = bundleKeywords.some(keyword => 
      item.displayName?.toLowerCase().includes(keyword)
    );
    const sectionIsBundle = item.section?.name?.toLowerCase().includes('bundle') ||
                           item.section?.category?.toLowerCase().includes('bundle');
    
    return hasMultipleItems && (nameHasBundleKeyword || sectionIsBundle);
  };

  const organizedItems = React.useMemo(() => {
    if (!shopData?.shop) return { sections: [], tracks: [] };

    const items = shopData.shop.filter((item: ShopItem) => {
      const hasValidImage = item.displayAssets?.[0]?.url || item.granted?.[0]?.images?.icon;
      const hasValidPrice = item.price?.finalPrice !== undefined;
      return hasValidImage && hasValidPrice;
    });

    // Separar items en bundles, tracks y otros
    const bundleItems: ShopItem[] = [];
    const trackItems: ShopItem[] = [];
    const regularItems: ShopItem[] = [];

    items.forEach((item: ShopItem) => {
      if (isBundle(item)) {
        bundleItems.push(item);
      } else if ((() => {
        const typeNames = [
          item.granted?.[0]?.type?.name?.toLowerCase(),
          item.mainType?.toLowerCase(),
          item.displayType?.toLowerCase(),
          item.section?.name?.toLowerCase() || ''
        ];
        
        return typeNames.some(type => 
          type?.includes('music') || 
          type?.includes('track') || 
          type?.includes('pista') ||
          type === 'sparks_song' ||
          type === 'jam tracks'
        );
      })()) {
        trackItems.push(item);
      } else {
        regularItems.push(item);
      }
    });

    // Crear secciones en orden: bundles, regulares, tracks
    const sections = new Map();

    // Agregar bundles primero si hay alguno
    if (bundleItems.length > 0) {
      sections.set('Bundles', {
        name: 'Bundles',
        category: 'Bundles',
        items: bundleItems
      });
    }

    // Agregar items regulares
    regularItems.forEach(item => {
      const sectionName = item.section?.name || 'Individual Items';
      if (!sections.has(sectionName)) {
        sections.set(sectionName, {
          name: sectionName,
          category: item.section?.category,
          items: []
        });
      }
      sections.get(sectionName).items.push(item);
    });

    // Agregar tracks al final
    if (trackItems.length > 0) {
      sections.set('Jam Tracks', {
        name: 'Jam Tracks',
        category: 'Music',
        items: trackItems
      });
    }

    return {
      sections: Array.from(sections.values()),
      tracks: []
    };
  }, [shopData]);

  const filteredItems = React.useMemo(() => {
    const searchLower = searchQuery.toLowerCase();
    
    const filterBySearch = (items: ShopItem[]) => {
      return items.filter(item => {
        const matchesSearch = item.displayName.toLowerCase().includes(searchLower);
        
        const itemType = (() => {
          // Verificar si es un bundle (paquete)
          if (isBundle(item)) {
            return 'bundle';
          }

          // Verificar si es música o jam track
          const isMusic = (
            item.displayType?.toLowerCase() === 'music' || 
            item.mainType?.toLowerCase() === 'sparks_song' || 
            item.granted?.[0]?.type?.id?.toLowerCase() === 'sparks_song' ||
            (item.section?.name?.toLowerCase() || '').includes('jam tracks') ||
            (item.section?.name?.toLowerCase() || '').includes('music pack')
          );

          if (isMusic) {
            return 'music';
          }

          // Verificar si es una skin (outfit)
          const isSkin = (
            item.granted?.[0]?.type?.id?.toLowerCase() === 'outfit' || 
            item.granted?.[0]?.type?.name?.toLowerCase() === 'outfit' || 
            item.mainType?.toLowerCase() === 'outfit' || 
            item.displayType?.toLowerCase() === 'outfit'
          );

          if (isSkin) {
            return 'skin';
          }

          // Verificar si es una mochila (backpack/backbling)
          const isBackbling = (
            item.granted?.[0]?.type?.id?.toLowerCase() === 'backpack' || 
            item.granted?.[0]?.type?.id?.toLowerCase() === 'backbling' || 
            item.granted?.[0]?.type?.name?.toLowerCase() === 'backpack' || 
            item.granted?.[0]?.type?.name?.toLowerCase() === 'backbling' ||
            item.displayType?.toLowerCase() === 'backbling'
          );

          if (isBackbling) {
            return 'mochila';
          }

          // Verificar si es un emote/gesto/baile
          const emoteKeywords = ['emote', 'dance', 'gesture', 'baile', 'gesto'];
          const isEmote = (
            item.granted?.[0]?.type?.id?.toLowerCase() === 'emote' || 
            item.granted?.[0]?.type?.name?.toLowerCase() === 'emote' || 
            item.displayType?.toLowerCase() === 'emote' || 
            item.mainType?.toLowerCase() === 'emote' ||
            emoteKeywords.some(keyword => 
              item.displayName?.toLowerCase().includes(keyword) || 
              item.displayType?.toLowerCase()?.includes(keyword) || 
              item.mainType?.toLowerCase()?.includes(keyword) ||
              (item.displayDescription?.toLowerCase() || '').includes(keyword)
            )
          );

          if (isEmote) {
            return 'emote';
          }

          return 'otro';
        })();

        // Si estamos en la categoría bundles, solo mostrar bundles
        if (activeCategory === 'bundles') {
          return matchesSearch && itemType === 'bundle';
        }

        const matchesCategory = 
          activeCategory === 'all' || 
          (activeCategory === 'skins' && itemType === 'skin') ||
          (activeCategory === 'mochilas' && itemType === 'mochila') ||
          (activeCategory === 'emotes' && itemType === 'emote');
        
        return matchesSearch && matchesCategory;
      });
    };

    // Si estamos en la categoría bundles, solo mostrar la sección de bundles
    if (activeCategory === 'bundles') {
      const bundleSection = organizedItems.sections.find(section => 
        section.name === 'Bundles' || 
        section.category === 'Bundles'
      );
      return {
        sections: bundleSection ? [bundleSection] : [],
        tracks: []
      };
    }

    return {
      sections: organizedItems.sections
        .map(section => ({
          ...section,
          items: filterBySearch(section.items)
        }))
        .filter(section => section.items.length > 0),
      tracks: []
    };
  }, [organizedItems, searchQuery, activeCategory]);

  const handleGiftClick = (item: ShopItem) => {
    navigate('/checkout', { state: { item } });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0D12] flex items-center justify-center">
        <div className="text-white">Cargando tienda...</div>
      </div>
    );
  }

  if (!shopData?.shop) {
    return (
      <div className="min-h-screen bg-[#0B0D12] flex items-center justify-center">
        <div className="text-white">No hay items disponibles en la tienda</div>
      </div>
    );
  }

  const categories = [
    { id: 'all', name: 'Todos' },
    { id: 'skins', name: 'Skins' },
    { id: 'mochilas', name: 'Mochilas' },
    { id: 'emotes', name: 'Emotes' },
    { id: 'bundles', name: 'Bundles' }
  ];

  const games = [
    { id: 'fortnite', name: 'Fortnite', icon: '/games/fortnite.png' }
  ];

  const renderShopItem = (item: ShopItem) => (
    <motion.div
      key={`${item.mainId}-${item.offerId}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ 
        scale: 1.03,
        transition: { duration: 0.2 }
      }}
      className="relative bg-[#1A1D1F] rounded-xl overflow-hidden group cursor-pointer transform transition-all duration-200 hover:shadow-xl"
    >
      <div className="aspect-square relative overflow-hidden">
        <img
          src={item.displayAssets?.[0]?.url || item.granted?.[0]?.images?.icon}
          alt={item.displayName}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-200"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <button
          onClick={() => navigate('/payment', { state: { item } })}
          className="absolute top-2 right-2 p-2 bg-white/10 rounded-lg backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-white/20"
        >
          <ShoppingBag className="w-5 h-5 text-white" />
        </button>
      </div>
      <div className="p-4">
        <h3 className="text-white font-medium truncate">{item.displayName}</h3>
        <div className="flex items-center justify-between mt-2">
          <span className="text-[#8A8F98] text-sm">{item.rarity?.name || 'Común'}</span>
          <span className="text-white font-medium">{item.price?.finalPrice || 0} V-Bucks</span>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-[#0B0D12]">
      <div className="pt-16">
        <StoreCarousel />
        {/* Compra segura y confiable */}
        <div className="flex justify-center items-center py-6 bg-[#0B0D12] border-b border-[#1A1D1F]">
          <div className="flex items-center gap-2 text-[#00A3FF]">
            <span className="text-lg">🔒</span>
            <span className="text-sm font-medium">Compra segura y confiable</span>
          </div>
        </div>
        
        {/* Contenido principal con espacio aumentado */}
        <div className="container mx-auto px-4 xl:px-8 2xl:px-16 pt-8">
          <div className="grid grid-cols-[240px_1fr] gap-8">
            {/* Sidebar */}
            <aside className="space-y-6">
              {/* Games Section */}
              <div className="bg-[#1A1D1F] rounded-xl p-4">
                <h3 className="text-white font-medium mb-4">Games</h3>
                <div className="space-y-2">
                  {games.map(game => (
                    <button
                      key={game.id}
                      onClick={() => setSelectedGame(game.id)}
                      className={`
                        relative w-full flex items-center gap-3 px-3 py-2 rounded-lg
                        transition-all duration-200 cursor-pointer
                        ${selectedGame === game.id 
                          ? 'bg-[#00A3FF] text-white shadow-lg shadow-[#00A3FF]/20' 
                          : 'text-[#8A8F98] hover:bg-[#1E2028]'
                        }
                      `}
                    >
                      <img src={game.icon} alt={game.name} className="w-6 h-6 rounded" />
                      <span>{game.name}</span>
                      {selectedGame === game.id && (
                        <motion.div
                          layoutId="selectedGameSidebar"
                          className="absolute inset-0 bg-[#00A3FF] rounded-lg -z-10"
                          initial={false}
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="bg-[#1A1D1F] rounded-xl p-4">
                <h3 className="text-white font-medium mb-4">Price Range</h3>
                <div className="px-3">
                  <div className="relative h-1 bg-[#2A2D30] rounded">
                    <div className="absolute left-0 right-0 h-full bg-[#00A3FF] rounded" />
                  </div>
                  <div className="flex justify-between mt-2 text-[#8A8F98]">
                    <span>$0.00</span>
                    <span>$480,750.5</span>
                  </div>
                </div>
              </div>

              {/* Rarities */}
              <div className="bg-[#1A1D1F] rounded-xl p-4">
                <h3 className="text-white font-medium mb-4">Rarities</h3>
                <div className="space-y-2">
                  {['Legendary', 'Mythical', 'Rare', 'Common'].map(rarity => (
                    <label key={rarity} className="flex items-center gap-2 text-[#8A8F98] cursor-pointer hover:text-white transition-colors">
                      <input type="checkbox" className="form-checkbox text-[#00A3FF]" />
                      <span>{rarity}</span>
                    </label>
                  ))}
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <main>
              {/* Categories */}
              <div className="flex flex-wrap gap-2 mb-8">
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`
                      relative px-4 py-2 rounded-lg font-medium
                      transition-all duration-200 cursor-pointer z-10
                      ${activeCategory === category.id 
                        ? 'bg-[#00A3FF] text-white shadow-lg shadow-[#00A3FF]/20' 
                        : 'bg-[#1A1D1F] text-gray-400 hover:bg-[#2A2D2F] hover:text-white'
                      }
                    `}
                  >
                    <span className="relative z-10">{category.name}</span>
                    {activeCategory === category.id && (
                      <motion.div
                        layoutId="activeCategory"
                        className="absolute inset-0 bg-[#00A3FF] rounded-lg -z-0"
                        initial={false}
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </button>
                ))}
              </div>

              {/* Search and Sort */}
              <div className="flex justify-between items-center mb-6">
                <div className="relative w-80">
                  <input
                    type="text"
                    placeholder="Buscar items..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-3 bg-[#1A1D1F] rounded-lg text-white placeholder-gray-400 
                             focus:outline-none focus:ring-2 focus:ring-[#00A3FF] transition-all duration-200"
                  />
                  <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>
                
                <div className="flex items-center gap-2 text-[#8A8F98]">
                  <span>Sort By:</span>
                  <select className="bg-[#1A1D1F] border border-[#2A2D30] rounded px-3 py-2">
                    <option>Popularity</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                  </select>
                </div>
              </div>

              {/* Grid de items */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredItems.sections.map(section => (
                  section.items.map(renderShopItem)
                ))}
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}