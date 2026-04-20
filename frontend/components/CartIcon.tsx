'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ShoppingBag } from 'lucide-react';

export default function CartIcon() {
    const [count, setCount] = useState(0);

    const updateCount = () => {
        try {
            const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
            const totalCount = cartItems.reduce((acc: number, item: any) => acc + item.quantity, 0);
            setCount(totalCount);
        } catch (e) {
            setCount(0);
        }
    };

    useEffect(() => {
        updateCount();
        window.addEventListener('cart-updated', updateCount);
        return () => {
            window.removeEventListener('cart-updated', updateCount);
        };
    }, []);

    return (
        <Link href="/cart" className="relative p-1 flex items-center justify-center transition-opacity hover:opacity-60">
            <ShoppingBag size={24} strokeWidth={1.5} className="text-black" />
            {count > 0 && (
                <span className="absolute -top-1 -right-1 bg-black text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full leading-none">
                    {count}
                </span>
            )}
        </Link>
    );
}
