import React, { useState, useEffect } from 'react';
import { Bookmark, FavoriteSite } from '../types';
import { ExternalLink, Plus, Trash2, X, Star, History, Pin, Search, BookmarkCheck } from 'lucide-react';
import ModalOverlay from './ModalOverlay';
import { WidgetHeader } from './ui/WidgetHeader';
import { WidgetSearchBar } from './ui/WidgetSearchBar';
import { IconButton } from './ui/IconButton';
import { ModalCloseButton } from './ui/ModalCloseButton';
import { TextInput } from './ui/TextInput';
import { PrimaryButton } from './ui/PrimaryButton';
import { FaviconImage } from './ui/FaviconImage';

interface BookmarksWidgetProps {
  bookmarks: Bookmark[];
  favorites?: FavoriteSite[];
  onAddBookmark: (title: string, url: string, category: string) => void;
  onDeleteBookmark: (id: string) => void;
  onAddFavorite?: (name: string, url: string, icon: string, category?: string, isFavorite?: boolean) => void;
  onDeleteFavorite?: (id: string) => void;
  onToggleFavorite?: (id: string) => void;
  onRemove?: () => void;
}

interface RecentVisit {
  id: string;
  title: string;
  url: string;
  visitedAt: number;
  isPinned?: boolean;
}

