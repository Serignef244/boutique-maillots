'use client';
import { useState, useEffect } from 'react';
import { getProducts, deleteProduct } from '@/lib/api';

export default function AdminPage() {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [products, setProducts] = useState<any[]>([]);
    
    // States du nouveau formulaire
    const availableSizes = ["S", "M", "L", "XL", "XXL", "3XL"];
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [images, setImages] = useState<string[]>(['']);
    const [hasFlockage, setHasFlockage] = useState(true);
    const [selectedSizes, setSelectedSizes] = useState<string[]>(["S", "M", "L", "XL"]);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        const data = await getProducts();
        if (data && Array.isArray(data)) {
            setProducts(data);
        }
    };

    const handleImageChange = (index: number, value: string) => {
        const newImages = [...images];
        newImages[index] = value;
        setImages(newImages);
    };

    const addImageField = () => {
        if (images.length < 5) {
            setImages([...images, '']);
        }
    };

    const removeImageField = (index: number) => {
        const newImages = [...images];
        newImages.splice(index, 1);
        setImages(newImages);
    };

    const handleSizeToggle = (size: string) => {
        if (selectedSizes.includes(size)) {
            setSelectedSizes(selectedSizes.filter(s => s !== size));
        } else {
            setSelectedSizes([...selectedSizes, size]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        // Filtrer les URL d'images vides
        const filteredImages = images.filter(url => url.trim() !== '');

        if (selectedSizes.length === 0) {
            setMessage('Sélectionnez au moins une taille.');
            setLoading(false);
            return;
        }

        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
            const res = await fetch(`${API_URL}/admin/products`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name, 
                    description, 
                    price: Number(price), 
                    images: filteredImages, 
                    hasFlockage,
                    sizes: selectedSizes
                }),
            });
            
            const data = await res.json();
            if (data.success) {
                setMessage('✅ Le produit a été ajouté avec succès dans la base de données !');
                // Réinitialiser le formulaire
                setName(''); setDescription(''); setPrice(''); setImages(['']); setHasFlockage(true); setSelectedSizes(["S", "M", "L", "XL"]);
                fetchProducts(); // Refresh la liste
            } else {
                setMessage(data.error || 'Erreur inconnue lors de l\'ajout.');
            }
        } catch (error) {
            setMessage('❌ Erreur réseau. Le serveur backend est-il démarré ?');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (window.confirm(`Êtes-vous sûr de vouloir supprimer définitivement "${name}" ?`)) {
            const res = await deleteProduct(id);
            if (res.success) {
                fetchProducts(); // Refresh
            } else {
                alert("Erreur lors de la suppression.");
            }
        }
    };

    return (
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-10">
            {/* Colonne d'ajout */}
            <div className="lg:w-2/3">
                <h1 className="text-3xl font-extrabold mb-8 text-gray-900 tracking-tight">Ajouter un Maillot</h1>
                
                <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
                    {message && (
                        <div className={`p-5 rounded-2xl mb-8 font-medium ${message.includes('✅') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                            {message}
                        </div>
                    )}
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold text-gray-700 mb-2">Nom du modèle *</label>
                                <input required max={100} minLength={3} type="text" value={name} onChange={e => setName(e.target.value)} className="w-full p-4 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium" placeholder="Ex: Maillot Real Madrid Domicile 2024" />
                            </div>
                            
                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                                <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full p-4 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[120px] font-medium resize-none" placeholder="Matière respirante, coupe sportive..." />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Prix unitaire (FCFA) *</label>
                                <input required min={1} step={0.01} type="number" value={price} onChange={e => setPrice(e.target.value)} className="w-full p-4 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold" placeholder="0" />
                            </div>

                            <div className="flex flex-col justify-center pt-8">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input type="checkbox" checked={hasFlockage} onChange={(e) => setHasFlockage(e.target.checked)} className="w-5 h-5 rounded" />
                                    <span className="font-bold text-gray-800">Flocage disponible (+2000 F)</span>
                                </label>
                            </div>
                        </div>

                        {/* Tailles */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-3">Tailles disponibles *</label>
                            <div className="flex flex-wrap gap-2">
                                {availableSizes.map(sz => (
                                    <button 
                                        type="button"
                                        key={sz} 
                                        onClick={() => handleSizeToggle(sz)}
                                        className={`w-12 h-10 rounded-lg font-bold flex items-center justify-center transition-all ${selectedSizes.includes(sz) ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                                    >
                                        {sz}
                                    </button>
                                ))}
                            </div>
                        </div>
                        
                        {/* Images Dynamiques */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Images (Max 5 URLs) *</label>
                            <div className="space-y-3">
                                {images.map((img, index) => (
                                    <div key={index} className="flex gap-2 relative group">
                                        <input type="url" value={img} onChange={(e) => handleImageChange(index, e.target.value)} placeholder="https://..." className="flex-1 p-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white" required={index === 0} />
                                        {images.length > 1 && (
                                            <button type="button" onClick={() => removeImageField(index)} className="w-12 flex items-center justify-center text-red-500 hover:bg-red-50 rounded-xl transition">
                                                🗑️
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                            {images.length < 5 && (
                                <button type="button" onClick={addImageField} className="mt-3 text-sm font-bold text-blue-600 hover:text-blue-800 transition">+ Ajouter une URL</button>
                            )}
                        </div>
                        
                        <div className="pt-6">
                            <button disabled={loading} type="submit" className="w-full bg-black text-white font-bold py-4 rounded-xl hover:bg-gray-800 transition disabled:opacity-50 text-lg">
                                {loading ? 'Enregistrement réseau...' : 'Ajouter le maillot à la boutique'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Colonne de liste */}
            <div className="lg:w-1/3">
                <h2 className="text-2xl font-bold mb-8 text-gray-900 border-b pb-2">Maillots en stock</h2>
                <div className="flex flex-col gap-4 max-h-[800px] overflow-y-auto pr-2 custom-scrollbar">
                    {products.length === 0 ? (
                        <p className="text-gray-500 italic">Aucun maillot pour le moment.</p>
                    ) : (
                        products.map(p => (
                            <div key={p.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                                <img src={p.images?.[0] || 'https://via.placeholder.com/50'} alt={p.name} className="w-14 h-14 rounded-lg object-cover bg-gray-50" />
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-sm text-gray-900 truncate">{p.name}</h3>
                                    <p className="text-xs text-blue-600 font-bold">{p.price.toLocaleString()} F</p>
                                </div>
                                <button onClick={() => handleDelete(p.id, p.name)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition" title="Supprimer">
                                    🗑️
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
