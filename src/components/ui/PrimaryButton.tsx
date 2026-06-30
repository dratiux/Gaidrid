import type { ReactNode } from 'react';

interface PrimaryButtonProps {
  type?: 'button' | 'submit';
  onClick?: () => void;
  children: ReactNode;
  className?: string;
}

export function PrimaryButton({ type = 'submit', onClick, children, className = '' }: PrimaryButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`w-full text-xs font-black uppercase py-2.5 rounded-xl bg-theme-accent text-theme-accent-text hover:bg-theme-accent-hover transition-all cursor-pointer text-center flex items-center justify-center gap-1.5 font-mono tracking-wider ${className}`}
    >
      {children}
    </button>
  );
}
