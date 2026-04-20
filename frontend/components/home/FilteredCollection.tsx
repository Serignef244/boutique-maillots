'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '../ProductCard';

export default function FilteredCollection({ products, loading }: { products: any[], loading: boolean }) {
  const [activeTab, setActiveTab] = useState('Tous');
  const tabs = ['Tous', 'Nouveautés', 'Promotions'];

  const filtered = products.filter(p => {
    if (activeTab === 'Tous') return true;
    if (activeTab === 'Nouveautés') return p.isNew;
    if (activeTab === 'Promotions') return p.isPromo;
    return true;
  });

  return (
    <section className="w-full  bg-dark py-16 text-white min-h-[600px] z-10 relative">
      <div className="container mx-auto px-4 max-w-7xl">
        <h2 className="font-display text-5xl md:text-7xl mb-12 tracking-widest text-center">NOTRE <span className="text-pitch">COLLECTION</span></h2>
        
        {/* Tabs */}
        <div className="flex justify-center flex-wrap gap-4 md:gap-12 mb-16 border-b border-white/10 pb-4">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="relative text-xl md:text-3xl font-display tracking-widest uppercase transition-colors hover:text-pitch"
              style={{ color: activeTab === tab ? '#00ff87' : '#ededed' }}
            >
              {tab}
              {activeTab === tab && (
                <motion.div
                  layoutId="activeTabUnderline"
                  className="absolute -bottom-[17px] left-0 right-0 h-1 bg-pitch shadow-[0_0_10px_rgba(0,255,135,0.8)]"
                />
              )}
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
              {[1,2,3,4].map(n => <div key={n} className="aspect-[3/4] bg-white/5 animate-pulse rounded-sm w-full border border-white/10"></div>)}
           </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            <AnimatePresence mode="popLayout">
              {filtered.map(product => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.4, type: "spring" }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </section>
  );
}
