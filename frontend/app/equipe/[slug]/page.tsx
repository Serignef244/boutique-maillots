'use client';
import { useState, useEffect } from 'react';
import { getProducts } from '@/lib/api';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function EquipePage({ params }: { params: { slug: string } }) {
    const slug = params.slug;
    const [teamName, setTeamName] = useState(slug.replace('-', ' '));
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const formatName = (str: string) => str.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        const formatted = formatName(slug);
        setTeamName(formatted);

        const fetchAll = async () => {
            setLoading(true);
            const data = await getProducts();
            if (data && Array.isArray(data)) {
                const filtered = data.filter(p => 
                    (p.team && p.team.toLowerCase().includes(formatted.toLowerCase())) ||
                    p.name.toLowerCase().includes(formatted.toLowerCase())
                );
                setResults(filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
            }
            setLoading(false);
        };
        fetchAll();
    }, [slug]);

    return (
        <div className="min-h-screen pb-24 max-w-7xl mx-auto px-4 text-white font-body">
            {/* Banner Equipe */}
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full h-[300px] md:h-[450px] bg-dark border-b-4 border-pitch relative mb-16 flex items-center justify-center overflow-hidden"
            >
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#00ff87 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
                
                {/* Decorative spotlight */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-pitch/5 blur-[120px] rounded-full pointer-events-none" />

                <div className="relative z-10 text-center px-6">
                    <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-pitch font-display text-xl md:text-2xl tracking-[0.4em] uppercase mb-4"
                    >
                        BOUTIQUE OFFICIELLE
                    </motion.p>
                    <motion.h1 
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="font-display font-black text-6xl md:text-9xl text-white uppercase tracking-widest leading-none drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                    >
                        {teamName}
                    </motion.h1>
                </div>
            </motion.div>

            <div className="mb-12 flex flex-col md:flex-row justify-between items-center gap-6 border-b border-white/5 pb-8">
                <p className="font-display text-2xl text-gray-500 tracking-widest uppercase">
                    {loading ? 'CHARGEMENT DU CATALOGUE...' : `${results.length} MODÈLE${results.length > 1 ? 'S' : ''} DISPONIBLE${results.length > 1 ? 'S' : ''}`}
                </p>
                <Link href="/explorer" className="font-display text-lg text-white hover:text-pitch transition-colors underline underline-offset-8 tracking-widest uppercase">
                    VOIR TOUTES LES ÉQUIPES
                </Link>
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
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 min-h-[40vh]"
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
                            <div className="text-6xl mb-6 grayscale opacity-30">⚽</div>
                            <p className="text-2xl font-display text-gray-500 tracking-widest uppercase text-center px-4">Indisponible pour le moment</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            )}
        </div>
    );
}
