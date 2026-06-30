import React, { useState } from 'react';
import { UserSettings } from '../../types';

export const WIDGET_INFO_MAP: Record<string, { title: string; desc: string; icon: string }> = {
  pomodoro: { title: 'Pomodoro Timer', desc: 'Focus timer sessions', icon: 'Sparkles' },
  weather: { title: 'Weather Station', desc: 'Current conditions', icon: 'Globe' },
  todo: { title: 'Task Board', desc: 'Interactive checklist', icon: 'Check' },
  bookmarks: { title: 'Bookmarks', desc: 'Saved workspace links', icon: 'Layers' },
  notes: { title: 'Notes', desc: 'Rich notepad organizer', icon: 'FileText' },
  calendar: { title: 'Calendar', desc: 'Upcoming schedule', icon: 'Activity' },
  finance: { title: 'Finance Hub', desc: 'Market tracking', icon: 'Terminal' },
  sports: { title: 'Sports', desc: 'Live scores & matches', icon: 'Trophy' },
  news: { title: 'News', desc: 'RSS feeds reader', icon: 'Newspaper' },
  games: { title: 'Games', desc: 'Play online HTML5 games', icon: 'Gamepad2' }
};

export const THEME_PREVIEW_MAP: Record<string, { label: string; primary: string; secondary: string }> = {
  'gaidrid-dark': { label: 'Slate Dark', primary: '#222831', secondary: '#EEEEEE' },
  'gaidrid-light': { label: 'Pure Light', primary: '#EEEEEE', secondary: '#222831' },
  'tokyo-night': { label: 'Tokyo Night', primary: '#1a1b26', secondary: '#7aa2f7' },
  'catppuccin-mocha': { label: 'Catppuccin Mocha', primary: '#1e1e2e', secondary: '#cba6f7' },
  'dracula': { label: 'Dracula', primary: '#282a36', secondary: '#bd93f9' },
  'rose-pine': { label: 'Rosé Pine', primary: '#191724', secondary: '#ebbcba' },
  'nord': { label: 'Nord Ice', primary: '#2e3440', secondary: '#88c0d0' },
  'ayu-mirage': { label: 'Ayu Mirage', primary: '#1f2430', secondary: '#f29718' },
  'everforest': { label: 'Everforest', primary: '#2d353b', secondary: '#a7c080' },
  'github-dimmed': { label: 'GitHub Dimmed', primary: '#22272e', secondary: '#539bf5' },
  'synthwave-84': { label: 'Synthwave \'84', primary: '#2b213a', secondary: '#f92aad' },
  'one-dark-pro': { label: 'One Dark Pro', primary: '#282c34', secondary: '#61afef' }
};

interface WorkspaceEnginePanelProps {
  settings: UserSettings;
  currentTab: 'home' | 'settings' | 'widgets' | 'news' | 'sports' | 'games';
  onUpdateSettings: (updates: Partial<UserSettings>) => void;
  onToggleWidget: (widgetId: string) => void;
  onSetTab: (tab: 'home' | 'settings' | 'widgets' | 'news' | 'sports' | 'games') => void;
  onClose: () => void;
}

