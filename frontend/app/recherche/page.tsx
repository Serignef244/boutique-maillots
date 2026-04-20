'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { getProducts } from '@/lib/api';
import ProductCard from '@/components/ProductCard';
import { motion, AnimatePresence } from 'framer-motion';

function RechercheContent() {
    const searchParams = useSearchParams();
    const query = searchParams.get('q') || '';
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAll = async () => {
            setLoading(true);
            const data = await getProducts();
            if (data && Array.isArray(data)) {
                const filtered = data.filter(p => 
                    p.name.toLowerCase().includes(query.toLowerCase()) || 
                    (p.team && p.team.toLowerCase().includes(query.toLowerCase())) ||
                    (p.description && p.description.toLowerCase().includes(query.toLowerCase()))
                );
                setResults(filtered);
            }
            setLoading(false);
        };
        fetchAll();
    }, [query]);

    return (
        <div className="min-h-[70vh] pb-32 max-w-7xl mx-auto px-4 text-black bg-white pt-24">
            <div className="mb-20 text-center">
                <h1 className="font-display font-black text-6xl md:text-[8rem] tracking-tighter uppercase mb-4 leading-none text-black">
                    VOTRE RECHERCHE
                </h1>
                <p className="font-body text-gray-400 text-lg tracking-[0.3em] uppercase">
                    {loading ? 'ANALYSANT LA COLLECTION...' : `"${query}" • ${results.length} MODÈLE${results.length > 1 ? 'S' : ''} TROUVÉ${results.length > 1 ? 'S' : ''}`}
                </p>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
                    {[1, 2, 3, 4].map(n => (
                        <div key={n} className="aspect-[4/5] bg-brand-grey animate-pulse w-full"></div>
                    ))}
                </div>
            ) : (
                <AnimatePresence mode="popLayout">
                    {results.length > 0 ? (
                        <motion.div 
                            layout
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16"
                        >
                            {results.map(product => (
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
                        </motion.div>
                    ) : (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-col items-center justify-center py-32 bg-brand-grey"
                        >
                            <p className="text-2xl font-display text-gray-400 tracking-[0.3em] uppercase text-center px-4">Aucun maillot ne correspond à votre recherche</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            )}
        </div>
    );
}

export default function RecherchePage() {
    return (
        <Suspense fallback={<div className="flex flex-col items-center justify-center py-32 text-black font-display text-3xl tracking-widest">CHARGEMENT...</div>}>
            <RechercheContent />
        </Suspense>
    );
}
