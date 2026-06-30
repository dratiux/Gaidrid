import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Play, 
  Star, 
  Zap,
  ChevronDown
} from 'lucide-react';
import type { Game, GameItem } from '../types';

const GAMEMONETIZE_API = 'https://rss.gamemonetize.com/rssfeed.php';

interface GamesPageProps {
  onOpenGame: (game: Game) => void;
  activeGameId?: string;
  onContextMenuGame?: (game: GameItem) => void;
}

const CATEGORY_GRADIENTS: Record<string, string> = {
  shooting: 'from-red-600 to-orange-500',
  puzzles: 'from-purple-600 to-pink-500',
  sports: 'from-green-600 to-emerald-500',
  arcade: 'from-yellow-600 to-red-500',
  racing: 'from-blue-600 to-cyan-500',
  action: 'from-orange-600 to-yellow-500',
  adventure: 'from-indigo-600 to-blue-500',
  strategy: 'from-violet-600 to-purple-500',
  girls: 'from-pink-600 to-rose-500',
  boys: 'from-teal-600 to-cyan-500',
  hypercasual: 'from-amber-600 to-yellow-500',
  cooking: 'from-lime-600 to-green-500',
  '2 player': 'from-sky-600 to-blue-500',
  other: 'from-neutral-600 to-neutral-500',
};

function getCategoryGradient(category: string): string {
  return CATEGORY_GRADIENTS[category.toLowerCase()] || CATEGORY_GRADIENTS.other;
}

