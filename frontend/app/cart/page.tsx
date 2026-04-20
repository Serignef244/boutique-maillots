'use client';
import { useState, useEffect } from 'react';
import { createOrder } from '@/lib/api';
import { dispatchCartUpdated, FLOCKAGE_PRICE } from '@/lib/cart';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedCounter from '@/components/ui/AnimatedCounter';
import NeonButton from '@/components/ui/NeonButton';

export default function CartPage() {
    const router = useRouter();
    const [cart, setCart] = useState<any[]>([]);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        const storedCart = JSON.parse(localStorage.getItem('cart') || '[]');
        setCart(storedCart);
    }, []);

    const updateQuantity = (index: number, newQty: number) => {
        if (newQty < 1 || newQty > 10) return;
        const newCart = [...cart];
        newCart[index].quantity = newQty;
        setCart(newCart);
        localStorage.setItem('cart', JSON.stringify(newCart));
        dispatchCartUpdated(); 
    };

    const removeItem = (index: number) => {
        const newCart = [...cart];
        newCart.splice(index, 1);
        setCart(newCart);
        localStorage.setItem('cart', JSON.stringify(newCart));
        dispatchCartUpdated();
    };

    const subtotal = cart.reduce((acc, item) => acc + (item.basePrice * item.quantity), 0);
    const totalFlockage = cart.reduce((acc, item) => item.hasFlockage ? acc + (FLOCKAGE_PRICE * item.quantity) : acc, 0);
    const total = subtotal + totalFlockage;

    const submitOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const phoneClean = phone.replace(/\s+/g, '');
        if (phoneClean.length < 8) {
            alert('Le numéro de téléphone doit contenir au moins 8 chiffres pour être valide.');
            return;
        }

        setLoading(true);

        const orderData = {
            customerName: name,
            customerPhone: phoneClean,
            customerEmail: email,
            items: cart.map(item => ({
                productId: item.id,
                quantity: item.quantity,
                size: item.size,
                hasFlockage: item.hasFlockage,
                flockageText: item.flockageText
            }))
        };

        const res = await createOrder(orderData);
        setLoading(false);

        if (res?.success) {
            setCart([]);
            localStorage.removeItem('cart');
            dispatchCartUpdated(); 
            
            let message = `🛒 *NOUVELLE COMMANDE* (N° ${res.orderNumber || 'WEB'})\n\n`;
            message += `👤 *Client:* ${name}\n`;
            message += `📞 *Téléphone:* ${phoneClean}\n\n`;
            message += `*DÉTAILS DES MAILLOTS:*\n`;
            
            cart.forEach((item, idx) => {
                message += `${idx + 1}. *${item.name}*\n`;
                message += `   - Quantité: ${item.quantity}\n`;
                message += `   - Taille: ${item.size}\n`;
                if (item.hasFlockage) {
                    message += `   - Flocage: ${item.flockageText}\n`;
                }
                message += `   - Sous-total: ${(item.price * item.quantity).toLocaleString()} F\n\n`;
            });
            
            message += `💰 *TOTAL À PAYER: ${total.toLocaleString()} FCFA*\n`;
            message += `_Commande scellée depuis la boutique Vercel._`;

            const encodedMessage = encodeURIComponent(message);
            window.location.href = `https://wa.me/221771384729?text=${encodedMessage}`;
        } else {
            alert(res?.error || "Erreur majeure lors de la création de la commande.");
        }
    };

    if (!isMounted) return null;

    return (
        <div className="max-w-7xl mx-auto py-16 px-4 font-body min-h-[80vh] text-white">
            <h1 className="text-5xl md:text-7xl font-display font-black mb-16 text-white tracking-widest uppercase">
                <span className="text-pitch">VOTRE</span> PANIER
            </h1>
            
            {cart.length === 0 ? (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-32 bg-jersey rounded-none border-2 border-white/10 flex flex-col items-center"
                >
                    <div className="w-24 h-24 bg-dark flex items-center justify-center rounded-full mb-6 border border-white/20">
                        <svg className="w-10 h-10 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                    </div>
                    <p className="text-3xl font-display text-gray-500 mb-8 uppercase tracking-[0.2em]">Votre chariot est vide</p>
                    <Link href="/explorer">
                        <NeonButton>DÉCOUVRIR LE CATALOGUE</NeonButton>
                    </Link>
                </motion.div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2 space-y-6">
                        <AnimatePresence>
                            {cart.map((item, index) => (
                                <motion.div 
                                    key={`${item.id}-${item.size}-${index}`}
                                    layout
                                    initial={{ opacity: 0, x: -50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 50, scale: 0.9 }}
                                    transition={{ duration: 0.3 }}
                                    className="flex flex-col sm:flex-row bg-jersey p-6 shadow-2xl border border-white/5 gap-6 relative group"
                                >
                                    <div className="w-full sm:w-40 h-48 bg-dark/50 flex-shrink-0 flex items-center justify-center p-4 border border-white/5">
                                        <img src={item.image || 'https://via.placeholder.com/150'} alt={item.name} className="max-w-full max-h-full object-contain filter drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]" />
                                    </div>
                                    <div className="flex-1 flex flex-col justify-center">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-display font-black text-3xl text-white leading-none pr-4">{item.name}</h3>
                                            <button onClick={() => removeItem(index)} className="text-gray-500 hover:text-red-500 p-2 hover:bg-red-500/10 transition" title="Supprimer">
                                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                            </button>
                                        </div>
                                        <div className="flex gap-4 items-center mb-4">
                                            <span className="text-sm font-display uppercase tracking-widest bg-white/10 text-white px-3 py-1">TAILLE: {item.size}</span>
                                        </div>
                                        {item.hasFlockage && (
                                            <p className="text-sm font-display uppercase tracking-widest bg-dark border border-white/10 text-white px-4 py-2 inline-flex flex-wrap gap-2 w-fit mb-4">
                                                <span className="text-gray-400">FLOCAGE:</span>
                                                <span className="text-pitch">{item.flockageText}</span>
                                                <span className="text-pitch/50 ml-1">+{FLOCKAGE_PRICE}F</span>
                                            </p>
                                        )}
                                        <div className="flex justify-between items-end mt-auto pt-4 border-t border-white/10">
                                            <div className="flex items-center bg-dark p-1 border border-white/10">
                                                <button onClick={() => updateQuantity(index, item.quantity - 1)} className="w-10 h-10 flex items-center justify-center font-display text-2xl text-gray-500 hover:text-white bg-jersey transition">-</button>
                                                <span className="w-12 text-center font-display text-2xl">{item.quantity}</span>
                                                <button onClick={() => updateQuantity(index, item.quantity + 1)} className="w-10 h-10 flex items-center justify-center font-display text-2xl text-gray-500 hover:text-white bg-jersey transition">+</button>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-display text-gold text-3xl tracking-widest"><AnimatedCounter value={item.price * item.quantity} /> F</p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                    
                    <div className="bg-jersey border border-white/10 text-white p-8 h-fit sticky top-28 shadow-2xl">
                        <h2 className="text-3xl font-display mb-8 border-b border-white/10 pb-6 uppercase tracking-widest">RÉSUMÉ</h2>
                        
                        <div className="space-y-4 mb-8 pb-8 border-b border-white/10 font-body text-xl tracking-widest uppercase">
                            <div className="flex justify-between">
                                <span className="text-gray-400">MAILLOTS</span>
                                <span><AnimatedCounter value={subtotal} /> F</span>
                            </div>
                            {totalFlockage > 0 && (
                                <div className="flex justify-between text-pitch">
                                    <span>FLOCAGE</span>
                                    <span>+<AnimatedCounter value={totalFlockage} /> F</span>
                                </div>
                            )}
                            <div className="flex justify-between">
                                <span className="text-gray-400">LIVRAISON</span>
                                <span className="text-pitch font-bold">OFFERTE</span>
                            </div>
                        </div>

                        <div className="flex justify-between items-center mb-10">
                            <span className="font-display text-gray-400 text-2xl uppercase tracking-widest">TOTAL</span>
                            <span className="font-display text-5xl text-pitch leading-none drop-shadow-[0_0_10px_rgba(0,255,135,0.4)]">
                                <AnimatedCounter value={total} /> F
                            </span>
                        </div>

                        <form onSubmit={submitOrder} className="space-y-6">
                            <div>
                                <label className="block text-sm font-display text-gray-400 uppercase tracking-widest mb-2">NOM COMPLET *</label>
                                <input required type="text" value={name} onChange={e => setName(e.target.value)} className="w-full px-5 py-4 border-2 border-white/10 bg-dark text-white focus:outline-none focus:border-pitch font-body placeholder-gray-600 transition-colors" placeholder="EX: SALIOU DIALLO" />
                            </div>
                            <div>
                                <label className="block text-sm font-display text-gray-400 uppercase tracking-widest mb-2">WHATSAPP *</label>
                                <input required type="tel" minLength={8} value={phone} onChange={e => setPhone(e.target.value)} className="w-full px-5 py-4 border-2 border-white/10 bg-dark text-white focus:outline-none focus:border-pitch font-body placeholder-gray-600 transition-colors" placeholder="+221 ..." />
                            </div>
                            <div>
                                <label className="block text-sm font-display text-gray-400 uppercase tracking-widest mb-2">EMAIL (OPTIONNEL)</label>
                                <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-5 py-4 border-2 border-white/10 bg-dark text-white focus:outline-none focus:border-pitch font-body placeholder-gray-600 transition-colors" placeholder="CONTACT@..." />
                            </div>
                            
                            <div className="pt-6">
                                <NeonButton 
                                    className="w-full"
                                    type="submit" 
                                    disabled={loading}
                                >
                                    {loading ? 'VALIDATION...' : 'COMMANDER SUR WHATSAPP'}
                                </NeonButton>
                                <p className="text-center text-xs text-gray-500 font-display tracking-widest uppercase mt-4">PAIEMENT SÉCURISÉ À LA LIVRAISON</p>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
