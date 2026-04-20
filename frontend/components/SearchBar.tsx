'use client';
import { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getProducts } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';

export default function SearchBar() {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [isFocused, setIsFocused] = useState(false);
    const router = useRouter();
    const searchRef = useRef<HTMLDivElement>(null);
    const [allProducts, setAllProducts] = useState<any[]>([]);

    useEffect(() => {
        const fetchAll = async () => {
            const data = await getProducts();
            if (data && Array.isArray(data)) {
                setAllProducts(data);
            }
        };
        fetchAll();
    }, []);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsFocused(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const q = e.target.value;
        setQuery(q);
        
        if (q.length > 2) {
            const results = allProducts.filter(p => 
                p.name.toLowerCase().includes(q.toLowerCase()) || 
                (p.team && p.team.toLowerCase().includes(q.toLowerCase()))
            ).slice(0, 5); 
            setSuggestions(results);
        } else {
            setSuggestions([]);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim().length > 0) {
            setIsFocused(false);
            router.push(`/recherche?q=${encodeURIComponent(query)}`);
        }
    };

    return (
        <div className="relative w-full" ref={searchRef}>
            <form onSubmit={handleSubmit} className="relative group">
                <input
                    type="text"
                    value={query}
                    onChange={handleSearch}
                    onFocus={() => setIsFocused(true)}
                    placeholder="RECHERCHER UN MAILLOT..."
                    className="w-full bg-dark border border-white/10 text-white font-body text-sm tracking-widest py-3 pr-12 pl-6 focus:outline-none focus:border-pitch focus:shadow-[0_0_15px_rgba(0,255,135,0.2)] transition-all placeholder:text-gray-700"
                />
                
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    {query.length > 0 && (
                        <button type="button" onClick={() => {setQuery(''); setSuggestions([])}} className="text-gray-500 hover:text-white transition-colors">
                            <X size={18} />
                        </button>
                    )}
                    <button type="submit" className="text-gray-500 hover:text-pitch transition-colors">
                        <Search size={20} />
                    </button>
                </div>
            </form>

            <AnimatePresence>
                {isFocused && (suggestions.length > 0 || query.length > 2) && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full left-0 w-full mt-3 bg-dark border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden z-50"
                    >
                        <div className="p-3">
                            <p className="font-display text-lg text-pitch uppercase tracking-[0.2em] px-3 pt-2 pb-4 border-b border-white/5 mb-2">RÉSULTATS RAPIDES</p>
                            
                            {suggestions.length > 0 ? (
                                <div className="space-y-1">
                                    {suggestions.map(product => (
                                        <button
                                            key={product.id}
                                            onClick={() => {
                                                setIsFocused(false);
                                                setQuery('');
                                                router.push(`/products/${product.slug}`);
                                            }}
                                            className="w-full text-left px-4 py-3 hover:bg-white/5 flex items-center gap-5 transition-colors group"
                                        >
                                            <div className="w-14 h-14 bg-jersey border border-white/5 flex items-center justify-center p-2 group-hover:border-pitch/50 transition-colors">
                                                <img src={product.images[0] || 'https://via.placeholder.com/60/000/fff?text=ICON'} alt={product.name} className="w-full h-full object-contain filter drop-shadow-md" />
                                            </div>
                                            <div className="flex-1 overflow-hidden">
                                                <p className="font-display text-xl text-white tracking-widest truncate group-hover:text-pitch transition-colors uppercase">{product.name}</p>
                                                <p className="font-body text-sm text-gold uppercase tracking-tighter">{product.price.toLocaleString()} FCFA</p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-600 font-body text-center py-6 uppercase tracking-widest">Aucun maillot trouvé pour "{query}"</p>
                            )}
                        </div>
                        
                        {suggestions.length > 0 && (
                            <button 
                                onClick={handleSubmit}
                                className="w-full bg-pitch py-4 text-dark font-display text-xl tracking-[0.2em] hover:bg-white transition-colors border-t border-white/10 uppercase"
                            >
                                TOUT VOIR ({allProducts.filter(p => p.name.toLowerCase().includes(query.toLowerCase())).length})
                            </button>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
