'use client';
import { motion } from 'framer-motion';

export default function HeroSection() {
  const handleScroll = () => {
    window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
  };

  return (
    <section className="relative w-full h-[90vh] md:h-screen bg-white flex flex-col items-center justify-center overflow-hidden">
      {/* Full Background Image with Castore Grayscale Style */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/images/messi.png" 
          alt="Legends background" 
          className="w-full h-full object-cover grayscale opacity-40"
        />
        {/* White overlay for text contrast */}
        <div className="absolute inset-0 bg-white/40"></div>
      </div>

      {/* Hero Content */}
      <div className="z-10 flex flex-col items-center px-4 max-w-7xl">
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-sm md:text-xl tracking-[0.5em] text-black/60 mb-6 uppercase"
        >
          Nouveautés 2024
        </motion.p>
        
        <h1 className="font-display text-6xl md:text-[8rem] lg:text-[10rem] leading-[0.8] text-black text-center tracking-tighter mb-12">
          <motion.span 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="block"
          >
            PERFORMANCE
          </motion.span>
          <motion.span 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="block"
          >
            SANS LIMITE
          </motion.span>
        </h1>

        {/* Action Buttons */}
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col md:flex-row gap-4 mt-8"
        >
          <button 
            onClick={handleScroll}
            className="bg-black text-white font-display text-xl px-12 py-5 tracking-widest hover:bg-gray-800 transition-colors uppercase"
          >
            ACHETER LA COLLECTION
          </button>
          <button 
            onClick={handleScroll}
            className="bg-white border-2 border-black text-black font-display text-xl px-12 py-5 tracking-widest hover:bg-black hover:text-white transition-all uppercase"
          >
            VOIR L'ÉDITORIAL
          </button>
        </motion.div>
      </div>
    </section>
  );
}
