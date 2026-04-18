import Link from 'next/link';
import { Facebook, Twitter, Instagram, ShieldCheck, Truck, RotateCcw } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-brand-black text-white pt-16 pb-8 border-t-4 border-brand-accent">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Brand Info */}
          <div>
            <h3 className="font-poppins font-black text-2xl tracking-tighter mb-4 text-brand-white">MAILLOTS<span className="text-brand-accent">STORE</span></h3>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              La référence officielle pour vos maillots de football originaux. Équipez-vous comme des pros, floquez votre passion.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-brand-accent hover:text-black transition-all">
                <Facebook size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-brand-accent hover:text-black transition-all">
                <Twitter size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-brand-accent hover:text-black transition-all">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Nav Links */}
          <div>
            <h4 className="font-poppins font-bold text-lg mb-5">Explorer</h4>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li><Link href="/explorer" className="hover:text-brand-accent transition-colors">Tous les maillots</Link></li>
              <li><Link href="/equipe/psg" className="hover:text-brand-accent transition-colors">Boutique PSG</Link></li>
              <li><Link href="/equipe/real-madrid" className="hover:text-brand-accent transition-colors">Boutique Real Madrid</Link></li>
              <li><Link href="/promotions" className="hover:text-brand-accent transition-colors">Bons Plans</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-poppins font-bold text-lg mb-5">Service Client</h4>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li><Link href="#" className="hover:text-brand-accent transition-colors">Nous contacter</Link></li>
              <li><Link href="#" className="hover:text-brand-accent transition-colors">FAQ</Link></li>
              <li><Link href="#" className="hover:text-brand-accent transition-colors">Suivre ma commande</Link></li>
              <li><Link href="#" className="hover:text-brand-accent transition-colors">Conditions Générales (CGV)</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-poppins font-bold text-lg mb-5">Newsletter</h4>
            <p className="text-gray-400 text-sm mb-4">
              Recevez toutes nos nouveautés et promotions exclusives en avant-première.
            </p>
            <form className="flex" onSubmit={e => e.preventDefault()}>
              <input type="email" placeholder="Votre adresse email" className="bg-gray-800 text-white px-4 py-3 rounded-l-lg w-full focus:outline-none focus:ring-1 focus:ring-brand-accent text-sm" />
              <button type="submit" className="bg-brand-accent text-brand-black font-bold px-4 rounded-r-lg hover:bg-green-400 transition-colors">
                OK
              </button>
            </form>
          </div>

        </div>

        {/* Reassurance Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-8 border-y border-gray-800 mb-8">
          <div className="flex items-center justify-center sm:justify-start gap-4">
            <ShieldCheck className="text-brand-accent" size={32} />
            <div>
              <p className="font-bold text-sm">Paiement Sécurisé</p>
              <p className="text-xs text-gray-500">Orange Money / Wave / CB</p>
            </div>
          </div>
          <div className="flex items-center justify-center sm:justify-start gap-4">
            <Truck className="text-brand-accent" size={32} />
            <div>
              <p className="font-bold text-sm">Livraison Rapide</p>
              <p className="text-xs text-gray-500">Partout au Sénégal</p>
            </div>
          </div>
          <div className="flex items-center justify-center sm:justify-start gap-4">
            <RotateCcw className="text-brand-accent" size={32} />
            <div>
              <p className="font-bold text-sm">Retours Faciles</p>
              <p className="text-xs text-gray-500">Sous 14 jours</p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} Maillots Store. Propulsé avec ❤️
        </div>
      </div>
    </footer>
  );
}
