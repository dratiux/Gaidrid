import { GameItem } from '../../types';
import { ExternalLink } from 'lucide-react';

interface WidgetContextMenuProps {
  widgetId: string;
  onWidgetAction: (widgetId: string, actionName: string) => void;
  onOpenGame: (game: GameItem) => void;
  onSetTab: (tab: 'home' | 'settings' | 'widgets' | 'news' | 'sports' | 'games') => void;
  onClose: () => void;
  onToggleWidget: (widgetId: string) => void;
  newsLink?: string | null;
  newsTitle?: string | null;
  gameItem?: GameItem | null;
}

export function WidgetContextMenu({
  widgetId,
  onWidgetAction,
  onOpenGame,
  onSetTab,
  onClose,
  onToggleWidget,
  newsLink,
  newsTitle,
  gameItem
}: WidgetContextMenuProps) {
  return (
    <div className="flex flex-col gap-0.5">
      {/* Pomodoro controls */}
      {widgetId === 'pomodoro' && (
        <div className="flex flex-col gap-0.5">
          <button
            onClick={() => onWidgetAction('pomodoro', 'toggle')}
            className="flex items-center px-2.5 py-1.5 w-full text-left rounded-lg hover:bg-theme-input-bg/80 transition-colors text-[11px]"
          >
            <span>Start / Pause Timer</span>
          </button>
          <button
            onClick={() => onWidgetAction('pomodoro', 'skip')}
            className="flex items-center px-2.5 py-1.5 w-full text-left rounded-lg hover:bg-theme-input-bg/80 transition-colors text-[11px]"
          >
            <span>Skip Active Session</span>
          </button>
          <button
            onClick={() => onWidgetAction('pomodoro', 'reset')}
            className="flex items-center px-2.5 py-1.5 w-full text-left rounded-lg hover:bg-theme-input-bg/80 transition-colors text-[11px]"
          >
            <span>Reset Timer State</span>
          </button>

          <div className="grid grid-cols-3 gap-1 px-2 py-1 bg-theme-input-bg/20 rounded-lg mx-1 mt-1">
            <button
              onClick={() => onWidgetAction('pomodoro', 'focus-15')}
              className="text-[9px] py-1 text-center rounded hover:bg-theme-input-bg"
            >
              15m
            </button>
            <button
              onClick={() => onWidgetAction('pomodoro', 'focus-25')}
              className="text-[9px] py-1 text-center rounded hover:bg-theme-input-bg"
            >
              25m
            </button>
            <button
              onClick={() => onWidgetAction('pomodoro', 'focus-45')}
              className="text-[9px] py-1 text-center rounded hover:bg-theme-input-bg"
            >
              45m
            </button>
          </div>
        </div>
      )}

      {/* Todo controls */}
      {widgetId === 'todo' && (
        <div className="flex flex-col gap-0.5">
          <button
            onClick={() => onWidgetAction('todo', 'show-add')}
            className="flex items-center px-2.5 py-1.5 w-full text-left rounded-lg hover:bg-theme-input-bg/80 transition-colors text-[11px]"
          >
            <span>Create New Task</span>
          </button>
          <button
            onClick={() => onWidgetAction('todo', 'clear-completed')}
            className="flex items-center px-2.5 py-1.5 w-full text-left rounded-lg hover:bg-theme-input-bg/80 transition-colors text-[11px]"
          >
            <span>Clear Completed Tasks</span>
          </button>

          <div className="grid grid-cols-3 gap-1 px-2 py-1 bg-theme-input-bg/20 rounded-lg mx-1 mt-1 text-center text-[9px]">
            <button
              onClick={() => onWidgetAction('todo', 'filter-all')}
              className="py-1 rounded hover:bg-theme-input-bg"
            >
              All
            </button>
            <button
              onClick={() => onWidgetAction('todo', 'filter-active')}
              className="py-1 rounded hover:bg-theme-input-bg"
            >
              Active
            </button>
            <button
              onClick={() => onWidgetAction('todo', 'filter-completed')}
              className="py-1 rounded hover:bg-theme-input-bg"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Notes controls */}
      {widgetId === 'notes' && (
        <div className="flex flex-col gap-0.5">
          <button
            onClick={() => onWidgetAction('notes', 'create')}
            className="flex items-center px-2.5 py-1.5 w-full text-left rounded-lg hover:bg-theme-input-bg/80 transition-colors text-[11px]"
          >
            <span>Create New Note</span>
          </button>
        </div>
      )}

      {/* Calendar controls */}
      {widgetId === 'calendar' && (
        <div className="flex flex-col gap-0.5">
          <button
            onClick={() => onWidgetAction('calendar', 'show-add')}
            className="flex items-center px-2.5 py-1.5 w-full text-left rounded-lg hover:bg-theme-input-bg/80 transition-colors text-[11px]"
          >
            <span>Add New Event</span>
          </button>
          <button
            onClick={() => onWidgetAction('calendar', 'view-list')}
            className="flex items-center px-2.5 py-1.5 w-full text-left rounded-lg hover:bg-theme-input-bg/80 transition-colors text-[11px]"
          >
            <span>View Daily Schedule</span>
          </button>
        </div>
      )}

      {/* Games controls */}
      {widgetId === 'games' && (
        <div className="flex flex-col gap-0.5">
          {gameItem && (
            <button
              onClick={() => {
                onOpenGame({
                  id: 'ctx-game',
                  title: gameItem.title,
                  game_url: gameItem.game_url,
                  thumbnail: gameItem.thumbnail,
                  genre: gameItem.genre,
                  short_description: gameItem.short_description
                });
                onClose();
              }}
              className="flex items-center px-2.5 py-1.5 w-full text-left rounded-lg hover:bg-theme-input-bg/80 transition-colors text-[11px]"
            >
              <span>Play {gameItem.title}</span>
            </button>
          )}
          <button
            onClick={() => {
              onSetTab('games');
              onClose();
            }}
            className="flex items-center px-2.5 py-1.5 w-full text-left rounded-lg hover:bg-theme-input-bg/80 transition-colors text-[11px]"
          >
            <span>Open Games</span>
          </button>
        </div>
      )}

      {/* News controls */}
      {widgetId === 'news' && (
        <div className="flex flex-col gap-0.5">
          {newsLink && (
            <a
              href={newsLink}
              target="_blank"
              rel="noopener noreferrer"
              referrerPolicy="no-referrer"
              className="flex items-center gap-1.5 px-2.5 py-1.5 w-full text-left rounded-lg hover:bg-theme-input-bg/80 transition-colors text-[11px]"
              onClick={() => onClose()}
            >
              <ExternalLink size={12} className="text-theme-text-muted shrink-0" />
              <span className="truncate">Open {newsTitle}</span>
            </a>
          )}
          <button
            onClick={() => {
              onSetTab('news');
              onClose();
            }}
            className="flex items-center px-2.5 py-1.5 w-full text-left rounded-lg hover:bg-theme-input-bg/80 transition-colors text-[11px]"
          >
            <span>Open News</span>
          </button>
        </div>
      )}

      {/* Sports controls */}
      {widgetId === 'sports' && (
        <div className="flex flex-col gap-0.5">
          <button
            onClick={() => {
              onSetTab('sports');
              onClose();
            }}
            className="flex items-center px-2.5 py-1.5 w-full text-left rounded-lg hover:bg-theme-input-bg/80 transition-colors text-[11px]"
          >
            <span>Open Sports</span>
          </button>
        </div>
      )}

      {/* Hide current widget */}
      <button
        onClick={() => {
          if (widgetId) {
            onToggleWidget(widgetId);
            onClose();
          }
        }}
        className="flex items-center px-2.5 py-1.5 w-full text-left rounded-lg hover:bg-red-500/10 text-red-500 transition-colors text-[11px] mt-1"
      >
        <span>Hide from Dashboard</span>
      </button>

      <div className="h-[1px] bg-theme-border/20 my-1.5" />
    </div>
  );
}