function GameThumbnail({ title, category, url }: { title: string; category: string; url?: string }) {
  const [imgError, setImgError] = useState(false);
  const gradient = getCategoryGradient(category);
  const initial = title.charAt(0).toUpperCase();

  if (url && !imgError) {
    return (
      <img
        src={url}
        alt={title}
        referrerPolicy="no-referrer"
        onError={() => setImgError(true)}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
    );
  }

  return (
    <div className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center`}>
      <span className="text-white/90 font-black text-2xl font-mono">{initial}</span>
    </div>
  );
}

export default function GamesPage({ onOpenGame, activeGameId, onContextMenuGame }: GamesPageProps) {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [visibleCount, setVisibleCount] = useState<number>(24);

  useEffect(() => {
    fetchGames();

    const savedFavorites = localStorage.getItem('gaidrid_games_favorites');
    const favList = savedFavorites ? JSON.parse(savedFavorites) : [];
    setFavorites(favList);
  }, []);

  const fetchGames = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${GAMEMONETIZE_API}?format=json&amount=100&type=html5`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          const apiGames: Game[] = data.map((g: any) => ({
            id: 'gm-' + g.id,
            title: g.title || 'Untitled Game',
            thumbnail: g.thumb || '',
            short_description: g.description || '',
            game_url: g.url || '',
            genre: g.category || 'Other',
            rating: parseFloat((4 + Math.random()).toFixed(1))
          }));
          setGames(apiGames);
        } else {
          setGames([]);
        }
      } else {
        setGames([]);
      }
    } catch (e) {
      console.warn('Could not fetch GameMonetize games', e);
      setGames([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const current = [...favorites];
    const index = current.indexOf(id);
    if (index > -1) {
      current.splice(index, 1);
    } else {
      current.push(id);
    }
    setFavorites(current);
    localStorage.setItem('gaidrid_games_favorites', JSON.stringify(current));
  };

  const handleLaunchGame = (game: Game) => {
    onOpenGame(game);
  };

  const nebulaCategories = [...new Set<string>(games.map(g => g.genre))].sort();
  const categories = ['All', ...nebulaCategories, 'Favorites'];

  useEffect(() => {
    setVisibleCount(12);
  }, [searchQuery, selectedCategory]);

  const filteredGames = games.filter(g => {
    const matchesSearch = g.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          g.genre.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          g.short_description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;
    
    if (selectedCategory === 'All') return true;
    if (selectedCategory === 'Favorites') return favorites.includes(g.id);
    return g.genre.toLowerCase() === selectedCategory.toLowerCase();
  });

  return (
    <div 
      className="w-full flex flex-col gap-6 font-sans"
      data-games-page="true"
    >
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-theme-border/15">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-theme-text">
            Games
          </h2>
          <p className="text-xs text-theme-text-muted mt-0.5 font-sans uppercase tracking-wider">
            Play responsive premium HTML5 classics & discover new browser games synced directly in your dashboard
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Left sidebar */}
        <div className="lg:col-span-1 bg-theme-card border border-theme-border/30 rounded-2xl p-4 flex flex-col gap-3">
          
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-theme-text-muted shrink-0" size={14} />
            <input
              type="text"
              placeholder="Search games..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-theme-card border border-theme-border/40 text-theme-text placeholder-theme-text-muted/40 focus:outline-none focus:border-theme-accent focus:ring-2 focus:ring-theme-accent/20 transition-all font-mono"
            />
          </div>

          <div className="border-b border-theme-border/15 my-0.5" />

          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-theme-text-muted font-mono">
              Categories
            </span>
          </div>

          <div className="flex flex-col gap-1">
            {categories.map((cat) => {
              const count = cat === 'All' ? games.length : 
                            cat === 'Favorites' ? favorites.length :
                            games.filter(g => g.genre.toLowerCase() === cat.toLowerCase()).length;

              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-theme-accent text-theme-accent-text font-bold'
                      : 'text-theme-text-muted hover:text-theme-text hover:bg-theme-input-bg/50'
                  }`}
                >
                  <span className="truncate">
                    {cat}
                  </span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-lg font-bold font-mono ${
                    selectedCategory === cat 
                      ? 'bg-theme-accent-text/20 text-theme-accent-text' 
                      : 'bg-theme-border/40 text-theme-text'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right column: Games grid */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="rounded-2xl border border-theme-border/20 bg-theme-input-bg/20 animate-pulse overflow-hidden">
                  <div className="aspect-video bg-theme-border/20" />
                  <div className="p-3.5 space-y-2">
                    <div className="h-3 bg-theme-border/30 rounded w-3/4" />
                    <div className="h-2 bg-theme-border/15 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredGames.length === 0 ? (
            <div className="text-center py-20 px-6 bg-theme-card/30 rounded-2xl border border-theme-border/30">
              <Search className="mx-auto text-theme-text-muted/40 mb-3" size={32} />
              <span className="text-xs font-semibold text-theme-text-muted block">
                No matching games found in this category.
              </span>
              <p className="text-[11px] text-theme-text-muted/70 mt-1 max-w-sm mx-auto">
                Try modifying your query or select "All Games" to reset.
              </p>
            </div>
          ) : (
            <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredGames.slice(0, visibleCount).map((game) => {
                const isFav = favorites.includes(game.id);
                return (
                  <div
                    key={game.id}
                    onClick={() => handleLaunchGame(game)}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      onContextMenuGame?.({
                        title: game.title,
                        game_url: game.game_url,
                        genre: game.genre,
                        short_description: game.short_description,
                        thumbnail: game.thumbnail
                      });
                    }}
                    className="group bg-theme-card border border-theme-border/30 rounded-2xl overflow-hidden hover:border-theme-accent hover:shadow-lg transition-all duration-300 flex flex-col justify-between cursor-pointer h-full relative"
                  >
                    <div>
                      {/* Card Thumbnail */}
                      <div className="relative aspect-video overflow-hidden bg-theme-bg">
                        <GameThumbnail title={game.title} category={game.genre} url={game.thumbnail} />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        
                        {/* Rating Badge */}
                        <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded-lg bg-black/70 backdrop-blur-md text-[9px] font-bold text-yellow-400 flex items-center gap-1">
                          <Star size={9} fill="currentColor" />
                          <span>{game.rating}</span>
                        </div>

                        {/* Favorite Toggle */}
                        <button
                          onClick={(e) => toggleFavorite(game.id, e)}
                          className={`absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 hover:bg-black/80 text-white backdrop-blur-md transition-colors ${
                            isFav ? 'text-yellow-400' : 'text-theme-text-muted hover:text-theme-text'
                          }`}
                          title={isFav ? "Remove Favorite" : "Favorite game"}
                        >
                          <Star size={11} fill={isFav ? "currentColor" : "none"} />
                        </button>

                        <div className="absolute bottom-2 left-2 flex items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded-full bg-theme-accent/90 text-theme-accent-text text-[9px] font-bold uppercase tracking-wider">
                            {game.genre}
                          </span>
                        </div>
                      </div>

                      {/* Title & Description */}
                      <div className="p-3.5 space-y-1.5">
                        <h3 className="font-bold text-xs text-theme-text group-hover:text-theme-accent transition-colors truncate">
                          {game.title}
                        </h3>
                        <p className="text-[10px] text-theme-text-muted leading-relaxed line-clamp-2 h-7">
                          {game.short_description}
                        </p>
                      </div>
                    </div>

                    {/* Action row */}
                    <div className="px-3.5 pb-3.5 pt-1 border-t border-theme-border/10 flex items-center justify-end text-[10px]">
                      <span className="font-bold text-theme-accent flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                        Launch <Play size={8} fill="currentColor" className="ml-0.5" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
            {visibleCount < filteredGames.length && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={() => setVisibleCount((prev) => prev + 12)}
                  className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl bg-theme-input-bg/40 border border-theme-border/40 hover:border-theme-accent/60 text-theme-text hover:text-theme-accent cursor-pointer transition-all"
                >
                  Load More
                  <span className="text-[10px] text-theme-text-muted font-mono">
                    ({filteredGames.length - visibleCount} left)
                  </span>
                  <ChevronDown size={14} />
                </button>
              </div>
            )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
