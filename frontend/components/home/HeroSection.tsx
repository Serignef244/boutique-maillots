import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export default function HeroSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const handleScroll = () => {
    window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
  };

  return (
    <section ref={ref} className="relative w-full h-[90vh] md:h-screen bg-white flex flex-col items-center justify-center overflow-hidden">
      {/* Full Background Image with Parallax */}
      <motion.div 
        style={{ y }}
        className="absolute inset-0 z-0"
      >
        <img 
          src="/images/messi.png" 
          alt="Legends background" 
          className="w-full h-full object-cover object-[center_70%] md:object-center opacity-70"
        />
        {/* Gradient overlay for better text contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-white/40 to-white/60"></div>
      </motion.div>

      {/* Hero Content */}
      <motion.div 
        style={{ opacity }}
        className="z-10 flex flex-col items-center px-6 max-w-7xl text-center"
      >
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-sm md:text-xl tracking-[0.5em] text-black/60 mb-6 uppercase"
        >
          Nouveautés 2024
        </motion.p>
        
        <h1 className="font-display text-5xl sm:text-6xl md:text-[8rem] lg:text-[10rem] leading-[0.9] md:leading-[0.8] text-black tracking-tighter mb-12 uppercase">
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
            className="flex flex-col md:flex-row gap-4 mt-8 w-full md:w-auto"
        >
          <button 
            onClick={handleScroll}
            className="w-full md:w-auto bg-black text-white font-display text-lg md:text-xl px-12 py-5 tracking-widest hover:bg-gray-800 transition-colors uppercase"
          >
            ACHETER LA COLLECTION
          </button>
          <button 
            onClick={handleScroll}
            className="w-full md:w-auto bg-white/80 backdrop-blur-sm border-2 border-black text-black font-display text-lg md:text-xl px-12 py-5 tracking-widest hover:bg-black hover:text-white transition-all uppercase"
          >
            VOIR L'ÉDITORIAL
          </button>
        </motion.div>
      </motion.div>
    </section>
  );
}
