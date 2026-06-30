import type { ReactNode } from 'react';

interface IconButtonProps {
  onClick?: () => void;
  variant?: 'default' | 'active' | 'danger' | 'accent';
  size?: 'sm' | 'md';
  icon: ReactNode;
  label: string;
  title?: string;
  className?: string;
}

const variantClasses: Record<string, string> = {
  default: 'bg-theme-input-bg border border-theme-border/60 text-theme-text hover:text-theme-accent hover:border-theme-accent/40',
  active: 'bg-theme-input-bg border border-theme-accent text-theme-accent',
  danger: 'bg-theme-input-bg border border-theme-border/60 text-theme-text-muted hover:text-red-500 hover:border-red-500/20',
  accent: 'bg-theme-input-bg border border-theme-border/60 text-theme-text-muted hover:text-theme-text hover:border-theme-border',
};

export function IconButton({
  onClick,
  variant = 'default',
  size = 'sm',
  icon,
  label,
  title,
  className = '',
}: IconButtonProps) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={title}
      type="button"
      className={`${size === 'md' ? 'h-8 w-8 rounded-xl flex items-center justify-center' : 'p-1 rounded-md'} cursor-pointer transition-all ${variantClasses[variant]} ${className}`}
    >
      {icon}
    </button>
  );
}
