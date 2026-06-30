import React from 'react';

interface ModalOverlayProps {
  onClose: () => void;
  label: string;
  children: React.ReactNode;
}

export default function ModalOverlay({ onClose, label, children }: ModalOverlayProps) {
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[150] p-4 select-none animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-label={label}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-theme-card border border-theme-border rounded-3xl p-6 space-y-4"
      >
        {children}
      </div>
    </div>
  );
}
