'use client';
import { motion } from 'framer-motion';

export default function HeroSection() {
  const handleScroll = () => {
    window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
  };

  return (
    <section className="relative w-full h-[90vh] md:h-screen bg-white flex flex-col items-center justify-center overflow-hidden">
      {/* Background Decorative - Very subtle grey circle */}
      <div className="absolute top-[20%] left-[-10%] w-[60%] h-[60%] bg-brand-grey/50 blur-[120px] rounded-full pointer-events-none"></div>

      {/* Hero Content */}
      <div className="z-10 flex flex-col items-center px-4 max-w-7xl">
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-sm md:text-xl tracking-[0.5em] text-gray-400 mb-6 uppercase"
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
            className="block text-gray-200"
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

      {/* Subtle Visual - Player in background or floating */}
      <div className="absolute right-0 bottom-0 w-[40%] h-[60%] pointer-events-none opacity-20 hidden lg:block">
        <img 
          src="/images/player-hero.png" 
          alt="Player" 
          className="w-full h-full object-contain object-bottom grayscale"
        />
      </div>
    </section>
  );
}
