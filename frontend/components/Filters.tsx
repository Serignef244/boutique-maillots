'use client';
import { useState } from 'react';
import { ChevronDown, ChevronUp, X, Filter as FilterIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Filters({ 
    onFilterChange, 
    activeFilters,
    availableTeams = []
}: { 
    onFilterChange: (type: string, value: any) => void;
    activeFilters: any;
    availableTeams?: string[];
}) {
    const [isOpenMobile, setIsOpenMobile] = useState(false);
    
    // Trier les équipes par ordre alphabétique pour une meilleure expérience
    const sortedTeams = [...availableTeams].sort((a, b) => a.localeCompare(b));
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
        <div className="w-full h-full flex flex-col p-6 lg:p-0 text-black font-body">
            {/* Header Mobile */}
            <div className="flex justify-between items-center lg:hidden mb-12 border-b border-gray-100 pb-6">
                <h2 className="font-display text-4xl tracking-tighter uppercase">
                    FILTRES
                </h2>
                <button onClick={() => setIsOpenMobile(false)} className="p-2">
                    <X size={28} strokeWidth={1.5} />
                </button>
            </div>

            <div className="space-y-12 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                
                {/* Section Equipes (Dynamique) */}
                <div className="border-b border-gray-100 pb-10">
                    <button onClick={() => toggleSection('equipe')} className="flex w-full justify-between items-center mb-8">
                        <span className="font-display text-xl tracking-[0.2em] text-black uppercase font-bold">ÉQUIPES DISPONIBLES</span>
                        {openSections.equipe ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                    <AnimatePresence>
                        {openSections.equipe && (
                            <motion.div 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="space-y-4 overflow-hidden"
                            >
                                {sortedTeams.length > 0 ? (
                                    sortedTeams.map(team => (
                                        <label key={team} className="flex items-center gap-4 cursor-pointer group w-full">
                                            <input 
                                                type="checkbox" 
                                                className="hidden" 
                                                checked={activeFilters.teams?.includes(team)}
                                                onChange={() => handleTeamToggle(team)}
                                            />
                                            <div className={`w-5 h-5 border transition-all flex items-center justify-center ${activeFilters.teams?.includes(team) ? 'bg-black border-black' : 'border-gray-200 group-hover:border-black'}`}>
                                                {activeFilters.teams?.includes(team) && <div className="w-2 h-2 bg-white" />}
                                            </div>
                                            <span className={`font-body text-base uppercase tracking-widest transition-colors ${activeFilters.teams?.includes(team) ? 'text-black font-bold' : 'text-gray-400 group-hover:text-black'}`}>{team}</span>
                                        </label>
                                    ))
                                ) : (
                                    <p className="text-sm text-gray-400 uppercase italic tracking-widest">Aucune équipe disponible</p>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Section Tailles */}
                <div className="border-b border-gray-100 pb-10">
                    <button onClick={() => toggleSection('taille')} className="flex w-full justify-between items-center mb-8">
                        <span className="font-display text-xl tracking-[0.2em] text-black uppercase font-bold">TAILLES</span>
                        {openSections.taille ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                    <AnimatePresence>
                        {openSections.taille && (
                            <motion.div 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="flex flex-wrap gap-2 overflow-hidden pt-1"
                            >
                                {sizes.map(size => (
                                    <button
                                        key={size}
                                        onClick={() => handleSizeToggle(size)}
                                        className={`px-6 py-3 font-display text-lg tracking-widest transition-all border ${
                                            activeFilters.sizes?.includes(size)
                                                ? 'bg-black text-white border-black'
                                                : 'bg-white text-black border-gray-200 hover:border-black'
                                        }`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Autres filtres (Promos, Stock) */}
                <div className="pb-10 space-y-8">
                    <label className="flex items-center justify-between cursor-pointer group">
                        <span className="font-display text-xl tracking-[0.2em] text-black uppercase font-bold">OFFRES SPÉCIALES</span>
                        <div className="relative">
                            <input type="checkbox" className="hidden" checked={activeFilters.promoOnly || false} onChange={e => onFilterChange('promoOnly', e.target.checked)} />
                            <div className={`w-12 h-6 flex items-center p-1 transition-colors ${activeFilters.promoOnly ? 'bg-black' : 'bg-gray-100 border border-gray-200 group-hover:border-black'}`}>
                                <div className={`bg-white w-4 h-4 shadow-sm transform transition-transform ${activeFilters.promoOnly ? 'translate-x-6' : ''}`} />
                            </div>
                        </div>
                    </label>

                    <label className="flex items-center justify-between cursor-pointer group">
                        <span className="font-display text-xl tracking-[0.2em] text-black uppercase font-bold">DISPONIBLE EN STOCK</span>
                        <div className="relative">
                            <input type="checkbox" className="hidden" checked={activeFilters.inStockOnly || false} onChange={e => onFilterChange('inStockOnly', e.target.checked)} />
                            <div className={`w-12 h-6 flex items-center p-1 transition-colors ${activeFilters.inStockOnly ? 'bg-black' : 'bg-gray-100 border border-gray-200 group-hover:border-black'}`}>
                                <div className={`bg-white w-4 h-4 shadow-sm transform transition-transform ${activeFilters.inStockOnly ? 'translate-x-6' : ''}`} />
                            </div>
                        </div>
                    </label>
                </div>
            </div>
            
            {/* Pied mobile */}
            <div className="lg:hidden mt-auto pt-8">
                <button 
                    onClick={() => setIsOpenMobile(false)} 
                    className="w-full bg-black text-white font-display text-xl tracking-[0.2em] py-5 uppercase"
                >
                    VOIR LES {availableTeams.length > 0 ? "MAILLOTS" : "RÉSULTATS"}
                </button>
            </div>
        </div>
    );

    return (
        <>
            {/* Bouton Mobile Fixe */}
            <div className="lg:hidden fixed bottom-8 left-1/2 -translate-x-1/2 z-40">
                <button 
                    onClick={() => setIsOpenMobile(true)}
                    className="flex items-center gap-3 bg-white text-black font-display text-lg tracking-[0.2em] px-10 py-5 shadow-2xl border-2 border-black"
                >
                    <FilterIcon size={20} strokeWidth={1.5} />
                    FILTRER LA COLLECTION
                </button>
            </div>

            {/* Sidebar Desktop */}
            <aside className="hidden lg:block w-72 flex-shrink-0 sticky top-32 h-fit pb-20">
                <FilterContent />
            </aside>

            {/* Modal Mobile */}
            <AnimatePresence>
                {isOpenMobile && (
                    <div className="fixed inset-0 z-[100] lg:hidden flex justify-end">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
                            onClick={() => setIsOpenMobile(false)} 
                        />
                        <motion.div 
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                            className="relative w-full sm:w-[500px] bg-white h-full shadow-2xl"
                        >
                            <FilterContent />
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
