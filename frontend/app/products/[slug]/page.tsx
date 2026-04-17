import { getProduct } from '@/lib/api';
import ProductClientDetails from './ProductClientDetails';
import Link from 'next/link';

export default async function ProductPage({ params }: { params: { slug: string } }) {
    const product = await getProduct(params.slug);

    if (!product) {
        return (
            <div className="text-center py-32 flex flex-col items-center">
                <h1 className="text-3xl font-bold mb-4 text-gray-800">Produit introuvable</h1>
                <Link href="/" className="text-blue-600 hover:underline font-medium">Retour à l'accueil</Link>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-10 max-w-7xl mx-auto">
            <ProductClientDetails product={product} />
        </div>
    );
}
