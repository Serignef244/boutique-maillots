import ProductCard from '@/components/ProductCard';
import { getProducts } from '@/lib/api';

export default async function Home() {
    const products = await getProducts();

    return (
        <div>
            {/* Hero Section */}
            <div className="mb-12 text-center py-10 px-4 bg-gradient-to-tr from-blue-900 to-black rounded-3xl text-white shadow-2xl overflow-hidden relative">
                <div className="absolute inset-0 bg-white opacity-5 mix-blend-overlay" style={{backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\' fill-rule=\'evenodd\'%3E%3Ccircle cx=\'3\' cy=\'3\' r=\'3\'/%3E%3Ccircle cx=\'13\' cy=\'13\' r=\'3\'/%3E%3C/g%3E%3C/svg%3E")'}}></div>
                <div className="relative z-10">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4">
                        Équipez-vous en pro
                    </h1>
                    <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto font-medium">
                        Découvrez notre collection de maillots de football originaux, personnalisables à votre nom.
                    </p>
                </div>
            </div>

            {/* List */}
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl md:text-3xl font-bold border-l-4 border-blue-600 pl-4">Nouveautés</h2>
            </div>
            
            {!products || products.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
                    <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <p className="text-xl font-medium text-gray-600">Aucun produit en stock.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-8">
                    {products.map((product: any) => (
                        <ProductCard 
                            key={product.id}
                            id={product.id}
                            name={product.name}
                            price={product.price}
                            image={product.images && product.images[0] ? product.images[0] : ''}
                            slug={product.slug}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
