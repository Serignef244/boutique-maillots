'use client';
import { useState } from 'react';
import { ChevronDown, ChevronUp, X, Filter as FilterIcon } from 'lucide-react';

export default function Filters({ 
    onFilterChange, 
    activeFilters 
}: { 
    onFilterChange: (type: string, value: any) => void;
    activeFilters: any;
}) {
    const [isOpenMobile, setIsOpenMobile] = useState(false);
    
    // Filtres statiques / simulés (MVP)
    const teams = ['PSG', 'Real Madrid', 'Sénégal', 'Barcelone', 'Marseille', 'Manchester City'];
    const sizes = ['S', 'M', 'L', 'XL', 'XXL'];
    
    const [openSections, setOpenSections] = useState({
        equipe: true,
        taille: true,
        prix: true
    });

    const toggleSection = (section: keyof typeof openSections) => {
        setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    const handleTeamToggle = (team: string) => {
        const current = activeFilters.teams || [];
        const updated = current.includes(team) 
            ? current.filter((t: string) => t !== team) 
            : [...current, team];
        onFilterChange('teams', updated);
    };

    const handleSizeToggle = (size: string) => {
        const current = activeFilters.sizes || [];
        const updated = current.includes(size) 
            ? current.filter((s: string) => s !== size) 
            : [...current, size];
        onFilterChange('sizes', updated);
    };

    const FilterContent = () => (
        <div className="w-full h-full flex flex-col p-6 lg:p-0">
            {/* Header Mobile */}
            <div className="flex justify-between items-center lg:hidden mb-8 border-b pb-4">
                <h2 className="font-poppins font-black text-2xl flex items-center gap-2">
                    <FilterIcon size={24} /> Filtres
                </h2>
                <button onClick={() => setIsOpenMobile(false)} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
                    <X size={24} />
                </button>
            </div>

            <div className="space-y-8 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                
                {/* Section Equipes */}
                <div className="border-b border-gray-100 pb-6">
                    <button onClick={() => toggleSection('equipe')} className="flex w-full justify-between items-center mb-4">
                        <span className="font-poppins font-bold text-lg text-brand-black">Équipes / Nations</span>
                        {openSections.equipe ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                    {openSections.equipe && (
                        <div className="space-y-3 animate-slide-up">
                            {teams.map(team => (
                                <label key={team} className="flex items-center gap-3 cursor-pointer group">
                                    <div className={`w-5 h-5 rounded border ${activeFilters.teams?.includes(team) ? 'bg-brand-accent border-brand-accent' : 'border-gray-300 bg-white group-hover:border-gray-400'} flex items-center justify-center transition-colors`}>
                                        {activeFilters.teams?.includes(team) && <div className="w-2 h-2 bg-white rounded-sm" />}
                                    </div>
                                    <span className="font-semibold text-gray-700">{team}</span>
                                </label>
                            ))}
                        </div>
                    )}
                </div>

                {/* Section Tailles */}
                <div className="border-b border-gray-100 pb-6">
                    <button onClick={() => toggleSection('taille')} className="flex w-full justify-between items-center mb-4">
                        <span className="font-poppins font-bold text-lg text-brand-black">Tailles</span>
                        {openSections.taille ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                    {openSections.taille && (
                        <div className="flex flex-wrap gap-2 animate-slide-up pt-1">
                            {sizes.map(size => (
                                <button
                                    key={size}
                                    onClick={() => handleSizeToggle(size)}
                                    className={`w-12 h-10 rounded-lg flex items-center justify-center font-bold text-sm transition-all shadow-sm ${
                                        activeFilters.sizes?.includes(size)
                                            ? 'bg-brand-black text-white hover:bg-gray-800'
                                            : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-400'
                                    }`}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Autres filtres (Promos, Stock) */}
                <div className="pb-6">
                    <label className="flex items-center gap-3 cursor-pointer group mb-4">
                        <div className={`w-10 h-6 flex items-center bg-gray-200 rounded-full p-1 transition-colors ${activeFilters.promoOnly ? 'bg-brand-accent' : ''}`}>
                            <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${activeFilters.promoOnly ? 'translate-x-4' : ''}`} />
                        </div>
                        <span className="font-bold text-red-500">Promotions uniquement</span>
                        <input type="checkbox" className="hidden" checked={activeFilters.promoOnly || false} onChange={e => onFilterChange('promoOnly', e.target.checked)} />
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer group">
                        <div className={`w-10 h-6 flex items-center bg-gray-200 rounded-full p-1 transition-colors ${activeFilters.inStockOnly ? 'bg-brand-black' : ''}`}>
                            <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${activeFilters.inStockOnly ? 'translate-x-4' : ''}`} />
                        </div>
                        <span className="font-bold text-gray-700">En stock uniquement</span>
                        <input type="checkbox" className="hidden" checked={activeFilters.inStockOnly || false} onChange={e => onFilterChange('inStockOnly', e.target.checked)} />
                    </label>
                </div>
            </div>
            
            {/* Pied mobile */}
            <div className="lg:hidden mt-auto pt-6 border-t border-gray-100">
                <button onClick={() => setIsOpenMobile(false)} className="w-full bg-brand-black text-white font-black py-4 rounded-xl shadow-lg">
                    Appliquer les filtres
                </button>
            </div>
        </div>
    );

    return (
        <>
            {/* Bouton Mobile Fixe */}
            <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
                <button 
                    onClick={() => setIsOpenMobile(true)}
                    className="flex items-center gap-2 bg-brand-black text-white font-black px-6 py-3.5 rounded-full shadow-2xl border-2 border-gray-800"
                >
                    <FilterIcon size={18} /> Filtrer
                    {(activeFilters.teams?.length > 0 || activeFilters.sizes?.length > 0 || activeFilters.promoOnly) && (
                        <div className="w-2 h-2 bg-brand-accent rounded-full ml-1" />
                    )}
                </button>
            </div>

            {/* Sidebar Desktop */}
            <aside className="hidden lg:block w-64 flex-shrink-0 sticky top-28 h-auto pb-10">
                <FilterContent />
            </aside>

            {/* Modal Mobile */}
            {isOpenMobile && (
                <div className="fixed inset-0 z-50 lg:hidden flex justify-end">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={() => setIsOpenMobile(false)} />
                    <div className="relative w-[300px] sm:w-[350px] bg-white h-full shadow-2xl animate-slide-up sm:animate-none">
                        <FilterContent />
                    </div>
                </div>
            )}
        </>
    );
}
