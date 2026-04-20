'use client';

export default function MarqueeBand() {
  return (
    <div className="w-full bg-black py-4 overflow-hidden relative z-20">
      <div className="flex whitespace-nowrap animate-marquee font-display text-4xl text-white tracking-[0.3em] font-black uppercase">
        {Array.from({ length: 4 }).map((_, i) => (
          <span key={i} className="mx-8">
            FRANCE • REAL MADRID • BARCELONE • PSG • SÉNÉGAL • LIVERPOOL •
          </span>
        ))}
      </div>
    </div>
  );
}
