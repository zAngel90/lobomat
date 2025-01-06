import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useApi } from '../hooks/useApi';
import { apiService } from '../services/api';

interface FeaturedBundlesProps {
  searchQuery?: string;
  selectedCategory: string;
  priceRange: {
    min: number;
    max: number;
  };
}

export function FeaturedBundles({ 
  searchQuery = '', 
  selectedCategory = 'all',
  priceRange
}: FeaturedBundlesProps) {
  const { data: shopData, loading } = useApi(() => apiService.getShop());
  const [selectedItem, setSelectedItem] = useState(null);

  if (loading) return null;

  // Si no hay datos de la tienda, retornamos null
  if (!shopData?.shop) {
    return null;
  }

  // Función para generar una key única
  const generateUniqueKey = (item: any, index: number) => {
    return `${item.mainId}-${item.section?.name}-${index}`;
  };

  // Función para filtrar items basado en todos los criterios
  const filterItems = (items: any[]) => {
    if (!Array.isArray(items)) return [];
    
    return items.filter(item => {
      // Filtro por búsqueda
      const matchesSearch = !searchQuery || 
        item.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.displayDescription?.toLowerCase().includes(searchQuery.toLowerCase());

      // Filtro por categoría
      const matchesCategory = 
        selectedCategory === 'all' || 
        item.mainType === selectedCategory;

      // Filtro por precio
      const itemPrice = item.price?.finalPrice || 0;
      const matchesPrice = itemPrice >= priceRange.min && itemPrice <= priceRange.max;

      return matchesSearch && matchesCategory && matchesPrice;
    });
  };

  // Inicializamos las secciones
  const sectionsData = shopData.shop.reduce((acc: any, item: any, index: number) => {
    if (!acc.normalSections) {
      acc.normalSections = {};
    }
    if (!acc.tracks) {
      acc.tracks = [];
    }

    if (item.section?.name) {
      const sectionName = item.section.name;
      const uniqueItem = {
        ...item,
        uniqueKey: generateUniqueKey(item, index)
      };

      if (item.type?.name === 'Pista de improvisación' || item.mainType === 'sparks_song') {
        acc.tracks.push(uniqueItem);
      } else {
        if (!acc.normalSections[sectionName]) {
          acc.normalSections[sectionName] = [];
        }
        acc.normalSections[sectionName].push(uniqueItem);
      }
    }
    return acc;
  }, { normalSections: {}, tracks: [] });

  const { tracks, normalSections } = sectionsData;

  // Filtramos las secciones basadas en la búsqueda
  const filteredSections = Object.entries(normalSections).reduce((acc: any, [key, items]: [string, any]) => {
    const filtered = filterItems(items);
    if (filtered.length > 0) {
      acc[key] = filtered;
    }
    return acc;
  }, {});

  const filteredTracks = tracks ? filterItems(tracks) : [];

  // Si no hay resultados, mostramos un mensaje
  const noResults = Object.keys(filteredSections).length === 0 && filteredTracks.length === 0;

  if (noResults && searchQuery) {
    return (
      <div className="text-center py-12">
        <p className="text-[#8A8F98] text-lg">
          No se encontraron resultados para "{searchQuery}"
        </p>
      </div>
    );
  }

  const handleAddToCart = (item, event) => {
    event?.stopPropagation();
    console.log('Agregado al carrito:', item);
  };

  const handleViewDetails = (item) => {
    setSelectedItem(item);
  };

  return (
    <div className="space-y-12">
      {/* Renderizado de secciones normales */}
      {Object.entries(filteredSections).map(([sectionName, items]: [string, any]) => (
        <div key={sectionName} className="space-y-4">
          <h2 className="text-2xl font-bold text-white">{sectionName}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {items.map((item: any) => (
              <motion.div
                key={item.uniqueKey}
                className="bg-[#1E2028] rounded-lg overflow-hidden cursor-pointer group"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
                onClick={() => handleViewDetails(item)}
              >
                <div className="relative">
                  <img 
                    src={item.displayAssets?.[0]?.full_background || item.granted?.[0]?.images?.full_background} 
                    alt={item.displayName} 
                    className="w-full aspect-square object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <button 
                        onClick={(e) => handleAddToCart(item, e)}
                        className="w-full bg-[#00A3FF] hover:bg-[#0088FF] text-white py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        Agregar al carrito
                      </button>
                    </div>
                  </div>
                  {item.banner && (
                    <div className="absolute top-2 right-2">
                      <span className="text-xs text-white bg-[#00A3FF] px-2 py-1 rounded-full font-medium">
                        {item.banner.name}
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-3">
                  <h3 className="text-white font-medium text-sm truncate">{item.displayName}</h3>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[#00A3FF] font-bold text-sm">
                      {item.price.finalPrice} V-Bucks
                    </span>
                    {item.price.finalPrice < item.price.regularPrice && (
                      <span className="text-[#8A8F98] text-xs line-through">
                        {item.price.regularPrice}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ))}

      {/* Renderizado de pistas de improvisación */}
      {filteredTracks.length > 0 && (
        <div key="tracks-section" className="space-y-4">
          <h2 className="text-2xl font-bold text-white">Pistas de Música</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredTracks.map((track: any) => (
              <motion.div
                key={track.uniqueKey}
                className="bg-[#1E2028] rounded-lg overflow-hidden cursor-pointer group"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
                onClick={() => handleViewDetails(track)}
              >
                <div className="relative">
                  <img 
                    src={track.displayAssets?.[0]?.full_background || track.granted?.[0]?.images?.full_background} 
                    alt={track.displayName} 
                    className="w-full aspect-square object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <button 
                        onClick={(e) => handleAddToCart(track, e)}
                        className="w-full bg-[#00A3FF] hover:bg-[#0088FF] text-white py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        Agregar al carrito
                      </button>
                    </div>
                  </div>
                  {track.banner && (
                    <div className="absolute top-2 right-2">
                      <span className="text-xs text-white bg-[#00A3FF] px-2 py-1 rounded-full font-medium">
                        {track.banner.name}
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-3">
                  <h3 className="text-white font-medium text-sm truncate">{track.displayName}</h3>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[#00A3FF] font-bold text-sm">
                      {track.price.finalPrice} V-Bucks
                    </span>
                    {track.price.finalPrice < track.price.regularPrice && (
                      <span className="text-[#8A8F98] text-xs line-through">
                        {track.price.regularPrice}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {selectedItem && (
        <div 
          className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedItem(null)}
        >
          <motion.div 
            className="bg-[#1E2028] rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={e => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-white">{selectedItem.displayName}</h2>
                  {selectedItem.rarity && (
                    <span className="text-sm text-[#8A8F98]">{selectedItem.rarity.name}</span>
                  )}
                </div>
                <button 
                  onClick={() => setSelectedItem(null)}
                  className="text-[#8A8F98] hover:text-white text-2xl"
                >
                  ✕
                </button>
              </div>
              
              <div className="relative rounded-lg overflow-hidden mb-4">
                <img 
                  src={selectedItem.displayAssets?.[0]?.full_background} 
                  alt={selectedItem.displayName}
                  className="w-full"
                />
              </div>
              
              <p className="text-[#8A8F98] mb-6">{selectedItem.displayDescription}</p>
              
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[#00A3FF] font-bold text-2xl">
                    {selectedItem.price.finalPrice} V-Bucks
                  </span>
                  {selectedItem.price.finalPrice < selectedItem.price.regularPrice && (
                    <div className="flex items-center gap-2">
                      <span className="text-[#8A8F98] line-through">
                        {selectedItem.price.regularPrice}
                      </span>
                      <span className="text-green-500">
                        {Math.round((1 - selectedItem.price.finalPrice/selectedItem.price.regularPrice) * 100)}% OFF
                      </span>
                    </div>
                  )}
                </div>
                
                <button 
                  onClick={(e) => handleAddToCart(selectedItem, e)}
                  className="bg-[#00A3FF] hover:bg-[#0088FF] text-white px-8 py-3 rounded-lg font-medium transition-colors"
                >
                  Agregar al carrito
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}