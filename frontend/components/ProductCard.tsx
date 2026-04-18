import Link from 'next/link';

export default function ProductCard({ product }: { product: any }) {
  if (!product) return null;

  return (
    <Link href={`/products/${product.slug}`} className="group relative block rounded-2xl overflow-hidden bg-white shadow-sm border border-gray-100 hover:shadow-2xl transition-all duration-500 font-inter">
      
      {/* Image Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-50 flex items-center justify-center">
        <img 
          src={product.images?.[0] || 'https://via.placeholder.com/300x400'} 
          alt={product.name}
          className="w-full h-full object-cover mix-blend-multiply group-hover:scale-110 transition-transform duration-700 ease-out"
        />
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
            {product.isNew && (
                <span className="bg-brand-black text-white text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full shadow-lg">
                    Nouveau
                </span>
            )}
            {product.isPromo && (
                <span className="bg-red-500 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full shadow-lg animate-pulse">
                    Promo
                </span>
            )}
        </div>
        
        {/* Stock Badge */}
        {!product.inStock && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center">
                <span className="bg-brand-black text-white font-black px-6 py-2 rounded-full rotate-[-12deg] text-lg uppercase tracking-widest border-2 border-white">
                    Épuisé
                </span>
            </div>
        )}
      </div>
      
      {/* Footer Info */}
      <div className="p-5 flex flex-col h-[140px] justify-between relative bg-white z-10 transition-transform duration-300 group-hover:-translate-y-2">
        <div>
            {product.team && (
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{product.team}</p>
            )}
            <h3 className="font-poppins font-bold text-gray-900 leading-tight line-clamp-2 mix-blend-darken group-hover:text-brand-accent transition-colors">
                {product.name}
            </h3>
        </div>
        
        <div className="flex items-center gap-3 mt-2">
            <p className="text-lg font-black text-brand-black">
                {product.price.toLocaleString()} F
            </p>
            {product.originalPrice && product.isPromo && (
                <p className="text-sm font-bold text-gray-400 line-through">
                    {product.originalPrice.toLocaleString()} F
                </p>
            )}
        </div>
      </div>
      
      {/* Hover Button Overlay */}
      <div className="absolute bottom-[-10px] opacity-0 group-hover:opacity-100 group-hover:bottom-4 left-0 w-full px-5 transition-all duration-300 pointer-events-none hidden md:block z-20">
          <div className="w-full bg-brand-accent text-white text-center font-black py-2.5 rounded-xl shadow-lg shadow-brand-accent/30 pointer-events-auto">
              Voir le maillot
          </div>
      </div>
    </Link>
  );
}
