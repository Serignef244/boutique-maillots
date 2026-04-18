import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const inter = Inter({ 
    subsets: ['latin'],
    variable: '--font-inter',
});

const poppins = Poppins({ 
    weight: ['400', '600', '700', '800', '900'],
    subsets: ['latin'],
    variable: '--font-poppins',
});

export const metadata: Metadata = {
    title: 'Maillots Store - Vêtements de sport premium',
    description: 'La référence en maillots de football authentiques et flocages officiels.',
    viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="fr" className="scroll-smooth">
            <body className={`${inter.variable} ${poppins.variable} font-inter bg-brand-white text-brand-black min-h-screen flex flex-col antialiased selection:bg-brand-accent selection:text-white`}>
                <Header />
                <main className="flex-grow w-full">
                    {children}
                </main>
                <Footer />
            </body>
        </html>
    );
}
