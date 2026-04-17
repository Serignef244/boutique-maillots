'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

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
        <Link href="/cart" className="relative p-2.5 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200 transition duration-200 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="8" cy="21" r="1" />
                <circle cx="19" cy="21" r="1" />
                <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
            </svg>
            {count > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-sm ring-2 ring-white">
                    {count}
                </span>
            )}
        </Link>
    );
}
