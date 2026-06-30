export interface Bookmark {
  id: string;
  title: string;
  url: string;
  category: string;
}

export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  category: string;
}

export interface NoteItem {
  id: string;
  title: string;
  content: string;
  updatedAt: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  description?: string;
}

export interface StockTicker {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

export interface FavoriteSite {
  id: string;
  name: string;
  url: string;
  icon: string; // Lucide icon name or emoji
  category?: string;
  isFavorite?: boolean;
}

export interface UserSettings {
  theme: 'gaidrid-light' | 'gaidrid-dark' | 'tokyo-night' | 'catppuccin-mocha' | 'dracula' | 'rose-pine' | 'nord' | 'ayu-mirage' | 'everforest' | 'github-dimmed' | 'synthwave-84' | 'one-dark-pro' | 'light' | 'dark' | 'slate';
  username: string;
  greetingType: 'standard' | 'formal' | 'casual' | 'philosophical';
  clockFormat: '12h' | '24h' | 'detailed';
  showSeconds: boolean;
  searchEngine: 'google' | 'duckduckgo' | 'bing' | 'github' | 'gemini';
  activeWidgets: string[]; // ids of widgets enabled
  widgetLayout: string[]; // order of widgets
}

export interface GameItem {
  id?: string;
  title: string;
  game_url: string;
  genre: string;
  short_description: string;
  thumbnail: string;
}

export interface Game extends GameItem {
  rating: number;
}
