import React, { useState } from 'react';
import { UserSettings } from '../types';
import { WIDGET_REGISTRY } from '../lib/constants';
import { 
  Eye, 
  EyeOff, 
  Check, 
  Timer, 
  CloudSun, 
  FileText, 
  CheckSquare, 
  Calendar, 
  TrendingUp, 
  Bookmark, 
  Trophy, 
  Newspaper,
  Gamepad2
} from 'lucide-react';

interface WidgetsPanelProps {
  settings: UserSettings;
  onUpdateSettings: (settings: Partial<UserSettings>) => void;
}

export default function WidgetsPanel({ settings, onUpdateSettings }: WidgetsPanelProps) {
  const [successMsg, setSuccessMsg] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'muted'>('all');

  const WIDGET_ICONS: Record<string, any> = {
    pomodoro: Timer,
    weather: CloudSun,
    notes: FileText,
    todo: CheckSquare,
    calendar: Calendar,
    finance: TrendingUp,
    bookmarks: Bookmark,
    sports: Trophy,
    news: Newspaper,
    games: Gamepad2,
  };

  const WIDGET_INFO = Object.fromEntries(
    WIDGET_REGISTRY.map(w => [w.id, { name: w.name, desc: w.desc, icon: WIDGET_ICONS[w.id], category: w.category }])
  );

  // Toggle Widget active status
  const handleWidgetToggle = (widgetId: string) => {
    let updatedActive = [...settings.activeWidgets];
    if (updatedActive.includes(widgetId)) {
      updatedActive = updatedActive.filter((w) => w !== widgetId);
      triggerNotification('Widget deactivated');
    } else {
      updatedActive.push(widgetId);
      triggerNotification('Widget activated successfully');
    }
    
    // Ensure it's in the layout order as well if added
    const updatedLayout = [...settings.widgetLayout];
    if (!updatedLayout.includes(widgetId)) {
      updatedLayout.push(widgetId);
    }

    onUpdateSettings({ 
      activeWidgets: updatedActive,
      widgetLayout: updatedLayout
    });
  };

  // Reorder Widgets
  const moveWidget = (index: number, direction: 'up' | 'down') => {
    const newLayout = [...settings.widgetLayout];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex < 0 || targetIndex >= newLayout.length) return;

    // Swap
    const temp = newLayout[index];
    newLayout[index] = newLayout[targetIndex];
    newLayout[targetIndex] = temp;

    onUpdateSettings({ widgetLayout: newLayout });
    triggerNotification('Widget order updated');
  };

  const triggerNotification = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleToggleAll = (action: 'enable' | 'disable') => {
    const allIds = Object.keys(WIDGET_INFO);
    if (action === 'enable') {
      onUpdateSettings({ activeWidgets: allIds });
      triggerNotification('All widgets enabled');
    } else {
      onUpdateSettings({ activeWidgets: [] });
      triggerNotification('All widgets muted');
    }
  };

  const filteredWidgets = Object.keys(WIDGET_INFO).filter(id => {
    const isActive = settings.activeWidgets.includes(id);
    if (activeTab === 'active') return isActive;
    if (activeTab === 'muted') return !isActive;
    return true;
  });

  return (
    <div id="widgets-panel" className="w-full flex flex-col gap-6 font-sans select-none animate-fade-in">
      
      {/* Unified Page Header */}
      <div className="border-b border-theme-border/30 pb-5">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-theme-text">
            Widgets
          </h2>
          <p className="text-xs text-theme-text-muted mt-0.5 font-sans uppercase tracking-wider">
            Configure your modular command center. Toggle dashboard modules, reorder widgets to structure your custom workspace, and optimize grid layout.
          </p>
        </div>
      </div>

      {/* Success Notification Banner */}
      {successMsg && (
        <div className="flex items-center gap-2 bg-theme-accent/10 text-theme-text p-3 rounded-2xl border border-theme-accent/20 text-xs font-bold backdrop-blur-xs transition-all duration-300">
          <Check size={14} className="text-theme-accent" />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="space-y-5">
        
        {/* Tab Filter Toggles */}
        <div className="flex border-b border-theme-border/25 gap-4">
          {(['all', 'active', 'muted'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2.5 text-xs font-black uppercase tracking-wider border-b-2 cursor-pointer transition-all outline-none bg-transparent ${
                activeTab === tab
                  ? 'border-theme-accent text-theme-text'
                  : 'border-transparent text-theme-text-muted hover:text-theme-text'
              }`}
            >
              {tab === 'all' && 'All Components'}
              {tab === 'active' && `Active (${settings.activeWidgets.length})`}
              {tab === 'muted' && `Deactivated (${Object.keys(WIDGET_INFO).length - settings.activeWidgets.length})`}
            </button>
          ))}
        </div>

        {/* Grid of Modular Widgets */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWidgets.map((id) => {
            const widget = WIDGET_INFO[id];
            const isActive = settings.activeWidgets.includes(id);

            return (
              <div
                key={id}
                className={`group relative overflow-hidden rounded-3xl border p-5 transition-all flex flex-col justify-between h-[135px] ${
                  isActive
                    ? 'bg-theme-card border-theme-border shadow-xs hover:border-theme-accent/55'
                    : 'bg-theme-card/40 border-theme-border/30 opacity-70 hover:opacity-100'
                }`}
              >
                <div className="space-y-1">
                  <h4 className="text-sm font-black uppercase tracking-wide text-theme-text">
                    {widget.name}
                  </h4>
                  <p className="text-[10px] text-theme-text-muted leading-snug">
                    {widget.desc}
                  </p>
                </div>

                <button
                  onClick={() => handleWidgetToggle(id)}
                  className={`w-full text-xs font-bold py-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    isActive
                      ? 'bg-theme-input-bg text-theme-text border-theme-border/60 hover:bg-red-500/10 hover:border-red-500/20 hover:text-red-500'
                      : 'bg-theme-accent text-theme-accent-text border-theme-accent hover:opacity-90'
                  }`}
                >
                  {isActive ? (
                    <>
                      <EyeOff size={13} />
                      Deactivate Widget
                    </>
                  ) : (
                    <>
                      <Eye size={13} />
                      Activate & Mount
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
