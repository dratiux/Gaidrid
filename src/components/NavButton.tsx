import React from 'react';

interface NavButtonProps {
  tabId: string;
  currentTab: string;
  icon?: React.ReactNode;
  label: string;
  shortcut: string;
  onClick: () => void;
  children?: React.ReactNode;
}

export default function NavButton({
  tabId,
  currentTab,
  icon,
  label,
  shortcut,
  onClick,
  children,
}: NavButtonProps) {
  return (
    <button
      onClick={onClick}
      aria-label={`Go to ${label}`}
      aria-current={currentTab === tabId ? 'page' : undefined}
      className={`relative p-3 rounded-2xl transition-all duration-200 group flex items-center justify-center cursor-pointer ${
        currentTab === tabId
          ? 'bg-theme-accent text-theme-accent-text scale-105'
          : 'text-theme-text-muted hover:text-theme-text hover:bg-theme-input-bg/70'
      }`}
      title={`${label} (${shortcut})`}
    >
      {children ?? icon}
      {/* Tooltip on Desktop */}
      <span className="absolute left-16 px-2.5 py-1.5 rounded-xl bg-theme-card text-theme-text text-[10px] font-black uppercase tracking-wider opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl border border-theme-border z-50 md:block hidden">
        {label} <span className="ml-1 opacity-50 font-mono">{shortcut}</span>
      </span>
    </button>
  );
}
