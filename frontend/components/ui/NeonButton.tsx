'use client';
import { ButtonHTMLAttributes, ReactNode } from 'react';
import { motion } from 'framer-motion';

interface NeonButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function NeonButton({ children, className = '', onClick, ...props }: NeonButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`relative inline-flex items-center justify-center px-8 py-4 overflow-hidden font-display text-xl tracking-widest uppercase transition-all duration-300 rounded-none bg-dark text-pitch border-2 border-pitch hover:bg-pitch hover:text-dark hover:shadow-[0_0_20px_rgba(0,255,135,0.6)] ${className}`}
      {...props}
    >
      <span className="relative z-10">{children}</span>
      <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full hover:animate-[shimmer_1s_infinite]"></div>
    </motion.button>
  );
}
