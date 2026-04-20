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
            <form onSubmit={handleSubmit} className="relative group border-b border-gray-100">
                <input
                    type="text"
                    value={query}
                    onChange={handleSearch}
                    onFocus={() => setIsFocused(true)}
                    placeholder="RECHERCHER DANS LA COLLECTION"
                    className="w-full bg-white text-black font-display text-base tracking-[0.2em] py-4 pr-12 pl-0 focus:outline-none placeholder:text-gray-300 uppercase transition-all"
                />
                
                <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-4">
                    {query.length > 0 && (
                        <button type="button" onClick={() => {setQuery(''); setSuggestions([])}} className="text-gray-300 hover:text-black transition-colors">
                            <X size={20} />
                        </button>
                    )}
                    <button type="submit" className="text-black hover:opacity-60 transition-opacity">
                        <Search size={22} />
                    </button>
                </div>
            </form>

            <AnimatePresence>
                {isFocused && (suggestions.length > 0 || query.length > 2) && (
                    <motion.div 
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        className="absolute top-full left-0 w-full bg-white shadow-2xl overflow-hidden z-[100] border border-gray-100"
                    >
                        <div className="p-4">
                            <p className="font-display text-xs text-gray-400 uppercase tracking-[0.3em] px-4 pt-2 pb-4 border-b border-gray-50 mb-2">SUGGESTIONS</p>
                            
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
                                            className="w-full text-left px-4 py-4 hover:bg-brand-grey flex items-center gap-6 transition-colors group"
                                        >
                                            <div className="w-16 h-16 bg-brand-grey flex items-center justify-center p-2 transition-colors">
                                                <img src={product.images[0] || 'https://via.placeholder.com/60/F5F5F5/000?text=ICON'} alt={product.name} className="w-full h-full object-contain mix-blend-multiply" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-display text-xl text-black tracking-widest uppercase truncate">{product.name}</p>
                                                <p className="font-body text-xs text-gray-400 uppercase tracking-widest">{product.price.toLocaleString()} FCFA</p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-400 font-body text-center py-10 uppercase tracking-widest text-sm">Aucun résultat pour "{query}"</p>
                            )}
                        </div>
                        
                        {suggestions.length > 0 && (
                            <button 
                                onClick={handleSubmit}
                                className="w-full bg-black py-5 text-white font-display text-lg tracking-[0.3em] hover:opacity-90 transition-opacity uppercase"
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
