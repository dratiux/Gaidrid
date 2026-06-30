import { Search, X } from 'lucide-react';

interface WidgetSearchBarProps {
  query: string;
  onQueryChange: (value: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
  className?: string;
}

export function WidgetSearchBar({
  query,
  onQueryChange,
  placeholder = 'Search...',
  autoFocus = true,
  className = '',
}: WidgetSearchBarProps) {
  return (
    <div className={`relative flex items-center bg-theme-input-bg/35 border border-theme-border/30 rounded-xl px-2.5 py-1.5 transition-all focus-within:border-theme-accent/40 focus-within:ring-2 focus-within:ring-theme-accent/5 ${className}`}>
      <Search size={12} className="text-theme-text-muted/50 shrink-0" />
      <input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        className="w-full text-xs bg-transparent border-none text-theme-text focus:outline-none focus-visible:ring-1 focus-visible:ring-theme-accent/30 placeholder-theme-text-muted/40 pl-2 font-medium"
        autoFocus={autoFocus}
      />
      {query && (
        <button
          onClick={() => onQueryChange('')}
          className="text-theme-text-muted hover:text-theme-text cursor-pointer p-0.5 rounded shrink-0 ml-1"
          type="button"
        >
          <X size={11} />
        </button>
      )}
    </div>
  );
}
