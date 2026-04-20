'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function LoadingScreen() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-dark"
        >
          <div className="flex flex-col items-center gap-6">
            <motion.h1 
              className="font-display text-5xl md:text-7xl text-pitch tracking-[0.2em] animate-[pulse-glow_2s_infinite]"
            >
              CHARGEMENT...
            </motion.h1>
            
            <div className="w-64 h-1 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.6, ease: "easeInOut" }}
                className="h-full bg-pitch"
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
