import { motion } from 'motion/react';
import { UserSettings } from '../../types';
import { Timer, CloudSun, FileText, CheckSquare, Calendar, TrendingUp, Bookmark, Trophy, Newspaper, Gamepad2 } from 'lucide-react';
import { Toggle } from '../ui/Toggle';

interface WidgetsStepProps {
  settings: UserSettings;
  onUpdateSettings: (newSettings: Partial<UserSettings>) => void;
}

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

const WIDGETS = [
  { id: 'pomodoro', name: 'Pomodoro', desc: 'Focus timer' },
  { id: 'weather', name: 'Weather', desc: 'Live conditions' },
  { id: 'notes', name: 'Notes', desc: 'Quick thoughts' },
  { id: 'todo', name: 'Task Board', desc: 'Track tasks' },
  { id: 'calendar', name: 'Calendar', desc: 'Schedule' },
  { id: 'finance', name: 'Finance', desc: 'Market tickers' },
  { id: 'bookmarks', name: 'Bookmarks', desc: 'Saved links' },
  { id: 'sports', name: 'Sports', desc: 'Live scores' },
  { id: 'news', name: 'News', desc: 'RSS feeds' },
  { id: 'games', name: 'Games', desc: 'Browser games' },
] as const;

export default function WidgetsStep({ settings, onUpdateSettings }: WidgetsStepProps) {
  const toggleWidget = (widgetId: string) => {
    let updatedActive = [...settings.activeWidgets];
    if (updatedActive.includes(widgetId)) {
      updatedActive = updatedActive.filter((w) => w !== widgetId);
    } else {
      updatedActive.push(widgetId);
    }
    onUpdateSettings({ activeWidgets: updatedActive });
  };

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
        <h2 className="text-lg font-black tracking-tight text-theme-text uppercase">
          Dashboard Widgets
        </h2>
        <p className="text-theme-text-muted text-[11px]">
          Choose which widgets to display on your workspace cockpit. You can always change this from Settings.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2 max-h-[240px] overflow-y-auto pr-1 scrollbar-thin">
        {WIDGETS.map((widget) => {
          const isActive = settings.activeWidgets.includes(widget.id);
          const Icon = WIDGET_ICONS[widget.id];
          return (
            <button
              key={widget.id}
              type="button"
              onClick={() => toggleWidget(widget.id)}
              className={`p-3 rounded-2xl border flex items-center gap-2.5 transition-all cursor-pointer text-left ${
                isActive
                  ? 'border-theme-accent/30 bg-theme-accent/5'
                  : 'border-theme-border/40 bg-theme-input-bg/30 hover:border-theme-border/60'
              }`}
            >
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                isActive ? 'bg-theme-accent/15 text-theme-accent' : 'bg-theme-input-bg/60 text-theme-text-muted'
              }`}>
                <Icon size={13} />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-black block text-theme-text uppercase tracking-wide leading-none truncate">{widget.name}</span>
                <span className="text-[8px] text-theme-text-muted block mt-0.5 leading-none">{widget.desc}</span>
              </div>
              <Toggle checked={isActive} onChange={() => toggleWidget(widget.id)} />
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}
