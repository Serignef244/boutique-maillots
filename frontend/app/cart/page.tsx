'use client';
import { useState, useEffect } from 'react';
import { createOrder } from '@/lib/api';
import { dispatchCartUpdated, FLOCKAGE_PRICE } from '@/lib/cart';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CartPage() {
    const router = useRouter();
    const [cart, setCart] = useState<any[]>([]);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
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

    return (
        <div className="max-w-6xl mx-auto font-inter">
            <h1 className="text-4xl md:text-5xl font-poppins font-black mb-10 text-brand-black tracking-tighter uppercase">Votre Panier</h1>
            
            {cart.length === 0 ? (
                <div className="text-center py-32 bg-white rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center">
                    <div className="w-24 h-24 bg-gray-50 flex items-center justify-center rounded-full mb-6">
                        <svg className="w-10 h-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                    </div>
                    <p className="text-xl font-bold text-gray-400 mb-8 uppercase tracking-widest">Votre chariot est vide</p>
                    <Link href="/explorer" className="bg-brand-black hover:bg-gray-800 text-white px-10 py-5 rounded-xl font-black transition text-lg shadow-xl uppercase tracking-widest">
                        Découvrir nos maillots
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2 space-y-6">
                        {cart.map((item, index) => (
                            <div key={index} className="flex flex-col sm:flex-row bg-white p-6 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 gap-6 relative group">
                                <div className="w-full sm:w-36 h-36 bg-[#F6F6F6] rounded-2xl flex-shrink-0 flex items-center justify-center p-2 group-hover:scale-95 transition-transform">
                                    <img src={item.image || 'https://via.placeholder.com/150'} alt={item.name} className="max-w-full max-h-full object-contain mix-blend-multiply" />
                                </div>
                                <div className="flex-1 flex flex-col justify-center">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-poppins font-black text-xl text-brand-black leading-tight pr-4">{item.name}</h3>
                                        <button onClick={() => removeItem(index)} className="text-gray-300 hover:text-red-500 p-2 hover:bg-red-50 rounded-xl transition" title="Supprimer">
                                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                        </button>
                                    </div>
                                    <div className="flex gap-4 items-center mb-4">
                                        <span className="text-xs font-black uppercase tracking-widest bg-gray-100 text-brand-black px-3 py-1.5 rounded-md">Taille: {item.size}</span>
                                    </div>
                                    {item.hasFlockage && (
                                        <p className="text-xs font-bold uppercase bg-brand-black/5 text-brand-black px-4 py-2 rounded-lg inline-flex flex-wrap gap-2 w-fit mb-4">
                                            <span>Flocage:</span>
                                            <span className="font-black">{item.flockageText}</span>
                                            <span className="text-brand-accent font-black ml-1 text-xs px-2 py-0.5 bg-brand-accent/20 rounded">+{FLOCKAGE_PRICE}F</span>
                                        </p>
                                    )}
                                    <div className="flex justify-between items-end mt-auto pt-4 border-t border-gray-50">
                                        <div className="flex items-center bg-[#F6F6F6] rounded-xl p-1 border border-gray-100">
                                            <button onClick={() => updateQuantity(index, item.quantity - 1)} className="w-10 h-10 flex items-center justify-center font-black text-gray-500 hover:text-brand-black bg-white rounded-lg shadow-sm">-</button>
                                            <span className="w-12 text-center font-black text-lg">{item.quantity}</span>
                                            <button onClick={() => updateQuantity(index, item.quantity + 1)} className="w-10 h-10 flex items-center justify-center font-black text-gray-500 hover:text-brand-black bg-white rounded-lg shadow-sm">+</button>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-poppins font-black text-brand-black text-2xl">{(item.price * item.quantity).toLocaleString()} F</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    <div className="bg-brand-black text-white p-8 rounded-3xl shadow-2xl h-fit sticky top-28">
                        <h2 className="text-2xl font-poppins font-black mb-8 border-b border-gray-800 pb-6 uppercase tracking-wider">Résumé</h2>
                        
                        <div className="space-y-4 mb-8 pb-8 border-b border-gray-800 font-medium">
                            <div className="flex justify-between text-base">
                                <span className="text-gray-400 font-bold">Maillots</span>
                                <span className="font-bold">{subtotal.toLocaleString()} F</span>
                            </div>
                            {totalFlockage > 0 && (
                                <div className="flex justify-between text-brand-accent text-base">
                                    <span className="font-bold">Flocage</span>
                                    <span className="font-bold">+{totalFlockage.toLocaleString()} F</span>
                                </div>
                            )}
                            <div className="flex justify-between text-base">
                                <span className="text-gray-400 font-bold">Livraison</span>
                                <span className="font-bold text-brand-accent uppercase">Offerte</span>
                            </div>
                        </div>

                        <div className="flex justify-between items-end mb-10">
                            <span className="font-black text-gray-400 text-lg uppercase tracking-wider">TOTAL TTC</span>
                            <span className="font-poppins font-black text-4xl text-brand-accent leading-none">{total.toLocaleString()} <span className="text-xl">F</span></span>
                        </div>

                        <form onSubmit={submitOrder} className="space-y-5">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Nom complet *</label>
                                <input required type="text" value={name} onChange={e => setName(e.target.value)} className="w-full px-5 py-4 border border-gray-800 rounded-xl bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-brand-accent font-bold placeholder-gray-600" placeholder="Ex: Saliou Diallo" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">WhatsApp valide *</label>
                                <input required type="tel" minLength={8} value={phone} onChange={e => setPhone(e.target.value)} className="w-full px-5 py-4 border border-gray-800 rounded-xl bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-brand-accent font-bold placeholder-gray-600" placeholder="+221 ..." />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Email <span className="font-normal opacity-50 text-[10px]">(Optionnel)</span></label>
                                <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-5 py-4 border border-gray-800 rounded-xl bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-brand-accent font-bold placeholder-gray-600" placeholder="contact@..." />
                            </div>
                            
                            <div className="pt-6">
                                <button disabled={loading} type="submit" className="relative group w-full bg-brand-accent text-brand-black overflow-hidden py-5 rounded-2xl font-black text-lg disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-all shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_30px_rgba(34,197,94,0.5)] uppercase tracking-widest">
                                    <div className="absolute inset-0 w-full h-full bg-white/20 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                                    <span className="relative z-10 flex items-center justify-center">
                                        {loading ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-brand-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                                Validation...
                                            </>
                                        ) : 'Valider sur WhatsApp'}
                                    </span>
                                </button>
                                <p className="text-center text-xs text-gray-500 font-bold mt-4">Paiement 100% sécurisé à la livraison</p>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
