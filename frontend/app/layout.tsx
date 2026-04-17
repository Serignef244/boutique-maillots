import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Maillots Store - Football Shirts',
    description: 'Boutique premium de maillots de football',
    viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="fr" className="scroll-smooth">
            <body className={`${inter.className} bg-gray-50 text-gray-900 min-h-screen flex flex-col antialiased selection:bg-blue-600 selection:text-white`}>
                <Header />
                <main className="flex-grow container mx-auto px-4 py-8 max-w-7xl">
                    {children}
                </main>
                <footer className="mt-auto border-t border-gray-200 bg-white py-8">
                    <div className="container mx-auto px-4 text-center text-sm font-medium text-gray-500">
                        &copy; 2026 Maillots Store. Tous droits réservés.
                    </div>
                </footer>
            </body>
        </html>
    );
}
