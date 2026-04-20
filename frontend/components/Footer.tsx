'use client';
import Link from 'next/link';
import { ShieldCheck, Truck, RotateCcw } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white text-black py-24 border-t border-gray-100 relative">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          
          {/* Brand Info */}
          <div className="space-y-8">
            <Link href="/" className="font-display font-black text-4xl tracking-tighter block">
              JERSEY SHORE
            </Link>
            <p className="font-body text-gray-500 text-lg uppercase tracking-wider leading-relaxed">
              Vêtements de sport de précision haute performance. Conçus pour l'excellence athlétique.
            </p>
            <div className="flex gap-8">
              {['FB', 'X', 'IG', 'TT'].map((social) => (
                <a 
                  key={social} 
                  href="#" 
                  className="font-display text-xl transition-opacity hover:opacity-50"
                >
                  {social}
                </a>
              ))}
            </div>
          </div>

          {/* Nav Links */}
          <div>
            <h4 className="font-display text-2xl mb-8 tracking-widest text-black">CATALOGUE</h4>
            <ul className="space-y-4 font-body text-base text-gray-500 uppercase tracking-[0.2em]">
              <li><Link href="/explorer" className="hover:text-black transition-colors">TOUS LES PRODUITS</Link></li>
              <li><Link href="/equipe/senegal" className="hover:text-black transition-colors">SÉNÉGAL</Link></li>
              <li><Link href="/equipe/psg" className="hover:text-black transition-colors">PSG SHOP</Link></li>
              <li><Link href="/explorer?promo=true" className="hover:text-black transition-colors">OFFRES SPÉCIALES</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-display text-2xl mb-8 tracking-widest text-black">ASSISTANCE</h4>
            <ul className="space-y-4 font-body text-base text-gray-500 uppercase tracking-[0.2em]">
              <li><Link href="#" className="hover:text-black transition-colors">CONTACT NOUS</Link></li>
              <li><Link href="#" className="hover:text-black transition-colors">GUIDE DES TAILLES</Link></li>
              <li><Link href="#" className="hover:text-black transition-colors">SUIVI DE COMMANDE</Link></li>
              <li><Link href="#" className="hover:text-black transition-colors">LIVRAISONS & RETOURS</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-display text-2xl mb-8 tracking-widest text-black">NEWSLETTER</h4>
            <p className="font-body text-gray-500 text-base mb-6 uppercase tracking-wider">
              Rejoignez la communauté pour recevoir les derniers drops et exclusivités.
            </p>
            <form className="flex flex-col gap-4" onSubmit={e => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="VOTRE ADRESSE EMAIL" 
                className="bg-brand-grey border-0 text-black px-5 py-4 w-full focus:ring-1 focus:ring-black font-body text-lg transition-colors placeholder:text-gray-400" 
              />
              <button 
                type="submit" 
                className="bg-black text-white font-display text-xl py-4 hover:opacity-80 transition-opacity"
              >
                S'INSCRIRE
              </button>
            </form>
          </div>

        </div>

        {/* Reassurance Banner Castore Style */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-16 py-12 border-y border-gray-100 mb-12">
          <div className="flex flex-col items-center text-center gap-4">
            <ShieldCheck size={32} strokeWidth={1} />
            <div>
              <p className="font-display text-xl tracking-widest">PAIEMENTS SÉCURISÉS</p>
              <p className="font-body text-xs text-gray-400 uppercase tracking-widest">TRANSACTIONS CHIFFRÉES SSL</p>
            </div>
          </div>
          <div className="flex flex-col items-center text-center gap-4">
            <Truck size={32} strokeWidth={1} />
            <div>
              <p className="font-display text-xl tracking-widest">LIVRAISON RAPIDE</p>
              <p className="font-body text-xs text-gray-400 uppercase tracking-widest">SÉNÉGAL & INTERNATIONAL</p>
            </div>
          </div>
          <div className="flex flex-col items-center text-center gap-4">
            <RotateCcw size={32} strokeWidth={1} />
            <div>
              <p className="font-display text-xl tracking-widest">RETOURS FACILES</p>
              <p className="font-body text-xs text-gray-400 uppercase tracking-widest">SOUS 14 JOURS</p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 font-display text-gray-400 text-sm tracking-[0.2em] uppercase">
          <div>&copy; {new Date().getFullYear()} JERSEY SHORE</div>
          <div className="flex gap-8">
            <Link href="#" className="hover:text-black">CONFIDENTIALITÉ</Link>
            <Link href="#" className="hover:text-black">CGV</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
