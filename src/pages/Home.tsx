import React, { useEffect, useRef } from 'react';
import { Icons } from '../icons';
import { TrustPilot } from '../components/TrustPilot';
import { Button } from '../components/ui/Button';
import { Link, useNavigate } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import { apiService } from '../services/api';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import { AnimatedButton } from '../components/ui/AnimatedButton';
import { AnimatedCard } from '../components/ui/AnimatedCard';
import { motion } from 'framer-motion';
import { Testimonials } from '../components/Testimonials';
import { PurchaseNotifications } from '../components/PurchaseNotifications';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ShopItem {
  mainId: string;
  mainType?: string;
  displayType?: string;
  displayName: string;
  displayAssets?: Array<{ url: string }>;
  granted?: Array<{
    type?: {
      name?: string;
    };
    images?: {
      icon?: string;
    };
  }>;
  price?: {
    finalPrice: number;
  };
  rarity?: {
    name: string;
  };
}

export function HomePage() {
  const navigate = useNavigate();
  const { data: shopData, loading } = useApi(() => apiService.getShop());

  const featuredOutfits = React.useMemo(() => {
    if (!shopData?.shop) return [];
    
    return shopData.shop
      .filter((item: ShopItem) => {
        const isOutfit = 
          item.mainType?.toLowerCase() === 'outfit' || 
          item.displayType?.toLowerCase() === 'traje' ||
          item.granted?.[0]?.type?.name?.toLowerCase() === 'traje';
        
        return isOutfit;
      })
      .slice(0, 8);
  }, [shopData]);

  const heroOutfit = React.useMemo(() => featuredOutfits[0], [featuredOutfits]);

  const handleNavigateToStore = React.useCallback(() => {
    navigate('/store');
  }, [navigate]);

  const handleNavigateToTutorial = React.useCallback(() => {
    navigate('/tutorial');
  }, [navigate]);

  if (loading) {
    return (
      <main className="relative min-h-screen w-full bg-[#0A0A0B] flex items-center justify-center">
        <div className="text-white">Cargando...</div>
      </main>
    );
  }

  if (!shopData?.shop) {
    return (
      <main className="relative min-h-screen w-full bg-[#0A0A0B] flex items-center justify-center">
        <div className="text-white">No se pudieron cargar los datos</div>
      </main>
    );
  }

  return (
    <motion.main className="relative w-full bg-[#0A0A0B] overflow-x-hidden">
      {/* Hero Section */}
      <div className="h-[calc(100vh-64px)] flex items-center">
        <div className="container mx-auto px-4 xl:px-8 2xl:px-16">
          <div className="flex flex-col lg:flex-row items-center gap-16 max-w-[1400px] mx-auto">
            <motion.div className="flex-1 space-y-6">
              <h1 className="hero-title text-5xl lg:text-6xl font-bold leading-tight">
                Buy Fortnite Items
                <br />
                <span className="bg-gradient-to-r from-[#00A3FF] to-[#00FFB3] text-transparent bg-clip-text">
                  Fast, Easy & Safe
                </span> with
                <br />
                Lobomat!
              </h1>

              <p className="hero-subtitle text-[#8A8F98] text-lg lg:text-xl mt-6 mb-10">
                Lobomat es la tienda más rápida y confiable para V-Bucks, 
                objetos del Battle Pass y cosméticos exclusivos. Con nuestro 
                sistema automatizado, obtienes tus artículos favoritos al instante.
              </p>

              <div className="hero-buttons flex gap-4 relative z-50">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-block relative z-50"
                >
                  <Button 
                    className="px-8 py-4 text-lg flex items-center gap-2 rounded-xl cursor-pointer hover:bg-[#00A3FF]/90 active:bg-[#00A3FF]/80 transition-colors relative z-50"
                    onClick={handleNavigateToStore}
                    type="button"
                    style={{ pointerEvents: 'auto' }}
                  >
                    <Icons.Store className="w-6 h-6" />
                    <span>Comprar Ahora</span>
                  </Button>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-block relative z-50"
                >
                  <Button 
                    variant="secondary"
                    className="px-8 py-4 text-lg rounded-xl cursor-pointer hover:bg-[#1E2028] active:bg-[#2A2D36] transition-colors relative z-50"
                    onClick={handleNavigateToTutorial}
                    type="button"
                    style={{ pointerEvents: 'auto' }}
                  >
                    <span>Ver Tutorial</span>
                  </Button>
                </motion.div>
              </div>

              <div className="hero-stats flex items-center gap-8 pt-8">
                <div className="flex flex-col">
                  <span className="text-3xl font-bold">50K+</span>
                  <span className="text-[#8A8F98]">Clientes Satisfechos</span>
                </div>
                <div className="w-px h-12 bg-white/10" />
                <div className="flex flex-col">
                  <span className="text-3xl font-bold">24/7</span>
                  <span className="text-[#8A8F98]">Soporte en Línea</span>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="flex-1 relative"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              {heroOutfit && (
                <div className="relative">
                  <motion.img 
                    src={heroOutfit.granted?.[0]?.images?.icon || heroOutfit.displayAssets?.[0]?.url}
                    alt={heroOutfit.displayName}
                    className="w-full h-[500px] object-contain mix-blend-screen"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5 }}
                  />
                  {/* Game Card 1 */}
                  <motion.div
                    className="absolute -left-15 top-20 w-40 h-56 bg-[#1A1D1F] rounded-lg overflow-hidden shadow-lg
                      border-2 border-yellow-400/50 hover:border-yellow-400 transition-colors duration-300
                      cursor-pointer z-[100]"
                    style={{ pointerEvents: 'auto' }}
                    animate={{
                      y: [0, -20, 0]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                    whileHover={{ 
                      scale: 1.05,
                      boxShadow: '0 0 20px rgba(250, 204, 21, 0.3)'
                    }}
                    onClick={() => {
                      if (featuredOutfits[1]) {
                        navigate(`/store?search=${encodeURIComponent(featuredOutfits[1].displayName)}`);
                      }
                    }}
                  >
                    <div className="relative z-[100] pointer-events-auto">
                      {featuredOutfits[1] && (
                        <>
                          <img 
                            src={featuredOutfits[1].granted?.[0]?.images?.icon || featuredOutfits[1].displayAssets?.[0]?.url}
                            alt={featuredOutfits[1].displayName}
                            className="w-full h-32 object-cover transform transition-transform duration-300 group-hover:scale-110"
                          />
                          <div className="p-3 relative z-50">
                            <h3 className="text-white text-sm font-bold truncate group-hover:text-yellow-400 transition-colors">
                              {featuredOutfits[1].displayName}
                            </h3>
                            <span className="text-yellow-400 text-sm font-bold">
                              {featuredOutfits[1].price?.finalPrice} V-Bucks
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  </motion.div>

                  {/* Game Card 2 */}
                  <motion.div
                    className="absolute -right-20 top-20 w-40 h-56 bg-[#1A1D1F] rounded-lg overflow-hidden shadow-lg
                      border-2 border-yellow-400/50 hover:border-yellow-400 transition-colors duration-300
                      cursor-pointer z-[100]"
                    style={{ pointerEvents: 'auto' }}
                    animate={{
                      y: [0, -20, 0]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear",
                      delay: 1
                    }}
                    whileHover={{ 
                      scale: 1.05,
                      boxShadow: '0 0 20px rgba(250, 204, 21, 0.3)'
                    }}
                    onClick={() => {
                      if (featuredOutfits[2]) {
                        navigate(`/store?search=${encodeURIComponent(featuredOutfits[2].displayName)}`);
                      }
                    }}
                  >
                    <div className="relative z-[100] pointer-events-auto">
                      {featuredOutfits[2] && (
                        <>
                          <img 
                            src={featuredOutfits[2].granted?.[0]?.images?.icon || featuredOutfits[2].displayAssets?.[0]?.url}
                            alt={featuredOutfits[2].displayName}
                            className="w-full h-32 object-cover transform transition-transform duration-300 group-hover:scale-110"
                          />
                          <div className="p-3 relative z-50">
                            <h3 className="text-white text-sm font-bold truncate group-hover:text-yellow-400 transition-colors">
                              {featuredOutfits[2].displayName}
                            </h3>
                            <span className="text-yellow-400 text-sm font-bold">
                              {featuredOutfits[2].price?.finalPrice} V-Bucks
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  </motion.div>

                  <motion.div 
                    className="absolute inset-0 -z-10 bg-gradient-to-r from-[#00A3FF]/20 to-[#00FFB3]/20 blur-[60px]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                  />
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="min-h-screen pt-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl lg:text-4xl font-bold text-center mb-4 text-white">
            Lo que dicen nuestros clientes
          </h2>
          <div className="text-center text-[#8A8F98] mb-12">
            Miles de jugadores confían en nosotros para sus compras de Fortnite. Aquí hay algunas de sus experiencias.
          </div>
          <div className="max-w-6xl mx-auto">
            <Testimonials />
          </div>
        </div>
      </div>

      {/* Featured Outfits Section */}
      <div className="min-h-screen py-20 relative">
        <div className="container mx-auto px-4 xl:px-8 2xl:px-16 max-w-6xl">
          <h2 className="text-3xl lg:text-4xl font-bold mb-10 bg-gradient-to-r from-[#00A3FF] to-[#00FFB3] text-transparent bg-clip-text">
            Outfits Destacados
          </h2>
          
          {featuredOutfits.length > 0 ? (
            <div className="relative z-10 overflow-hidden">
              <Swiper
                modules={[Autoplay]}
                spaceBetween={12}
                slidesPerView="auto"
                loop={true}
                speed={3000}
                allowTouchMove={false}
                autoplay={{
                  delay: 0,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true,
                }}
                breakpoints={{
                  320: { 
                    slidesPerView: 1.5,
                    spaceBetween: 8
                  },
                  640: { 
                    slidesPerView: 2.5,
                    spaceBetween: 10
                  },
                  768: { 
                    slidesPerView: 3.5,
                    spaceBetween: 10
                  },
                  1024: { 
                    slidesPerView: 5,
                    spaceBetween: 12
                  },
                }}
                className="mySwiper !overflow-visible"
                style={{
                  width: '100%'
                }}
              >
                {featuredOutfits.map((outfit: ShopItem, index: number) => (
                  <SwiperSlide 
                    key={`${outfit.mainId}-${index}`}
                    className="!w-[280px] !h-[350px]"
                  >
                    <AnimatedCard 
                      className="w-full h-full cursor-pointer group relative transition-all duration-300 hover:scale-105 hover:z-50 bg-[#1A1A1A] rounded-xl overflow-hidden"
                      onClick={() => {
                        navigate(`/shop/outfit/${outfit.mainId}`);
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20" />
                      
                      <motion.div 
                        className="absolute top-2 right-2 bg-black/80 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-50"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log('Añadir al carrito:', outfit.displayName);
                        }}
                      >
                        <Icons.ShoppingCart className="w-5 h-5 text-white" />
                      </motion.div>

                      <img 
                        src={outfit.granted?.[0]?.images?.icon || outfit.displayAssets?.[0]?.url} 
                        alt={outfit.displayName}
                        className="w-full h-full object-contain p-4 transition-transform duration-300 group-hover:scale-110 relative z-10"
                      />

                      <motion.div 
                        className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/95 to-transparent z-30"
                      >
                        <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#00A3FF] transition-colors">
                          {outfit.displayName}
                        </h3>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[#00A3FF] group-hover:scale-110 transition-transform">
                            {outfit.price?.finalPrice} V-Bucks
                          </span>
                          <motion.span 
                            className="text-xs text-white/90 bg-[#00A3FF]/30 px-2 py-1 rounded-full transition-all duration-300 group-hover:bg-[#00A3FF] group-hover:text-white"
                            whileHover={{ scale: 1.1 }}
                          >
                            {outfit.rarity?.name || 'Common'}
                          </motion.span>
                        </div>
                      </motion.div>
                    </AnimatedCard>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          ) : (
            <div className="text-center text-white/60">
              No hay outfits disponibles en este momento
            </div>
          )}
        </div>
      </div>

      {/* Background Elements */}
      <motion.div 
        className="fixed top-0 right-0 -z-5 h-[600px] w-[600px] opacity-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        transition={{ duration: 1.5 }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#00A3FF] to-[#00FFB3] blur-[100px]" />
      </motion.div>
      
      <motion.div 
        className="fixed bottom-0 left-0 right-0 h-[500px] -z-5 bg-gradient-to-t from-[#0A0A0B]/80 to-transparent"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      />
    </motion.main>
  );
}