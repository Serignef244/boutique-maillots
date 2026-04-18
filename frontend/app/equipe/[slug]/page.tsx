'use client';
import { useState, useEffect } from 'react';
import { getProducts } from '@/lib/api';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';

export default function EquipePage({ params }: { params: { slug: string } }) {
    const slug = params.slug;
    const [teamName, setTeamName] = useState(slug.replace('-', ' '));
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Formatter le nom (ex: real-madrid -> Real Madrid)
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
                // Trier par nouveauté
                setResults(filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
            }
            setLoading(false);
        };
        fetchAll();
    }, [slug]);

    return (
        <div className="min-h-screen pb-20">
            {/* Banner Equipe */}
            <div className="w-full h-[250px] md:h-[350px] bg-brand-black rounded-3xl overflow-hidden relative mb-12 flex items-center justify-center border-b-4 border-brand-accent shadow-xl">
                {/* Fallback pattern css */}
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#22C55E 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                <div className="relative z-10 text-center px-4">
                    <p className="text-brand-accent font-bold tracking-[0.2em] text-sm md:text-base uppercase mb-2">Boutique Officielle</p>
                    <h1 className="font-poppins font-black text-4xl md:text-6xl text-white uppercase tracking-tighter drop-shadow-lg">
                        {teamName}
                    </h1>
                </div>
            </div>

            <div className="mb-8 flex justify-between items-center">
                <p className="font-semibold text-gray-500">
                    {loading ? 'Chargement du catalogue...' : `${results.length} article(s) exclusif(s)`}
                </p>
                <Link href="/explorer" className="text-sm font-bold text-gray-800 hover:text-brand-accent transition-colors underline underline-offset-4">
                    Voir toutes les équipes
                </Link>
            </div>

            {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                    {[1, 2, 3, 4].map(n => (
                        <div key={n} className="aspect-[3/4] bg-gray-100 animate-pulse rounded-2xl w-full"></div>
                    ))}
                </div>
            ) : results.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 min-h-[40vh]">
                    {results.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-24 bg-gray-50 rounded-3xl border border-dashed border-gray-300">
                    <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-4 opacity-50 text-3xl">⚽</div>
                    <p className="text-xl font-bold text-gray-500 text-center px-4">Aucun maillot du {teamName} n'est disponible pour le moment.</p>
                </div>
            )}
        </div>
    );
}
