import { getProduct } from '@/lib/api';
import ProductClientDetails from './ProductClientDetails';
import Link from 'next/link';

export default async function ProductPage({ params }: { params: { slug: string } }) {
    const product = await getProduct(params.slug);

    if (!product) {
        return (
            <div className="text-center py-32 flex flex-col items-center flex-grow max-w-7xl mx-auto text-white">
                <h1 className="text-5xl font-display uppercase tracking-widest mb-4">PRODUIT INTROUVABLE</h1>
                <Link href="/" className="text-pitch hover:underline font-body text-xl uppercase tracking-widest">RETOUR À L'ACCUEIL</Link>
            </div>
        );
    }

    return (
        <div className="py-12 px-6 max-w-7xl mx-auto flex-grow w-full">
            <ProductClientDetails product={product} />
        </div>
    );
}
