import React, { useState, useEffect } from 'react';
import { X, Star } from 'lucide-react';
import { WidgetHeader } from './ui/WidgetHeader';
import { IconButton } from './ui/IconButton';
import type { Game, GameItem } from '../types';

const GAMEMONETIZE_API = 'https://rss.gamemonetize.com/rssfeed.php';

interface GamesWidgetProps {
  onRemove: () => void;
  onOpenGame?: (game: Game) => void;
  onNavigate?: (page: string) => void;
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
        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
      />
    );
  }

  return (
    <div className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center`}>
      <span className="text-white/90 font-black text-lg font-mono">{initial}</span>
    </div>
  );
}

export default function GamesWidget({ onRemove, onOpenGame, onNavigate, onContextMenuGame }: GamesWidgetProps) {
  const [favoriteCount, setFavoriteCount] = useState<number>(0);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [activeTab, setActiveTab] = useState<string>('All');

  useEffect(() => {
    const handleUpdate = () => {
      const savedFavorites = localStorage.getItem('gaidrid_games_favorites');
      const favList: string[] = savedFavorites ? JSON.parse(savedFavorites) : [];
      setFavorites(favList);
      setFavoriteCount(favList.length);
    };

    handleUpdate();
    fetchGames();
    window.addEventListener('storage', handleUpdate);
    window.addEventListener('gaidrid-game-launched', handleUpdate);

    return () => {
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('gaidrid-game-launched', handleUpdate);
    };
  }, []);

  const fetchGames = async () => {
    try {
      const res = await fetch(`${GAMEMONETIZE_API}?format=json&amount=30&type=html5`);
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
        }
      }
    } catch (e) {
      console.warn('Could not fetch GameMonetize games', e);
    }
  };

  const toggleFavorite = (gameId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const current = [...favorites];
    const index = current.indexOf(gameId);
    if (index > -1) {
      current.splice(index, 1);
    } else {
      current.push(gameId);
    }
    setFavorites(current);
    setFavoriteCount(current.length);
    localStorage.setItem('gaidrid_games_favorites', JSON.stringify(current));
  };

  const handleLaunchGame = (game: Game) => {
    if (!onOpenGame) return;
    onOpenGame({
      id: game.id,
      title: game.title,
      game_url: game.game_url || '',
      short_description: game.short_description || '',
      thumbnail: game.thumbnail,
      genre: game.genre,
      rating: game.rating,
    });
  };

  const categories = [...new Set<string>(games.map(g => g.genre)).values()].sort();
  const allTabs = ['All', ...categories.filter(c => c !== 'All'), 'Favorites'];

  const displayedGames = (activeTab === 'Favorites'
    ? games.filter(g => favorites.includes(g.id))
    : activeTab === 'All'
    ? games
    : games.filter(g => g.genre === activeTab)
  );

  return (
    <div className="flex flex-col h-full justify-between p-5">
      {/* Header */}
      <WidgetHeader
        title="Games"
        actions={
          onRemove && (
            <IconButton
              onClick={onRemove}
              variant="danger"
              icon={<X size={12} />}
              label="Remove Games widget"
              title="Remove Widget"
            />
          )
        }
      />

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 mb-2">
        {allTabs.map((tab) => {
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg transition-all cursor-pointer whitespace-nowrap font-mono ${
                activeTab === tab
                  ? 'bg-theme-accent text-theme-accent-text'
                  : 'bg-theme-input-bg/40 text-theme-text-muted border border-theme-border/30 hover:border-theme-border'
              }`}
              aria-label={`Show ${tab} games`}
              aria-pressed={activeTab === tab}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* Games List */}
      <div className="flex-1 overflow-y-auto max-h-[190px] pr-1 space-y-1.5 scrollbar-thin premium-scroll-mask">
        {displayedGames.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Star size={18} className="text-theme-text-muted/30 mb-1.5" />
            <span className="text-[10px] text-theme-text-muted font-semibold">
              {activeTab === 'favorites' ? 'No favorite games yet.' : 'No games available.'}
            </span>
          </div>
        ) : (
          <>
            {displayedGames.slice(0, 8).map((game) => {
            const isFav = favorites.includes(game.id);
            return (
              <button
                key={game.id}
                onClick={() => handleLaunchGame(game)}
                onContextMenu={(e) => {
                  e.preventDefault();
                  onContextMenuGame?.({
                    title: game.title,
                    game_url: game.game_url || '',
                    genre: game.genre,
                    short_description: game.short_description || '',
                    thumbnail: game.thumbnail
                  });
                }}
                className="group flex items-center gap-3 p-2 rounded-xl bg-theme-input-bg/40 border border-theme-border/40 hover:border-theme-accent/40 hover:bg-theme-input-bg/60 text-theme-text transition-all duration-200 cursor-pointer w-full text-left"
                aria-label={`Play ${game.title}, ${game.genre}, rated ${game.rating}`}
              >
                <div className="w-10 h-10 rounded-lg overflow-hidden bg-theme-bg flex items-center justify-center shrink-0 border border-theme-border/10">
                  <GameThumbnail title={game.title} category={game.genre} url={game.thumbnail} />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[11px] font-semibold tracking-wide group-hover:text-theme-accent transition-colors truncate block">
                    {game.title}
                  </span>
                  <div className="flex items-center gap-2 mt-1 text-[9px] text-theme-text-muted font-mono">
                    <span className="px-1.5 py-0.5 rounded bg-theme-border/20 text-[8px] uppercase font-bold tracking-wider">
                      {game.genre}
                    </span>
                    <div className="flex items-center gap-0.5">
                      <Star size={8} className="text-yellow-500" fill="currentColor" />
                      <span>{game.rating}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={(e) => toggleFavorite(game.id, e)}
                  className="shrink-0 p-1.5 rounded-lg hover:bg-theme-accent/10 transition-colors cursor-pointer"
                  title={isFav ? 'Remove from favorites' : 'Add to favorites'}
                  aria-label={isFav ? `Remove ${game.title} from favorites` : `Add ${game.title} to favorites`}
                >
                  <Star
                    size={12}
                    className={isFav ? 'text-yellow-400' : 'text-theme-text-muted/40 hover:text-theme-text-muted'}
                    fill={isFav ? 'currentColor' : 'none'}
                  />
                </button>
              </button>
            );
          })}
          {displayedGames.length > 8 && (
            <button
              onClick={() => onNavigate?.('games')}
              className="w-full flex items-center justify-center gap-2 py-2 text-[10px] font-bold uppercase tracking-wider rounded-xl bg-theme-input-bg/40 border border-theme-border/40 hover:border-theme-accent/60 text-theme-text hover:text-theme-accent cursor-pointer transition-all"
            >
              View All
            </button>
          )}
          </>
        )}
      </div>
    </div>
  );
}
