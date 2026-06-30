import React from 'react';
import { Plus, Trash2, RefreshCw, Search, Globe } from 'lucide-react';
import { AnimatePresence } from 'motion/react';
import { RSSFeed } from './types';

interface FeedSidebarProps {
  feeds: RSSFeed[];
  activeFeedId: string;
  searchQuery: string;
  loading: boolean;
  onSearchChange: (query: string) => void;
  onRefresh: () => void;
  onSelectFeed: (id: string) => void;
  onDeleteFeed: (id: string, e: React.MouseEvent) => void;
  onOpenAddFeed: () => void;
}

export default function FeedSidebar({
  feeds,
  activeFeedId,
  searchQuery,
  loading,
  onSearchChange,
  onRefresh,
  onSelectFeed,
  onDeleteFeed,
  onOpenAddFeed,
}: FeedSidebarProps) {
  return (
    <div className="lg:col-span-1 bg-theme-card border border-theme-border/30 rounded-2xl p-4 flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-theme-text-muted shrink-0" size={14} />
          <input
            type="text"
            placeholder="Search feed..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-theme-input-bg border border-theme-border/40 text-theme-text focus:outline-none focus:border-theme-accent focus:ring-2 focus:ring-theme-accent/20 transition-all font-mono"
          />
        </div>

        <button
          onClick={onRefresh}
          disabled={loading}
          className="p-2.5 rounded-xl bg-theme-input-bg hover:bg-theme-input-bg/80 border border-theme-border/40 text-theme-text-muted hover:text-theme-text transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center shrink-0"
          title="Refresh feed"
        >
          <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      <div className="border-b border-theme-border/15 my-0.5" />

      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-wider text-theme-text-muted font-mono">
          Channels ({feeds.length})
        </span>
        <button
          onClick={onOpenAddFeed}
          className="p-1.5 rounded-lg bg-theme-accent/10 hover:bg-theme-accent/25 text-theme-accent cursor-pointer transition-all flex items-center justify-center"
          title="Add RSS Feed"
        >
          <Plus size={13} />
        </button>
      </div>

      <div className="flex flex-col gap-1 max-h-[350px] lg:max-h-none overflow-y-auto pr-1 scrollbar-thin">
        {feeds.map((f) => {
          const isActive = f.id === activeFeedId;
          return (
            <button
              key={f.id}
              onClick={() => onSelectFeed(f.id)}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-150 text-left cursor-pointer group ${
                isActive
                  ? 'bg-theme-accent text-theme-accent-text font-medium'
                  : 'hover:bg-theme-input-bg/55 text-theme-text border border-transparent hover:border-theme-border/20'
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                <Globe size={13} className={isActive ? 'text-theme-accent-text' : 'text-theme-text-muted group-hover:text-theme-text'} />
                <span className="text-[12px] truncate">{f.name}</span>
              </div>
              {!f.isDefault && (
                <button
                  onClick={(e) => onDeleteFeed(f.id, e)}
                  className={`p-1 rounded-lg transition-all ${
                    isActive
                      ? 'text-theme-accent-text/85 hover:text-theme-accent-text hover:bg-black/10'
                      : 'text-theme-text-muted hover:text-red-500 hover:bg-theme-input-bg'
                  }`}
                  title="Delete feed"
                >
                  <Trash2 size={11} />
                </button>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
