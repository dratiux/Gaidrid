import React, { useState, useEffect, useRef } from 'react';
import { UserSettings, Bookmark, TodoItem, NoteItem, CalendarEvent, StockTicker, FavoriteSite, GameItem } from './types';
import { usePersistedState } from './lib/usePersistedState';
import { THEME_MAP } from './lib/themes';
import {
  DEFAULT_BOOKMARKS,
  DEFAULT_TODOS,
  DEFAULT_NOTES,
  DEFAULT_EVENTS,
  DEFAULT_STOCKS,
  DEFAULT_FAVORITES,
  DEFAULT_SETTINGS
} from './lib/initialData';

// Component imports
import ArrivalZone from './components/ArrivalZone';
import WidgetsGrid from './components/WidgetsGrid';
import SettingsPanel from './components/SettingsPanel';
import WidgetsPanel from './components/WidgetsPanel';
import NewsPage from './components/NewsPage';
import SportsPage from './components/SportsPage';
import GamesPage from './components/GamesPage';
import GamePlayerModal from './components/GamePlayerModal';
import NavButton from './components/NavButton';
import ContextMenu from './components/ContextMenu';
import SplashScreen from './components/SplashScreen';
import Onboarding from './components/Onboarding';

import { 
  Settings as SettingsIcon, 
  Layers, 
  Trophy,
  Newspaper,
  Gamepad2
} from 'lucide-react';

