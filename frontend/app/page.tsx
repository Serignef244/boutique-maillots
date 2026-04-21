'use client';
import { useEffect, useState } from 'react';
import { getProducts } from '@/lib/api';

import LoadingScreen from '@/components/home/LoadingScreen';
import HeroSection from '@/components/home/HeroSection';
import MarqueeBand from '@/components/home/MarqueeBand';

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
        <div className="flex flex-col w-full bg-white text-black min-h-screen">
            <LoadingScreen />
            
            <HeroSection />
            
            <MarqueeBand />
            

            <FilteredCollection products={products} loading={loading} />
            
        </div>
    );
}
