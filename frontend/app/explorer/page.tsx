'use client';
import { useState, useEffect } from 'react';
import { getProducts } from '@/lib/api';
import ProductCard from '@/components/ProductCard';
import Filters from '@/components/Filters';
import ProductSkeleton from '@/components/ProductSkeleton';
import { motion, AnimatePresence } from 'framer-motion';

export default function ExplorerPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeFilters, setActiveFilters] = useState<any>({
        teams: [],
        sizes: [],
        promoOnly: false,
        inStockOnly: false
    });

    useEffect(() => {
        const fetchAll = async () => {
            setLoading(true);
            const data = await getProducts();
            if (data && Array.isArray(data)) {
                setProducts(data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
            }
            setLoading(false);
        };
        fetchAll();
    }, []);

    const handleFilterChange = (type: string, value: any) => {
        setActiveFilters((prev: any) => ({
            ...prev,
            [type]: value
        }));
    };

    const handleChipToggle = (team: string) => {
        const current = activeFilters.teams || [];
        const updated = current.includes(team) 
            ? current.filter((t: string) => t !== team) 
            : [...current, team];
        handleFilterChange('teams', updated);
    };

    const filteredProducts = products.filter(p => {
        if (activeFilters.teams && activeFilters.teams.length > 0) {
            const matchesTeam = activeFilters.teams.some((team: string) => 
                (p.team && p.team.toLowerCase() === team.toLowerCase()) || 
                p.name.toLowerCase().includes(team.toLowerCase())
            );
            if (!matchesTeam) return false;
        }

        if (activeFilters.sizes && activeFilters.sizes.length > 0) {
            const hasSize = activeFilters.sizes.some((s: string) => p.sizes?.includes(s));
            if (!hasSize) return false;
        }

        if (activeFilters.promoOnly && !p.isPromo) return false;
        if (activeFilters.inStockOnly && !p.inStock) return false;

        return true;
    });

    const availableTeams = Array.from(new Set(products.map(p => p.team).filter(Boolean)));
    const availableSizes = Array.from(new Set(products.flatMap(p => {
        try {
            return typeof p.sizes === 'string' ? JSON.parse(p.sizes) : p.sizes;
        } catch (e) {
            return [];
        }
    }))).filter(Boolean).sort();

    return (
        <div className="max-w-7xl mx-auto px-4 py-24 min-h-screen text-black bg-white">
            <div className="flex flex-col lg:flex-row gap-16 mt-16">
                {/* Colonne Filtres */}
                <Filters 
                    activeFilters={activeFilters} 
                    onFilterChange={handleFilterChange} 
                    availableTeams={availableTeams}
                    availableSizes={availableSizes}
                />

                {/* Grille Produits */}
                <div className="flex-1 w-full pb-32">
                    
                    {/* En-tête de recherche/résultats */}
                    <div className="flex flex-col mb-12 border-b border-gray-100 pb-12">
                        <div className="mb-8">
                            <h1 className="font-display font-black text-6xl md:text-8xl text-black tracking-tighter uppercase leading-[0.8]">
                                TOUTE LA COLLECTION
                            </h1>
                            <p className="font-body text-gray-400 mt-6 text-sm md:text-base tracking-[0.3em] uppercase">
                                {filteredProducts.length} MODÈLE{filteredProducts.length > 1 ? 'S' : ''} DISPONIBLE{filteredProducts.length > 1 ? 'S' : ''}
                            </p>
                        </div>

                        {/* Quick Filter Chips (Mobile/Desktop) */}
                        <div className="flex overflow-x-auto pb-4 gap-3 no-scrollbar -mx-4 px-4 mask-fade-right">
                           <button 
                             onClick={() => handleFilterChange('teams', [])}
                             className={`px-6 py-2 whitespace-nowrap font-display text-sm tracking-widest border transition-all ${activeFilters.teams.length === 0 ? 'bg-black text-white border-black' : 'bg-white text-black border-gray-200'}`}
                           >
                              TOUS
                           </button>
                           {availableTeams.sort().map(team => (
                             <button 
                                key={team}
                                onClick={() => handleChipToggle(team)}
                                className={`px-6 py-2 whitespace-nowrap font-display text-sm tracking-widest border transition-all ${activeFilters.teams.includes(team) ? 'bg-black text-white border-black' : 'bg-white text-black border-gray-200 uppercase'}`}
                             >
                                {team}
                             </button>
                           ))}
                        </div>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 md:gap-x-8 gap-y-12">
                            {[1, 2, 3, 4, 5, 6].map((n, i) => (
                                <div key={n} className={`${i % 4 === 0 ? 'col-span-2' : 'col-span-1'}`}>
                                    <ProductSkeleton />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <AnimatePresence mode="popLayout">
                            {filteredProducts.length > 0 ? (
                                <motion.div 
                                    layout
                                    className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 md:gap-x-8 gap-y-12 md:gap-y-16"
                                >
                                    {filteredProducts.map((product, index) => (
                                        <motion.div
                                            key={product.id}
                                            layout
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            transition={{ duration: 0.4, delay: index * 0.05 }}
                                            className={`${index % 4 === 0 ? 'col-span-2' : 'col-span-1'}`}
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
                                    <p className="text-2xl font-display text-gray-400 mb-8 tracking-[0.3em] uppercase text-center px-4">Aucun article ne correspond à vos filtres</p>
                                    <button 
                                        onClick={() => setActiveFilters({ teams: [], sizes: [], promoOnly: false, inStockOnly: false })} 
                                        className="bg-black text-white px-8 py-4 font-display text-base tracking-widest hover:opacity-80 transition-opacity uppercase"
                                    >
                                        RÉINITIALISER TOUT
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    )}
                </div>
            </div>
        </div>
    );
}
