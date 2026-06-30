export const THEME_LIST = [
  { value: 'gaidrid-dark', label: 'Gaidrid Dark', color: '#222831', accent: '#EEEEEE', text: 'Charcoal' },
  { value: 'gaidrid-light', label: 'Gaidrid Light', color: '#EEEEEE', accent: '#222831', text: 'Slate' },
  { value: 'tokyo-night', label: 'Tokyo Night', color: '#1a1b26', accent: '#7aa2f7', text: 'Neon' },
  { value: 'catppuccin-mocha', label: 'Catppuccin Mocha', color: '#1e1e2e', accent: '#cba6f7', text: 'Pastel' },
  { value: 'dracula', label: 'Dracula', color: '#282a36', accent: '#bd93f9', text: 'Classic Gothic' },
  { value: 'rose-pine', label: 'Rosé Pine', color: '#191724', accent: '#ebbcba', text: 'Dusk' },
  { value: 'nord', label: 'Polar Nord', color: '#2e3440', accent: '#88c0d0', text: 'Arctic' },
  { value: 'ayu-mirage', label: 'Ayu Mirage', color: '#1f2430', accent: '#f29718', text: 'Matte Golden' },
  { value: 'everforest', label: 'Everforest', color: '#2d353b', accent: '#a7c080', text: 'Organic Green' },
  { value: 'github-dimmed', label: 'GitHub Dimmed', color: '#22272e', accent: '#539bf5', text: 'Relaxed Dim Blue' },
  { value: 'synthwave-84', label: "Synthwave '84", color: '#2b213a', accent: '#f92aad', text: 'Neon Cyberpunk' },
  { value: 'one-dark-pro', label: 'One Dark Pro', color: '#282c34', accent: '#61afef', text: 'Tech Atom Grey' },
] as const;

export const THEME_SELECT_OPTIONS = THEME_LIST.map(t => ({
  value: t.value,
  label: `${t.label} (${t.text})`,
}));

export const SEARCH_ENGINE_LIST = [
  { value: 'google', label: 'Google', desc: 'Secure web search terminal' },
  { value: 'duckduckgo', label: 'DuckDuckGo', desc: 'Privacy-focused search engine' },
  { value: 'bing', label: 'Bing', desc: 'Microsoft Web Search' },
  { value: 'github', label: 'GitHub', desc: 'Code repository explorer' },
  { value: 'gemini', label: 'Gemini AI', desc: 'Gemini Workspace' },
] as const;

export const SEARCH_ENGINE_SELECT_OPTIONS = SEARCH_ENGINE_LIST.map(e => ({
  value: e.value,
  label: e.label,
}));

export const WIDGET_REGISTRY = [
  { id: 'pomodoro', name: 'Pomodoro Timer', desc: 'Focus timer sessions with countdowns and deep work intervals.', category: 'Productivity' },
  { id: 'weather', name: 'Weather Station', desc: 'Local weather metrics, wind speeds, and forecast.', category: 'Information' },
  { id: 'notes', name: 'Notes', desc: 'Write down ideas, active notes, and persistent text clippings.', category: 'Productivity' },
  { id: 'todo', name: 'Task Board', desc: 'Create, filter, and track tasks by priority.', category: 'Productivity' },
  { id: 'calendar', name: 'Calendar', desc: 'Personal timeline and monthly planner.', category: 'Information' },
  { id: 'finance', name: 'Finance Hub', desc: 'Track market tickers, prices, and visual sparklines.', category: 'Finance' },
  { id: 'bookmarks', name: 'Bookmarks', desc: 'Organize links and portals for quick access.', category: 'Links' },
  { id: 'sports', name: 'Sports', desc: 'Live scores, league tables, and match timings.', category: 'Sports' },
  { id: 'news', name: 'News', desc: 'Read curated RSS feeds and custom streams.', category: 'Information' },
  { id: 'games', name: 'Games', desc: 'Play responsive HTML5 games directly in your workspace.', category: 'Games' },
] as const;
