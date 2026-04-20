'use client';
import { useState, useEffect } from 'react';
import { createOrder } from '@/lib/api';
import { dispatchCartUpdated, FLOCKAGE_PRICE } from '@/lib/cart';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';

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
        if (phoneClean.length < 8) return;

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
                if (item.hasFlockage) message += `   - Flocage: ${item.flockageText}\n`;
                message += `   - S/Total: ${(item.price * item.quantity).toLocaleString()} F\n\n`;
            });
            message += `💰 *TOTAL: ${total.toLocaleString()} FCFA*\n`;
            const encodedMessage = encodeURIComponent(message);
            window.location.href = `https://wa.me/221771384729?text=${encodedMessage}`;
        }
    };

    if (!isMounted) return null;

    return (
        <div className="max-w-7xl mx-auto py-24 px-4 font-body min-h-[80vh] text-black bg-white">
            <h1 className="text-6xl md:text-[8rem] font-display font-black mb-16 text-black tracking-tighter uppercase leading-none">
                PANIER
            </h1>
            
            {cart.length === 0 ? (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-32 bg-brand-grey flex flex-col items-center gap-8"
                >
                    <ShoppingBag size={64} strokeWidth={1} className="text-gray-300" />
                    <p className="text-3xl font-display text-gray-400 uppercase tracking-widest">Votre panier est vide</p>
                    <Link href="/explorer" className="bg-black text-white px-12 py-5 font-display text-xl tracking-[0.2em] hover:opacity-80 transition-opacity">
                        COMMENCER VOS ACHATS
                    </Link>
                </motion.div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-20">
                    {/* Items List */}
                    <div className="lg:col-span-2 space-y-12">
                        <AnimatePresence>
                            {cart.map((item, index) => (
                                <motion.div 
                                    key={`${item.id}-${item.size}-${index}`}
                                    layout
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex flex-col sm:flex-row pb-12 border-b border-gray-100 gap-8 relative items-center sm:items-start"
                                >
                                    <div className="w-48 h-60 bg-brand-grey flex-shrink-0 flex items-center justify-center p-6">
                                        <img src={item.image || 'https://via.placeholder.com/200/F5F5F5/000?text=IMG'} alt={item.name} className="max-w-full max-h-full object-contain mix-blend-multiply" />
                                    </div>
                                    <div className="flex-1 flex flex-col pt-2 w-full">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="font-display font-black text-3xl text-black leading-none uppercase tracking-wider">{item.name}</h3>
                                                <p className="text-xs font-display text-gray-400 mt-2 tracking-[0.3em] uppercase">Taille: {item.size}</p>
                                            </div>
                                            <button onClick={() => removeItem(index)} className="text-gray-300 hover:text-black transition-colors">
                                                <Trash2 size={24} strokeWidth={1.5} />
                                            </button>
                                        </div>
                                        
                                        {item.hasFlockage && (
                                            <p className="text-xs font-display uppercase tracking-widest bg-gray-50 text-black px-4 py-3 w-fit mb-6">
                                                Personnalisation: <span className="font-bold">{item.flockageText}</span>
                                            </p>
                                        )}

                                        <div className="flex justify-between items-center mt-auto">
                                            <div className="flex items-center border border-gray-100 p-1">
                                                <button onClick={() => updateQuantity(index, item.quantity - 1)} className="w-10 h-10 flex items-center justify-center hover:bg-gray-50"><Minus size={16}/></button>
                                                <span className="w-10 text-center font-display text-xl">{item.quantity}</span>
                                                <button onClick={() => updateQuantity(index, item.quantity + 1)} className="w-10 h-10 flex items-center justify-center hover:bg-gray-50"><Plus size={16}/></button>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-display text-2xl tracking-tighter">{(item.price * item.quantity).toLocaleString()} F</p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                    
                    {/* Summary Sidebar */}
                    <div className="bg-white border border-gray-100 p-10 h-fit sticky top-32 shadow-sm">
                        <h2 className="text-3xl font-display mb-10 border-b border-gray-50 pb-6 uppercase tracking-widest">RÉSUMÉ</h2>
                        
                        <div className="space-y-6 mb-10 pb-10 border-b border-gray-50 font-body text-base tracking-widest uppercase">
                            <div className="flex justify-between text-gray-400">
                                <span>SOUS-TOTAL</span>
                                <span className="text-black">{subtotal.toLocaleString()} F</span>
                            </div>
                            {totalFlockage > 0 && (
                                <div className="flex justify-between text-gray-400">
                                    <span>PERSONNALISATION</span>
                                    <span className="text-black">+{totalFlockage.toLocaleString()} F</span>
                                </div>
                            )}
                            <div className="flex justify-between text-gray-400">
                                <span>LIVRAISON</span>
                                <span className="text-black font-bold">OFFERTE</span>
                            </div>
                        </div>

                        <div className="flex justify-between items-center mb-12">
                            <span className="font-display text-gray-400 text-xl uppercase tracking-widest">TOTAL</span>
                            <span className="font-display text-5xl text-black tracking-tighter">
                                {total.toLocaleString()} F
                            </span>
                        </div>

                        <form onSubmit={submitOrder} className="space-y-8">
                            <div className="space-y-1">
                                <label className="block text-[10px] font-display text-gray-400 uppercase tracking-[0.3em] font-bold">NOM COMPLET</label>
                                <input required type="text" value={name} onChange={e => setName(e.target.value)} className="w-full px-0 py-4 border-b border-gray-100 bg-white text-black focus:outline-none focus:border-black font-body placeholder:text-gray-200 transition-colors uppercase tracking-widest" placeholder="EX: SALIOU DIALLO" />
                            </div>
                            <div className="space-y-1">
                                <label className="block text-[10px] font-display text-gray-400 uppercase tracking-[0.3em] font-bold">WHATSAPP</label>
                                <input required type="tel" minLength={8} value={phone} onChange={e => setPhone(e.target.value)} className="w-full px-0 py-4 border-b border-gray-100 bg-white text-black focus:outline-none focus:border-black font-body placeholder:text-gray-200 transition-colors tracking-widest" placeholder="+221 ..." />
                            </div>
                            
                            <div className="pt-8">
                                <button 
                                    className={`w-full py-6 font-display text-xl tracking-[0.2em] transition-all uppercase ${loading ? 'bg-gray-100 text-gray-400' : 'bg-black text-white hover:opacity-80'}`}
                                    type="submit" 
                                    disabled={loading}
                                >
                                    {loading ? 'ANALYSANT...' : 'VALIDER LA COMMANDE'}
                                </button>
                                <p className="text-center text-[10px] text-gray-300 font-display tracking-widest uppercase mt-6">PAIEMENT SÉCURISÉ À LA RÉCEPTION</p>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
