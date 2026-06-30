import React, { useState } from 'react';
import { UserSettings, Bookmark, TodoItem, NoteItem, CalendarEvent, StockTicker, FavoriteSite } from '../types';
import { Settings, CheckCircle, AlertCircle } from 'lucide-react';
import { SEARCH_ENGINE_SELECT_OPTIONS } from '../lib/constants';
import CustomSelect from './CustomSelect';
import { ThemePicker } from './ThemePicker';

interface SettingsPanelProps {
  settings: UserSettings;
  onUpdateSettings: (settings: Partial<UserSettings>) => void;
  bookmarks: Bookmark[];
  todos: TodoItem[];
  notes: NoteItem[];
  events: CalendarEvent[];
  stocks: StockTicker[];
  favorites: FavoriteSite[];
  onImportData: (data: {
    settings?: UserSettings;
    bookmarks?: Bookmark[];
    todos?: TodoItem[];
    notes?: NoteItem[];
    events?: CalendarEvent[];
    stocks?: StockTicker[];
    favorites?: FavoriteSite[];
  }) => void;
  onResetAll: () => void;
  onRestartOnboarding?: () => void;
}

export default function SettingsPanel({
  settings,
  onUpdateSettings,
  bookmarks,
  todos,
  notes,
  events,
  stocks,
  favorites,
  onImportData,
  onResetAll,
  onRestartOnboarding
}: SettingsPanelProps) {
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Export Backup File
  const handleExport = () => {
    try {
      const readJson = (key: string) => {
        try {
          const raw = localStorage.getItem(key);
          return raw ? JSON.parse(raw) : undefined;
        } catch { return undefined; }
      };

      const backupData = {
        settings,
        bookmarks,
        todos,
        notes,
        events,
        stocks,
        favorites,
        gameFavorites: readJson('gaidrid_games_favorites'),
        pinnedTeams: readJson('gaidrid_pinned_teams'),
        recentVisits: readJson('gaidrid_recent_visits'),
        newsFeeds: readJson('gaidrid_news_feeds'),
        customCategories: readJson('gaidrid_custom_categories'),
        exportedAt: new Date().toISOString(),
        version: 'Gaidrid-v3'
      };

      const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `gaidrid_backup_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      triggerSuccess('Backup file exported successfully!');
    } catch (err) {
      triggerError('Failed to export backup data.');
    }
  };

  // Import Backup File
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        
        if (parsed.version !== 'Gaidrid-v3' && parsed.version !== 'Gaidrid-v2' && !parsed.settings) {
          triggerError('Invalid file format. Please upload a valid Gaidrid backup.');
          return;
        }

        const writeJson = (key: string, value: any) => {
          if (value !== undefined && value !== null) {
            localStorage.setItem(key, JSON.stringify(value));
          }
        };

        onImportData(parsed);
        writeJson('gaidrid_games_favorites', parsed.gameFavorites);
        writeJson('gaidrid_pinned_teams', parsed.pinnedTeams);
        writeJson('gaidrid_recent_visits', parsed.recentVisits);
        writeJson('gaidrid_news_feeds', parsed.newsFeeds);
        writeJson('gaidrid_custom_categories', parsed.customCategories);

        triggerSuccess('Workspace configurations imported and restored!');
        setTimeout(() => window.location.reload(), 800);
      } catch (err) {
        triggerError('Error parsing backup file. Ensure it is a valid JSON file.');
      }
    };
    reader.readAsText(file);
  };

  const triggerSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setErrorMsg('');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const triggerError = (msg: string) => {
    setErrorMsg(msg);
    setSuccessMsg('');
    setTimeout(() => setErrorMsg(''), 4000);
  };

  return (
    <div id="settings-panel" className="w-full flex flex-col gap-6 font-sans select-none animate-fade-in">
      
      {/* Unified Page Banner Header */}
      <div className="border-b border-theme-border/30 pb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-theme-text">
            Settings
          </h2>
          <p className="text-xs text-theme-text-muted mt-0.5 font-sans uppercase tracking-wider">
            Customize theme colors, clock interfaces, default search engines, and manage full desktop data backup profiles.
          </p>
        </div>
      </div>

      {/* Visual Feedback Alerts */}
      {successMsg && (
        <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-500 p-3.5 rounded-2xl border border-emerald-500/20 text-xs font-bold backdrop-blur-xs">
          <CheckCircle size={15} className="shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}
      {errorMsg && (
        <div className="flex items-center gap-2 bg-red-500/10 text-red-400 p-3.5 rounded-2xl border border-red-500/20 text-xs font-bold backdrop-blur-xs">
          <AlertCircle size={15} className="shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Column 1: Identity, Preferences & Theme Selection */}
        <div className="bg-theme-card p-6 rounded-3xl border border-theme-border/65 space-y-5">
          <div className="flex items-center gap-2 border-b border-theme-border/30 pb-3">
            <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-theme-text-muted opacity-80">
              Identity & Clocks
            </h3>
          </div>

          <div className="space-y-4">
            {/* Username Input */}
            <div>
              <label className="block text-[10px] uppercase font-black tracking-[0.1em] text-theme-text-muted mb-1.5 font-mono">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={settings.username}
                onChange={(e) => onUpdateSettings({ username: e.target.value })}
                placeholder="Enter your name..."
                className={`w-full text-xs px-3 py-2 rounded-xl bg-theme-input-bg border text-theme-text focus:outline-none focus:ring-2 focus:ring-theme-accent/20 transition-all ${
                  !settings.username || !settings.username.trim()
                    ? 'border-red-500 focus:border-red-500'
                    : 'border-theme-border/65 focus:border-theme-accent'
                }`}
              />
              {(!settings.username || !settings.username.trim()) && (
                <span className="text-[10px] text-red-500 font-bold block mt-1 animate-pulse">
                  Name is required!
                </span>
              )}
            </div>

            {/* Visual Theme Selection */}
            <div>
              <label className="block text-[10px] uppercase font-black tracking-[0.1em] text-theme-text-muted mb-2 font-mono">
                Visual Workspace Theme
              </label>
              <ThemePicker
                value={settings.theme}
                onChange={(val) => onUpdateSettings({ theme: val as any })}
              />
            </div>



            {/* Search Engine Option */}
            <div>
              <label className="block text-[10px] uppercase font-black tracking-[0.1em] text-theme-text-muted mb-1.5 font-mono">
                Search Engine Terminal
              </label>
              <CustomSelect
                value={settings.searchEngine}
                onChange={(val) => onUpdateSettings({ searchEngine: val as any })}
                options={SEARCH_ENGINE_SELECT_OPTIONS}
              />
            </div>

            {/* Clock Formats */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] uppercase font-black tracking-[0.1em] text-theme-text-muted mb-1.5 font-mono">
                  Clock View
                </label>
                <CustomSelect
                  value={settings.clockFormat}
                  onChange={(val) => onUpdateSettings({ clockFormat: val as any })}
                  options={[
                    { value: "12h", label: "12-Hour" },
                    { value: "24h", label: "24-Hour" },
                    { value: "detailed", label: "Date & time" }
                  ]}
                />
              </div>

              {/* Show Seconds Toggle */}
              <div>
                <label className="block text-[10px] uppercase font-black tracking-[0.1em] text-theme-text-muted mb-1.5 font-mono">
                  Show Seconds
                </label>
                <button
                  onClick={() => onUpdateSettings({ showSeconds: !settings.showSeconds })}
                  className={`w-full text-xs py-2.5 rounded-xl font-bold border transition-all cursor-pointer ${
                    settings.showSeconds
                      ? 'bg-theme-accent text-theme-accent-text border-theme-accent'
                      : 'bg-theme-input-bg border-theme-border/65 text-theme-text-muted hover:border-theme-border'
                  }`}
                >
                  {settings.showSeconds ? 'ENABLED' : 'DISABLED'}
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Column 2: System Maintenance */}
        <div className="bg-theme-card p-6 rounded-3xl border border-theme-border/65 flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-theme-border/30 pb-3">
              <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-theme-text-muted opacity-80">
                System Maintenance
              </h3>
            </div>
            
            <p className="text-xs text-theme-text-muted leading-relaxed">
              Maintain and backup your secure workspace settings. You can export all active notes, events, tasks, stock trackers, bookmarks, favorites, game favorites, pinned teams, news feeds, and custom categories into a single, portable JSON backup file.
            </p>

            <div className="border border-theme-border/50 bg-theme-input-bg/30 rounded-2xl p-4.5 space-y-3.5">
              <h4 className="text-[10px] font-black uppercase tracking-[0.1em] text-theme-text-muted font-mono">
                Backup Data profiles
              </h4>
              
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  onClick={handleExport}
                  className="flex items-center justify-center gap-1.5 text-xs py-2.5 rounded-xl bg-theme-input-bg hover:bg-theme-input-bg/85 hover:opacity-90 text-theme-text border border-theme-border/65 font-bold cursor-pointer transition-colors"
                  title="Export entire setup"
                >
                  Export JSON
                </button>

                <label className="flex items-center justify-center gap-1.5 text-xs py-2.5 rounded-xl bg-theme-input-bg hover:bg-theme-input-bg/85 hover:opacity-90 text-theme-text border border-theme-border/65 font-bold cursor-pointer transition-colors">
                  Import JSON
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImport}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="border-t border-theme-border/30 pt-5 mt-auto flex flex-col gap-2">
            {onRestartOnboarding && (
              <button
                onClick={onRestartOnboarding}
                className="w-full flex items-center justify-center gap-1.5 text-xs py-2.5 rounded-xl bg-theme-input-bg border border-theme-border/65 text-theme-text hover:text-theme-accent hover:border-theme-accent/40 font-bold cursor-pointer transition-all"
              >
                Restart Onboarding Tour
              </button>
            )}
            <button
              onClick={() => {
                if (confirm('Are you absolutely sure you want to reset all data and layouts back to defaults?')) {
                  onResetAll();
                  triggerSuccess('All desktop configurations restored to defaults.');
                }
              }}
              className="w-full flex items-center justify-center gap-1.5 text-xs py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 font-bold cursor-pointer transition-all"
            >
              Reset Factory Defaults
            </button>
          </div>
        </div>
      </div>

      {/* Keyboard Shortcuts Section */}
      <div className="bg-theme-card p-6 rounded-3xl border border-theme-border/65 space-y-5">
        <div className="flex items-center gap-2 border-b border-theme-border/30 pb-3">
          <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-theme-text-muted opacity-80">
            Keyboard Shortcuts
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Navigation chords */}
          <div className="space-y-3.5">
            <h4 className="text-[10px] uppercase font-black tracking-[0.1em] text-theme-text-muted font-mono">
              Navigation
            </h4>
            {[
              { keys: ['G', 'H'], label: 'Go to Home' },
              { keys: ['G', 'W'], label: 'Go to Widgets' },
              { keys: ['G', 'N'], label: 'Go to News' },
              { keys: ['G', 'P'], label: 'Go to Sports' },
              { keys: ['G', 'G'], label: 'Go to Games' },
              { keys: ['G', 'S'], label: 'Go to Settings' },
            ].map((shortcut, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-theme-input-bg/40 border border-theme-border/45">
                <span className="text-xs font-semibold text-theme-text">{shortcut.label}</span>
                <div className="flex gap-1.5">
                  {shortcut.keys.map((k, idx) => (
                    <kbd key={idx} className="font-mono font-black text-[10px] bg-theme-input-bg px-2.5 py-1 rounded border border-theme-border text-theme-text">
                      {k}
                    </kbd>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Spotlight actions */}
          <div className="space-y-3.5 flex flex-col justify-between">
            <div className="space-y-3.5">
              <h4 className="text-[10px] uppercase font-black tracking-[0.1em] text-theme-text-muted font-mono">
                System Controls
              </h4>
              {[
                { keys: ['R'], label: 'Hard Reset Workspace Data' },
              ].map((shortcut, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-theme-input-bg/40 border border-theme-border/45">
                  <span className="text-xs font-semibold text-theme-text">{shortcut.label}</span>
                  <div className="flex gap-1.5">
                    {shortcut.keys.map((k, idx) => (
                      <kbd key={idx} className="font-mono font-black text-[10px] bg-theme-input-bg px-2.5 py-1 rounded border border-theme-border text-theme-text">
                        {k}
                      </kbd>
                    ))}
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
