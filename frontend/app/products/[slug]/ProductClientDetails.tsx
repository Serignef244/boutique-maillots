'use client';
import { useState } from 'react';
import { dispatchCartUpdated, FLOCKAGE_PRICE } from '@/lib/cart';
import { ShieldCheck, Truck, RotateCcw, Minus, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProductClientDetails({ product }: { product: any }) {
    const defaultSizes = ["S", "M", "L", "XL", "XXL"];
    const sizes = Array.isArray(product.sizes) && product.sizes.length > 0 ? product.sizes : defaultSizes;
    
    const [selectedSize, setSelectedSize] = useState('');
    const [hasFlockage, setHasFlockage] = useState(false);
    const [flockageText, setFlockageText] = useState('');
    const [quantity, setQuantity] = useState(1);
    
    const images = Array.isArray(product.images) && product.images.length > 0 ? product.images : ['https://via.placeholder.com/1000/F5F5F5/000000?text=MAILLOT'];
    const [mainImage, setMainImage] = useState(images[0]);
    
    const isButtonDisabled = !selectedSize || (hasFlockage && flockageText.trim() === '') || !product.inStock;

    const addToCart = () => {
        if (!selectedSize) return;
        
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
        <div className="flex flex-col lg:flex-row gap-20 font-body pb-32 text-black min-h-screen bg-white">
            {/* Left: Image Gallery */}
            <div className="lg:w-[60%] flex flex-col gap-6">
                <div className="bg-brand-grey flex items-center justify-center p-8 md:p-12 relative overflow-hidden group">
                    <motion.img 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8 }}
                        src={mainImage} 
                        alt={product.name} 
                        className="max-w-full h-auto max-h-[800px] object-contain mix-blend-multiply transition-transform duration-700 ease-out" 
                    />
                    
                    {/* Badges */}
                    <div className="absolute top-8 left-8 flex flex-col gap-2">
                        {product.isNew && (
                            <span className="bg-black text-white text-[10px] font-display tracking-widest px-3 py-1 uppercase">
                                NOUVEAUTÉ
                            </span>
                        )}
                        {product.isPromo && (
                            <span className="bg-white text-black border border-black text-[10px] font-display tracking-widest px-3 py-1 uppercase">
                                OFFRE SPÉCIALE
                            </span>
                        )}
                    </div>
                </div>
                
                {images.length > 1 && (
                    <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
                        {images.map((img: string, idx: number) => (
                            <button 
                                key={idx} 
                                onClick={() => setMainImage(img)}
                                className={`w-32 h-32 flex-shrink-0 transition-all border border-gray-100 bg-brand-grey p-2 ${
                                    mainImage === img ? 'border-black' : 'opacity-60 hover:opacity-100'
                                }`}
                            >
                                <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-contain mix-blend-multiply" />
                            </button>
                        ))}
                    </div>
                )}
            </div>
            
            {/* Right: Product Info Sidebar */}
            <div className="lg:w-[40%] flex flex-col sticky top-32 h-fit">
                {product.team && (
                    <div className="text-xs font-display text-gray-400 uppercase tracking-[0.4em] mb-4">
                        {product.team} — {product.season || 'Collection Officielle'}
                    </div>
                )}
                
                <h1 className="text-6xl md:text-8xl font-display font-black text-black mb-8 leading-[0.8] tracking-tighter uppercase whitespace-pre-line">
                    {product.name}
                </h1>
                
                <div className="flex items-baseline gap-6 mb-12">
                    <p className="text-5xl font-display text-black tracking-tighter">
                        {product.price.toLocaleString()} FCFA
                    </p>
                    {product.originalPrice && product.isPromo && (
                        <p className="text-xl text-gray-300 font-body line-through decoration-black/20">
                            {product.originalPrice.toLocaleString()} FCFA
                        </p>
                    )}
                </div>
                
                <p className="text-gray-500 leading-relaxed mb-12 text-lg font-body uppercase tracking-wider max-w-lg">
                    {product.description || 'Conçu pour une performance athlétique supérieure. Tissu technique léger et respirant pour un confort optimal en mouvement.'}
                </p>
                
                {/* Size Selector */}
                <div className="mb-12">
                    <div className="flex justify-between items-center mb-6">
                        <span className="text-sm font-display text-black uppercase tracking-[0.2em] font-bold">CHOISIR LA TAILLE</span>
                        <button className="text-[10px] font-display text-gray-400 underline tracking-widest uppercase">GUIDE DES TAILLES</button>
                    </div>
                    
                    <div className="grid grid-cols-5 gap-3">
                        {sizes.map((size: string) => (
                            <button 
                                key={size}
                                onClick={() => setSelectedSize(size)}
                                className={`h-16 font-display text-xl tracking-widest flex items-center justify-center transition-all border ${
                                    selectedSize === size 
                                    ? 'bg-black text-white border-black' 
                                    : 'bg-white border-gray-100 text-black hover:border-black'
                                }`}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Flockage Customization */}
                {product.hasFlockage && (
                    <div className="mb-12 border-t border-gray-100 pt-10">
                        <label className="flex items-center justify-between cursor-pointer group mb-6">
                            <input 
                                type="checkbox" 
                                className="hidden" 
                                checked={hasFlockage} 
                                onChange={(e) => setHasFlockage(e.target.checked)} 
                            />
                            <div className="flex items-center gap-4">
                                <div className={`w-5 h-5 flex items-center justify-center border transition-colors ${hasFlockage ? 'bg-black border-black' : 'border-gray-200 group-hover:border-black'}`}>
                                    {hasFlockage && <div className="w-2 h-2 bg-white" />}
                                </div>
                                <span className="font-display text-lg tracking-widest uppercase font-bold">
                                    PERSONNALISATION
                                </span>
                            </div>
                            <span className="font-display text-lg tracking-widest">+{FLOCKAGE_PRICE} FCFA</span>
                        </label>
                        
                        <AnimatePresence>
                            {hasFlockage && (
                                <motion.div 
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="space-y-6"
                                >
                                    <input 
                                        type="text"
                                        placeholder="NOM & NUMÉRO (EX: DIOP 10)"
                                        value={flockageText}
                                        onChange={(e) => setFlockageText(e.target.value)}
                                        className="w-full bg-brand-grey border-0 text-black px-6 py-5 focus:ring-1 focus:ring-black font-body uppercase text-lg tracking-widest placeholder-gray-400"
                                        maxLength={16}
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                )}

                {/* Counter & Add to Cart */}
                <div className="flex gap-4 mb-12">
                    <div className="flex items-center border border-gray-100 h-20">
                        <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-16 h-full flex items-center justify-center hover:bg-gray-50 transition-colors"><Minus size={20} /></button>
                        <span className="w-12 text-center font-display text-2xl">{quantity}</span>
                        <button onClick={() => setQuantity(Math.min(10, quantity + 1))} className="w-16 h-full flex items-center justify-center hover:bg-gray-50 transition-colors"><Plus size={20} /></button>
                    </div>
                    
                    <button 
                        className={`flex-1 h-20 font-display text-2xl tracking-[0.2em] transition-all uppercase ${
                            isButtonDisabled 
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                            : 'bg-black text-white hover:opacity-80'
                        }`}
                        onClick={addToCart}
                        disabled={isButtonDisabled}
                    >
                        {!product.inStock 
                            ? 'STOCKS ÉPUISÉS' 
                            : !selectedSize 
                            ? 'CHOISIR UNE TAILLE'
                            : 'AJOUTER AU PANIER'
                        }
                    </button>
                </div>
                
                {/* Reassurance Sidebar */}
                <div className="grid grid-cols-1 gap-6 pt-10 border-t border-gray-100">
                    <div className="flex items-center gap-4">
                        <Truck size={24} strokeWidth={1} />
                        <span className="text-[10px] font-display text-gray-400 uppercase tracking-widest">LIVRAISON EN 48H PARTOUT AU SÉNÉGAL</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <RotateCcw size={24} strokeWidth={1} />
                        <span className="text-[10px] font-display text-gray-400 uppercase tracking-widest">RETOURS GRATUITS SOUS 14 JOURS</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
