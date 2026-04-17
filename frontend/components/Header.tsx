import Link from 'next/link';
import CartIcon from './CartIcon';

export default function Header() {
    return (
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="text-2xl font-black bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent hover:opacity-80 transition">
                    Maillots Store
                </Link>
                <nav className="flex items-center gap-6 sm:gap-8">
                    <Link href="/" className="text-sm font-semibold text-gray-700 hover:text-black transition">
                        Accueil
                    </Link>
                    <Link href="/admin" className="text-sm font-semibold text-gray-700 hover:text-black transition">
                        Admin
                    </Link>
                    <div className="pl-2 border-l border-gray-200">
                        <CartIcon />
                    </div>
                </nav>
            </div>
        </header>
    );
}
