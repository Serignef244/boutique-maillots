'use client';

export default function ProductSkeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-col gap-6 animate-pulse ${className}`}>
      <div className="aspect-[4/5] bg-gray-100 rounded-none w-full relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
      </div>
      <div className="space-y-3 px-1">
        <div className="h-3 bg-gray-100 w-1/3"></div>
        <div className="h-8 bg-gray-100 w-full"></div>
        <div className="h-6 bg-gray-100 w-1/2"></div>
      </div>
    </div>
  );
}
