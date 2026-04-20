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
    <section className="w-full bg-white py-24 text-black min-h-[600px] z-10 relative">
      <div className="container mx-auto px-4 max-w-7xl">
        <h2 className="font-display text-6xl md:text-8xl mb-16 tracking-tighter text-center uppercase">NOTRE COLLECTION</h2>
        
        {/* Tabs */}
        <div className="flex justify-center flex-wrap gap-4 md:gap-16 mb-20 border-b border-gray-100 pb-4">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="relative text-xl md:text-2xl font-display tracking-[0.2em] uppercase transition-colors hover:text-black"
              style={{ color: activeTab === tab ? '#000000' : '#d1d1d1' }}
            >
              {tab}
              {activeTab === tab && (
                <motion.div
                  layoutId="activeTabUnderline"
                  className="absolute -bottom-[17px] left-0 right-0 h-[2px] bg-black"
                />
              )}
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
              {[1,2,3,4].map(n => <div key={n} className="aspect-[4/5] bg-brand-grey animate-pulse w-full"></div>)}
           </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
            <AnimatePresence mode="popLayout">
              {filtered.map(product => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
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