export default function BookmarksWidget({ 
  bookmarks, 
  favorites, 
  onAddBookmark, 
  onDeleteBookmark,
  onAddFavorite,
  onDeleteFavorite,
  onToggleFavorite,
  onRemove
}: BookmarksWidgetProps) {
  const [activeTab, setActiveTab] = useState<'recent' | 'saved'>('recent');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newCategory, setNewCategory] = useState('General');
  const [recentVisits, setRecentVisits] = useState<RecentVisit[]>([]);
  const [timeTrigger, setTimeTrigger] = useState(0);

  // Load and sync recent visits
  useEffect(() => {
    const saved = localStorage.getItem('gaidrid_recent_visits');
    if (saved) {
      try {
        setRecentVisits(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse recent visits', e);
      }
    }
  }, []);

  const saveRecentVisits = (visits: RecentVisit[]) => {
    setRecentVisits(visits);
    localStorage.setItem('gaidrid_recent_visits', JSON.stringify(visits));
  };

  // Live timer tick to update relative times every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeTrigger((prev) => prev + 1);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // Global listener to auto-intercept clicks on any external links across the app
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest('a');
      if (anchor && anchor.href && /^https?:\/\//i.test(anchor.href)) {
        // Exclude internal routing or anchor hashtags if any
        if (anchor.getAttribute('href')?.startsWith('#')) return;

        const urlStr = anchor.href;
        let titleStr = anchor.innerText?.trim() || anchor.title?.trim();
        
        // Fallback title determination
        if (!titleStr) {
          try {
            titleStr = new URL(urlStr).hostname;
          } catch (err) {
            titleStr = 'Web Link';
          }
        }

        // Limit length of title
        if (titleStr.length > 50) {
          titleStr = titleStr.substring(0, 47) + '...';
        }

        // Add to recent visits
        const now = Date.now();
        setRecentVisits((prev) => {
          // Remove duplicates
          const filtered = prev.filter((item) => item.url.replace(/\/$/, '') !== urlStr.replace(/\/$/, ''));
          const updated = [
            {
              id: String(now),
              title: titleStr,
              url: urlStr,
              visitedAt: now,
              isPinned: prev.find((item) => item.url.replace(/\/$/, '') === urlStr.replace(/\/$/, ''))?.isPinned || false
            },
            ...filtered
          ].slice(0, 40); // Max 40 visits tracked
          
          localStorage.setItem('gaidrid_recent_visits', JSON.stringify(updated));
          return updated;
        });
      }
    };

    document.addEventListener('click', handleGlobalClick);
    return () => document.removeEventListener('click', handleGlobalClick);
  }, []);

  // Relative time renderer helper
  const getRelativeTime = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    if (diff < 15000) return 'Just now';
    if (diff < 60000) return 'Seconds ago';
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  // Extract hostname for cleaner presentation
  const getDomain = (urlStr: string) => {
    try {
      const parsed = new URL(urlStr);
      return parsed.hostname.replace('www.', '');
    } catch (e) {
      return '';
    }
  };

  // Add a manual bookmark/saved tab
  const handleManualAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newUrl.trim()) return;

    let formattedUrl = newUrl.trim();
    if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = 'https://' + formattedUrl;
    }

    onAddBookmark(newTitle.trim(), formattedUrl, newCategory.trim());
    setNewTitle('');
    setNewUrl('');
    setIsAdding(false);
  };

  // Delete a single visit from history
  const handleDeleteVisit = (idToDelete: string) => {
    const updated = recentVisits.filter((v) => v.id !== idToDelete);
    saveRecentVisits(updated);
  };

  // Toggle Pinned status on a history item
  const handleTogglePinVisit = (visit: RecentVisit) => {
    const updated = recentVisits.map((v) => {
      if (v.id === visit.id) {
        return { ...v, isPinned: !v.isPinned };
      }
      return v;
    });
    saveRecentVisits(updated);

    // If pinning, also check if it exists in bookmarks, or add to bookmarks
    const isNowPinned = !visit.isPinned;
    const existingBookmark = bookmarks.find(b => b.url.replace(/\/$/, '') === visit.url.replace(/\/$/, ''));
    
    if (isNowPinned && !existingBookmark) {
      onAddBookmark(visit.title, visit.url, 'Saved Tabs');
    } else if (!isNowPinned && existingBookmark) {
      onDeleteBookmark(existingBookmark.id);
    }
  };

  // Clear all recent history
  const handleClearAllHistory = () => {
    if (confirm('Are you sure you want to clear your recently visited tabs history?')) {
      saveRecentVisits([]);
    }
  };

  // Filter lists based on search
  const filteredRecent = recentVisits.filter(
    (v) =>
      v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.url.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredSaved = bookmarks.filter(
    (b) =>
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div id="widget-bookmarks" className="flex flex-col h-full justify-between p-5 select-none">
      <WidgetHeader
        title="Bookmarks"
        actions={
          <>
            <IconButton
              onClick={() => {
                setShowSearch(!showSearch);
                if (showSearch) setSearchQuery('');
              }}
              variant={showSearch ? 'active' : 'default'}
              icon={<Search size={12} />}
              label="Search tabs"
              title="Search tabs"
            />
            <IconButton
              onClick={() => setIsAdding(!isAdding)}
              icon={<Plus size={12} />}
              label="Add Bookmark"
              title="Add Bookmark"
            />
            {onRemove && (
              <IconButton
                onClick={onRemove}
                variant="danger"
                icon={<X size={12} />}
                label="Remove bookmarks widget"
                title="Remove Widget"
              />
            )}
            {activeTab === 'recent' && recentVisits.length > 0 && (
              <IconButton
                onClick={handleClearAllHistory}
                variant="danger"
                icon={<Trash2 size={12} />}
                label="Clear all history"
                title="Clear History"
              />
            )}
          </>
        }
      />

      {/* Tab Buttons */}
      <div className="flex bg-theme-input-bg/70 p-0.5 rounded-xl border border-theme-border/40 shrink-0 mb-3">
        <button
          onClick={() => { setActiveTab('recent'); setIsAdding(false); }}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-[9px] font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
            activeTab === 'recent' 
              ? 'bg-theme-card text-theme-text border border-theme-border/30' 
              : 'text-theme-text-muted hover:text-theme-text'
          }`}
          aria-label={`Switch to history tab, ${recentVisits.length} items`}
          aria-pressed={activeTab === 'recent'}
        >
          <History size={10} />
          History ({recentVisits.length})
        </button>
        <button
          onClick={() => { setActiveTab('saved'); setIsAdding(false); }}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-[9px] font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
            activeTab === 'saved' 
              ? 'bg-theme-card text-theme-text border border-theme-border/30' 
              : 'text-theme-text-muted hover:text-theme-text'
          }`}
          aria-label={`Switch to pinned tab, ${bookmarks.length} items`}
          aria-pressed={activeTab === 'saved'}
        >
          <Pin size={10} />
          Pinned ({bookmarks.length})
        </button>
      </div>

        <div className="flex-1 flex flex-col min-h-0">
          {showSearch && (
            <WidgetSearchBar
              query={searchQuery}
              onQueryChange={setSearchQuery}
              placeholder={activeTab === 'recent' ? "Search visited history" : "Search pinned bookmarks"}
              className="mb-2.5 shrink-0"
            />
          )}

          {/* List Wrapper */}
          <div
            className="flex-1 overflow-y-auto max-h-[190px] pr-0.5 space-y-1.5 scrollbar-thin premium-scroll-mask"
            role="list"
            aria-label={activeTab === 'recent' ? "Recent tabs list" : "Pinned tabs list"}
          >
            {activeTab === 'recent' ? (
              filteredRecent.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-xs text-theme-text-muted py-10 gap-1 opacity-70">
                  <BookmarkCheck size={18} className="text-theme-text-muted/40 mb-1" />
                  <span className="font-bold uppercase tracking-wider text-[9px] font-mono">No Recent Tabs</span>
                  <span className="text-[9px]">Clicks on launchpad portals or custom shortcuts will automatically build your live browser history tab.</span>
                </div>
              ) : (
                filteredRecent.map((visit) => {
                  const domain = getDomain(visit.url);
                  const isPinned = bookmarks.some(b => b.url.replace(/\/$/, '') === visit.url.replace(/\/$/, ''));
                  return (
                    <div
                      key={visit.id}
                      className="group flex items-center justify-between p-2 rounded-xl bg-theme-card border border-theme-border/40 hover:border-theme-accent/30 hover:bg-theme-input-bg/10 transition-all hover:translate-x-[1px]"
                      role="listitem"
                    >
                      <a
                        href={visit.url}
                        target="_blank"
                        referrerPolicy="no-referrer"
                        className="flex items-center gap-2.5 flex-1 min-w-0"
                        title={visit.title}
                      >
                        {/* High fidelity Google Favicon loader with generic fallback */}
                        <div className="w-6 h-6 rounded-lg bg-theme-input-bg flex items-center justify-center shrink-0 border border-theme-border/30 overflow-hidden">
                          <FaviconImage url={visit.url} size={32} className="w-3.5 h-3.5 object-contain" />
                        </div>
                        <div className="flex flex-col min-w-0 text-left">
                          <span className="text-xs font-bold text-theme-text group-hover:text-theme-accent transition-colors truncate">
                            {visit.title}
                          </span>
                          <span className="text-[8px] font-mono font-medium text-theme-text-muted/65 tracking-wide uppercase mt-0.5">
                            {domain || 'web shortcut'}
                          </span>
                        </div>
                      </a>

                      <div className="flex items-center gap-1">
                        <span className="text-[8px] font-mono font-semibold text-theme-text-muted opacity-80 group-hover:opacity-0 transition-opacity duration-150 pr-1 shrink-0">
                          {getRelativeTime(visit.visitedAt)}
                        </span>
                        
                        <div className="absolute right-2.5 flex items-center opacity-0 group-hover:opacity-100 transition-opacity gap-1 bg-gradient-to-l from-theme-card via-theme-card pl-3 py-1 rounded-lg">
                          <button
                            onClick={() => handleTogglePinVisit(visit)}
                            className="p-1 text-theme-text-muted hover:text-yellow-500 rounded-md hover:bg-theme-input-bg cursor-pointer transition-all hover:scale-110"
                            title={isPinned ? 'Unpin Tab' : 'Pin Tab'}
                            aria-label={isPinned ? `Unpin ${visit.title}` : `Pin ${visit.title}`}
                          >
                            <Star size={11} className={isPinned ? "fill-yellow-500 text-yellow-500" : ""} />
                          </button>
                          <a
                            href={visit.url}
                            target="_blank"
                            referrerPolicy="no-referrer"
                            className="p-1 text-theme-text-muted hover:text-theme-accent rounded-md hover:bg-theme-input-bg transition-all hover:scale-110"
                            title="Open Link"
                            aria-label={`Open ${visit.title} in new tab`}
                          >
                            <ExternalLink size={11} />
                          </a>
                          <button
                            onClick={() => handleDeleteVisit(visit.id)}
                            className="p-1 text-theme-text-muted hover:text-red-500 rounded-md hover:bg-theme-input-bg cursor-pointer transition-all hover:scale-110"
                            title="Remove from History"
                            aria-label={`Remove ${visit.title} from history`}
                          >
                            <X size={11} className="stroke-[2.5]" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )
            ) : (
              filteredSaved.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-xs text-theme-text-muted py-10 gap-1 opacity-70">
                  <Pin size={18} className="text-theme-text-muted/40 mb-1" />
                  <span className="font-bold uppercase tracking-wider text-[9px] font-mono">No Pinned Tabs</span>
                  <span className="text-[9px]">Star any visited history item or click the '+' button to keep permanently pinned tabs.</span>
                </div>
              ) : (
                filteredSaved.map((b) => {
                  const domain = getDomain(b.url);
                  const existingFav = favorites?.find(fav => fav.url.replace(/\/$/, '') === b.url.replace(/\/$/, ''));
                  const isFavoriteShortcut = existingFav ? existingFav.isFavorite === true : false;

                  return (
                    <div
                      key={b.id}
                      className="group flex items-center justify-between p-2 rounded-xl bg-theme-card border border-theme-border/40 hover:border-theme-accent/30 hover:bg-theme-input-bg/10 transition-all hover:translate-x-[1px]"
                      role="listitem"
                    >
                      <a
                        href={b.url}
                        target="_blank"
                        referrerPolicy="no-referrer"
                        className="flex items-center gap-2.5 flex-1 min-w-0"
                        title={b.title}
                      >
                        <div className="w-6 h-6 rounded-lg bg-theme-input-bg flex items-center justify-center shrink-0 border border-theme-border/30 overflow-hidden">
                          <FaviconImage url={b.url} size={32} className="w-3.5 h-3.5 object-contain" />
                        </div>
                        <div className="flex flex-col min-w-0 text-left">
                          <span className="text-xs font-bold text-theme-text group-hover:text-theme-accent transition-colors truncate">
                            {b.title}
                          </span>
                          <span className="text-[8px] font-mono font-semibold text-theme-text-muted/65 tracking-wide uppercase mt-0.5">
                            {b.category ? `${b.category} • ` : ''}{domain || 'portal'}
                          </span>
                        </div>
                      </a>

                      <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity gap-1 pr-1">
                        {(onAddFavorite || onToggleFavorite) && (
                          <button
                            onClick={() => {
                              if (existingFav) {
                                if (onToggleFavorite) onToggleFavorite(existingFav.id);
                              } else if (onAddFavorite) {
                                const favCategory = b.category ? b.category.toLowerCase() : 'search';
                                onAddFavorite(b.title, b.url, favCategory, favCategory, true);
                              }
                            }}
                            className="p-1 text-theme-text-muted hover:text-yellow-500 rounded-md hover:bg-theme-input-bg cursor-pointer transition-all hover:scale-110"
                            title={isFavoriteShortcut ? 'Remove from favorites' : 'Add to favorites'}
                            aria-label={isFavoriteShortcut ? `Remove ${b.title} from favorites` : `Add ${b.title} to favorites`}
                          >
                            <Star size={11} className={isFavoriteShortcut ? "fill-yellow-500 text-yellow-500" : ""} />
                          </button>
                        )}
                        <a
                          href={b.url}
                          target="_blank"
                          referrerPolicy="no-referrer"
                          className="p-1 text-theme-text-muted hover:text-theme-accent rounded-md hover:bg-theme-input-bg transition-all hover:scale-110"
                          title="Open Link"
                          aria-label={`Open ${b.title} in new tab`}
                        >
                          <ExternalLink size={11} />
                        </a>
                        <button
                          onClick={() => onDeleteBookmark(b.id)}
                          className="p-1 text-theme-text-muted hover:text-red-500 rounded-md hover:bg-theme-input-bg cursor-pointer transition-all hover:scale-110"
                          title="Unpin Tab"
                          aria-label={`Unpin ${b.title}`}
                        >
                          <X size={11} className="stroke-[2.5]" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )
            )}
          </div>
        </div>

      {isAdding && (
        <ModalOverlay onClose={() => setIsAdding(false)} label="Add bookmark dialog">
            <div className="flex items-center justify-between border-b border-theme-border/30 pb-3">
              <h3 className="text-xs font-black uppercase tracking-[0.25em] text-theme-text-muted">
                Add Bookmark
              </h3>
              <ModalCloseButton onClick={() => setIsAdding(false)} />
            </div>
            
            <form onSubmit={handleManualAdd} className="space-y-4 flex flex-col">
              <div className="space-y-3.5">
                <TextInput
                  label="Tab Title"
                  placeholder="e.g. GitHub"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                  autoFocus
                  aria-label="Bookmark title"
                />
                <TextInput
                  label="Destination URL"
                  placeholder="e.g. github.com"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  required
                  aria-label="Bookmark URL"
                  className="font-mono"
                />
                <TextInput
                  label="Category (Optional)"
                  placeholder="e.g. Development"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  aria-label="Bookmark category"
                />
              </div>

              <div className="flex gap-2.5 pt-2">
                <PrimaryButton type="submit">Save Bookmark</PrimaryButton>
              </div>
            </form>
        </ModalOverlay>
      )}
    </div>
  );
}
