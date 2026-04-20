'use client';
import { useEffect, useState } from 'react';
import { getProducts } from '@/lib/api';

import LoadingScreen from '@/components/home/LoadingScreen';
import HeroSection from '@/components/home/HeroSection';
import MarqueeBand from '@/components/home/MarqueeBand';
import PlayersSection from '@/components/home/PlayersSection';
import FilteredCollection from '@/components/home/FilteredCollection';

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

    return (
        <div className="flex flex-col w-full bg-dark text-white min-h-screen">
            <LoadingScreen />
            
            <HeroSection />
            
            <MarqueeBand />
            
            <PlayersSection />
            
            <FilteredCollection products={products} loading={loading} />
            
        </div>
    );
}
