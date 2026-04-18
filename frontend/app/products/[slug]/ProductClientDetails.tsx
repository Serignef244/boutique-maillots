'use client';
import { useState } from 'react';
import { dispatchCartUpdated, FLOCKAGE_PRICE } from '@/lib/cart';
import { ShoppingBag, ShieldCheck } from 'lucide-react';

export default function ProductClientDetails({ product }: { product: any }) {
    const defaultSizes = ["S", "M", "L", "XL", "XXL"];
    const sizes = Array.isArray(product.sizes) && product.sizes.length > 0 ? product.sizes : defaultSizes;
    
    const [selectedSize, setSelectedSize] = useState('');
    const [hasFlockage, setHasFlockage] = useState(false);
    const [flockageText, setFlockageText] = useState('');
    const [quantity, setQuantity] = useState(1);
    
    // Pour la galerie d'images
    const images = Array.isArray(product.images) && product.images.length > 0 ? product.images : ['https://via.placeholder.com/600?text=Aper%C3%A7u'];
    const [mainImage, setMainImage] = useState(images[0]);
    
    // Validation globale pour l'activation du bouton d'ajout au panier
    const isButtonDisabled = !selectedSize || (hasFlockage && flockageText.trim() === '') || !product.inStock;

    const addToCart = () => {
        if (!selectedSize) {
            alert('Veuillez sélectionner une taille.');
            return;
        }
        
        const finalPrice = hasFlockage ? product.price + FLOCKAGE_PRICE : product.price;

        const item = {
            id: product.id,
            name: product.name,
            basePrice: product.price,
            price: finalPrice, 
            size: selectedSize,
            hasFlockage,
            flockageText: hasFlockage ? flockageText.toUpperCase() : null,
            quantity,
            image: mainImage
        };
        
        let cart = JSON.parse(localStorage.getItem('cart') || '[]');
        
        const existingIndex = cart.findIndex((i: any) => 
            i.id === item.id && i.size === item.size && i.hasFlockage === item.hasFlockage && i.flockageText === item.flockageText
        );

        if (existingIndex > -1) {
            cart[existingIndex].quantity += item.quantity;
        } else {
            cart.push(item);
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        dispatchCartUpdated(); 
        
        // Petit effet feedback visuel (optionnel)
        const btn = document.getElementById('add-to-cart-btn');
        if (btn) {
            btn.innerHTML = '✔ Ajouté au panier !';
            btn.classList.add('bg-green-600', 'text-white');
            setTimeout(() => {
                btn.innerHTML = 'Ajouter au panier';
                btn.classList.remove('bg-green-600', 'text-white');
            }, 2000);
        }
    };

    return (
        <div className="flex flex-col lg:flex-row gap-12 font-inter pb-20">
            {/* Colonne de gauche : Galerie des images */}
            <div className="lg:w-[55%] flex flex-col gap-4">
                <div className="bg-[#F6F6F6] flex items-center justify-center p-8 rounded-3xl min-h-[500px] border border-gray-100 relative overflow-hidden group">
                    <img src={mainImage} alt={product.name} className="max-w-full h-auto max-h-[600px] object-contain drop-shadow-2xl mix-blend-multiply group-hover:scale-105 transition-transform duration-700 ease-out" />
                    
                    {/* Badges Fiche Produit */}
                    <div className="absolute top-6 left-6 flex flex-col gap-2">
                        {product.isNew && (
                            <span className="bg-brand-black text-white text-xs font-black uppercase tracking-wider px-4 py-2 rounded-full shadow-lg">
                                NOUVEAU
                            </span>
                        )}
                        {product.isPromo && (
                            <span className="bg-red-500 text-white text-xs font-black uppercase tracking-wider px-4 py-2 rounded-full shadow-lg animate-pulse">
                                PROMO
                            </span>
                        )}
                    </div>
                </div>
                
                {images.length > 1 && (
                    <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
                        {images.map((img: string, idx: number) => (
                            <button 
                                key={idx} 
                                onClick={() => setMainImage(img)}
                                className={`w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 transition-all ${
                                    mainImage === img ? 'opacity-100 ring-2 ring-brand-black ring-offset-2' : 'border border-gray-200 bg-[#F6F6F6] opacity-60 hover:opacity-100'
                                }`}
                            >
                                <img src={img} alt={`Aperçu ${idx + 1}`} className="w-full h-full object-cover mix-blend-multiply" />
                            </button>
                        ))}
                    </div>
                )}
            </div>
            
            {/* Colonne de droite : Détails techniques */}
            <div className="lg:w-[45%] flex flex-col pt-4">
                {product.team && (
                    <div className="text-sm font-bold text-gray-400 uppercase tracking-[0.2em] mb-2">{product.team} {product.season ? `- ${product.season}` : ''}</div>
                )}
                <h1 className="text-4xl md:text-5xl font-poppins font-black text-brand-black mb-4 leading-tight tracking-tighter">{product.name}</h1>
                
                <div className="flex items-center gap-4 mb-8">
                    <p className="text-3xl text-brand-black font-black">{product.price.toLocaleString()} F</p>
                    {product.originalPrice && product.isPromo && (
                        <p className="text-xl text-gray-400 font-bold line-through">{product.originalPrice.toLocaleString()} F</p>
                    )}
                </div>
                
                <p className="text-gray-600 leading-relaxed mb-10 text-lg font-medium">{product.description || 'Maillot de qualité professionnelle conçu avec des matériaux respirants de pointe.'}</p>
                
                {/* Grille des tailles */}
                <div className="mb-8">
                    <div className="flex justify-between items-end mb-4">
                        <span className="block text-sm font-bold text-brand-black uppercase tracking-wider">Choix de la taille <span className="text-red-500">*</span></span>
                    </div>
                    
                    <div className="flex flex-wrap gap-3">
                        {sizes.map((size: string) => (
                            <button 
                                key={size}
                                onClick={() => setSelectedSize(size)}
                                className={`w-[72px] h-[60px] rounded-xl font-bold text-lg flex items-center justify-center transition-all ${
                                    selectedSize === size 
                                    ? 'bg-brand-black text-white shadow-lg scale-105 ring-2 ring-black ring-offset-2' 
                                    : 'bg-white border-2 border-gray-100 text-gray-600 hover:border-gray-900 hover:text-black'
                                }`}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Simulateur Flocage Sport Premium */}
                {product.hasFlockage && (
                    <div className={`mb-8 p-6 rounded-3xl border-2 transition-all duration-300 ${hasFlockage ? 'bg-brand-black text-white border-brand-black' : 'bg-gray-50 border-gray-100'}`}>
                        <label className="flex items-center justify-between cursor-pointer group">
                            <input 
                                type="checkbox" 
                                className="hidden" 
                                checked={hasFlockage} 
                                onChange={(e) => setHasFlockage(e.target.checked)} 
                            />
                            <div className="flex items-center gap-4">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-colors ${hasFlockage ? 'bg-brand-accent border-brand-accent' : 'border-gray-400 bg-transparent'}`}>
                                    {hasFlockage && <div className="w-2.5 h-2.5 bg-brand-black rounded-full" />}
                                </div>
                                <span className={`font-bold text-lg ${hasFlockage ? 'text-white' : 'text-gray-800'}`}>
                                    Ajouter un Flocage Officiel
                                </span>
                            </div>
                            <span className={`font-black ${hasFlockage ? 'text-brand-accent' : 'text-gray-500'}`}>+{FLOCKAGE_PRICE} F</span>
                        </label>
                        
                        {hasFlockage && (
                            <div className="mt-6 space-y-4 animate-slide-up">
                                <div className="relative">
                                    <input 
                                        type="text"
                                        placeholder="Ex: BELLINGHAM 5"
                                        value={flockageText}
                                        onChange={(e) => setFlockageText(e.target.value)}
                                        className="w-full bg-white/10 border border-white/20 text-white rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-brand-accent font-bold uppercase placeholder-gray-500"
                                        maxLength={16}
                                    />
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-500">
                                        {16 - flockageText.length}
                                    </div>
                                </div>
                                
                                {/* Aperçu Live */}
                                <div className="bg-gray-800 rounded-xl p-4 flex flex-col items-center justify-center border-t-4 border-brand-accent h-[120px]">
                                    <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Aperçu du dos</p>
                                    <p className="font-poppins font-black text-3xl md:text-4xl text-white uppercase tracking-wider text-center break-words max-w-full leading-none mt-2" style={{textShadow: '0px 2px 10px rgba(0,0,0,0.5)'}}>
                                        {flockageText || 'NOM Numéro'}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Quantité & Action d'Ajout */}
                <div className="flex flex-col sm:flex-row items-center gap-4 mt-auto mb-8">
                    <div className="flex items-center bg-white border-2 border-gray-200 p-1.5 rounded-2xl w-full sm:w-36 justify-between shrink-0">
                        <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-gray-500 hover:text-black hover:bg-gray-100 transition-colors text-xl">-</button>
                        <span className="font-bold text-xl select-none">{quantity}</span>
                        <button onClick={() => setQuantity(Math.min(10, quantity + 1))} className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-gray-500 hover:text-black hover:bg-gray-100 transition-colors text-xl">+</button>
                    </div>
                    
                    <button 
                        id="add-to-cart-btn"
                        onClick={addToCart}
                        disabled={isButtonDisabled}
                        className="flex-1 w-full flex items-center justify-center gap-3 bg-brand-accent hover:bg-green-400 text-brand-black px-6 py-5 rounded-2xl font-black text-lg shadow-xl shadow-brand-accent/20 transition-all disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none disabled:cursor-not-allowed active:scale-[0.98]"
                    >
                        {!product.inStock 
                            ? 'RUPTURE DE STOCK' 
                            : !selectedSize 
                            ? 'CHOISISSEZ UNE TAILLE'
                            : (
                                <>
                                    <ShoppingBag size={24} />
                                    AJOUTER AU PANIER
                                </>
                            )}
                    </button>
                </div>
                
                {/* Réassurance */}
                <div className="p-4 bg-gray-50 rounded-xl flex items-center gap-3 border border-gray-100">
                    <ShieldCheck className="text-brand-accent shrink-0" size={28} />
                    <div>
                        <p className="font-bold text-sm text-brand-black">Paiement 100% Sécurisé à la livraison</p>
                        <p className="text-xs text-gray-500 font-medium">Expédition sous 24h/48h. Retours acceptés sous 14 jours.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
