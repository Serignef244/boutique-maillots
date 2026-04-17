import Link from 'next/link';

interface ProductCardProps {
    id: string;
    name: string;
    price: number;
    image: string;
    slug: string;
}

export default function ProductCard({ name, price, image, slug }: ProductCardProps) {
    return (
        <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col h-full transform hover:-translate-y-1">
            <div className="relative aspect-square w-full bg-gray-50 flex-shrink-0 overflow-hidden">
                <img 
                    src={image || 'https://via.placeholder.com/400?text=Maillot+Pro'} 
                    alt={name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur text-xs font-bold px-3 py-1 rounded-full shadow-sm text-gray-900 leading-none">
                    Nouveau
                </div>
            </div>
            <div className="p-5 flex flex-col flex-1">
                <h3 className="font-bold text-lg text-gray-900 mb-2 truncate group-hover:text-blue-600 transition-colors">{name}</h3>
                <p className="text-xl text-blue-600 font-bold mt-auto mb-4">{price.toLocaleString()} FCFA</p>
                <Link 
                    href={`/products/${slug}`}
                    className="mt-auto flex items-center justify-center w-full py-3 px-4 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-all shadow-md hover:shadow-lg active:scale-95"
                >
                    Acheter maintenant
                </Link>
            </div>
        </div>
    );
}
