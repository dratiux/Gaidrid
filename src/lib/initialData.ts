import { Bookmark, TodoItem, NoteItem, CalendarEvent, StockTicker, FavoriteSite, UserSettings } from '../types';

export const DEFAULT_BOOKMARKS: Bookmark[] = [
  { id: '1', title: 'Notion', url: 'https://notion.so', category: 'Productivity' },
  { id: '2', title: 'Google Drive', url: 'https://drive.google.com', category: 'Productivity' },
  { id: '3', title: 'Canva', url: 'https://canva.com', category: 'Creative' },
  { id: '4', title: 'Wikipedia', url: 'https://wikipedia.org', category: 'Learning' },
  { id: '5', title: 'Medium', url: 'https://medium.com', category: 'Learning' },
  { id: '6', title: 'Pinterest', url: 'https://pinterest.com', category: 'Creative' },
  { id: '7', title: 'Slack', url: 'https://slack.com', category: 'Productivity' },
  { id: '8', title: 'Unsplash', url: 'https://unsplash.com', category: 'Creative' },
];

export const DEFAULT_TODOS: TodoItem[] = [
  { id: '1', text: 'Prepare strategy slides for the weekly sync', completed: true, priority: 'high', category: 'Work' },
  { id: '2', text: 'Review monthly budget and investment portfolio', completed: false, priority: 'high', dueDate: '2026-06-30', category: 'Finance' },
  { id: '3', text: 'Read 15 pages of "Atomic Habits" or choice literature', completed: false, priority: 'medium', category: 'Reading' },
  { id: '4', text: 'Drink 8 glasses of water & update wellness log', completed: false, priority: 'low', category: 'Routine' },
];

export const DEFAULT_NOTES: NoteItem[] = [
  {
    id: '1',
    title: '💡 Daily Productivity Blueprint',
    content: `Focus Rule: "Do fewer things, but do them exceptionally well."\n\nDaily habits to maintain clarity and energy:\n- Define 3 High-Impact Tasks (HITs) every morning.\n- Block out the first 2 hours of the day for deep focus work.\n- Use the Pomodoro timer to prevent cognitive fatigue.\n- Clear your physical and digital workspaces before finishing up.`,
    updatedAt: '2026-06-24T10:00:00Z',
  },
  {
    id: '2',
    title: '🌿 Weekly Focus Goals',
    content: `- Complete draft for the upcoming quarterly proposals\n- Organize desktop files and cloud folders\n- Maintain a daily 15-minute mindfulness or stretching break\n- Schedule completely screen-free time after 8:00 PM`,
    updatedAt: '2026-06-24T14:30:00Z',
  }
];

export const DEFAULT_EVENTS: CalendarEvent[] = [
  {
    id: '1',
    title: '✨ Strategic Planning Sync',
    date: '2026-06-24',
    startTime: '10:00',
    endTime: '11:00',
    description: 'Review quarterly goals and align project key results'
  },
  {
    id: '2',
    title: '🎨 Creative Brainstorming',
    date: '2026-06-24',
    startTime: '14:00',
    endTime: '15:15',
    description: 'Mind-map fresh ideas for the upcoming brand campaign'
  },
  {
    id: '3',
    title: '☕ Virtual Coffee Catchup',
    date: '2026-06-25',
    startTime: '16:00',
    endTime: '16:30',
    description: 'Relaxed catch-up with the team to share thoughts and stay connected'
  }
];

export const DEFAULT_STOCKS: StockTicker[] = [
  { symbol: 'AAPL', name: 'Apple Inc.', price: 214.25, change: 3.42, changePercent: 1.62 },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 123.51, change: -1.82, changePercent: -1.45 },
  { symbol: 'BTC/USD', name: 'Bitcoin USD', price: 65420.00, change: 1280.00, changePercent: 1.99 },
  { symbol: 'TSLA', name: 'Tesla Inc.', price: 187.35, change: -2.10, changePercent: -1.11 },
  { symbol: 'SPY', name: 'S&P 500 ETF', price: 545.22, change: 4.15, changePercent: 0.77 },
];