export function WorkspaceEnginePanel({
  settings,
  currentTab,
  onUpdateSettings,
  onToggleWidget,
  onSetTab,
  onClose
}: WorkspaceEnginePanelProps) {
  const [activeSubmenu, setActiveSubmenu] = useState<'none' | 'themes' | 'widgets' | 'search'>('none');

  return (
    <div className="flex flex-col gap-0.5">
      <div className="px-2.5 py-1 text-[9px] font-bold text-theme-text-muted uppercase tracking-widest">
        <span>Workspace Engine</span>
      </div>

      {/* Accordion: Visual Themes */}
      <button
        onClick={() => setActiveSubmenu(activeSubmenu === 'themes' ? 'none' : 'themes')}
        className={`flex items-center justify-between px-2.5 py-1.5 w-full text-left rounded-lg transition-colors text-[11px] ${
          activeSubmenu === 'themes' ? 'bg-theme-accent/5 text-theme-accent font-medium' : 'hover:bg-theme-input-bg/80'
        }`}
      >
        <span>Switch Visual Theme</span>
        <span className="opacity-60 text-[10px]">{activeSubmenu === 'themes' ? '▼' : '▶'}</span>
      </button>
      {activeSubmenu === 'themes' && (
        <div className="grid grid-cols-2 gap-1 px-2 py-1.5 bg-theme-input-bg/30 rounded-lg mt-0.5 mb-1 border border-theme-border/10 max-h-40 overflow-y-auto scrollbar-thin">
          {Object.entries(THEME_PREVIEW_MAP).map(([themeKey, item]) => {
            const isActive = settings.theme === themeKey;
            return (
              <button
                key={themeKey}
                onClick={() => onUpdateSettings({ theme: themeKey as UserSettings['theme'] })}
                className={`flex items-center gap-1.5 p-1 rounded-md transition-all text-left text-[9px] border ${
                  isActive
                    ? 'border-theme-accent bg-theme-accent/10 text-theme-accent font-semibold'
                    : 'border-transparent hover:bg-theme-input-bg/50'
                }`}
              >
                <span
                  className="w-3 h-3 rounded-full border border-theme-border shrink-0"
                  style={{ background: `linear-gradient(135deg, ${item.primary} 50%, ${item.secondary} 50%)` }}
                />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Accordion: Active Modules */}
      <button
        onClick={() => setActiveSubmenu(activeSubmenu === 'widgets' ? 'none' : 'widgets')}
        className={`flex items-center justify-between px-2.5 py-1.5 w-full text-left rounded-lg transition-colors text-[11px] ${
          activeSubmenu === 'widgets' ? 'bg-theme-accent/5 text-theme-accent font-medium' : 'hover:bg-theme-input-bg/80'
        }`}
      >
        <span>Toggle Active Modules</span>
        <span className="opacity-60 text-[10px]">{activeSubmenu === 'widgets' ? '▼' : '▶'}</span>
      </button>
      {activeSubmenu === 'widgets' && (
        <div className="flex flex-col gap-0.5 px-1.5 py-1 bg-theme-input-bg/30 rounded-lg mt-0.5 mb-1 border border-theme-border/10 max-h-48 overflow-y-auto scrollbar-thin">
          {Object.entries(WIDGET_INFO_MAP).map(([id, item]) => {
            const isActive = settings.activeWidgets.includes(id);
            return (
              <button
                key={id}
                onClick={() => onToggleWidget(id)}
                className="flex items-center justify-between px-2 py-1 rounded hover:bg-theme-input-bg/50 transition-colors text-left text-[10px] w-full"
              >
                <div className="flex items-center min-w-0">
                  <span className="truncate">{item.title}</span>
                </div>
                <div className={`w-3.5 h-3.5 rounded flex items-center justify-center border transition-colors ${
                  isActive
                    ? 'bg-theme-accent border-theme-accent text-theme-text'
                    : 'border-theme-border'
                }`}>
                  {isActive && <span className="text-[10px] leading-none font-bold">✓</span>}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Accordion: Search Engine */}
      <button
        onClick={() => setActiveSubmenu(activeSubmenu === 'search' ? 'none' : 'search')}
        className={`flex items-center justify-between px-2.5 py-1.5 w-full text-left rounded-lg transition-colors text-[11px] ${
          activeSubmenu === 'search' ? 'bg-theme-accent/5 text-theme-accent font-medium' : 'hover:bg-theme-input-bg/80'
        }`}
      >
        <span>Default Search Engine</span>
        <span className="opacity-60 text-[10px]">{activeSubmenu === 'search' ? '▼' : '▶'}</span>
      </button>
      {activeSubmenu === 'search' && (
        <div className="flex flex-col gap-0.5 px-1.5 py-1 bg-theme-input-bg/30 rounded-lg mt-0.5 mb-1 border border-theme-border/10">
          {['google', 'duckduckgo', 'bing', 'gemini'].map((engine) => {
            const isActive = settings.searchEngine === engine;
            const readableNames: Record<string, string> = {
              google: 'Google',
              duckduckgo: 'DuckDuckGo',
              bing: 'Microsoft Bing',
              gemini: 'Google Gemini'
            };
            return (
              <button
                key={engine}
                onClick={() => onUpdateSettings({ searchEngine: engine as UserSettings['searchEngine'] })}
                className="flex items-center justify-between px-2 py-1 rounded hover:bg-theme-input-bg/50 transition-colors text-left text-[10px] w-full"
              >
                <span className={isActive ? "font-semibold text-theme-accent" : ""}>
                  {readableNames[engine]}
                </span>
                {isActive && <span className="text-[11px] font-bold text-theme-accent">✓</span>}
              </button>
            );
          })}
        </div>
      )}

      <div className="h-[1px] bg-theme-border/20 my-1" />

      {/* General Shortcuts */}
      <button
        onClick={() => {
          onSetTab(currentTab === 'home' ? 'settings' : 'home');
          onClose();
        }}
        className="flex items-center px-2.5 py-1.5 w-full text-left rounded-lg hover:bg-theme-input-bg/80 transition-colors text-[11px]"
      >
        <span>Open Settings</span>
      </button>
      <button
        onClick={() => {
          window.location.reload();
        }}
        className="flex items-center px-2.5 py-1.5 w-full text-left rounded-lg hover:bg-theme-input-bg/80 transition-colors text-[11px]"
      >
        <span>Reload Extension</span>
      </button>
    </div>
  );
}
