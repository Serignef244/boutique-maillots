'use client';
import { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getProducts } from '@/lib/api';

export default function SearchBar() {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [isFocused, setIsFocused] = useState(false);
    const router = useRouter();
    const searchRef = useRef<HTMLDivElement>(null);
    const [allProducts, setAllProducts] = useState<any[]>([]);

    useEffect(() => {
        // Précharger les produits pour la recherche rapide côté client (MVP)
        const fetchAll = async () => {
            const data = await getProducts();
            if (data && Array.isArray(data)) {
                setAllProducts(data);
            }
        };
        fetchAll();
    }, []);

    // Fermer les suggestions si on clique à l'extérieur
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
            ).slice(0, 5); // Max 5 suggestions
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
            <form onSubmit={handleSubmit} className="relative">
                <input
                    type="text"
                    value={query}
                    onChange={handleSearch}
                    onFocus={() => setIsFocused(true)}
                    placeholder="Rechercher un maillot, un club..."
                    className="w-full bg-gray-100 text-sm font-semibold rounded-full py-3 pr-10 pl-5 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:bg-white transition-all text-brand-black placeholder-gray-400"
                />
                
                {query.length > 0 ? (
                    <button type="button" onClick={() => {setQuery(''); setSuggestions([])}} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-black">
                        <X size={18} />
                    </button>
                ) : (
                    <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-accent">
                        <Search size={18} />
                    </button>
                )}
            </form>

            {/* Modal Suggestions */}
            {isFocused && suggestions.length > 0 && query.length > 2 && (
                <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-slide-up">
                    <div className="p-2">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest px-3 pt-2 pb-2">Produits trouvés</p>
                        {suggestions.map(product => (
                            <button
                                key={product.id}
                                onClick={() => {
                                    setIsFocused(false);
                                    setQuery('');
                                    router.push(`/products/${product.slug}`);
                                }}
                                className="w-full text-left px-3 py-3 hover:bg-gray-50 rounded-xl flex items-center gap-4 transition-colors"
                            >
                                <img src={product.images[0] || 'https://via.placeholder.com/40'} alt={product.name} className="w-10 h-10 rounded-md object-cover bg-gray-100" />
                                <div className="flex-1 overflow-hidden">
                                    <p className="font-bold text-sm text-brand-black truncate">{product.name}</p>
                                    <p className="text-xs font-semibold text-brand-accent">{product.price.toLocaleString()} FCFA</p>
                                </div>
                            </button>
                        ))}
                    </div>
                    <button 
                        onClick={handleSubmit}
                        className="w-full bg-gray-50 py-3 text-sm font-bold text-brand-accent hover:bg-gray-100 transition-colors border-t border-gray-100"
                    >
                        Voir tous les résultats ({allProducts.filter(p => p.name.toLowerCase().includes(query.toLowerCase())).length})
                    </button>
                </div>
            )}
        </div>
    );
}
