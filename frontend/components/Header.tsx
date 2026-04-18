'use client';
import Link from 'next/link';
import { ShoppingBag, Search, Menu, X, User } from 'lucide-react';
import CartIcon from './CartIcon';
import SearchBar from './SearchBar';
import { useState } from 'react';

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 bg-brand-white border-b border-gray-100 shadow-sm font-inter">
            {/* Top Bar Promo */}
            <div className="bg-brand-black text-brand-white text-xs font-bold py-2 text-center tracking-wide">
                🔥 LIVRAISON OFFERTE PARTOUT AU SÉNÉGAL DÈS 50.000 FCFA 🔥
            </div>
            
            <div className="container mx-auto px-4 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    
                    {/* Mobile Menu Toggle */}
                    <button className="lg:hidden p-2 text-brand-black" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>

                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link href="/" className="font-poppins font-black text-3xl tracking-tighter text-brand-black">
                            MAILLOTS<span className="text-brand-accent">.</span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center gap-8">
                        <Link href="/explorer" className="text-sm font-bold text-gray-800 hover:text-brand-accent transition-colors">TOUS LES MAILLOTS</Link>
                        <Link href="/equipe/senegal" className="text-sm font-bold text-gray-800 hover:text-brand-accent transition-colors">LIONS DU SÉNÉGAL</Link>
                        <Link href="/equipe/psg" className="text-sm font-bold text-gray-800 hover:text-brand-accent transition-colors">PSG</Link>
                        <Link href="/equipe/real-madrid" className="text-sm font-bold text-gray-800 hover:text-brand-accent transition-colors">REAL MADRID</Link>
                    </nav>

                    {/* Right Icons: Search & Cart */}
                    <div className="flex items-center gap-5">
                        
                        {/* Search Desktop */}
                        <div className="hidden lg:block w-72 relative">
                            <SearchBar />
                        </div>

                        {/* Search Mobile Toggle */}
                        <button className="lg:hidden p-2 text-brand-black" onClick={() => setSearchOpen(!searchOpen)}>
                            <Search size={24} />
                        </button>

                        {/* Admin Link / User */}
                        <Link href="/admin" className="hidden sm:flex text-gray-600 hover:text-brand-accent transition-colors">
                            <User size={24} />
                        </Link>

                        {/* Cart */}
                        <div className="flex items-center bg-gray-50 px-3 py-2 rounded-full border border-gray-200 shadow-sm hover:border-brand-accent transition-colors cursor-pointer">
                            <CartIcon />
                        </div>
                    </div>
                </div>

                {/* Mobile Search Bar Dropdown */}
                {searchOpen && (
                    <div className="lg:hidden py-4 border-t border-gray-100 animate-slide-up">
                        <SearchBar />
                    </div>
                )}
            </div>

            {/* Mobile Menu Dropdown */}
            {mobileMenuOpen && (
                <div className="lg:hidden absolute top-full left-0 w-full bg-brand-white border-b border-gray-200 shadow-xl overflow-hidden animate-slide-up">
                    <nav className="flex flex-col p-4">
                        <Link href="/explorer" onClick={() => setMobileMenuOpen(false)} className="py-4 border-b border-gray-100 text-lg font-bold text-brand-black">TOUS LES MAILLOTS</Link>
                        <Link href="/equipe/senegal" onClick={() => setMobileMenuOpen(false)} className="py-4 border-b border-gray-100 text-lg font-bold text-brand-black">LIONS DU SÉNÉGAL</Link>
                        <Link href="/equipe/psg" onClick={() => setMobileMenuOpen(false)} className="py-4 border-b border-gray-100 text-lg font-bold text-brand-black">PSG</Link>
                        <Link href="/equipe/real-madrid" onClick={() => setMobileMenuOpen(false)} className="py-4 border-b border-gray-100 text-lg font-bold text-brand-black">REAL MADRID</Link>
                        <Link href="/admin" onClick={() => setMobileMenuOpen(false)} className="py-4 text-brand-accent font-bold">Panel Administrateur</Link>
                    </nav>
                </div>
            )}
        </header>
    );
}
