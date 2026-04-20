'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function ProductCard({ product }: { product: any }) {
  if (!product) return null;

  return (
    <Link href={`/products/${product.slug}`} className="group block w-full outline-none font-body">
      <div className="relative overflow-hidden">
        {/* Image Container Castore Style */}
        <div className="relative aspect-[4/5] w-full bg-brand-grey flex flex-col items-center justify-center overflow-hidden transition-all duration-700">
          <motion.img 
            initial={{ opacity: 0, scale: 1 }}
            animate={{ opacity: 1 }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            src={product.images?.[0] || 'https://via.placeholder.com/600x750/F5F5F5/000000?text=MAILLOT'} 
            alt={product.name}
            className="w-full h-full object-contain p-8 md:p-12 mix-blend-multiply"
          />
          
          {/* Quick Add Overlay */}
          <div className="absolute inset-x-0 bottom-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500 hidden md:block">
            <div className="w-full bg-black text-white text-center font-display text-sm tracking-[0.2em] py-4 uppercase">
                ACHETER
            </div>
          </div>

          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-1">
              {product.isNew && (
                  <span className="bg-black text-white text-[10px] font-display tracking-widest px-2 py-1 uppercase">
                      NOUVEAUTÉ
                  </span>
              )}
          </div>
          
          {/* Stock Overlay */}
          {!product.inStock && (
              <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                  <span className="text-black font-display text-2xl tracking-[0.4em] border-y border-black px-4 py-2">
                      EPUISÉ
                  </span>
              </div>
          )}
        </div>
        
        {/* Info Area */}
        <div className="pt-6 pb-2">
            <div className="flex flex-col gap-1">
                {product.team && (
                    <p className="text-[10px] md:text-xs font-display text-gray-400 tracking-[0.3em] uppercase">{product.team}</p>
                )}
                <div className="flex justify-between items-baseline gap-4">
                  <h3 className="font-display text-xl md:text-2xl text-black leading-none tracking-wider uppercase group-hover:opacity-60 transition-opacity">
                      {product.name}
                  </h3>
                  <div className="text-xl md:text-2xl font-display text-black tracking-wider whitespace-nowrap">
                    {product.price.toLocaleString()} F
                  </div>
                </div>
            </div>
        </div>
      </div>
    </Link>
  );
}
