'use client';

export default function MarqueeBand() {
  return (
    <div className="w-full bg-pitch py-4 overflow-hidden border-y-4 border-pitch relative z-20">
      <div className="flex whitespace-nowrap animate-marquee font-display text-4xl text-dark tracking-[0.2em] font-black">
        {Array.from({ length: 4 }).map((_, i) => (
          <span key={i} className="mx-4">
            FRANCE • REAL MADRID • BARCELONE • PSG • SÉNÉGAL • LIVERPOOL •
          </span>
        ))}
      </div>
    </div>
  );
}
