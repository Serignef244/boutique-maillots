'use client';
import Link from 'next/link';
import { Search, Menu, X, User, ShoppingBag } from 'lucide-react';
import CartIcon from './CartIcon';
import SearchBar from './SearchBar';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);

    return (
        <header className="fixed top-0 w-full z-50 bg-white border-b border-gray-100 transition-all duration-300">
            {/* Top Bar Promo Castore Style */}
            <div className="bg-black text-white text-[10px] md:text-xs font-display py-2 text-center tracking-[0.3em] uppercase">
                LIVRAISON OFFERTE DÈS 50.000 FCFA | RETOURS SOUS 14 JOURS
            </div>
            
            <div className="container mx-auto px-4 lg:px-8">
                <div className="grid grid-cols-3 items-center h-20 md:h-24">
                    
                    {/* Left: Mobile Menu & Desktop Nav */}
                    <div className="flex items-center">
                        <button 
                            className="lg:hidden p-2 text-black hover:opacity-70 transition-opacity" 
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                        
                        <nav className="hidden lg:flex items-center gap-8 font-display text-sm tracking-[0.2em] text-black uppercase">
                            <Link href="/explorer" className="hover:opacity-60 transition-opacity">COLLECTION</Link>
                            <Link href="/equipe/senegal" className="hover:opacity-60 transition-opacity">SÉNÉGAL</Link>
                            <Link href="/equipe/psg" className="hover:opacity-60 transition-opacity">PSG</Link>
                        </nav>
                    </div>

                    {/* Center: Logo */}
                    <div className="flex justify-center">
                        <Link href="/" className="font-display font-black text-3xl md:text-5xl tracking-tighter text-black">
                            JERSEY SHORE
                        </Link>
                    </div>

                    {/* Right: Search, User, Cart */}
                    <div className="flex items-center justify-end gap-2 md:gap-6">
                        <button 
                            className="p-2 text-black hover:opacity-60 transition-opacity" 
                            onClick={() => setSearchOpen(!searchOpen)}
                        >
                            <Search size={22} />
                        </button>

                        <Link href="/admin" className="hidden sm:block p-2 text-black hover:opacity-60 transition-opacity">
                            <User size={22} />
                        </Link>

                        <div className="relative p-2 text-black hover:opacity-60 transition-opacity cursor-pointer">
                            <CartIcon />
                        </div>
                    </div>
                </div>
            </div>

            {/* Expandable Search Bar */}
            <AnimatePresence>
                {searchOpen && (
                    <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="bg-white border-b border-gray-100 overflow-hidden"
                    >
                        <div className="container mx-auto px-4 py-8 flex flex-col items-center">
                            <div className="w-full max-w-3xl">
                                <SearchBar />
                            </div>
                            <button 
                                onClick={() => setSearchOpen(false)}
                                className="mt-4 font-display text-xs tracking-widest text-gray-400 hover:text-black uppercase"
                            >
                                FERMER
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Mobile Menu Dropdown */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div 
                        initial={{ x: '-100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '-100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="lg:hidden fixed top-0 left-0 w-full h-screen bg-white z-[60] flex flex-col p-8"
                    >
                        <div className="flex justify-between items-center mb-16">
                            <span className="font-display font-black text-2xl tracking-tighter">JERSEY SHORE</span>
                            <button onClick={() => setMobileMenuOpen(false)}><X size={32} /></button>
                        </div>
                        <nav className="flex flex-col gap-10 font-display text-4xl tracking-widest uppercase">
                            <Link href="/explorer" onClick={() => setMobileMenuOpen(false)}>COLLECTION</Link>
                            <Link href="/equipe/senegal" onClick={() => setMobileMenuOpen(false)}>SÉNÉGAL</Link>
                            <Link href="/equipe/psg" onClick={() => setMobileMenuOpen(false)}>PSG</Link>
                            <Link href="/equipe/real-madrid" onClick={() => setMobileMenuOpen(false)}>REAL MADRID</Link>
                        </nav>
                        <div className="mt-auto border-t pt-8">
                            <Link href="/admin" onClick={() => setMobileMenuOpen(false)} className="font-display text-xl tracking-widest text-gray-400 uppercase">ADMINISTRATION</Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
