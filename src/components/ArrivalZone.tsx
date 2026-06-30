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

function AnalogClock({ time }: { time: Date }) {
  const hours = time.getHours() % 12;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  const hourDeg = hours * 30 + minutes * 0.5;
  const minuteDeg = minutes * 6;
  const secondDeg = seconds * 6;

  const size = 160;
  const center = size / 2;
  const outerR = center - 4;
  const hourTickOuter = outerR;
  const hourTickInner = outerR - 10;
  const minTickOuter = outerR;
  const minTickInner = outerR - 5;
  const numeralR = outerR - 22;

  const romanNumerals = ['XII', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI'];

  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* Minute ticks */}
      {Array.from({ length: 60 }).map((_, i) => {
        if (i % 5 === 0) return null;
        const angle = (i * 6 - 90) * (Math.PI / 180);
        const x1 = center + minTickOuter * Math.cos(angle);
        const y1 = center + minTickOuter * Math.sin(angle);
        const x2 = center + minTickInner * Math.cos(angle);
        const y2 = center + minTickInner * Math.sin(angle);
        return (
          <svg key={`m${i}`} className="absolute inset-0" width={size} height={size}>
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--theme-text-muted)" strokeWidth={0.5} opacity={0.2} />
          </svg>
        );
      })}

      {/* Hour ticks */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i * 30 - 90) * (Math.PI / 180);
        const x1 = center + hourTickOuter * Math.cos(angle);
        const y1 = center + hourTickOuter * Math.sin(angle);
        const x2 = center + hourTickInner * Math.cos(angle);
        const y2 = center + hourTickInner * Math.sin(angle);
        return (
          <svg key={`h${i}`} className="absolute inset-0" width={size} height={size}>
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--theme-text-muted)" strokeWidth={1} opacity={0.45} />
          </svg>
        );
      })}

      {/* Roman numerals at 12, 3, 6, 9 */}
      {[0, 3, 6, 9].map((idx) => {
        const angle = (idx * 30 - 90) * (Math.PI / 180);
        const x = center + numeralR * Math.cos(angle);
        const y = center + numeralR * Math.sin(angle);
        return (
          <span
            key={idx}
            className="absolute font-serif text-theme-text-muted/50"
            style={{
              left: x,
              top: y,
              transform: 'translate(-50%, -50%)',
              fontSize: 12,
              fontWeight: 400,
              letterSpacing: '0.08em',
            }}
          >
            {romanNumerals[idx * 1]}
          </span>
        );
      })}

      {/* Hour hand — tapered wedge */}
      <svg
        className="absolute origin-bottom"
        style={{
          width: 20,
          height: 44,
          left: center - 10,
          bottom: center,
          transform: `rotate(${hourDeg}deg)`,
        }}
        viewBox="0 0 20 44"
      >
        <path
          d="M10 0 L14 38 L10 44 L6 38 Z"
          fill="var(--theme-text)"
        />
      </svg>

      {/* Minute hand — slender tapered */}
      <svg
        className="absolute origin-bottom"
        style={{
          width: 14,
          height: 56,
          left: center - 7,
          bottom: center,
          transform: `rotate(${minuteDeg}deg)`,
        }}
        viewBox="0 0 14 56"
      >
        <path
          d="M7 0 L10 48 L7 56 L4 48 Z"
          fill="var(--theme-text)"
          opacity={0.65}
        />
      </svg>

      {/* Second hand — thin needle */}
      <svg
        className="absolute origin-bottom"
        style={{
          width: 8,
          height: 60,
          left: center - 4,
          bottom: center,
          transform: `rotate(${secondDeg}deg)`,
        }}
        viewBox="0 0 8 60"
      >
        <path
          d="M4 0 L5.5 52 L4 60 L2.5 52 Z"
          fill="var(--theme-accent)"
        />
      </svg>

      {/* Center dot */}
      <div
        className="absolute rounded-full"
        style={{
          width: 6,
          height: 6,
          left: center - 3,
          top: center - 3,
          backgroundColor: 'var(--theme-accent)',
        }}
      />
    </div>
  );
}

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

    if (settings.clockFormat === 'analog') {
      return null;
    } else if (settings.clockFormat === '12h') {
      hours = hours % 12;
      hours = hours ? hours : 12;
      return { main: `${hours}:${minutes}`, period: ampm, seconds: settings.showSeconds ? seconds : null };
    } else {
      const h24 = String(hours).padStart(2, '0');
      return { main: `${h24}:${minutes}`, period: null, seconds: settings.showSeconds ? seconds : null };
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
    <div id="arrival-zone" className="w-full flex flex-col items-center justify-center text-center py-10 px-4 max-w-4xl mx-auto select-none gap-8">
      
      {/* Clock and Greeting Header */}
      <section className="space-y-3 animate-fade-in">
        {settings.clockFormat === 'analog' ? (
          <div className="flex justify-center">
            <AnalogClock time={time} />
          </div>
        ) : (() => {
          const t = formatTime();
          if (!t) return null;
          return (
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-7xl sm:text-9xl font-light tracking-tighter text-theme-text font-sans leading-none tabular-nums">
                {t.main}
              </span>
              {t.seconds && (
                <span className="text-7xl sm:text-9xl font-light text-theme-text-muted/50 tabular-nums leading-none">
                  :{t.seconds}
                </span>
              )}
              {t.period && (
                <span className="text-lg sm:text-xl font-medium text-theme-text-muted/60 self-end mb-2 ml-0.5">
                  {t.period}
                </span>
              )}
            </div>
          );
        })()}
        <div className="text-[11px] font-mono tracking-wider uppercase text-theme-text-muted/80">
          {formatDate()}
        </div>
        <h2 className="text-[10px] sm:text-xs font-medium text-theme-text-muted uppercase tracking-[0.2em] italic opacity-60">
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
                  draggable
                  onDragStart={(e) => handleFavDragStart(e, fav.id)}
                  onDragOver={(e) => handleFavDragOver(e, fav.id)}
                  onDragEnd={handleFavDragEnd}
                  onDrop={(e) => handleFavDrop(e, fav.id)}
                >
                  {/* Favorite star — top right on hover */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onToggleFavorite(fav.id);
                    }}
                    className="absolute top-1.5 right-1.5 p-1 rounded-md bg-theme-input-bg border border-theme-border/40 text-theme-text-muted hover:text-yellow-500 hover:border-yellow-500/20 cursor-pointer opacity-0 group-hover:opacity-100 transition-all duration-200 z-10"
                    title={fav.isFavorite === true ? "Unfavorite" : "Favorite"}
                  >
                    <Star size={10} className={fav.isFavorite === true ? "fill-yellow-500 text-yellow-500" : ""} />
                  </button>

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

          {/* Inline Add Bookmark */}
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

        {/* Add More Links */}
        <div className="flex items-center justify-center mt-4">
          <button
            type="button"
            onClick={() => setShowAddMoreModal(true)}
            className="flex items-center gap-1.5 text-[9px] uppercase font-mono font-bold tracking-widest px-4 py-2 rounded-xl bg-theme-card/40 border border-theme-border/50 text-theme-text-muted hover:text-theme-accent hover:border-theme-accent/40 hover:bg-theme-card/80 transition-all cursor-pointer"
          >
            Add More Links
          </button>
        </div>
      </div>
    </div>
  );
}