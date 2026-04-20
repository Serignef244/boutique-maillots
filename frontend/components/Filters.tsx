'use client';
import { useState } from 'react';
import { ChevronDown, ChevronUp, X, Filter as FilterIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Filters({ 
    onFilterChange, 
    activeFilters 
}: { 
    onFilterChange: (type: string, value: any) => void;
    activeFilters: any;
}) {
    const [isOpenMobile, setIsOpenMobile] = useState(false);
    
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
        <div className="w-full h-full flex flex-col p-6 lg:p-0 text-white font-body">
            {/* Header Mobile */}
            <div className="flex justify-between items-center lg:hidden mb-8 border-b border-white/10 pb-4">
                <h2 className="font-display text-3xl flex items-center gap-3 tracking-widest uppercase">
                    <FilterIcon size={24} className="text-pitch" /> FILTRES
                </h2>
                <button onClick={() => setIsOpenMobile(false)} className="p-2 border border-white/10 hover:border-white transition-colors">
                    <X size={24} />
                </button>
            </div>

            <div className="space-y-10 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                
                {/* Section Equipes */}
                <div className="border-b border-white/5 pb-8">
                    <button onClick={() => toggleSection('equipe')} className="flex w-full justify-between items-center mb-6">
                        <span className="font-display text-2xl tracking-widest text-white uppercase">ÉQUIPES • NATIONS</span>
                        {openSections.equipe ? <ChevronUp size={20} className="text-pitch" /> : <ChevronDown size={20} />}
                    </button>
                    <AnimatePresence>
                        {openSections.equipe && (
                            <motion.div 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="space-y-4 overflow-hidden"
                            >
                                {teams.map(team => (
                                    <label key={team} className="flex items-center gap-4 cursor-pointer group w-fit">
                                        <input 
                                            type="checkbox" 
                                            className="hidden" 
                                            checked={activeFilters.teams?.includes(team)}
                                            onChange={() => handleTeamToggle(team)}
                                        />
                                        <div className={`w-6 h-6 border-2 transition-all flex items-center justify-center ${activeFilters.teams?.includes(team) ? 'bg-pitch border-pitch' : 'border-white/20 bg-transparent group-hover:border-white/50'}`}>
                                            {activeFilters.teams?.includes(team) && <div className="w-2.5 h-2.5 bg-dark" />}
                                        </div>
                                        <span className={`font-body text-lg uppercase tracking-wider transition-colors ${activeFilters.teams?.includes(team) ? 'text-pitch' : 'text-gray-500 group-hover:text-white'}`}>{team}</span>
                                    </label>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Section Tailles */}
                <div className="border-b border-white/5 pb-8">
                    <button onClick={() => toggleSection('taille')} className="flex w-full justify-between items-center mb-6">
                        <span className="font-display text-2xl tracking-widest text-white uppercase">TAILLES</span>
                        {openSections.taille ? <ChevronUp size={20} className="text-pitch" /> : <ChevronDown size={20} />}
                    </button>
                    <AnimatePresence>
                        {openSections.taille && (
                            <motion.div 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="flex flex-wrap gap-3 overflow-hidden pt-1"
                            >
                                {sizes.map(size => (
                                    <button
                                        key={size}
                                        onClick={() => handleSizeToggle(size)}
                                        className={`w-14 h-12 font-display text-2xl tracking-widest transition-all border ${
                                            activeFilters.sizes?.includes(size)
                                                ? 'bg-pitch text-dark border-pitch shadow-[0_0_15px_rgba(0,255,135,0.3)]'
                                                : 'bg-dark text-white border-white/20 hover:border-white hover:bg-white/5'
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
                <div className="pb-8 space-y-6">
                    <label className="flex items-center justify-between cursor-pointer group">
                        <span className="font-display text-2xl tracking-widest text-red-500 uppercase">PROMOTIONS</span>
                        <div className="relative">
                            <input type="checkbox" className="hidden" checked={activeFilters.promoOnly || false} onChange={e => onFilterChange('promoOnly', e.target.checked)} />
                            <div className={`w-12 h-6 flex items-center rounded-none p-1 transition-colors ${activeFilters.promoOnly ? 'bg-red-600' : 'bg-white/10 border border-white/10'}`}>
                                <div className={`bg-white w-4 h-4 shadow-xl transform transition-transform ${activeFilters.promoOnly ? 'translate-x-6' : ''}`} />
                            </div>
                        </div>
                    </label>

                    <label className="flex items-center justify-between cursor-pointer group">
                        <span className="font-display text-2xl tracking-widest text-white uppercase">DISPONIBILITÉ</span>
                        <div className="relative">
                            <input type="checkbox" className="hidden" checked={activeFilters.inStockOnly || false} onChange={e => onFilterChange('inStockOnly', e.target.checked)} />
                            <div className={`w-12 h-6 flex items-center rounded-none p-1 transition-colors ${activeFilters.inStockOnly ? 'bg-pitch' : 'bg-white/10 border border-white/10'}`}>
                                <div className={`bg-white w-4 h-4 shadow-xl transform transition-transform ${activeFilters.inStockOnly ? 'translate-x-6 text-dark' : ''}`} />
                            </div>
                        </div>
                    </label>
                </div>
            </div>
            
            {/* Pied mobile */}
            <div className="lg:hidden mt-auto pt-6 border-t border-white/10">
                <button 
                    onClick={() => setIsOpenMobile(false)} 
                    className="w-full bg-pitch text-dark font-display text-2xl tracking-[0.2em] py-4 hover:shadow-[0_0_20px_rgba(0,255,135,0.4)] transition-all uppercase"
                >
                    APPLIQUER
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
                    className="flex items-center gap-3 bg-pitch text-dark font-display text-xl tracking-widest px-8 py-4 shadow-[0_0_25px_rgba(0,255,135,0.4)] border-2 border-dark"
                >
                    <FilterIcon size={18} /> FILTRER
                    {(activeFilters.teams?.length > 0 || activeFilters.sizes?.length > 0 || activeFilters.promoOnly) && (
                        <div className="w-3 h-3 bg-dark animate-pulse ml-1" />
                    )}
                </button>
            </div>

            {/* Sidebar Desktop */}
            <aside className="hidden lg:block w-72 flex-shrink-0 sticky top-28 h-fit pb-10">
                <FilterContent />
            </aside>

            {/* Modal Mobile */}
            <AnimatePresence>
                {isOpenMobile && (
                    <div className="fixed inset-0 z-50 lg:hidden flex justify-end">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/80 backdrop-blur-md" 
                            onClick={() => setIsOpenMobile(false)} 
                        />
                        <motion.div 
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="relative w-[300px] sm:w-[380px] bg-dark h-full shadow-[0_0_50px_rgba(0,0,0,1)] border-l border-white/5"
                        >
                            <FilterContent />
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
