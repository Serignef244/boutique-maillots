import Link from 'next/link';

export default function ConfirmationPage({ searchParams }: { searchParams: { order: string } }) {
    const orderNumber = searchParams.order || 'XXX';

    return (
        <div className="max-w-2xl mx-auto py-24 text-center animate-in zoom-in duration-500 min-h-[60vh] flex flex-col justify-center items-center">
            <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
            </div>
            
            <h1 className="text-4xl font-extrabold mb-4 text-gray-900">Commande Confirmée !</h1>
            
            <div className="bg-white px-6 py-4 rounded-xl shadow-sm border border-gray-100 inline-block mb-8">
                <p className="font-medium text-gray-500 text-sm">Numéro de Commande</p>
                <p className="text-2xl font-black text-blue-600 tracking-wider font-mono">{orderNumber}</p>
            </div>
            
            <p className="text-lg text-gray-600 mb-2 max-w-md mx-auto">
                Merci pour votre commande. Notre équipe la prépare immédiatement.
            </p>
            <p className="text-md text-gray-500 mb-10 max-w-md mx-auto bg-blue-50 py-3 px-4 rounded-xl border border-blue-100 font-medium">
                📱 Vous allez recevoir le récapitulatif détaillé et un lien de paiement / suivi via un message WhatsApp dans quelques instants sur votre téléphone.
            </p>
            
            <Link href="/" className="inline-block bg-black text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-gray-800 transition active:scale-95 shadow-lg shadow-black/20">
                Continuer mes achats
            </Link>
        </div>
    );
}
