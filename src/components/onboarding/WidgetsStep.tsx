import React from 'react';
import { motion } from 'motion/react';
import { Check } from 'lucide-react';
import { UserSettings } from '../../types';

interface WidgetsStepProps {
  settings: UserSettings;
  onUpdateSettings: (newSettings: Partial<UserSettings>) => void;
}

const WIDGETS = [
  { id: 'pomodoro', name: 'Pomodoro Timer', desc: 'Focus timer sessions' },
  { id: 'weather', name: 'Weather Station', desc: 'Live weather conditions' },
  { id: 'notes', name: 'Notes', desc: 'Quick thoughts and notes' },
  { id: 'todo', name: 'Task Board', desc: 'Track tasks by priority' },
  { id: 'calendar', name: 'Calendar', desc: 'Schedule and events' },
  { id: 'finance', name: 'Finance Hub', desc: 'Market tickers and sparklines' },
  { id: 'bookmarks', name: 'Bookmarks', desc: 'Saved links and portals' },
  { id: 'sports', name: 'Sports', desc: 'Live scores and matches' },
  { id: 'news', name: 'News', desc: 'RSS feeds and streams' },
  { id: 'games', name: 'Games', desc: 'Browser games collection' },
] as const;

export default function WidgetsStep({ settings, onUpdateSettings }: WidgetsStepProps) {
  return (
    <motion.div
      key="step-3"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
      className="space-y-4"
    >
      <div className="space-y-1.5">
        <h2 className="text-lg font-black tracking-tight text-theme-text uppercase flex items-center gap-2">
          Dashboard Widgets
        </h2>
        <p className="text-theme-text-muted text-[11px]">
          Choose which widgets to display on your workspace cockpit. You can always change this from Settings.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-2 max-h-[220px] overflow-y-auto pr-1 scrollbar-thin">
        {WIDGETS.map((widget) => {
          const isActive = settings.activeWidgets.includes(widget.id);
          return (
            <button
              key={widget.id}
              type="button"
              onClick={() => {
                let updatedActive = [...settings.activeWidgets];
                if (updatedActive.includes(widget.id)) {
                  updatedActive = updatedActive.filter((w) => w !== widget.id);
                } else {
                  updatedActive.push(widget.id);
                }
                onUpdateSettings({ activeWidgets: updatedActive });
              }}
              className={`p-2.5 rounded-2xl border flex items-center justify-between transition-all cursor-pointer text-left ${
                isActive
                  ? 'border-theme-accent bg-theme-accent/5 font-bold'
                  : 'border-theme-border/50 bg-theme-input-bg/20 opacity-70 hover:opacity-100 hover:border-theme-border'
              }`}
            >
              <div className="min-w-0 mr-2">
                <span className="text-[11px] font-black block text-theme-text uppercase tracking-wide leading-none">{widget.name}</span>
                <span className="text-[9px] text-theme-text-muted block mt-1 leading-none">{widget.desc}</span>
              </div>
              <div className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 ${
                isActive
                  ? 'bg-theme-accent border-theme-accent text-theme-accent-text'
                  : 'border-theme-border/60'
              }`}>
                {isActive && <Check size={10} strokeWidth={3} />}
              </div>
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}