export default function App() {
  // --- STATE REGISTRATION ---
  const [tab, setTab] = useState<'home' | 'settings' | 'widgets' | 'news' | 'sports' | 'games'>('home');
  const [showOnboarding, setShowOnboarding] = useState<boolean>(() => {
    return localStorage.getItem('gaidrid_onboarding_completed') !== 'true';
  });
  const [showSplash, setShowSplash] = useState(true);

  // Custom Context Menu State
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    visible: boolean;
    widgetId: string | null;
    portalId: string | null;
    selectedText: string;
    newsLink?: string | null;
    newsTitle?: string | null;
    newsDate?: string | null;
    newsDesc?: string | null;
    newsAuthor?: string | null;
    newsThumbnail?: string | null;
    newsContent?: string | null;
    gamesPageId?: string | null;
    gameItem?: GameItem | null;
  } | null>(null);

  const [activeGame, setActiveGame] = useState<GameItem | null>(null);
  const [contextGameItem, setContextGameItem] = useState<GameItem | null>(null);
  const contextGameItemRef = useRef<GameItem | null>(null);

  const handleOpenGame = (game: GameItem) => {
    setActiveGame(game);
    // Dispatch event to update widget counts/listeners
    window.dispatchEvent(new CustomEvent('gaidrid-game-launched'));
  };

  const handleSetContextGame = (game: GameItem | null) => {
    contextGameItemRef.current = game;
    setContextGameItem(game);
  };

  // Core Data Lists
  const [settings, setSettings] = useState<UserSettings>(() => {
    const saved = localStorage.getItem('gaidrid_settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Self-healing: Ensure pomodoro is present in both activeWidgets and widgetLayout
        const activeWidgets = parsed.activeWidgets || [];
        const widgetLayout = parsed.widgetLayout || [];
        
        if (!activeWidgets.includes('pomodoro')) {
          activeWidgets.push('pomodoro');
        }
        if (!widgetLayout.includes('pomodoro')) {
          widgetLayout.unshift('pomodoro');
        }
        if (!activeWidgets.includes('sports')) {
          activeWidgets.push('sports');
        }
        if (!widgetLayout.includes('sports')) {
          widgetLayout.push('sports');
        }
        if (!activeWidgets.includes('news')) {
          activeWidgets.push('news');
        }
        if (!widgetLayout.includes('news')) {
          widgetLayout.push('news');
        }
        if (!activeWidgets.includes('games')) {
          activeWidgets.push('games');
        }
        if (!widgetLayout.includes('games')) {
          widgetLayout.push('games');
        }
        
        return {
          ...DEFAULT_SETTINGS,
          ...parsed,
          activeWidgets,
          widgetLayout
        };
      } catch (e) {
        return DEFAULT_SETTINGS;
      }
    }
    return DEFAULT_SETTINGS;
  });

  const [bookmarks, setBookmarks] = usePersistedState<Bookmark[]>('gaidrid_bookmarks', DEFAULT_BOOKMARKS);

  const [todos, setTodos] = usePersistedState<TodoItem[]>('gaidrid_todos', DEFAULT_TODOS);

  const [notes, setNotes] = usePersistedState<NoteItem[]>('gaidrid_notes', DEFAULT_NOTES);

  const [events, setEvents] = usePersistedState<CalendarEvent[]>('gaidrid_events', DEFAULT_EVENTS);

  const [stocks, setStocks] = usePersistedState<StockTicker[]>('gaidrid_stocks', DEFAULT_STOCKS);

  const [favorites, setFavorites] = usePersistedState<FavoriteSite[]>('gaidrid_favorites', DEFAULT_FAVORITES);

  useEffect(() => {
    localStorage.setItem('gaidrid_settings', JSON.stringify(settings));
  }, [settings]);

  // --- THEME OVERRIDES ---
  useEffect(() => {
    const root = document.documentElement;
    const currentTheme = settings.theme || 'gaidrid-dark';
    const themeData = THEME_MAP[currentTheme] || THEME_MAP['gaidrid-dark'];

    // Inject CSS variables
    root.style.setProperty('--theme-bg', themeData.bg);
    root.style.setProperty('--theme-card', themeData.card);
    root.style.setProperty('--theme-border', themeData.border);
    root.style.setProperty('--theme-text', themeData.text);
    root.style.setProperty('--theme-text-muted', themeData.textMuted);
    root.style.setProperty('--theme-accent', themeData.accent);
    root.style.setProperty('--theme-accent-hover', themeData.accentHover);
    root.style.setProperty('--theme-accent-text', themeData.accentText);
    root.style.setProperty('--theme-input-bg', themeData.inputBg);
    root.style.setProperty('--theme-calendar-invert', themeData.isDark ? '1' : '0');

    // Update body class for tailwind standard selectors
    const body = document.body;
    body.className = 'transition-all duration-300 min-h-screen bg-theme-bg text-theme-text';
    
    if (themeData.isDark) {
      body.classList.add('dark');
    } else {
      body.classList.remove('dark');
    }
  }, [settings.theme]);

  // --- KEYBOARD SHORTCUT CHORDS ---
  useEffect(() => {
    let lastKey = '';
    const handleGlobalKeys = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || (e.target as HTMLElement).isContentEditable) {
        return; // Ignore shortcuts in input editors
      }

      const key = e.key.toLowerCase();
      
      // Chords sequence (g then h/w/n/p/g/s)
      if (lastKey === 'g') {
        if (key === 'h') {
          e.preventDefault();
          if (!settings.username || !settings.username.trim()) {
            alert('Name is required. Please set your name in Settings.');
            return;
          }
          setTab('home');
        } else if (key === 'p') {
          e.preventDefault();
          if (!settings.username || !settings.username.trim()) {
            alert('Name is required. Please set your name in Settings.');
            return;
          }
          setTab('sports');
        } else if (key === 's') {
          e.preventDefault();
          setTab('settings');
        } else if (key === 'w') {
          e.preventDefault();
          if (!settings.username || !settings.username.trim()) {
            alert('Name is required. Please set your name in Settings.');
            return;
          }
          setTab('widgets');
        } else if (key === 'n') {
          e.preventDefault();
          if (!settings.username || !settings.username.trim()) {
            alert('Name is required. Please set your name in Settings.');
            return;
          }
          setTab('news');
        } else if (key === 'g') {
          e.preventDefault();
          if (!settings.username || !settings.username.trim()) {
            alert('Name is required. Please set your name in Settings.');
            return;
          }
          setTab('games');
        }
        lastKey = '';
        return;
      }

      if (key === 'g') {
        lastKey = 'g';
        setTimeout(() => {
          lastKey = '';
        }, 1000); // 1s chord window
        return;
      }

      // Single key shortcuts
      if (key === 'r') {
        e.preventDefault();
        if (confirm('Are you sure you want to reset all data?')) {
          handleResetWorkspace();
        }
      } else if (key === '/') {
        e.preventDefault();
        const searchInput = document.getElementById('global-search-input') as HTMLInputElement | null;
        if (searchInput) {
          searchInput.focus();
          searchInput.select();
        }
      }
    };

    window.addEventListener('keydown', handleGlobalKeys);
    return () => window.removeEventListener('keydown', handleGlobalKeys);
  }, []);

  // --- CUSTOM DYNAMIC CONTEXT MENU EVENT HANDLERS ---
  useEffect(() => {
    const handleGlobalContextMenu = (e: MouseEvent) => {
      if (e.shiftKey) return; // Allow Shift + Right Click to bypass and open the default browser context menu

      e.preventDefault();
      
      const target = e.target as HTMLElement;
      
      // Determine what widget cell was clicked (if any)
      const cellEl = target.closest('[id^="grid-cell-"]');
      const widgetId = cellEl ? cellEl.id.replace('grid-cell-', '') : null;
      
      // Determine if a portal was clicked
      const portalEl = target.closest('[data-portal-id]');
      const portalId = portalEl ? portalEl.getAttribute('data-portal-id') : null;

      // Determine if a news article was clicked
      const newsEl = target.closest('[data-news-link]');
      const newsLink = newsEl ? newsEl.getAttribute('data-news-link') : null;
      const newsTitle = newsEl ? newsEl.getAttribute('data-news-title') : null;
      const newsDate = newsEl ? newsEl.getAttribute('data-news-date') : null;
      const newsDesc = newsEl ? newsEl.getAttribute('data-news-desc') : null;
      const newsAuthor = newsEl ? newsEl.getAttribute('data-news-author') : null;
      const newsThumbnail = newsEl ? newsEl.getAttribute('data-news-thumbnail') : null;
      const newsContent = newsEl ? newsEl.getAttribute('data-news-content') : null;
      
      // Determine if clicked inside games page
      const gamesPageEl = target.closest('[data-games-page]');
      const gamesPageId = gamesPageEl ? 'games' : null;
      
      // Get selected text (if any)
      const selectedText = window.getSelection()?.toString().trim() || '';

      // Dimensions to avoid screen edge clipping
      const menuWidth = 260;
      const menuHeight = 380;
      let posX = e.clientX;
      let posY = e.clientY;

      if (posX + menuWidth > window.innerWidth) {
        posX = window.innerWidth - menuWidth - 12;
      }
      if (posY + menuHeight > window.innerHeight) {
        posY = window.innerHeight - menuHeight - 12;
      }

      posX = Math.max(12, posX);
      posY = Math.max(12, posY);

      setContextMenu({
        x: posX,
        y: posY,
        visible: true,
        widgetId,
        portalId,
        selectedText,
        newsLink,
        newsTitle,
        newsDate,
        newsDesc,
        newsAuthor,
        newsThumbnail,
        newsContent,
        gamesPageId,
        gameItem: contextGameItemRef.current
      });
      contextGameItemRef.current = null;
    };

    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // If clicked inside the custom context menu, do not close (allows toggling or using accordions)
      if (target.closest('#gaidrid-context-menu')) {
        return;
      }
      setContextMenu((prev) => prev ? { ...prev, visible: false } : null);
    };

    const handleGlobalScroll = () => {
      setContextMenu((prev) => prev ? { ...prev, visible: false } : null);
    };

    window.addEventListener('contextmenu', handleGlobalContextMenu);
    window.addEventListener('click', handleGlobalClick);
    window.addEventListener('scroll', handleGlobalScroll, { passive: true });

    return () => {
      window.removeEventListener('contextmenu', handleGlobalContextMenu);
      window.removeEventListener('click', handleGlobalClick);
      window.removeEventListener('scroll', handleGlobalScroll);
    };
  }, []);



  // --- CRUD DISPATCH ACTION HANDLERS ---
  const handleUpdateSettings = (updates: Partial<UserSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
  };

  const handleAddBookmark = (title: string, url: string, category: string) => {
    const newItem = { id: String(Date.now()), title, url, category };
    setBookmarks((prev) => [...prev, newItem]);
  };

  const handleDeleteBookmark = (id: string) => {
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
  };

  const handleAddTodo = (text: string, priority: 'low' | 'medium' | 'high' = 'medium', dueDate?: string, category: string = 'General') => {
    const newItem = { id: String(Date.now()), text, completed: false, priority, dueDate, category };
    setTodos((prev) => [newItem, ...prev]);
  };

  const handleToggleTodo = (id: string) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleDeleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  const handleAddNote = (title: string, content: string) => {
    const newItem = { id: String(Date.now()), title, content, updatedAt: new Date().toISOString() };
    setNotes((prev) => [...prev, newItem]);
  };

  const handleUpdateNote = (id: string, title: string, content: string) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, title, content, updatedAt: new Date().toISOString() } : n))
    );
  };

  const handleDeleteNote = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  const handleAddEvent = (title: string, date: string = '2026-06-24', startTime: string = '12:00', endTime: string = '13:00', description?: string) => {
    const newItem = { id: String(Date.now()), title, date, startTime, endTime, description };
    setEvents((prev) => [...prev, newItem]);
  };

  const handleDeleteEvent = (id: string) => {
    setEvents((prev) => prev.filter((ev) => ev.id !== id));
  };

  const handleAddFavorite = (name: string, url: string, icon: string, category?: string, isFavorite: boolean = false) => {
    const newItem = { id: String(Date.now()), name, url, icon, category, isFavorite };
    setFavorites((prev) => [...prev, newItem]);
  };

  const handleDeleteFavorite = (id: string) => {
    setFavorites((prev) => prev.filter((fav) => fav.id !== id));
  };

  const handleToggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.map((fav) => (fav.id === id ? { ...fav, isFavorite: !fav.isFavorite } : fav))
    );
  };

  const handleReorderFavorites = (newFavorites: FavoriteSite[]) => {
    setFavorites(newFavorites);
  };

  // --- SYSTEM CONFERENCES ---
  const handleImportData = (data: any) => {
    if (data.settings) setSettings(data.settings);
    if (data.bookmarks) setBookmarks(data.bookmarks);
    if (data.todos) setTodos(data.todos);
    if (data.notes) setNotes(data.notes);
    if (data.events) setEvents(data.events);
    if (data.stocks) setStocks(data.stocks);
    if (data.favorites) setFavorites(data.favorites);
  };

  const handleResetWorkspace = () => {
    setSettings(DEFAULT_SETTINGS);
    setBookmarks(DEFAULT_BOOKMARKS);
    setTodos(DEFAULT_TODOS);
    setNotes(DEFAULT_NOTES);
    setEvents(DEFAULT_EVENTS);
    setStocks(DEFAULT_STOCKS);
    setFavorites(DEFAULT_FAVORITES);
    localStorage.removeItem('gaidrid_games_favorites');
    localStorage.removeItem('gaidrid_pinned_teams');
    localStorage.removeItem('gaidrid_recent_visits');
    localStorage.removeItem('gaidrid_news_feeds');
    localStorage.removeItem('gaidrid_custom_categories');
  };

  return (
    <div id="gaidrid-root" className="min-h-screen flex text-brand-primary selection:bg-brand-accent w-full relative">
      
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      
      {/* Main Workspace Viewport Frame */}
      <main id="viewport-frame" className="flex-1 h-screen overflow-y-auto relative scrollbar-thin flex flex-col justify-between w-full">
        
        {/* --- VIEW ROUTER --- */}
        <div id="view-router" className="p-4 sm:p-8 md:pl-28 md:pr-10 max-md:pb-24">
          {tab === 'home' && (
            <div className="space-y-6">
              {/* Above the Fold Greeting Panel */}
              <ArrivalZone
                settings={settings}
                favorites={favorites}
                onAddFavorite={handleAddFavorite}
                onDeleteFavorite={handleDeleteFavorite}
                onToggleFavorite={handleToggleFavorite}
                onRestoreFavorites={() => setFavorites(DEFAULT_FAVORITES)}
                onUpdateSettings={handleUpdateSettings}
                onReorderFavorites={handleReorderFavorites}
              />

              {/* Modular Dashboard Assembly Grid */}
              <WidgetsGrid
                settings={settings}
                bookmarks={bookmarks}
                todos={todos}
                notes={notes}
                events={events}
                favorites={favorites}
                onOpenGame={handleOpenGame}
                onContextMenuGame={handleSetContextGame}
                onNavigate={setTab}
                onAddFavorite={handleAddFavorite}
                onDeleteFavorite={handleDeleteFavorite}
                onToggleFavorite={handleToggleFavorite}
                onUpdateSettings={handleUpdateSettings}
                onAddBookmark={handleAddBookmark}
                onDeleteBookmark={handleDeleteBookmark}
                onAddTodo={handleAddTodo}
                onToggleTodo={handleToggleTodo}
                onDeleteTodo={handleDeleteTodo}
                onAddNote={handleAddNote}
                onUpdateNote={handleUpdateNote}
                onDeleteNote={handleDeleteNote}
                onAddEvent={handleAddEvent}
                onDeleteEvent={handleDeleteEvent}
              />
            </div>
          )}

          {tab === 'settings' && (
            <SettingsPanel
              settings={settings}
              onUpdateSettings={handleUpdateSettings}
              bookmarks={bookmarks}
              todos={todos}
              notes={notes}
              events={events}
              stocks={stocks}
              favorites={favorites}
              onImportData={handleImportData}
              onResetAll={handleResetWorkspace}
              onRestartOnboarding={() => {
                localStorage.removeItem('gaidrid_onboarding_completed');
                setShowOnboarding(true);
                setTab('home');
              }}
            />
          )}

          {tab === 'widgets' && (
            <WidgetsPanel
              settings={settings}
              onUpdateSettings={handleUpdateSettings}
            />
          )}

          {tab === 'news' && (
            <NewsPage />
          )}

          {tab === 'sports' && (
            <SportsPage />
          )}

          {tab === 'games' && (
            <GamesPage onOpenGame={handleOpenGame} onContextMenuGame={handleSetContextGame} />
          )}
        </div>
      </main>

      {/* Floating Modern Responsive Navigation Sidebar/Dock */}
      <div 
        id="gaidrid-floating-navigation"
        role="navigation"
        aria-label="Main navigation"
        className="fixed left-6 top-1/2 -translate-y-1/2 z-45 flex flex-col items-center gap-3.5 p-3.5 rounded-3xl bg-theme-card/90 border border-theme-border/40 backdrop-blur-xl transition-all duration-300 md:w-16 max-md:fixed max-md:bottom-6 max-md:top-auto max-md:left-1/2 max-md:right-auto max-md:translate-y-0 max-md:-translate-x-1/2 max-md:flex-row max-md:w-[90%] max-md:max-w-md max-md:h-16 max-md:justify-around max-md:py-2 max-md:px-6"
      >
        {/* Home Tab */}
        <NavButton
          tabId="home"
          currentTab={tab}
          label="Home"
          shortcut="G+H"
          onClick={() => {
            if (tab === 'settings' && (!settings.username || !settings.username.trim())) {
              alert('Name is required. Please set your name in Settings.');
              return;
            }
            setTab('home');
          }}
        >
          <svg viewBox="0 0 579 581" className="w-5 h-5" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <g transform="matrix(1,0,0,1,-2148,-1162)">
              <g transform="matrix(1,0,0,1,29.675982,-0)">
                <g id="logo" transform="matrix(0.486979,0,0,1,980.97506,985)">
                  <g transform="matrix(4.555814,0,0,2.218586,-7658.50137,-401.425529)">
                    <path d="M2454.408,410.321C2450.538,437.379 2438.38,461.78 2420.592,480.864C2396.69,506.508 2362.621,522.553 2324.835,522.553L2324.835,488.737C2372.648,488.737 2412.434,454.097 2420.445,408.565L2324.835,408.565L2324.835,374.749L2420.445,374.749C2420.495,375.035 2420.544,375.321 2420.592,375.608L2420.592,374.749L2454.408,374.749L2454.408,410.321Z"/>
                  </g>
                  <g transform="matrix(4.555814,0,0,2.218586,-7658.50137,-401.425529)">
                    <path d="M2195.023,408.565C2194.308,403.03 2193.939,397.386 2193.939,391.657C2193.939,385.928 2194.308,380.285 2195.023,374.749C2203.327,310.48 2258.32,260.761 2324.835,260.761C2362.621,260.761 2396.69,276.807 2420.592,302.45C2427.311,309.659 2433.227,317.626 2438.196,326.208L2408.91,343.117C2392.114,314.109 2360.737,294.577 2324.835,294.577C2277.022,294.577 2237.235,329.218 2229.225,374.749C2228.259,380.241 2227.755,385.891 2227.755,391.657C2227.755,397.424 2228.259,403.074 2229.225,408.565C2231.22,419.908 2235.188,430.574 2240.76,440.198L2211.474,457.106C2203.003,442.477 2197.283,426.06 2195.023,408.565Z"/>
                  </g>
                </g>
              </g>
            </g>
          </svg>
        </NavButton>

        {/* Widgets Tab */}
        <NavButton
          tabId="widgets"
          currentTab={tab}
          icon={<Layers size={20} />}
          label="Widgets"
          shortcut="G+W"
          onClick={() => {
            if (tab === 'settings' && (!settings.username || !settings.username.trim())) {
              alert('Name is required. Please set your name in Settings.');
              return;
            }
            setTab('widgets');
          }}
        />

        {/* News Tab */}
        <NavButton
          tabId="news"
          currentTab={tab}
          icon={<Newspaper size={20} />}
          label="News"
          shortcut="G+N"
          onClick={() => {
            if (tab === 'settings' && (!settings.username || !settings.username.trim())) {
              alert('Name is required. Please set your name in Settings.');
              return;
            }
            setTab('news');
          }}
        />

        {/* Sports Tab */}
        <NavButton
          tabId="sports"
          currentTab={tab}
          icon={<Trophy size={20} />}
          label="Sports"
          shortcut="G+P"
          onClick={() => {
            if (tab === 'settings' && (!settings.username || !settings.username.trim())) {
              alert('Name is required. Please set your name in Settings.');
              return;
            }
            setTab('sports');
          }}
        />

        {/* Games Tab */}
        <NavButton
          tabId="games"
          currentTab={tab}
          icon={<Gamepad2 size={20} />}
          label="Games"
          shortcut="G+G"
          onClick={() => {
            if (tab === 'settings' && (!settings.username || !settings.username.trim())) {
              alert('Name is required. Please set your name in Settings.');
              return;
            }
            setTab('games');
          }}
        />

        {/* Settings Tab */}
        <button
          onClick={() => setTab('settings')}
          aria-label="Go to Settings"
          aria-current={tab === 'settings' ? 'page' : undefined}
          className={`relative p-3 rounded-2xl transition-all duration-200 group flex items-center justify-center cursor-pointer ${
            tab === 'settings'
              ? 'bg-theme-accent text-theme-accent-text scale-105'
              : 'text-theme-text-muted hover:text-theme-text hover:bg-theme-input-bg/70'
          }`}
          title="Settings (G+S)"
        >
          <SettingsIcon size={20} className={tab === 'settings' ? "animate-spin-slow" : ""} />
          {/* Tooltip on Desktop */}
          <span className="absolute left-16 px-2.5 py-1.5 rounded-xl bg-theme-card text-theme-text text-[10px] font-black uppercase tracking-wider opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl border border-theme-border z-50 md:block hidden">
            Settings <span className="ml-1 opacity-50 font-mono">G+S</span>
          </span>
        </button>
      </div>

      {showOnboarding && (
        <Onboarding
          settings={settings}
          onUpdateSettings={handleUpdateSettings}
          onComplete={() => {
            localStorage.setItem('gaidrid_onboarding_completed', 'true');
            setShowOnboarding(false);
          }}
        />
      )}

      {/* --- CUSTOM DYNAMIC CONTEXT MENU --- */}
      {contextMenu && contextMenu.visible && (
        <ContextMenu
          contextMenu={contextMenu}
          setContextMenu={setContextMenu}
          settings={settings}
          favorites={favorites}
          onUpdateSettings={handleUpdateSettings}
          onToggleFavorite={handleToggleFavorite}
          onDeleteFavorite={handleDeleteFavorite}
          onOpenGame={handleOpenGame}
          setTab={setTab}
          currentTab={tab}
        />
      )}

      {/* Interactive Arcade Fullscreen HUD Modal */}
      {activeGame && (
        <GamePlayerModal 
          game={activeGame} 
          onClose={() => setActiveGame(null)} 
        />
      )}
    </div>
  );
}
