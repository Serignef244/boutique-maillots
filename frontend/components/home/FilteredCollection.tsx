'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '../ProductCard';
import ProductSkeleton from '../ProductSkeleton';

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
        <h2 className="font-display text-5xl md:text-8xl mb-16 tracking-tighter text-center uppercase">NOTRE COLLECTION</h2>
        
        {/* Tabs */}
        <div className="flex justify-center flex-wrap gap-4 md:gap-16 mb-20 border-b border-gray-100 pb-4">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="relative text-lg md:text-2xl font-display tracking-[0.2em] uppercase transition-colors hover:text-black"
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

        {/* Grid Magazine Layout */}
        {loading ? (
           <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 md:gap-x-8 gap-y-12 md:gap-y-16 grid-flow-dense">
              {[1,2,3,4,5,6].map((n, i) => (
                <div key={n} className={`${i % 2 === 0 ? 'col-span-2' : 'col-span-1'}`}>
                  <ProductSkeleton />
                </div>
              ))}
           </div>
        ) : (
          <motion.div layout className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 md:gap-x-8 gap-y-12 md:gap-y-16 grid-flow-dense">
            <AnimatePresence mode="popLayout">
              {filtered.map((product, index) => {
                // Layout Magazine Logic stable
                const isLarge = index % 2 === 0; 
                
                return (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    className={`${isLarge ? 'col-span-2' : 'col-span-1'}`}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </section>
  );
}