export const DEFAULT_FAVORITES: FavoriteSite[] = [
  // Search
  { id: 'f-search-1', name: 'Google', url: 'https://google.com', icon: 'Search', category: 'search', isFavorite: true },
  { id: 'f-search-2', name: 'Bing', url: 'https://bing.com', icon: 'Search', category: 'search', isFavorite: false },
  { id: 'f-search-3', name: 'DuckDuckGo', url: 'https://duckduckgo.com', icon: 'Search', category: 'search', isFavorite: false },
  { id: 'f-search-4', name: 'Yahoo Search', url: 'https://search.yahoo.com', icon: 'Search', category: 'search', isFavorite: false },
  { id: 'f-search-5', name: 'Yandex', url: 'https://yandex.com', icon: 'Search', category: 'search', isFavorite: false },

  // Social
  { id: 'f-social-1', name: 'Facebook', url: 'https://facebook.com', icon: 'MessageSquare', category: 'social', isFavorite: true },
  { id: 'f-social-2', name: 'X / Twitter', url: 'https://x.com', icon: 'MessageSquare', category: 'social', isFavorite: false },
  { id: 'f-social-3', name: 'LinkedIn', url: 'https://linkedin.com', icon: 'MessageSquare', category: 'social', isFavorite: false },
  { id: 'f-social-4', name: 'Instagram', url: 'https://instagram.com', icon: 'MessageSquare', category: 'social', isFavorite: true },
  { id: 'f-social-5', name: 'Pinterest', url: 'https://pinterest.com', icon: 'MessageSquare', category: 'social', isFavorite: false },

  // Games
  { id: 'f-games-1', name: 'Twitch', url: 'https://twitch.tv', icon: 'Gamepad2', category: 'games', isFavorite: false },
  { id: 'f-games-2', name: 'Steam', url: 'https://store.steampowered.com', icon: 'Gamepad2', category: 'games', isFavorite: false },
  { id: 'f-games-3', name: 'Chess.com', url: 'https://chess.com', icon: 'Gamepad2', category: 'games', isFavorite: false },
  { id: 'f-games-4', name: 'Roblox', url: 'https://roblox.com', icon: 'Gamepad2', category: 'games', isFavorite: false },
  { id: 'f-games-5', name: 'Epic Games', url: 'https://epicgames.com', icon: 'Gamepad2', category: 'games', isFavorite: false },

  // Streaming
  { id: 'f-stream-1', name: 'YouTube', url: 'https://youtube.com', icon: 'Tv', category: 'streaming', isFavorite: true },
  { id: 'f-stream-2', name: 'Netflix', url: 'https://netflix.com', icon: 'Tv', category: 'streaming', isFavorite: false },
  { id: 'f-stream-3', name: 'Spotify', url: 'https://spotify.com', icon: 'Tv', category: 'streaming', isFavorite: false },
  { id: 'f-stream-4', name: 'Disney+', url: 'https://disneyplus.com', icon: 'Tv', category: 'streaming', isFavorite: false },
  { id: 'f-stream-5', name: 'Amazon Prime', url: 'https://primevideo.com', icon: 'Tv', category: 'streaming', isFavorite: false },

  // Entertainment
  { id: 'f-ent-1', name: 'TikTok', url: 'https://tiktok.com', icon: 'Film', category: 'entertainment', isFavorite: true },
  { id: 'f-ent-2', name: 'Reddit', url: 'https://reddit.com', icon: 'Film', category: 'entertainment', isFavorite: false },
  { id: 'f-ent-3', name: 'IMDb', url: 'https://imdb.com', icon: 'Film', category: 'entertainment', isFavorite: false },
  { id: 'f-ent-4', name: '9GAG', url: 'https://9gag.com', icon: 'Film', category: 'entertainment', isFavorite: false },
  { id: 'f-ent-5', name: 'Fandom', url: 'https://fandom.com', icon: 'Film', category: 'entertainment', isFavorite: false },

  // Sports
  { id: 'f-sports-1', name: 'ESPN', url: 'https://espn.com', icon: 'Trophy', category: 'sports', isFavorite: false },
  { id: 'f-sports-2', name: 'NBA', url: 'https://nba.com', icon: 'Trophy', category: 'sports', isFavorite: false },
  { id: 'f-sports-3', name: 'FIFA', url: 'https://fifa.com', icon: 'Trophy', category: 'sports', isFavorite: false },
  { id: 'f-sports-4', name: 'Sky Sports', url: 'https://skysports.com', icon: 'Trophy', category: 'sports', isFavorite: false },
  { id: 'f-sports-5', name: 'Cricbuzz', url: 'https://cricbuzz.com', icon: 'Trophy', category: 'sports', isFavorite: false },

  // News
  { id: 'f-news-1', name: 'BBC News', url: 'https://bbc.com/news', icon: 'Newspaper', category: 'news', isFavorite: false },
  { id: 'f-news-2', name: 'CNN', url: 'https://cnn.com', icon: 'Newspaper', category: 'news', isFavorite: false },
  { id: 'f-news-3', name: 'New York Times', url: 'https://nytimes.com', icon: 'Newspaper', category: 'news', isFavorite: false },
  { id: 'f-news-4', name: 'The Guardian', url: 'https://theguardian.com', icon: 'Newspaper', category: 'news', isFavorite: false },
  { id: 'f-news-5', name: 'Al Jazeera', url: 'https://aljazeera.com', icon: 'Newspaper', category: 'news', isFavorite: false },
];

export const DEFAULT_SETTINGS: UserSettings = {
  theme: 'gaidrid-dark',
  username: '',
  greetingType: 'philosophical',
  clockFormat: '12h',
  showSeconds: false,
  searchEngine: 'google',
  activeWidgets: ['pomodoro', 'weather', 'notes', 'todo', 'calendar', 'finance', 'bookmarks', 'sports', 'news', 'games'],
  widgetLayout: ['pomodoro', 'weather', 'notes', 'todo', 'calendar', 'finance', 'bookmarks', 'sports', 'news', 'games'],
};
