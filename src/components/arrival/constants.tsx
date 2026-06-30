import { FavoriteSite } from '../../types';
import { 
  Search, 
  MessageSquare, 
  Gamepad2, 
  Tv, 
  Film, 
  Trophy, 
  Newspaper, 
  Globe
} from 'lucide-react';
import React from 'react';

export const CATEGORIES = ['Favorite', 'search', 'social', 'games', 'streaming', 'entertainment', 'sports', 'news'];

export const CATEGORY_LABELS: Record<string, string> = {
  favorite: 'Favorite',
  search: 'Search',
  social: 'Social',
  games: 'Games',
  streaming: 'Streaming',
  entertainment: 'Entertainment',
  sports: 'Sports',
  news: 'News'
};

export const getIconComponent = (category: string, size = 16): React.ReactNode => {
  switch (category.toLowerCase()) {
    case 'search':
      return <Search size={size} />;
    case 'social':
      return <MessageSquare size={size} />;
    case 'games':
      return <Gamepad2 size={size} />;
    case 'streaming':
      return <Tv size={size} />;
    case 'entertainment':
      return <Film size={size} />;
    case 'sports':
      return <Trophy size={size} />;
    case 'news':
      return <Newspaper size={size} />;
    default:
      return <Globe size={size} />;
  }
};

export const getCategoryForSite = (fav: FavoriteSite, customCategories: string[] = []): string => {
  if (fav.category) {
    const catLower = fav.category.toLowerCase();
    const defaults = ['all', 'search', 'social', 'games', 'streaming', 'entertainment', 'sports', 'news'];
    const customs = customCategories.map(c => c.toLowerCase());
    if (defaults.includes(catLower) || customs.includes(catLower)) {
      return catLower;
    }
  }
  const name = fav.name.toLowerCase();
  if (name.includes('google') || name.includes('bing') || name.includes('duck')) return 'search';
  if (name.includes('twitter') || name.includes('x') || name.includes('facebook') || name.includes('linkedin') || name.includes('instagram')) return 'social';
  if (name.includes('twitch') || name.includes('chess') || name.includes('steam') || name.includes('game') || name.includes('play')) return 'games';
  if (name.includes('youtube') || name.includes('netflix') || name.includes('spotify') || name.includes('disney')) return 'streaming';
  if (name.includes('tiktok') || name.includes('reddit') || name.includes('imdb')) return 'entertainment';
  if (name.includes('espn') || name.includes('nba') || name.includes('fifa') || name.includes('sport')) return 'sports';
  if (name.includes('bbc') || name.includes('cnn') || name.includes('news') || name.includes('times')) return 'news';
  return 'search';
};

export const POPULAR_LINKS_LIBRARY = [
  { name: 'Google', url: 'https://google.com', category: 'search' },
  { name: 'Bing', url: 'https://bing.com', category: 'search' },
  { name: 'DuckDuckGo', url: 'https://duckduckgo.com', category: 'search' },
  { name: 'Yahoo Search', url: 'https://search.yahoo.com', category: 'search' },
  { name: 'Yandex', url: 'https://yandex.com', category: 'search' },
  { name: 'Facebook', url: 'https://facebook.com', category: 'social' },
  { name: 'X / Twitter', url: 'https://x.com', category: 'social' },
  { name: 'LinkedIn', url: 'https://linkedin.com', category: 'social' },
  { name: 'Instagram', url: 'https://instagram.com', category: 'social' },
  { name: 'Pinterest', url: 'https://pinterest.com', category: 'social' },
  { name: 'WhatsApp Web', url: 'https://web.whatsapp.com', category: 'social' },
  { name: 'Telegram', url: 'https://web.telegram.org', category: 'social' },
  { name: 'Twitch', url: 'https://twitch.tv', category: 'games' },
  { name: 'Steam', url: 'https://store.steampowered.com', category: 'games' },
  { name: 'Chess.com', url: 'https://chess.com', category: 'games' },
  { name: 'Roblox', url: 'https://roblox.com', category: 'games' },
  { name: 'Epic Games', url: 'https://epicgames.com', category: 'games' },
  { name: 'IGN', url: 'https://ign.com', category: 'games' },
  { name: 'YouTube', url: 'https://youtube.com', category: 'streaming' },
  { name: 'Netflix', url: 'https://netflix.com', category: 'streaming' },
  { name: 'Spotify', url: 'https://spotify.com', category: 'streaming' },
  { name: 'Disney+', url: 'https://disneyplus.com', category: 'streaming' },
  { name: 'Amazon Prime', url: 'https://primevideo.com', category: 'streaming' },
  { name: 'SoundCloud', url: 'https://soundcloud.com', category: 'streaming' },
  { name: 'TikTok', url: 'https://tiktok.com', category: 'entertainment' },
  { name: 'Reddit', url: 'https://reddit.com', category: 'entertainment' },
  { name: 'IMDb', url: 'https://imdb.com', category: 'entertainment' },
  { name: '9GAG', url: 'https://9gag.com', category: 'entertainment' },
  { name: 'Fandom', url: 'https://fandom.com', category: 'entertainment' },
  { name: 'ESPN', url: 'https://espn.com', category: 'sports' },
  { name: 'NBA', url: 'https://nba.com', category: 'sports' },
  { name: 'FIFA', url: 'https://fifa.com', category: 'sports' },
  { name: 'Sky Sports', url: 'https://skysports.com', category: 'sports' },
  { name: 'Cricbuzz', url: 'https://cricbuzz.com', category: 'sports' },
  { name: 'BBC News', url: 'https://bbc.com/news', category: 'news' },
  { name: 'CNN', url: 'https://cnn.com', category: 'news' },
  { name: 'New York Times', url: 'https://nytimes.com', category: 'news' },
  { name: 'The Guardian', url: 'https://theguardian.com', category: 'news' },
  { name: 'Al Jazeera', url: 'https://aljazeera.com', category: 'news' },
];