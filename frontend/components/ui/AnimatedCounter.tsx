'use client';
import { useEffect, useState, useRef } from 'react';
import { useInView, useSpring } from 'framer-motion';

interface AnimatedCounterProps {
  value: number;
  className?: string;
}

export default function AnimatedCounter({ value, className = '' }: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [displayValue, setDisplayValue] = useState(0);

  const springValue = useSpring(0, {
    stiffness: 50,
    damping: 20,
    mass: 1
  });

  useEffect(() => {
    if (isInView) {
      springValue.set(value);
    }
  }, [isInView, value, springValue]);

  useEffect(() => {
    return springValue.onChange((v) => {
      setDisplayValue(Math.floor(v));
    });
  }, [springValue]);

  return <span ref={ref} className={className}>{displayValue.toLocaleString()}</span>;
}
