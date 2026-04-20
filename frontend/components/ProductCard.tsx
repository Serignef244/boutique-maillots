'use client';
import Link from 'next/link';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import AnimatedCounter from './ui/AnimatedCounter';

export default function ProductCard({ product }: { product: any }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["12.5deg", "-12.5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-12.5deg", "12.5deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  if (!product) return null;

  // Numéro factice basé sur la longueur du nom pour garder le même nombre
  const bgNumber = (product.name.length % 99) || 10;

  return (
    <Link href={`/products/${product.slug}`} className="group relative block w-full outline-none font-body py-4 z-10 hover:z-40 perspective-1000">
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateY,
          rotateX,
          transformStyle: "preserve-3d",
        }}
        className="relative rounded-sm overflow-hidden bg-jersey border border-white/10 hover:border-pitch/50 shadow-2xl transition-colors duration-500"
      >
        {/* Giant Number Background */}
        <div 
          className="absolute inset-0 flex items-center justify-center font-display text-[12rem] text-white opacity-5 pointer-events-none z-0"
          style={{ transform: "translateZ(-30px)" }}
        >
          {bgNumber}
        </div>

        {/* Image Container */}
        <div className="relative aspect-[3/4] w-full p-6 flex flex-col items-center justify-center z-10" style={{ transform: "translateZ(40px)" }}>
          <img 
            src={product.images?.[0] || 'https://via.placeholder.com/300x400'} 
            alt={product.name}
            className="w-full h-full object-contain drop-shadow-[0_20px_20px_rgba(0,0,0,0.9)] group-hover:scale-110 transition-transform duration-700 ease-out"
          />
          
          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.isNew && (
                  <span className="bg-pitch text-dark text-lg font-display tracking-widest px-3 py-1 shadow-[0_0_15px_rgba(0,255,135,0.4)]">
                      NOUVEAU
                  </span>
              )}
              {product.isPromo && (
                  <span className="bg-red-600 text-white text-lg font-display tracking-widest px-3 py-1 shadow-[0_0_15px_rgba(220,38,38,0.5)] animate-[flicker_3s_infinite]">
                      TOP VENTE
                  </span>
              )}
          </div>
          
          {/* Stock Badge */}
          {!product.inStock && (
              <div className="absolute inset-0 bg-dark/80 backdrop-blur-sm flex items-center justify-center">
                  <span className="text-red-500 font-display text-5xl uppercase tracking-widest border-4 border-red-500 px-6 py-2 rotate-[-12deg]">
                      SOLD OUT
                  </span>
              </div>
          )}
        </div>
        
        {/* Footer Info */}
        <div className="p-6 relative bg-dark/95 z-20 border-t border-white/10 transition-transform duration-300" style={{ transform: "translateZ(20px)" }}>
          <div className="flex justify-between items-start mb-2">
            <div>
              {product.team && (
                  <p className="text-sm font-bold text-pitch uppercase tracking-[0.2em] mb-1">{product.team}</p>
              )}
              <h3 className="font-display text-3xl text-white leading-none group-hover:text-pitch transition-colors">
                  {product.name}
              </h3>
            </div>
            
            <div className="flex flex-col items-end gap-1">
                <div className="text-2xl font-display text-gold flex items-center tracking-wider">
                    <AnimatedCounter value={product.price} /> <span className="ml-1">F</span>
                </div>
                {product.originalPrice && product.isPromo && (
                    <p className="text-sm font-body text-gray-500 line-through">
                        {product.originalPrice.toLocaleString()} F
                    </p>
                )}
            </div>
          </div>
          
          {/* Hover Button Overlay */}
          <div className="mt-4 md:absolute md:-bottom-16 md:left-0 w-full md:px-6 transition-all duration-300 md:group-hover:bottom-6 md:opacity-0 md:group-hover:opacity-100 hidden md:block">
            <div className="w-full bg-pitch text-dark flex items-center justify-center font-display text-xl tracking-widest py-3 uppercase shadow-[0_0_15px_rgba(0,255,135,0.4)] pointer-events-none">
                AJOUTER AU PANIER
            </div>
          </div>
          {/* Version Mobile toujours visible */}
          <div className="mt-4 block md:hidden w-full bg-pitch text-dark text-center font-display text-xl tracking-widest py-3 uppercase shadow-[0_0_15px_rgba(0,255,135,0.4)]">
                VOIR L'ARTICLE
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
