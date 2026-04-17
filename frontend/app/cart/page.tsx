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
        dispatchCartUpdated(); // Refléter dans le header
    };

    const removeItem = (index: number) => {
        const newCart = [...cart];
        newCart.splice(index, 1);
        setCart(newCart);
        localStorage.setItem('cart', JSON.stringify(newCart));
        dispatchCartUpdated();
    };

    // Calculs de facture exacts (Prix de base + Flocage)
    const subtotal = cart.reduce((acc, item) => acc + (item.basePrice * item.quantity), 0);
    const totalFlockage = cart.reduce((acc, item) => item.hasFlockage ? acc + (FLOCKAGE_PRICE * item.quantity) : acc, 0);
    const total = subtotal + totalFlockage;

    const submitOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validations
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
            dispatchCartUpdated(); // Réinitialiser le compteur du header
            
            // Format WhatsApp Message
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
            // Redirection directe vers l'application WhatsApp du client
            window.location.href = `https://wa.me/221771384729?text=${encodedMessage}`;
        } else {
            alert(res?.error || "Erreur majeure lors de la création de la commande.");
        }
    };

    return (
        <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-extrabold mb-8 text-gray-900 tracking-tight">Mon Panier</h1>
            
            {cart.length === 0 ? (
                <div className="text-center py-24 bg-white rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center">
                    <div className="w-24 h-24 bg-gray-50 flex items-center justify-center rounded-full mb-6">
                        <svg className="w-12 h-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                    </div>
                    <p className="text-xl font-medium text-gray-500 mb-6">Votre chariot est complètement vide.</p>
                    <Link href="/" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-xl font-bold transition shadow-lg shadow-blue-600/30">
                        Découvrir nos maillots
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    <div className="lg:col-span-2 space-y-5">
                        {cart.map((item, index) => (
                            <div key={index} className="flex flex-col sm:flex-row bg-white p-5 rounded-3xl shadow-sm hover:shadow-md transition border border-gray-50 gap-6 relative">
                                <div className="w-full sm:w-32 h-32 bg-gray-50 rounded-2xl flex-shrink-0 flex items-center justify-center p-2">
                                    <img src={item.image || 'https://via.placeholder.com/150'} alt={item.name} className="max-w-full max-h-full object-contain mix-blend-multiply" />
                                </div>
                                <div className="flex-1 flex flex-col justify-center">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-lg text-gray-900 leading-tight pr-4">{item.name}</h3>
                                        <button onClick={() => removeItem(index)} className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition" title="Supprimer">
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                        </button>
                                    </div>
                                    <div className="flex gap-4 items-center mb-3">
                                        <span className="text-sm font-semibold bg-gray-100 text-gray-700 px-3 py-1.5 rounded-md">Taille: {item.size}</span>
                                    </div>
                                    {item.hasFlockage && (
                                        <p className="text-sm font-medium bg-blue-50/50 border border-blue-100 text-blue-700 px-3 py-1.5 rounded-lg inline-flex flex-wrap gap-2 w-fit mb-3">
                                            <span>Flocage:</span>
                                            <span className="font-bold uppercase">{item.flockageText}</span>
                                            <span className="text-blue-500 font-bold ml-1 text-xs px-1.5 py-0.5 bg-blue-100 rounded-sm">+{FLOCKAGE_PRICE}F</span>
                                        </p>
                                    )}
                                    <div className="flex justify-between items-end mt-auto pt-2 border-t border-gray-50 pt-4">
                                        <div className="flex items-center bg-gray-100 rounded-lg p-1 border border-gray-200">
                                            <button onClick={() => updateQuantity(index, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center font-bold text-gray-600 hover:text-black bg-white rounded-md shadow-sm">-</button>
                                            <span className="w-10 text-center font-extrabold text-sm">{item.quantity}</span>
                                            <button onClick={() => updateQuantity(index, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center font-bold text-gray-600 hover:text-black bg-white rounded-md shadow-sm">+</button>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-extrabold text-blue-600 text-xl">{(item.price * item.quantity).toLocaleString()} FCFA</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 h-fit sticky top-24">
                        <h2 className="text-xl font-extrabold mb-6 text-gray-900 border-b border-gray-100 pb-4">Résumé de l'achat</h2>
                        
                        <div className="space-y-4 mb-6 pb-6 border-b border-gray-100 text-gray-600 font-medium">
                            <div className="flex justify-between text-base">
                                <span>Maillot(s)</span>
                                <span className="font-bold text-gray-900">{subtotal.toLocaleString()} F</span>
                            </div>
                            {totalFlockage > 0 && (
                                <div className="flex justify-between text-blue-600 text-base">
                                    <span>Flocage</span>
                                    <span className="font-bold">+{totalFlockage.toLocaleString()} F</span>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-between mb-8">
                            <span className="text-gray-900 font-extrabold text-lg">TOTAL TTC</span>
                            <span className="font-black text-3xl text-gray-900">{total.toLocaleString()} <span className="text-lg">FCFA</span></span>
                        </div>

                        <form onSubmit={submitOrder} className="space-y-5">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Nom complet *</label>
                                <input required type="text" value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none font-semibold text-gray-900" placeholder="Ex: Adama Fall" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">WhatsApp valide *</label>
                                <input required type="tel" minLength={8} value={phone} onChange={e => setPhone(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none font-semibold text-gray-900" placeholder="+221 ..." />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Email <span className="text-gray-400 font-normal ml-1">(Optionnel)</span></label>
                                <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none font-semibold text-gray-900" placeholder="contact@domaine.com" />
                            </div>
                            
                            <div className="pt-4">
                                <button disabled={loading} type="submit" className="relative group w-full bg-blue-600 text-white overflow-hidden py-4 rounded-xl font-extrabold text-lg disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-600/30 active:scale-95 transition-all">
                                    <div className="absolute inset-0 w-full h-full bg-white/20 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                                    <span className="relative z-10 flex items-center justify-center">
                                        {loading ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                                Validation en cours...
                                            </>
                                        ) : 'Valider la commande'}
                                    </span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
