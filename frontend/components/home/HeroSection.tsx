'use client';
import { motion } from 'framer-motion';
import NeonButton from '../ui/NeonButton';

export default function HeroSection() {
  const handleScroll = () => {
    window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
  };

  return (
    <section className="relative w-full h-screen bg-dark flex flex-col items-center justify-center overflow-hidden">
      {/* Spotlights Animations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-pitch/10 blur-[100px] rounded-full animate-spotlight"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-pitch/10 blur-[120px] rounded-full animate-spotlight" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Hero Content */}
      <div className="z-10 flex flex-col items-center mt-20">
        <h1 className="font-display text-6xl md:text-[9rem] leading-none text-white text-center tracking-tighter flex flex-col md:flex-row gap-0 md:gap-8">
          <span>PORTE LES</span>
          <span className="text-pitch animate-[flicker_3s_infinite]">COULEURS</span>
        </h1>

        {/* Player Image Placeholder (absolute behind or below depending on layout) */}
        <div className="relative w-[300px] md:w-[500px] h-[300px] md:h-[500px] mt-[-40px] md:mt-[-100px] pointer-events-none z-0">
            <motion.img 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
              src="/images/player-hero.png" 
              alt="Player" 
              className="w-full h-full object-contain filter drop-shadow-[0_0_30px_rgba(0,255,135,0.2)]"
              onError={(e) => {
                  // Fallback if image doesn't exist yet
                  e.currentTarget.src = "https://via.placeholder.com/500x500/000000/00ff87?text=JOUEUR";
              }}
            />
        </div>

        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="z-20 mt-[-20px] md:mt-[-40px]"
        >
          <NeonButton onClick={handleScroll}>DÉCOUVRIR LA COLLECTION</NeonButton>
        </motion.div>
      </div>

      {/* Background Texture/Grid (optional) */}
      <div className="absolute inset-0 bg-[url('/images/grid.png')] bg-repeat opacity-5 pointer-events-none mix-blend-overlay"></div>
    </section>
  );
}
