'use client';
import { useState } from 'react';
import { dispatchCartUpdated, FLOCKAGE_PRICE } from '@/lib/cart';
import { ShieldCheck } from 'lucide-react';
import NeonButton from '@/components/ui/NeonButton';
import AnimatedCounter from '@/components/ui/AnimatedCounter';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProductClientDetails({ product }: { product: any }) {
    const defaultSizes = ["S", "M", "L", "XL", "XXL"];
    const sizes = Array.isArray(product.sizes) && product.sizes.length > 0 ? product.sizes : defaultSizes;
    
    const [selectedSize, setSelectedSize] = useState('');
    const [hasFlockage, setHasFlockage] = useState(false);
    const [flockageText, setFlockageText] = useState('');
    const [quantity, setQuantity] = useState(1);
    
    // Pour la galerie d'images
    const images = Array.isArray(product.images) && product.images.length > 0 ? product.images : ['https://via.placeholder.com/600/111111/00ff87?text=APER%C3%87U'];
    const [mainImage, setMainImage] = useState(images[0]);
    
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
    };

    return (
        <div className="flex flex-col lg:flex-row gap-12 font-body pb-20 text-white min-h-[80vh]">
            {/* Colonne de gauche : Galerie des images */}
            <div className="lg:w-[55%] flex flex-col gap-4">
                <div className="bg-jersey flex items-center justify-center p-8 rounded-none min-h-[500px] border border-white/5 relative overflow-hidden group shadow-[0_0_30px_rgba(0,0,0,0.8)]">
                    <img src={mainImage} alt={product.name} className="max-w-full h-auto max-h-[600px] object-contain drop-shadow-[0_20px_20px_rgba(0,0,0,0.9)] group-hover:scale-105 transition-transform duration-700 ease-out" />
                    
                    {/* Badges Fiche Produit */}
                    <div className="absolute top-6 left-6 flex flex-col gap-2">
                        {product.isNew && (
                            <span className="bg-pitch text-dark text-lg font-display tracking-widest px-4 py-1 shadow-[0_0_15px_rgba(0,255,135,0.4)]">
                                NOUVEAU
                            </span>
                        )}
                        {product.isPromo && (
                            <span className="bg-red-600 text-white text-lg font-display tracking-widest px-4 py-1 shadow-[0_0_15px_rgba(220,38,38,0.5)] animate-[flicker_3s_infinite]">
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
                                className={`w-28 h-28 rounded-none overflow-hidden flex-shrink-0 transition-all border ${
                                    mainImage === img ? 'border-pitch opacity-100 shadow-[0_0_10px_rgba(0,255,135,0.3)]' : 'border-white/10 bg-jersey opacity-50 hover:opacity-100 block'
                                }`}
                            >
                                <img src={img} alt={`Aperçu ${idx + 1}`} className="w-full h-full object-contain filter drop-shadow-md" />
                            </button>
                        ))}
                    </div>
                )}
            </div>
            
            {/* Colonne de droite : Détails techniques */}
            <div className="lg:w-[45%] flex flex-col pt-4">
                {product.team && (
                    <div className="text-xl font-body text-pitch uppercase tracking-[0.3em] mb-2">{product.team} {product.season ? `- ${product.season}` : ''}</div>
                )}
                <h1 className="text-5xl md:text-7xl font-display font-black text-white mb-6 leading-none tracking-widest uppercase">{product.name}</h1>
                
                <div className="flex items-end gap-6 mb-8">
                    <p className="text-5xl text-gold font-display tracking-widest"><AnimatedCounter value={product.price} /> F</p>
                    {product.originalPrice && product.isPromo && (
                        <p className="text-2xl text-gray-500 font-body line-through mb-1.5">{product.originalPrice.toLocaleString()} F</p>
                    )}
                </div>
                
                <p className="text-gray-400 leading-relaxed mb-10 text-xl font-body uppercase tracking-wider">{product.description || 'Maillot de qualité professionnelle conçu avec des matériaux respirants de pointe.'}</p>
                
                {/* Grille des tailles */}
                <div className="mb-10">
                    <div className="flex justify-between items-end mb-4">
                        <span className="block text-lg font-display text-white uppercase tracking-widest">SÉLECTIONNEZ LA TAILLE <span className="text-pitch">*</span></span>
                    </div>
                    
                    <div className="flex flex-wrap gap-4">
                        {sizes.map((size: string) => (
                            <button 
                                key={size}
                                onClick={() => setSelectedSize(size)}
                                className={`w-[80px] h-[60px] font-display text-2xl tracking-widest flex items-center justify-center transition-all border ${
                                    selectedSize === size 
                                    ? 'bg-pitch text-dark border-pitch shadow-[0_0_15px_rgba(0,255,135,0.4)]' 
                                    : 'bg-dark border-white/20 text-white hover:border-white hover:bg-white/5'
                                }`}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Simulateur Flocage Sport Premium */}
                {product.hasFlockage && (
                    <div className={`mb-10 p-6 border-2 transition-all duration-300 ${hasFlockage ? 'bg-black/50 border-pitch shadow-[0_0_15px_rgba(0,255,135,0.1)]' : 'bg-jersey border-white/10'}`}>
                        <label className="flex items-center justify-between cursor-pointer group">
                            <input 
                                type="checkbox" 
                                className="hidden" 
                                checked={hasFlockage} 
                                onChange={(e) => setHasFlockage(e.target.checked)} 
                            />
                            <div className="flex items-center gap-4">
                                <div className={`w-8 h-8 flex items-center justify-center border-2 transition-colors ${hasFlockage ? 'bg-pitch border-pitch' : 'border-white/50 bg-transparent group-hover:border-white'}`}>
                                    {hasFlockage && <div className="w-3 h-3 bg-dark" />}
                                </div>
                                <span className={`font-display text-2xl tracking-widest uppercase ${hasFlockage ? 'text-white' : 'text-gray-400 group-hover:text-white'}`}>
                                    AJOUTER UN FLOCAGE
                                </span>
                            </div>
                            <span className={`font-display text-2xl tracking-widest ${hasFlockage ? 'text-pitch' : 'text-gray-500'}`}>+{FLOCKAGE_PRICE} F</span>
                        </label>
                        
                        <AnimatePresence>
                            {hasFlockage && (
                                <motion.div 
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="mt-6 space-y-4 overflow-hidden"
                                >
                                    <div className="relative">
                                        <input 
                                            type="text"
                                            placeholder="EX: BELLINGHAM 5"
                                            value={flockageText}
                                            onChange={(e) => setFlockageText(e.target.value)}
                                            className="w-full bg-dark border border-white/20 text-white px-5 py-4 focus:outline-none focus:border-pitch font-body uppercase text-xl placeholder-gray-600 transition-colors"
                                            maxLength={16}
                                        />
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-display text-gray-500">
                                            {16 - flockageText.length}
                                        </div>
                                    </div>
                                    
                                    {/* Aperçu Live */}
                                    <div className="bg-dark/80 p-6 flex flex-col items-center justify-center border-t-2 border-pitch h-[140px] shadow-inner relative overflow-hidden">
                                        <p className="absolute top-2 left-2 text-pitch/50 text-xs font-display uppercase tracking-widest">APERÇU</p>
                                        <p className="font-display text-5xl md:text-6xl text-white uppercase tracking-widest text-center break-words max-w-full leading-none mt-4 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                                            {flockageText || 'NOM NUMÉRO'}
                                        </p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                )}

                {/* Quantité & Action d'Ajout */}
                <div className="flex flex-col sm:flex-row items-center gap-6 mt-auto mb-10 w-full">
                    <div className="flex items-center bg-dark border border-white/20 p-1 w-full sm:w-40 justify-between shrink-0 h-[68px]">
                        <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-14 h-full flex items-center justify-center font-display text-3xl text-gray-500 hover:text-white bg-jersey transition-colors">-</button>
                        <span className="font-display text-3xl select-none">{quantity}</span>
                        <button onClick={() => setQuantity(Math.min(10, quantity + 1))} className="w-14 h-full flex items-center justify-center font-display text-3xl text-gray-500 hover:text-white bg-jersey transition-colors">+</button>
                    </div>
                    
                    <div className="flex-1 w-full h-[68px]" id="cart-btn-container">
                        <NeonButton 
                            className="w-full h-full text-2xl"
                            onClick={addToCart}
                            disabled={isButtonDisabled}
                        >
                            {!product.inStock 
                                ? 'SOLD OUT' 
                                : !selectedSize 
                                ? 'SÉLECTIONNER TAILLE'
                                : 'AJOUTER AU PANIER'
                            }
                        </NeonButton>
                    </div>
                </div>
                
                {/* Réassurance */}
                <div className="p-6 bg-jersey flex items-center gap-4 border border-white/5">
                    <ShieldCheck className="text-pitch shrink-0" size={32} />
                    <div>
                        <p className="font-display text-xl tracking-widest text-white uppercase">PAIEMENT SÉCURISÉ</p>
                        <p className="text-sm text-gray-400 font-body uppercase tracking-wider mt-1">LIVRAISON 24H/48H. RETOURS SOUS 14 JOURS.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
