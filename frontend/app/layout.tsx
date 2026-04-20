import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CustomCursor from '@/components/ui/CustomCursor';

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
    title: 'JERSEY SHORE - Collection Exclusive',
    description: 'La référence en maillots de football authentiques et flocages officiels.',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="fr" className="scroll-smooth bg-dark text-white">
            <body className={`${inter.variable} ${poppins.variable} font-body bg-dark text-white min-h-screen flex flex-col antialiased selection:bg-pitch selection:text-dark`}>
                <CustomCursor />
                <Header />
                <main className="flex-grow w-full relative z-10">
                    {children}
                </main>
                <Footer />
            </body>
        </html>
    );
}
