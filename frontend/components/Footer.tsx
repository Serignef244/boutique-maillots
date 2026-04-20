'use client';
import Link from 'next/link';
import { ShieldCheck, Truck, RotateCcw } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-dark text-white pt-20 pb-10 border-t-4 border-pitch relative overflow-hidden">
      {/* Background Decorative Element */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-pitch/5 blur-[120px] pointer-events-none rounded-full" />
      
      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Info */}
          <div className="space-y-6">
            <Link href="/" className="font-display font-black text-4xl tracking-tighter block">
              <span className="text-pitch">JERSEY</span>
              <span className="text-white ml-2">SHORE</span>
            </Link>
            <p className="font-body text-gray-500 text-lg uppercase tracking-wider leading-relaxed">
              La destination ultime pour les maillots de football d'exception. Performance, style et authenticité scellés dans chaque fibre.
            </p>
            <div className="flex gap-5">
              {['FB', 'X', 'IG', 'TT'].map((social) => (
                <a 
                  key={social} 
                  href="#" 
                  className="w-12 h-12 flex items-center justify-center border border-white/10 text-white font-display text-xl transition-all hover:bg-pitch hover:text-dark hover:border-pitch hover:shadow-[0_0_15px_rgba(0,255,135,0.4)]"
                >
                  {social}
                </a>
              ))}
            </div>
          </div>

          {/* Nav Links */}
          <div>
            <h4 className="font-display text-2xl mb-8 tracking-widest text-white">CATALOGUE</h4>
            <ul className="space-y-4 font-body text-lg text-gray-500 uppercase tracking-widest">
              <li><Link href="/explorer" className="hover:text-pitch transition-colors">Collection Complète</Link></li>
              <li><Link href="/equipe/senegal" className="hover:text-pitch transition-colors">Ferveur Lions</Link></li>
              <li><Link href="/equipe/psg" className="hover:text-pitch transition-colors">Boutique Paris</Link></li>
              <li><Link href="/explorer?promo=true" className="hover:text-pitch transition-colors">Offres Limitées</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-display text-2xl mb-8 tracking-widest text-white">ASSISTANCE</h4>
            <ul className="space-y-4 font-body text-lg text-gray-500 uppercase tracking-widest">
              <li><Link href="#" className="hover:text-pitch transition-colors">Contact Expert</Link></li>
              <li><Link href="#" className="hover:text-pitch transition-colors">Guide des Tailles</Link></li>
              <li><Link href="#" className="hover:text-pitch transition-colors">Suivi Livraison</Link></li>
              <li><Link href="#" className="hover:text-pitch transition-colors">Mentions Légales</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-display text-2xl mb-8 tracking-widest text-white">REJOINDRE L'ÉLITE</h4>
            <p className="font-body text-gray-500 text-lg mb-6 uppercase tracking-wider">
              Inscris-toi pour recevoir les drops exclusifs et les alertes de réassort.
            </p>
            <form className="flex group" onSubmit={e => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="TON EMAIL" 
                className="bg-jersey border border-white/10 text-white px-5 py-4 w-full focus:outline-none focus:border-pitch font-body text-lg transition-colors placeholder:text-gray-700" 
              />
              <button 
                type="submit" 
                className="bg-pitch text-dark font-display text-2xl px-6 hover:shadow-[0_0_20px_rgba(0,255,135,0.4)] transition-all"
              >
                JOIN
              </button>
            </form>
          </div>

        </div>

        {/* Reassurance Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 py-10 border-y border-white/5 mb-10">
          <div className="flex items-center gap-6 group">
            <div className="w-16 h-16 flex items-center justify-center bg-jersey border border-white/5 group-hover:border-pitch transition-colors">
              <ShieldCheck className="text-pitch" size={36} />
            </div>
            <div>
              <p className="font-display text-2xl tracking-widest">GARANTIE PRO</p>
              <p className="font-body text-sm text-gray-500 uppercase">PAIEMENT 100% SÉCURISÉ</p>
            </div>
          </div>
          <div className="flex items-center gap-6 group">
            <div className="w-16 h-16 flex items-center justify-center bg-jersey border border-white/5 group-hover:border-pitch transition-colors">
              <Truck className="text-pitch" size={36} />
            </div>
            <div>
              <p className="font-display text-2xl tracking-widest">VITESSE ÉCLAIR</p>
              <p className="font-body text-sm text-gray-500 uppercase">LIVRAISON PARTOUT AU SÉNÉGAL</p>
            </div>
          </div>
          <div className="flex items-center gap-6 group">
            <div className="w-16 h-16 flex items-center justify-center bg-jersey border border-white/5 group-hover:border-pitch transition-colors">
              <RotateCcw className="text-pitch" size={36} />
            </div>
            <div>
              <p className="font-display text-2xl tracking-widest">SATISFACTION</p>
              <p className="font-body text-sm text-gray-500 uppercase">RETOURS FLEXIBLES 14J</p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center font-display text-gray-600 text-lg tracking-[0.4em] uppercase">
          &copy; {new Date().getFullYear()} JERSEY SHORE • EXCELLENCE ATHLÉTIQUE
        </div>
      </div>
    </footer>
  );
}
