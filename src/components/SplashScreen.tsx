import { useEffect, useState } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [phase, setPhase] = useState<'fill' | 'fade'>('fill');

  useEffect(() => {
    const fadeTimer = setTimeout(() => setPhase('fade'), 2000);
    const doneTimer = setTimeout(onComplete, 2400);
    return () => { clearTimeout(fadeTimer); clearTimeout(doneTimer); };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-theme-bg transition-opacity duration-500 ${
        phase === 'fade' ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="relative w-[320px] h-[80px]">
        {/* Base logo — inverted white at 50% opacity */}
        <img
          src="/gaidrid_full.svg"
          alt="Gaidrid"
          className="absolute inset-0 w-full h-full object-contain splash-base-logo"
        />

        {/* Animated accent-colored fill using mask */}
        <div className="absolute inset-0 splash-fill-mask splash-accent-fill" />
      </div>
    </div>
  );
}
