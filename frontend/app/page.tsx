'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getProducts } from '@/lib/api';
import ProductCard from '@/components/ProductCard';

export default function Home() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAll = async () => {
            const data = await getProducts();
            if (data && Array.isArray(data)) {
                setProducts(data);
            }
            setLoading(false);
        };
        fetchAll();
    }, []);

    const newArrivals = products.filter(p => p.isNew).slice(0, 4);
    const topSales = products.filter(p => !p.isNew).slice(0, 4); 
    // Fallback si pas assez de nouveautés
    const displayNew = newArrivals.length > 0 ? newArrivals : products.slice(0, 4);
    const displayTop = topSales.length > 0 ? topSales : products.slice(0, 4);

    return (
        <div className="flex justify-center flex-col w-full -mt-8">
            {/* HERO SECTION */}
            <section className="relative w-full h-[70vh] min-h-[500px] mb-16 overflow-hidden rounded-b-[40px] md:rounded-b-[60px] flex items-center justify-center">
                {/* Background Image / Overlay */}
                <div className="absolute inset-0 bg-brand-black">
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/60 to-transparent z-10" />
                    {/* Pattern ou image de fond */}
                    <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1518605368461-1e1252281a64?q=80&w=2940&auto=format&fit=crop')] bg-cover bg-center" />
                </div>
                
                <div className="relative z-20 container mx-auto px-4 text-center">
                    <span className="inline-block bg-brand-accent text-brand-black font-black uppercase tracking-widest text-xs px-4 py-1.5 rounded-full mb-6">Nouvelle Collection 2026</span>
                    <h1 className="font-poppins font-black text-5xl md:text-7xl lg:text-8xl text-white uppercase tracking-tighter mb-6 drop-shadow-2xl">
                        VOTRE PASSION,<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-accent to-white">NOTRE MAILLOT.</span>
                    </h1>
                    <p className="text-gray-300 font-medium text-lg md:text-xl max-w-2xl mx-auto mb-10">
                        Découvrez la collection officielle des plus grandes équipes. Flocage authentique gratuit sur une sélection VIP.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link href="/explorer" className="bg-brand-accent text-brand-black font-black text-lg px-8 py-4 rounded-full hover:bg-green-400 hover:scale-105 transition-all shadow-lg shadow-brand-accent/20">
                            Découvrir le catalogue
                        </Link>
                        <Link href="/equipe/senegal" className="bg-white/10 backdrop-blur-md border border-white/20 text-white font-black text-lg px-8 py-4 rounded-full hover:bg-white/20 transition-all">
                            Voir Maillots Sénégal
                        </Link>
                    </div>
                </div>
            </section>

            <div className="container mx-auto px-4 max-w-7xl space-y-24 pb-20">
                {/* NOUVEAUTES */}
                <section>
                    <div className="flex justify-between items-end mb-8">
                        <div>
                            <h2 className="font-poppins font-black text-3xl md:text-4xl text-brand-black tracking-tight">Nouveautés</h2>
                            <p className="text-gray-500 font-medium mt-1">Les derniers arrivages de la semaine</p>
                        </div>
                        <Link href="/explorer" className="hidden sm:block text-brand-accent font-bold hover:underline">Tout voir</Link>
                    </div>
                    {loading ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                            {[1,2,3,4].map(n => <div key={n} className="aspect-[3/4] bg-gray-100 animate-pulse rounded-2xl w-full"></div>)}
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                            {displayNew.map(product => <ProductCard key={product.id} product={product} />)}
                        </div>
                    )}
                </section>

                {/* PROMO BANNER */}
                <section className="relative w-full h-[250px] bg-gray-900 rounded-3xl overflow-hidden shadow-2xl flex items-center p-8 md:p-16 group">
                    <div className="absolute inset-0 bg-brand-accent opacity-0 group-hover:opacity-10 transition-opacity duration-700"></div>
                    <div className="relative z-10 w-full md:w-1/2">
                        <h2 className="font-poppins font-black text-3xl md:text-5xl text-white mb-4 leading-tight uppercase">Personnalisez<br/>votre légende</h2>
                        <p className="text-gray-300 font-medium mb-6">Ajoutez votre nom et numéro en flocage officiel pour seulement 2000 FCFA supplémentaire.</p>
                        <Link href="/explorer" className="inline-block bg-white text-brand-black font-black px-6 py-3 rounded-full hover:bg-gray-100 transition-colors">
                            Voir les options
                        </Link>
                    </div>
                    <div className="absolute right-[-10%] md:right-10 top-1/2 -translate-y-1/2 opacity-20 md:opacity-100 text-brand-accent scale-[3] md:scale-[5] rotate-12 blur-[2px] font-black">
                        10
                    </div>
                </section>

                {/* MEILLEURES VENTES */}
                <section>
                    <div className="flex justify-between items-end mb-8">
                        <div>
                            <h2 className="font-poppins font-black text-3xl md:text-4xl text-brand-black tracking-tight">Top Ventes</h2>
                            <p className="text-gray-500 font-medium mt-1">Les choix préférés de notre communauté</p>
                        </div>
                    </div>
                    {loading ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                            {[1,2,3,4].map(n => <div key={n} className="aspect-[3/4] bg-gray-100 animate-pulse rounded-2xl w-full"></div>)}
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                            {displayTop.map(product => <ProductCard key={product.id} product={product} />)}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}
