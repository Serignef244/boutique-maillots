'use client';
import { useState } from 'react';
import { dispatchCartUpdated, FLOCKAGE_PRICE } from '@/lib/cart';

export default function ProductClientDetails({ product }: { product: any }) {
    const defaultSizes = ["S", "M", "L", "XL", "XXL"];
    const sizes = Array.isArray(product.sizes) && product.sizes.length > 0 ? product.sizes : defaultSizes;
    
    // Le choix de la taille est vide par défaut (ce qui forcera sa sélection)
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
        
        // Calcul du prix final incluant le flocage additionnel (uniquement appliqué pour ce item)
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
        dispatchCartUpdated(); // Evénement propulsé pour Header
        alert('🛒 Produit ajouté au panier avec succès !');
    };

    return (
        <div className="flex flex-col lg:flex-row gap-10">
            {/* Colonne de gauche : Galerie des images */}
            <div className="lg:w-1/2 flex flex-col gap-4">
                <div className="bg-gray-50 flex items-center justify-center p-8 rounded-3xl min-h-[400px] border border-gray-100 relative">
                    <img src={mainImage} alt={product.name} className="max-w-full max-h-[500px] object-contain drop-shadow-xl transition-all duration-300" />
                </div>
                {images.length > 1 && (
                    <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
                        {images.map((img: string, idx: number) => (
                            <button 
                                key={idx} 
                                onClick={() => setMainImage(img)}
                                className={`w-20 h-20 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                                    mainImage === img ? 'border-blue-600 opacity-100 ring-2 ring-blue-600 ring-offset-1' : 'border-transparent opacity-60 hover:opacity-100'
                                }`}
                            >
                                <img src={img} alt={`Aperçu ${idx + 1}`} className="w-full h-full object-cover" />
                            </button>
                        ))}
                    </div>
                )}
            </div>
            
            {/* Colonne de droite : Détails techniques */}
            <div className="lg:w-1/2 flex flex-col">
                <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">{product.name}</h1>
                <p className="text-2xl text-blue-600 font-black mb-6">{product.price.toLocaleString()} FCFA</p>
                <p className="text-gray-600 leading-relaxed mb-8 text-lg">{product.description || 'Description non disponible pour le moment.'}</p>
                
                {/* Grille des tailles */}
                <div className="mb-6">
                    <span className="block text-sm font-bold text-gray-700 uppercase tracking-wider mb-3">Taille requise *</span>
                    <div className="flex flex-wrap gap-3">
                        {sizes.map((size: string) => (
                            <button 
                                key={size}
                                onClick={() => setSelectedSize(size)}
                                className={`w-14 h-12 rounded-lg font-bold flex items-center justify-center transition-all ${
                                    selectedSize === size 
                                    ? 'bg-black text-white shadow-md ring-2 ring-black ring-offset-2' 
                                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                }`}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Option Flocage Dynamique */}
                {product.hasFlockage && (
                    <div className="mb-6 p-5 bg-gray-50 rounded-xl border border-gray-100 transition-all">
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <input 
                                type="checkbox" 
                                checked={hasFlockage} 
                                onChange={(e) => setHasFlockage(e.target.checked)}
                                className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                            />
                            <span className="font-bold text-gray-800 group-hover:text-black">
                                Ajouter un flocage (+{FLOCKAGE_PRICE} FCFA)
                            </span>
                        </label>
                        
                        {hasFlockage && (
                            <div className="mt-4">
                                <input 
                                    type="text"
                                    placeholder="Nom et numéro (ex: VINICIUS 7)"
                                    value={flockageText}
                                    onChange={(e) => setFlockageText(e.target.value)}
                                    className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold font-sans uppercase placeholder-gray-400 text-gray-900"
                                    maxLength={20}
                                />
                                {flockageText.trim() === '' && <p className="text-red-500 text-xs mt-2 font-bold animate-pulse">Veuillez renseigner un texte pour le flocage.</p>}
                            </div>
                        )}
                    </div>
                )}

                {/* Quantité & Action d'Ajout */}
                <div className="flex items-center gap-4 mt-auto pt-4">
                    <div className="flex items-center bg-gray-100 p-1 rounded-xl w-32 justify-between border border-gray-200">
                        <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 rounded-lg bg-white flex items-center justify-center font-bold text-gray-700 hover:text-black shadow-sm">-</button>
                        <span className="font-bold text-lg select-none">{quantity}</span>
                        <button onClick={() => setQuantity(Math.min(10, quantity + 1))} className="w-10 h-10 rounded-lg bg-white flex items-center justify-center font-bold text-gray-700 hover:text-black shadow-sm">+</button>
                    </div>
                    
                    <button 
                        onClick={addToCart}
                        disabled={isButtonDisabled}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-xl font-bold text-lg shadow-lg shadow-blue-600/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                    >
                        {!product.inStock 
                            ? 'Rupture de stock' 
                            : !selectedSize 
                            ? 'Sélectionnez une taille'
                            : 'Ajouter au panier'}
                    </button>
                </div>
            </div>
        </div>
    );
}
