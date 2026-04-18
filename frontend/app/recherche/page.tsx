'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { getProducts } from '@/lib/api';
import ProductCard from '@/components/ProductCard';

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
                // Filtre simple côté client
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
        <div className="min-h-[60vh] pb-20">
            <div className="mb-10 text-center">
                <h1 className="font-poppins font-black text-3xl md:text-5xl text-brand-black tracking-tight mb-4">
                    Résultats pour : <span className="text-brand-accent">"{query}"</span>
                </h1>
                <p className="font-semibold text-gray-400">
                    {loading ? 'Recherche en cours...' : `${results.length} maillot(s) trouvé(s)`}
                </p>
            </div>

            {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                    {[1, 2, 3, 4].map(n => (
                        <div key={n} className="aspect-[3/4] bg-gray-100 animate-pulse rounded-2xl w-full"></div>
                    ))}
                </div>
            ) : results.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                    {results.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-300">
                    <p className="text-xl font-bold text-gray-500">Aucun produit ne correspond à votre recherche.</p>
                </div>
            )}
        </div>
    );
}

export default function RecherchePage() {
    return (
        <Suspense fallback={<div className="flex justify-center py-20"><p className="font-bold">Chargement...</p></div>}>
            <RechercheContent />
        </Suspense>
    );
}
