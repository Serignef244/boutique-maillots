import { useState, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Star, Zap, Clock } from 'lucide-react';
import { dispatchCartUpdated } from '@/lib/cart';

export default function ProductCard({ product }: { product: any }) {
  const [selectedSize, setSelectedSize] = useState('');
  const [showSizes, setShowSizes] = useState(false);
  const [isPressing, setIsPressing] = useState(false);
  const timerRef = useRef<any>(null);

  if (!product) return null;

  const handleQuickAdd = (e: React.MouseEvent | React.TouchEvent, size: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    const item = {
      id: product.id,
      name: product.name,
      basePrice: product.price,
      price: product.price,
      size: size,
      hasFlockage: false,
      flockageText: null,
      quantity: 1,
      image: product.images?.[0]
    };

    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingIndex = cart.findIndex((i: any) => 
        i.id === item.id && i.size === item.size && !i.hasFlockage
    );

    if (existingIndex > -1) {
        cart[existingIndex].quantity += 1;
    } else {
        cart.push(item);
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    dispatchCartUpdated();
    
    // Simple feedback
    setSelectedSize(size);
    if (typeof window !== 'undefined' && 'vibrate' in navigator) navigator.vibrate(50);
  };

  const handlePressStart = () => {
    setIsPressing(true);
    timerRef.current = setTimeout(() => {
        if (typeof window !== 'undefined' && 'vibrate' in navigator) navigator.vibrate(100);
        // Ici on pourrait ouvrir un preview modal
    }, 600);
  };

  const handlePressEnd = () => {
    setIsPressing(false);
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  // Simulation FOMO basée sur l'ID du produit
  const stockCount = Math.floor(6 + (parseInt(product.id.slice(-1), 16) || 5));
  const isTopSeller = parseInt(product.id.slice(-2), 16) > 180;

  return (
    <div className="group relative font-body bg-white border border-gray-50 md:border-0 transition-all duration-300">
      <Link href={`/products/${product.slug}`} className="block w-full outline-none">
        <div 
          className="relative overflow-hidden"
          onMouseDown={handlePressStart}
          onMouseUp={handlePressEnd}
          onTouchStart={handlePressStart}
          onTouchEnd={handlePressEnd}
        >
          {/* Image Container */}
          <div className="relative aspect-[4/5] w-full bg-[#F9F9F9] flex flex-col items-center justify-center overflow-hidden">
            <motion.img 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: isPressing ? 1.05 : 1 }}
              whileHover={{ scale: 1.08 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              src={product.images?.[0] || 'https://via.placeholder.com/600x750/F5F5F5/000000?text=MAILLOT'} 
              alt={product.name}
              className="w-full h-full object-contain p-6 md:p-12 mix-blend-multiply"
            />
            
            {/* Quick Add Overlay (Desktop) or Size Bubbles (Mobile Overlay) */}
            <div className={`absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 hidden md:block z-20`}>
              <div className="w-full bg-black text-white text-center font-display text-xs tracking-[0.3em] py-4 uppercase hover:bg-gray-900">
                  DÉCOUVRIR
              </div>
            </div>

            {/* Badges Dynamiques (Magazine Style) */}
            <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
                {product.isNew && (
                    <motion.div 
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className="bg-black text-white text-[8px] md:text-[10px] font-display tracking-widest px-2 py-1 uppercase flex items-center gap-1 shadow-sm"
                    >
                        <Zap size={10} fill="white" /> NOUVEAU
                    </motion.div>
                )}
                {product.isPromo && (
                    <div className="bg-red-600 text-white text-[8px] md:text-[10px] font-display tracking-widest px-2 py-1 uppercase shadow-sm">
                        -{Math.floor(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                    </div>
                )}
                {isTopSeller && (
                    <div className="bg-white text-black border border-black/10 text-[8px] md:text-[10px] font-display tracking-widest px-2 py-1 uppercase flex items-center gap-1 shadow-sm">
                        <Star size={10} fill="black" /> TOP VENTE
                    </div>
                )}
                {stockCount < 10 && product.inStock && (
                    <div className="bg-orange-500 text-white text-[8px] md:text-[10px] font-display tracking-widest px-2 py-1 uppercase flex items-center gap-1 shadow-sm">
                       <Clock size={10} /> {stockCount} RESTANTS
                    </div>
                )}
            </div>
            
            {/* Stock Overlay */}
            {!product.inStock && (
                <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-20">
                    <span className="text-black font-display text-xl md:text-2xl tracking-[0.4em] border-y border-black px-4 py-2">
                        EPUISÉ
                    </span>
                </div>
            )}
          </div>
        </div>
      </Link>

      {/* Info Area & Quick Selection */}
      <div className="pt-5 pb-4 px-2">
          {/* Sizes Row (Quick Add on Mobile) */}
          <div className="flex gap-1 mb-4 overflow-x-auto no-scrollbar py-1">
              {["S", "M", "L", "XL"].map(size => (
                  <button
                    key={size}
                    onClick={(e) => handleQuickAdd(e, size)}
                    className={`min-w-[40px] h-10 border text-[10px] md:text-xs font-display tracking-widest flex items-center justify-center transition-all ${
                        selectedSize === size 
                        ? 'bg-black text-white border-black' 
                        : 'bg-white border-gray-100 text-gray-400 hover:border-black hover:text-black'
                    }`}
                  >
                    {size}
                  </button>
              ))}
          </div>

          <div className="flex flex-col gap-2">
              {product.team && (
                  <p className="text-[10px] md:text-xs font-display text-gray-400 tracking-[0.4em] uppercase font-bold">{product.team}</p>
              )}
              <div className="flex flex-col gap-1">
                <Link href={`/products/${product.slug}`} className="block">
                    <h3 className="font-display text-xl md:text-4xl text-black leading-none tracking-tighter uppercase group-hover:opacity-70 transition-opacity">
                        {product.name}
                    </h3>
                </Link>
                <div className="flex items-center gap-3 mt-1">
                  <div className="text-lg md:text-3xl font-display text-black tracking-tighter">
                    {product.price.toLocaleString()} FCFA
                  </div>
                  {product.originalPrice && product.isPromo && (
                    <div className="text-xs md:text-lg text-gray-300 line-through font-display opacity-50">
                        {product.originalPrice.toLocaleString()}
                    </div>
                  )}
                </div>
              </div>
          </div>
      </div>
    </div>
  );
}
