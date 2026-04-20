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
        <div className="min-h-[70vh] pb-24 max-w-7xl mx-auto px-4 text-white">
            <div className="mb-16 text-center pt-10">
                <h1 className="font-display font-black text-5xl md:text-8xl tracking-widest uppercase mb-4 leading-none">
                    RÉSULTATS : <span className="text-pitch">"{query}"</span>
                </h1>
                <p className="font-body text-gray-500 text-xl tracking-[0.2em] uppercase">
                    {loading ? 'RECHERCHE EN COURS...' : `${results.length} MAILLOT${results.length > 1 ? 'S' : ''} TROUVÉ${results.length > 1 ? 'S' : ''}`}
                </p>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {[1, 2, 3, 4].map(n => (
                        <div key={n} className="aspect-[4/5] bg-jersey animate-pulse border border-white/5 w-full"></div>
                    ))}
                </div>
            ) : (
                <AnimatePresence mode="popLayout">
                    {results.length > 0 ? (
                        <motion.div 
                            layout
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
                        >
                            {results.map(product => (
                                <motion.div
                                    key={product.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <ProductCard product={product} />
                                </motion.div>
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-col items-center justify-center py-32 bg-jersey border border-white/5"
                        >
                            <p className="text-3xl font-display text-gray-500 tracking-[0.2em] uppercase text-center">Aucun match pour votre recherche</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            )}
        </div>
    );
}

export default function RecherchePage() {
    return (
        <Suspense fallback={<div className="flex flex-col items-center justify-center py-32 text-white font-display text-3xl tracking-widest">CHARGEMENT...</div>}>
            <RechercheContent />
        </Suspense>
    );
}
