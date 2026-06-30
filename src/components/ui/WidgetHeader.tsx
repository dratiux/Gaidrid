import type { ReactNode } from 'react';

interface WidgetHeaderProps {
  title: string;
  actions?: ReactNode;
  leading?: ReactNode;
  className?: string;
}

export function WidgetHeader({ title, actions, leading, className = '' }: WidgetHeaderProps) {
  return (
    <div className={`flex items-center justify-between mb-3 border-b border-theme-border/30 pb-2.5 ${className}`}>
      <div className="flex items-center gap-1.5">
        {leading}
        <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-theme-text-muted opacity-80">
          {title}
        </h3>
      </div>
      {actions && <div className="flex items-center gap-1.5">{actions}</div>}
    </div>
  );
}
