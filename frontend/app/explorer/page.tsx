'use client';
import { useState, useEffect } from 'react';
import { getProducts } from '@/lib/api';
import ProductCard from '@/components/ProductCard';
import Filters from '@/components/Filters';

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
                // Tri par nouveauté (plus récents d'abord pour un shop premium)
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

    // Application stricte des filtres côté client pour rapidité absolue (MVP)
    const filteredProducts = products.filter(p => {
        // Filtre Equipe
        if (activeFilters.teams && activeFilters.teams.length > 0) {
            // Si le maillot a un attribut d'équipe défini en base, ou sinon on check le nom
            const matchesTeam = activeFilters.teams.some((team: string) => 
                (p.team && p.team.toLowerCase() === team.toLowerCase()) || 
                p.name.toLowerCase().includes(team.toLowerCase())
            );
            if (!matchesTeam) return false;
        }

        // Filtre Tailles
        if (activeFilters.sizes && activeFilters.sizes.length > 0) {
            const hasSize = activeFilters.sizes.some((s: string) => p.sizes?.includes(s));
            if (!hasSize) return false;
        }

        // Filtre Promo
        if (activeFilters.promoOnly && !p.isPromo) {
            return false;
        }

        // Filtre Stock
        if (activeFilters.inStockOnly && !p.inStock) {
            return false;
        }

        return true;
    });

    return (
        <div className="flex flex-col lg:flex-row gap-10 min-h-screen">
            {/* Colonne Filtres */}
            <Filters activeFilters={activeFilters} onFilterChange={handleFilterChange} />

            {/* Grille Produits */}
            <div className="flex-1 w-full pb-20">
                
                {/* En-tête de recherche/résultats */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 border-b border-gray-100 pb-4">
                    <div>
                        <h1 className="font-poppins font-black text-3xl md:text-4xl text-brand-black tracking-tight">
                            Tous les Maillots
                        </h1>
                        <p className="font-semibold text-gray-400 mt-1">
                            {filteredProducts.length} article{filteredProducts.length > 1 ? 's' : ''} trouvé{filteredProducts.length > 1 ? 's' : ''}
                        </p>
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                            <div key={n} className="aspect-[3/4] bg-gray-100 animate-pulse rounded-2xl w-full"></div>
                        ))}
                    </div>
                ) : filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8">
                        {filteredProducts.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-300">
                        <p className="text-xl font-bold text-gray-500 mb-2">Oups, aucun maillot ne correspond à ces critères.</p>
                        <button onClick={() => setActiveFilters({ teams: [], sizes: [], promoOnly: false, inStockOnly: false })} className="text-brand-accent font-bold hover:underline">
                            Réinitialiser tous les filtres
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
