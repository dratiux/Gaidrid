import React, { useState, useEffect, useRef } from 'react';
import { UserSettings, FavoriteSite } from '../types';
import { FaviconImage } from './ui/FaviconImage';
import { 
  Plus, 
  X,
  Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import SearchEngineSelector from './arrival/SearchEngineSelector';
import BookmarkAddModal from './arrival/BookmarkAddModal';
import PopularLinksModal from './arrival/PopularLinksModal';
import CategoryFilterBar from './arrival/CategoryFilterBar';
import { CATEGORY_LABELS, getCategoryForSite } from './arrival/constants';

interface ArrivalZoneProps {
  settings: UserSettings;
  favorites: FavoriteSite[];
  onAddFavorite: (name: string, url: string, icon: string, category?: string, isFavorite?: boolean) => void;
  onDeleteFavorite: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onRestoreFavorites: () => void;
  onUpdateSettings: (updates: Partial<UserSettings>) => void;
  onReorderFavorites: (newFavorites: FavoriteSite[]) => void;
}

export default function ArrivalZone({ 
  settings, 
  favorites, 
  onAddFavorite, 
  onDeleteFavorite,
  onToggleFavorite,
  onRestoreFavorites,
  onUpdateSettings,
  onReorderFavorites
}: ArrivalZoneProps) {
  const [time, setTime] = useState(new Date());
  const [showAddFav, setShowAddFav] = useState(false);
  const [showAddMoreModal, setShowAddMoreModal] = useState(false);
  const [newFavName, setNewFavName] = useState('');
  const [newFavUrl, setNewFavUrl] = useState('');
  const [newFavIcon, setNewFavIcon] = useState('search');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('Favorite');

  // Drag and Drop for Bookmarks
  const [draggedFavId, setDraggedFavId] = useState<string | null>(null);
  const [dragOverFavId, setDragOverFavId] = useState<string | null>(null);

  const handleFavDragStart = (e: React.DragEvent, id: string) => {
    if (typeof document !== 'undefined' && document.querySelector('.fixed.inset-0')) {
      e.preventDefault();
      return;
    }
    setDraggedFavId(id);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', id);
  };

  const handleFavDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    if (draggedFavId && draggedFavId !== id) {
      setDragOverFavId(id);
    }
  };

  const handleFavDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    const sourceId = e.dataTransfer.getData('text/plain') || draggedFavId;
    if (sourceId && sourceId !== targetId) {
      const currentFavs = [...favorites];
      const sourceIndex = currentFavs.findIndex(f => f.id === sourceId);
      const targetIndex = currentFavs.findIndex(f => f.id === targetId);

      if (sourceIndex !== -1 && targetIndex !== -1) {
        const itemToMove = currentFavs[sourceIndex];
        currentFavs.splice(sourceIndex, 1);
        currentFavs.splice(targetIndex, 0, itemToMove);
        onReorderFavorites(currentFavs);
      }
    }
    setDraggedFavId(null);
    setDragOverFavId(null);
  };

  const handleFavDragEnd = () => {
    setDraggedFavId(null);
    setDragOverFavId(null);
  };

  // Custom Categories state (stored in localStorage, limit 5)
  const [customCategories, setCustomCategories] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('gaidrid_custom_categories');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const handleAddCustomCategory = (name: string) => {
    const updated = [...customCategories, name];
    setCustomCategories(updated);
    localStorage.setItem('gaidrid_custom_categories', JSON.stringify(updated));
  };

  const handleDeleteCustomCategory = (catToDelete: string) => {
    const updated = customCategories.filter(c => c.toLowerCase() !== catToDelete.toLowerCase());
    setCustomCategories(updated);
    localStorage.setItem('gaidrid_custom_categories', JSON.stringify(updated));
    if (activeCategoryFilter.toLowerCase() === catToDelete.toLowerCase()) {
      setActiveCategoryFilter('All');
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format Time
  const formatTime = () => {
    let hours = time.getHours();
    const minutes = String(time.getMinutes()).padStart(2, '0');
    const seconds = String(time.getSeconds()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';

    if (settings.clockFormat === '12h') {
      hours = hours % 12;
      hours = hours ? hours : 12;
      return `${hours}:${minutes}${settings.showSeconds ? `:${seconds}` : ''} ${ampm}`;
    } else if (settings.clockFormat === 'detailed') {
      const options: Intl.DateTimeFormatOptions = { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      };
      const dateStr = time.toLocaleDateString('en-US', options);
      const h24 = String(hours).padStart(2, '0');
      return `${dateStr} • ${h24}:${minutes}${settings.showSeconds ? `:${seconds}` : ''}`;
    } else {
      const h24 = String(hours).padStart(2, '0');
      return `${h24}:${minutes}${settings.showSeconds ? `:${seconds}` : ''}`;
    }
  };

  // Format Date
  const formatDate = () => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return time.toLocaleDateString('en-US', options);
  };

  // Get Greeting based on setting
  const getGreeting = () => {
    const hours = time.getHours();
    let timeGreeting = 'Good evening';
    if (hours < 12) {
      timeGreeting = 'Good morning';
    } else if (hours < 18) {
      timeGreeting = 'Good afternoon';
    }

    switch (settings.greetingType) {
      case 'casual':
        return `Hey ${settings.username || 'there'}, focus up.`;
      case 'formal':
        return `Salutations, ${settings.username || 'Partner'}. Initiate your workflow.`;
      case 'philosophical':
        const philosophicalQuotes = [
          "The present moment is all you ever have. Focus deep.",
          "In the middle of every difficulty lies creative opportunity.",
          "Polish each detail. Excellence is the summation of small steps.",
          "Your work is a statement of your standards. Make it elegant.",
          "Calm in mind, relentless in execution.",
          "Determine to make today outstanding."
        ];
        return philosophicalQuotes[hours % philosophicalQuotes.length];
      case 'standard':
      default:
        return `${timeGreeting}, ${settings.username || 'User'}.`;
    }
  };

  const handleAddFav = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFavName.trim() || !newFavUrl.trim()) return;
    
    let formattedUrl = newFavUrl.trim();
    if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = 'https://' + formattedUrl;
    }

    const isFavTab = false;
    onAddFavorite(newFavName.trim(), formattedUrl, newFavIcon, newFavIcon, isFavTab);
    setNewFavName('');
    setNewFavUrl('');
    setNewFavIcon('search');
    setShowAddFav(false);
  };

  const getSearchEnginePlaceholder = () => {
    switch (settings.searchEngine) {
      case 'duckduckgo': return 'Search DuckDuckGo...';
      case 'bing': return 'Search Bing...';
      case 'github': return 'Search GitHub repositories...';
      case 'gemini': return 'Ask Gemini AI...';
      case 'google':
      default: return 'Search Google or type a URL...';
    }
  };

  return (
    <div id="arrival-zone" className="w-full flex flex-col items-center justify-center text-center py-8 px-4 max-w-4xl mx-auto select-none gap-6">
      
      {/* Clock and Greeting Header */}
      <section className="space-y-2 animate-fade-in">
        <h1 className="text-6xl sm:text-8xl font-medium tracking-tight text-theme-text font-sans leading-none">
          {formatTime()}
        </h1>
        <div className="text-[11px] font-mono tracking-wider uppercase text-theme-text-muted/80">
          {formatDate()}
        </div>
        <h2 className="text-[10px] sm:text-xs font-black text-theme-text-muted uppercase tracking-[0.3em] opacity-80">
          {getGreeting()}
        </h2>
      </section>

      {/* Universal Search Bar */}
      <SearchEngineSelector
        searchEngine={settings.searchEngine}
        onSearchEngineChange={(engine) => onUpdateSettings({ searchEngine: engine as any })}
        getSearchEnginePlaceholder={getSearchEnginePlaceholder}
      />

      {/* Bookmarks Grid */}
      <div className="w-full max-w-2xl mt-4">
        {/* Add Bookmark Modal */}
        <BookmarkAddModal
          show={showAddFav}
          onClose={() => setShowAddFav(false)}
          newFavName={newFavName}
          onNewFavNameChange={setNewFavName}
          newFavUrl={newFavUrl}
          onNewFavUrlChange={setNewFavUrl}
          newFavIcon={newFavIcon}
          onNewFavIconChange={setNewFavIcon}
          onSubmit={handleAddFav}
          customCategories={customCategories}
        />

        {/* Popular Links Modal */}
        <PopularLinksModal
          show={showAddMoreModal}
          onClose={() => setShowAddMoreModal(false)}
          favorites={favorites}
          onAddFavorite={onAddFavorite}
          onRestoreFavorites={onRestoreFavorites}
        />

        {/* Category Filters for Bookmarks */}
        <CategoryFilterBar
          favorites={favorites}
          activeCategoryFilter={activeCategoryFilter}
          onCategoryFilterChange={setActiveCategoryFilter}
          customCategories={customCategories}
          onAddCustomCategory={handleAddCustomCategory}
          onDeleteCustomCategory={handleDeleteCustomCategory}
        />

        {/* Bookmarks Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {favorites
            .filter((fav) => activeCategoryFilter === 'Favorite' ? fav.isFavorite === true : getCategoryForSite(fav, customCategories) === activeCategoryFilter.toLowerCase())
            .map((fav) => {
              const siteCategory = getCategoryForSite(fav, customCategories);
              const isDragging = draggedFavId === fav.id;
              const isDragOver = dragOverFavId === fav.id;
              const isAnyModalOpen = typeof document !== 'undefined' && !!document.querySelector('.fixed.inset-0');
              return (
                <div
                  key={fav.id}
                  data-portal-id={fav.id}
                  className={`relative group cursor-move rounded-2xl flex flex-col items-center bg-theme-card/40 border transition-all duration-300 select-none ${
                    isDragging
                      ? 'opacity-30 border-dashed border-theme-border scale-[0.98]'
                      : isDragOver
                      ? 'border-theme-accent ring-2 ring-theme-accent/20 scale-[0.99] opacity-85'
                      : 'border-theme-border/50 hover:border-theme-accent/60 hover:bg-theme-card/80 hover:scale-[1.03] active:scale-[0.98]'
                  }`}
                  draggable={!isAnyModalOpen}
                  onDragStart={(e) => handleFavDragStart(e, fav.id)}
                  onDragOver={(e) => handleFavDragOver(e, fav.id)}
                  onDragEnd={handleFavDragEnd}
                  onDrop={(e) => handleFavDrop(e, fav.id)}
                >
                  {/* Actions shortcut panel on hover */}
                  <div className="absolute top-1.5 right-1.5 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200 z-10">
                    {activeCategoryFilter !== 'Favorite' && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          onDeleteFavorite(fav.id);
                        }}
                        className="p-1 rounded-md bg-theme-input-bg border border-theme-border/40 text-theme-text-muted hover:text-red-500 hover:border-red-500/20 cursor-pointer"
                        title="Delete Bookmark Shortcut"
                      >
                        <X size={10} className="stroke-[2.5]" />
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onToggleFavorite(fav.id);
                      }}
                      className="p-1 rounded-md bg-theme-input-bg border border-theme-border/40 text-theme-text-muted hover:text-yellow-500 hover:border-yellow-500/20 cursor-pointer"
                      title={fav.isFavorite === true ? "Remove from Favorites" : "Add to Favorites"}
                    >
                      <Star size={10} className={fav.isFavorite === true ? "fill-yellow-500 text-yellow-500" : ""} />
                    </button>
                  </div>

                  <a
                    href={fav.url}
                    target="_blank"
                    referrerPolicy="no-referrer"
                    className="flex flex-col items-center p-3 w-full h-full relative"
                    onClick={(e) => {
                      if (draggedFavId) {
                        e.preventDefault();
                      }
                    }}
                  >
                    <div className="w-10 h-10 rounded-xl bg-theme-input-bg/70 flex items-center justify-center text-theme-text-muted transition-all mb-2 border border-theme-border/30 overflow-hidden relative">
                      <FaviconImage url={fav.url} size={64} className="w-5 h-5 object-contain transition-transform group-hover:scale-110" />
                    </div>
                    <span className="text-[10px] font-extrabold tracking-widest text-theme-text/80 uppercase truncate w-full px-1">
                      {fav.name}
                    </span>
                    <span className="text-[8px] font-mono font-bold text-theme-text-muted/60 uppercase tracking-wider group-hover:text-theme-text/80 transition-colors mt-0.5 truncate w-full px-0.5">
                      {CATEGORY_LABELS[siteCategory] || siteCategory}
                    </span>
                  </a>
                </div>
              );
            })}

          {/* Inline Add Bookmark Custom Shape */}
          <button
            type="button"
            onClick={() => setShowAddFav(true)}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-theme-card/30 border border-dashed border-theme-border/80 hover:border-theme-accent/60 hover:bg-theme-card/70 transition-all duration-200 hover:scale-[1.03] active:scale-[0.98] group cursor-pointer min-h-[92px]"
          >
            <div className="w-10 h-10 rounded-xl bg-theme-input-bg/50 flex items-center justify-center text-theme-text-muted group-hover:bg-theme-accent group-hover:text-theme-accent-text transition-all mb-2 border border-theme-border/25">
              <Plus size={16} className="stroke-[3] text-theme-accent group-hover:text-theme-accent-text transition-colors" />
            </div>
            <span className="text-[10px] font-extrabold tracking-widest text-theme-text-muted group-hover:text-theme-text uppercase truncate w-full px-1.5">
              Add New
            </span>
            <span className="text-[8px] font-mono font-bold text-theme-text-muted/40 uppercase tracking-wider group-hover:text-theme-accent/80 transition-colors mt-0.5">
              Bookmark
            </span>
          </button>
        </div>

        {/* Directory Button bottom row */}
        <div className="flex items-center justify-center mt-5">
          <button
            type="button"
            onClick={() => setShowAddMoreModal(true)}
            className="flex items-center gap-1.5 text-[9px] uppercase font-mono font-black tracking-widest px-4 py-2 rounded-xl bg-theme-card/50 border border-theme-border/70 text-theme-text-muted hover:text-theme-accent hover:border-theme-accent/50 hover:bg-theme-card/85 transition-all cursor-pointer"
          >
            Add More Links
          </button>
        </div>
      </div>
    </div>
  );
}