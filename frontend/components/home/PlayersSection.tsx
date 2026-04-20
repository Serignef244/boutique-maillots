'use client';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

export default function PlayersSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const players = [
    { name: "DOMICILE", number: "01", img: "/images/player-1.png", delay: 0 },
    { name: "EXXTÉRIEUR", number: "02", img: "/images/player-2.png", delay: 0.2 },
    { name: "THIRD", number: "03", img: "/images/player-3.png", delay: 0.4 },
  ];

  return (
    <section ref={ref} className="w-full bg-white py-32 relative overflow-hidden">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {players.map((player, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: player.delay, ease: [0.16, 1, 0.3, 1] }}
              className="relative group cursor-none"
            >
              {/* Numéro géant background */}
              <div className="absolute inset-0 flex items-center justify-center font-display text-[15rem] leading-none text-black opacity-[0.03] pointer-events-none transition-opacity duration-500 group-hover:opacity-[0.07]">
                {player.number}
              </div>

              <div className="relative aspect-[3/4] bg-brand-grey overflow-hidden group-hover:bg-gray-100 transition-colors">
                <img 
                  src={player.img} 
                  alt={player.name}
                  className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-700 ease-in-out scale-100 group-hover:scale-105"
                  onError={(e) => { e.currentTarget.src = "https://via.placeholder.com/400x600/F5F5F5/000000?text=COLLECTION"; }}
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent"></div>

                <div className="absolute bottom-10 left-10">
                  <h3 className="font-display text-5xl text-black tracking-tighter group-hover:opacity-60 transition-opacity uppercase">
                    {player.name}
                  </h3>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
