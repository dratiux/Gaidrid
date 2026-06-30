import { X } from 'lucide-react';

interface ModalCloseButtonProps {
  onClick: () => void;
  className?: string;
}

export function ModalCloseButton({ onClick, className = '' }: ModalCloseButtonProps) {
  return (
    <button
      onClick={onClick}
      aria-label="Close dialog"
      type="button"
      className={`h-8 w-8 rounded-xl bg-theme-input-bg border border-theme-border/65 text-theme-text-muted hover:text-theme-text hover:border-theme-border transition-all cursor-pointer flex items-center justify-center ${className}`}
    >
      <X size={14} />
    </button>
  );
}
