'use client';
import Link from 'next/link';
import { Search, Menu, X, User } from 'lucide-react';
import CartIcon from './CartIcon';
import SearchBar from './SearchBar';
import { useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);

    const { scrollY } = useScroll();
    const backgroundColor = useTransform(
        scrollY,
        [0, 100],
        ['rgba(10, 10, 10, 0)', 'rgba(10, 10, 10, 0.95)']
    );
    const backdropFilter = useTransform(
        scrollY,
        [0, 100],
        ['blur(0px)', 'blur(8px)']
    );
    const borderBottomColor = useTransform(
        scrollY,
        [0, 100],
        ['rgba(0, 255, 135, 0)', 'rgba(0, 255, 135, 0.2)']
    );

    return (
        <motion.header 
            style={{ backgroundColor, backdropFilter, borderBottomColor }}
            className="fixed top-0 w-full z-50 border-b transition-all duration-300"
        >
            {/* Top Bar Promo */}
            <div className="bg-pitch text-dark text-xs font-display py-1.5 text-center tracking-[0.3em] uppercase hidden md:block">
                LIVRAISON OFFERTE PARTOUT AU SÉNÉGAL DÈS 50.000 FCFA
            </div>
            
            <div className="container mx-auto px-4 lg:px-8">
                <div className="flex items-center justify-between h-20 md:h-24">
                    
                    {/* Mobile Menu Toggle */}
                    <button className="lg:hidden p-2 text-white hover:text-pitch transition-colors" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                        {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>

                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link href="/" className="font-display font-black text-4xl md:text-5xl tracking-tighter flex items-center">
                            <span className="text-pitch drop-shadow-[0_0_10px_rgba(0,255,135,0.4)]">JERSEY</span>
                            <span className="text-white ml-2">SHORE</span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center gap-10">
                        <Link href="/explorer" className="text-base font-body tracking-[0.2em] text-white uppercase hover:text-pitch hover:drop-shadow-[0_0_8px_rgba(0,255,135,0.5)] transition-all">COLLECTION</Link>
                        <Link href="/equipe/senegal" className="text-base font-body tracking-[0.2em] text-white uppercase hover:text-pitch hover:drop-shadow-[0_0_8px_rgba(0,255,135,0.5)] transition-all">SÉNÉGAL</Link>
                        <Link href="/equipe/psg" className="text-base font-body tracking-[0.2em] text-white uppercase hover:text-pitch hover:drop-shadow-[0_0_8px_rgba(0,255,135,0.5)] transition-all">PSG</Link>
                        <Link href="/equipe/real-madrid" className="text-base font-body tracking-[0.2em] text-white uppercase hover:text-pitch hover:drop-shadow-[0_0_8px_rgba(0,255,135,0.5)] transition-all">REAL MADRID</Link>
                    </nav>

                    {/* Right Icons: Search & Cart */}
                    <div className="flex items-center gap-6">
                        
                        {/* Search Desktop */}
                        <div className="hidden lg:block w-64 relative">
                            <SearchBar />
                        </div>

                        {/* Search Mobile Toggle */}
                        <button className="lg:hidden p-2 text-white hover:text-pitch transition-colors" onClick={() => setSearchOpen(!searchOpen)}>
                            <Search size={24} />
                        </button>

                        {/* Admin Link / User */}
                        <Link href="/admin" className="hidden sm:flex text-gray-400 hover:text-pitch transition-colors">
                            <User size={24} />
                        </Link>

                        {/* Cart */}
                        <div className="flex items-center px-2 py-2 rounded-full border border-white/20 hover:border-pitch hover:shadow-[0_0_15px_rgba(0,255,135,0.3)] transition-all cursor-pointer bg-black/50 text-white">
                            <CartIcon />
                        </div>
                    </div>
                </div>

                {/* Mobile Search Bar Dropdown */}
                {searchOpen && (
                    <div className="lg:hidden pb-4">
                        <SearchBar />
                    </div>
                )}
            </div>

            {/* Mobile Menu Dropdown */}
            {mobileMenuOpen && (
                <div className="lg:hidden absolute top-full left-0 w-full bg-dark/95 backdrop-blur-md border-b border-white/10 shadow-2xl overflow-hidden">
                    <nav className="flex flex-col p-6 gap-6 font-display text-2xl tracking-widest text-center">
                        <Link href="/explorer" onClick={() => setMobileMenuOpen(false)} className="text-white hover:text-pitch">COLLECTION</Link>
                        <Link href="/equipe/senegal" onClick={() => setMobileMenuOpen(false)} className="text-white hover:text-pitch">SÉNÉGAL</Link>
                        <Link href="/equipe/psg" onClick={() => setMobileMenuOpen(false)} className="text-white hover:text-pitch">PSG</Link>
                        <Link href="/equipe/real-madrid" onClick={() => setMobileMenuOpen(false)} className="text-white hover:text-pitch">REAL MADRID</Link>
                        <Link href="/admin" onClick={() => setMobileMenuOpen(false)} className="text-pitch mt-4 border-t border-white/10 pt-4">ADMINISTRATION</Link>
                    </nav>
                </div>
            )}
        </motion.header>
    );
}
