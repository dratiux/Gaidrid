import React, { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { buildSearchUrl } from '../../lib/utils';

interface SearchEngineSelectorProps {
  searchEngine: string;
  onSearchEngineChange: (engine: string) => void;
  getSearchEnginePlaceholder: () => string;
}

export default function SearchEngineSelector({
  searchEngine,
  onSearchEngineChange,
  getSearchEnginePlaceholder
}: SearchEngineSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchSelectOpen, setIsSearchSelectOpen] = useState(false);
  const searchSelectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchSelectRef.current && !searchSelectRef.current.contains(event.target as Node)) {
        setIsSearchSelectOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const url = buildSearchUrl(searchQuery.trim(), searchEngine);
    window.open(url, '_blank', 'noreferrer');
  };

  return (
    <div className="w-full max-w-xl relative mt-3">
      <form onSubmit={handleSearchSubmit} className="relative group">
        <div className="absolute inset-y-0 left-4.5 flex items-center pointer-events-none text-theme-text-muted">
          <Search size={15} className="opacity-70 group-focus-within:opacity-100 group-focus-within:text-theme-accent transition-all" />
        </div>
        
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={getSearchEnginePlaceholder()}
          className="w-full pl-12 pr-28 py-3.5 rounded-2xl bg-theme-card/50 border border-theme-border/60 focus:outline-none focus:border-theme-accent focus:ring-4 focus:ring-theme-accent/15 text-xs sm:text-sm font-medium text-theme-text placeholder-theme-text-muted/60 transition-all"
        />

        <div className="absolute inset-y-0 right-3.5 flex items-center" ref={searchSelectRef}>
          <button
            type="button"
            onClick={() => setIsSearchSelectOpen(!isSearchSelectOpen)}
            className="text-[9px] font-black uppercase font-mono tracking-wider text-theme-accent bg-theme-accent-hover/10 px-3 py-2 rounded-xl border border-theme-accent/25 cursor-pointer outline-none hover:border-theme-accent/40 hover:bg-theme-accent-hover/20 focus:ring-2 focus:ring-theme-accent/15 transition-all flex items-center justify-center hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>{searchEngine}</span>
          </button>

          <AnimatePresence>
            {isSearchSelectOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ type: 'spring', duration: 0.25, bounce: 0 }}
                className="absolute right-0 top-full mt-2 w-40 rounded-2xl bg-theme-card border border-theme-border overflow-hidden origin-top-right z-50"
              >
                <div className="p-1.5 space-y-0.5">
                  {[
                    { value: 'google', label: 'Google' },
                    { value: 'duckduckgo', label: 'DuckDuckGo' },
                    { value: 'bing', label: 'Bing' },
                    { value: 'github', label: 'GitHub' },
                    { value: 'gemini', label: 'Gemini' }
                  ].map((engine) => {
                    const isSelected = searchEngine === engine.value;
                    return (
                      <button
                        key={engine.value}
                        type="button"
                        onClick={() => {
                          onSearchEngineChange(engine.value);
                          setIsSearchSelectOpen(false);
                        }}
                        className={`w-full text-left text-[10px] uppercase tracking-wider font-mono px-3 py-2.5 rounded-xl flex items-center justify-between transition-colors cursor-pointer font-bold ${
                          isSelected
                            ? 'bg-theme-accent text-theme-accent-text'
                            : 'text-theme-text hover:bg-theme-input-bg'
                        }`}
                      >
                        <span>{engine.label}</span>
                        {isSelected && <span className="text-[7px] shrink-0">●</span>}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </form>
    </div>
  );
}