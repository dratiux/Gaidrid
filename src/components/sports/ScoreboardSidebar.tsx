import React from 'react';
import { Search, RefreshCw } from 'lucide-react';
import { LEAGUES } from '../../data/sportsMockData';

interface ScoreboardSidebarProps {
  selectedLeague: string;
  onLeagueChange: (id: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filterState: 'all' | 'live' | 'upcoming' | 'completed';
  onFilterChange: (state: 'all' | 'live' | 'upcoming' | 'completed') => void;
  loading: boolean;
  onRefresh: () => void;
}

export default function ScoreboardSidebar({
  selectedLeague,
  onLeagueChange,
  searchQuery,
  onSearchChange,
  filterState,
  onFilterChange,
  loading,
  onRefresh,
}: ScoreboardSidebarProps) {
  return (
    <div className="lg:col-span-1 bg-theme-card border border-theme-border/30 rounded-2xl p-4 flex flex-col gap-4">
      {/* Search and Action Row above Select Arena */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-theme-text-muted shrink-0" size={14} />
          <input
            type="text"
            placeholder="Search teams / match..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-theme-input-bg border border-theme-border/40 text-theme-text focus:outline-none focus:border-theme-accent focus:ring-2 focus:ring-theme-accent/20 transition-all font-mono"
          />
        </div>

        <button
          onClick={onRefresh}
          disabled={loading}
          className="p-2.5 rounded-xl bg-theme-input-bg hover:bg-theme-input-bg/80 border border-theme-border/40 text-theme-text-muted hover:text-theme-text transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center shrink-0"
          title="Refresh Scores"
        >
          <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      <div className="border-b border-theme-border/15 my-0.5" />

      <div>
        <span className="text-[10px] font-black uppercase tracking-wider text-theme-text-muted font-mono block mb-2.5">
          Select Arena
        </span>
        <div className="flex flex-col gap-1.5">
          {LEAGUES.map((league) => (
            <button
              key={league.id}
              onClick={() => onLeagueChange(league.id)}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-between cursor-pointer ${
                selectedLeague === league.id
                  ? 'bg-theme-accent text-theme-accent-text font-bold'
                  : 'bg-theme-input-bg/40 text-theme-text hover:bg-theme-input-bg/75'
              }`}
            >
              <span className="truncate">{league.name}</span>
              <span className="text-[10px] opacity-70">
                {league.id === 'all' ? 'World' : league.id.toUpperCase()}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-theme-border/15 pt-3.5">
        <span className="text-[10px] font-black uppercase tracking-wider text-theme-text-muted font-mono block mb-2.5">
          Match Status Filter
        </span>
        <div className="grid grid-cols-2 gap-1.5">
          {(['all', 'live', 'upcoming', 'completed'] as const).map((s) => (
            <button
              key={s}
              onClick={() => onFilterChange(s)}
              className={`py-2 rounded-xl text-[10px] uppercase font-bold tracking-wider transition-all cursor-pointer border text-center ${
                filterState === s
                  ? 'bg-theme-accent text-theme-accent-text border-transparent'
                  : 'bg-theme-input-bg/30 text-theme-text-muted border-theme-border/20 hover:text-theme-text hover:border-theme-border/40'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
