import React, { useState } from 'react';
import { UserSettings, Bookmark, TodoItem, NoteItem, CalendarEvent, FavoriteSite, Game, GameItem } from '../types';
import WeatherWidget from './WeatherWidget';
import BookmarksWidget from './BookmarksWidget';
import TodoWidget from './TodoWidget';
import NotesWidget from './NotesWidget';
import CalendarWidget from './CalendarWidget';
import FinanceWidget from './FinanceWidget';
import PomodoroWidget from './PomodoroWidget';
import SportsWidget from './SportsWidget';
import NewsWidget from './NewsWidget';
import GamesWidget from './GamesWidget';

interface WidgetsGridProps {
  settings: UserSettings;
  bookmarks: Bookmark[];
  todos: TodoItem[];
  notes: NoteItem[];
  events: CalendarEvent[];
  favorites?: FavoriteSite[];
  
  // Handlers
  onUpdateSettings?: (updates: Partial<UserSettings>) => void;
  onAddBookmark: (title: string, url: string, category: string) => void;
  onDeleteBookmark: (id: string) => void;
  onAddFavorite?: (name: string, url: string, icon: string, category?: string) => void;
  onDeleteFavorite?: (id: string) => void;
  onToggleFavorite?: (id: string) => void;
  
  onAddTodo: (text: string, priority: 'low' | 'medium' | 'high', dueDate?: string, category?: string) => void;
  onToggleTodo: (id: string) => void;
  onDeleteTodo: (id: string) => void;
  
  onAddNote: (title: string, content: string) => void;
  onUpdateNote: (id: string, title: string, content: string) => void;
  onDeleteNote: (id: string) => void;
  
  onAddEvent: (title: string, date: string, startTime: string, endTime: string, description?: string) => void;
  onDeleteEvent: (id: string) => void;
  
  onOpenGame?: (game: Game) => void;
  onContextMenuGame?: (game: GameItem) => void;
  onNavigate?: (page: string) => void;
}

export default function WidgetsGrid({
  settings,
  bookmarks,
  todos,
  notes,
  events,
  favorites,
  onUpdateSettings,
  onAddBookmark,
  onDeleteBookmark,
  onAddTodo,
  onToggleTodo,
  onDeleteTodo,
  onAddNote,
  onUpdateNote,
  onDeleteNote,
  onAddEvent,
  onDeleteEvent,
  onAddFavorite,
  onDeleteFavorite,
  onToggleFavorite,
  onOpenGame,
  onContextMenuGame,
  onNavigate
}: WidgetsGridProps) {
  
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  // Filter and sort widgets based on the active state and layout configurations
  const visibleWidgets = settings.widgetLayout.filter((widgetId) =>
    settings.activeWidgets.includes(widgetId)
  );

  const getBentoClasses = (id: string) => {
    switch (id) {
      case 'pomodoro':
        return 'col-span-1 row-span-1 h-[340px]';
      case 'weather':
        return 'col-span-1 row-span-1 h-[340px]';
      case 'todo':
        return 'col-span-1 md:col-span-2 row-span-1 h-[340px]';
      case 'bookmarks':
        return 'col-span-1 row-span-1 h-[340px]';
      case 'notes':
        return 'col-span-1 md:col-span-2 lg:col-span-1 row-span-1 h-[340px]';
      case 'calendar':
        return 'col-span-1 md:col-span-2 row-span-1 h-[340px]';
      case 'finance':
        return 'col-span-1 row-span-1 h-[340px]';
      case 'sports':
        return 'col-span-1 md:col-span-2 row-span-1 h-[340px]';
      case 'news':
        return 'col-span-1 md:col-span-2 lg:col-span-1 row-span-1 h-[340px]';
      case 'games':
        return 'col-span-1 md:col-span-2 row-span-1 h-[340px]';
      default:
        return 'col-span-1 row-span-1 h-[340px]';
    }
  };

  const handleRemoveWidget = (widgetId: string) => {
    if (onUpdateSettings) {
      onUpdateSettings({
        activeWidgets: settings.activeWidgets.filter((id) => id !== widgetId),
      });
    }
  };

  const renderWidgetContent = (widgetId: string) => {
    switch (widgetId) {
      case 'pomodoro':
        return <PomodoroWidget onRemove={() => handleRemoveWidget('pomodoro')} />;
      case 'weather':
        return <WeatherWidget onRemove={() => handleRemoveWidget('weather')} />;
      case 'bookmarks':
        return (
          <BookmarksWidget
            bookmarks={bookmarks}
            favorites={favorites}
            onAddBookmark={onAddBookmark}
            onDeleteBookmark={onDeleteBookmark}
            onAddFavorite={onAddFavorite}
            onDeleteFavorite={onDeleteFavorite}
            onToggleFavorite={onToggleFavorite}
            onRemove={() => handleRemoveWidget('bookmarks')}
          />
        );
      case 'todo':
        return (
          <TodoWidget
            todos={todos}
            onAddTodo={onAddTodo}
            onToggleTodo={onToggleTodo}
            onDeleteTodo={onDeleteTodo}
            onRemove={() => handleRemoveWidget('todo')}
          />
        );
      case 'notes':
        return (
          <NotesWidget
            notes={notes}
            onAddNote={onAddNote}
            onUpdateNote={onUpdateNote}
            onDeleteNote={onDeleteNote}
            onRemove={() => handleRemoveWidget('notes')}
          />
        );
      case 'calendar':
        return (
          <CalendarWidget
            events={events}
            onAddEvent={onAddEvent}
            onDeleteEvent={onDeleteEvent}
            onRemove={() => handleRemoveWidget('calendar')}
          />
        );
      case 'finance':
        return (
          <FinanceWidget
            onRemove={() => handleRemoveWidget('finance')}
          />
        );
      case 'sports':
        return <SportsWidget onRemove={() => handleRemoveWidget('sports')} onNavigate={onNavigate} />;
      case 'news':
        return (
          <NewsWidget 
            onRemove={() => handleRemoveWidget('news')} 
            onNavigate={onNavigate}
          />
        );
      case 'games':
        return (
          <GamesWidget 
            onRemove={() => handleRemoveWidget('games')}
            onOpenGame={onOpenGame}
            onNavigate={onNavigate}
            onContextMenuGame={onContextMenuGame}
          />
        );
      default:
        return null;
    }
  };

  // Drag and Drop handlers
  const handleDragStart = (e: React.DragEvent, id: string) => {
    if (typeof document !== 'undefined' && document.querySelector('.fixed.inset-0')) {
      e.preventDefault();
      return;
    }
    setDraggedId(id);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', id);
  };

  const handleDragOver = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (draggedId && draggedId !== targetId) {
      setDragOverId(targetId);
    }
  };

  const handleDragLeave = () => {
    setDragOverId(null);
  };

  const handleDragEnd = () => {
    setDraggedId(null);
    setDragOverId(null);
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    const sourceId = e.dataTransfer.getData('text/plain') || draggedId;
    if (sourceId && sourceId !== targetId) {
      const currentLayout = [...settings.widgetLayout];
      const sourceIndex = currentLayout.indexOf(sourceId);
      const targetIndex = currentLayout.indexOf(targetId);

      if (sourceIndex !== -1 && targetIndex !== -1) {
        currentLayout.splice(sourceIndex, 1);
        currentLayout.splice(targetIndex, 0, sourceId);
        
        if (onUpdateSettings) {
          onUpdateSettings({ widgetLayout: currentLayout });
        }
      }
    }
    setDraggedId(null);
    setDragOverId(null);
  };

  if (visibleWidgets.length === 0) {
    return (
      <div className="w-full text-center py-12 px-6 bg-theme-card rounded-3xl border border-theme-border/40 max-w-2xl mx-auto mt-6">
        <span className="text-xs text-theme-text-muted font-medium block">
          All widgets are currently muted or disabled. Use the Sidebar or Settings Panel to activate workspace modules.
        </span>
      </div>
    );
  }

  return (
    <div
      id="widgets-grid-container"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto py-6 px-4 grid-flow-row-dense"
    >
      {visibleWidgets.map((widgetId) => {
        const isDragging = draggedId === widgetId;
        const isDragOver = dragOverId === widgetId;
        
        return (
          <div
            key={widgetId}
            id={`grid-cell-${widgetId}`}
            draggable
            onDragStart={(e) => handleDragStart(e, widgetId)}
            onDragOver={(e) => handleDragOver(e, widgetId)}
            onDragLeave={handleDragLeave}
            onDragEnd={handleDragEnd}
            onDrop={(e) => handleDrop(e, widgetId)}
            className={`bg-theme-card border rounded-[24px] transition-all duration-300 flex flex-col justify-between overflow-hidden relative group ${
              getBentoClasses(widgetId)
            } ${
              isDragging
                ? 'opacity-30 border-dashed border-theme-border scale-[0.98]'
                : isDragOver
                ? 'border-theme-accent ring-2 ring-theme-accent/20 scale-[0.99] opacity-85'
                : 'border-theme-border hover:border-theme-accent/30'
            }`}
          >
            <div className="flex-1 h-full w-full">
              {renderWidgetContent(widgetId)}
            </div>
          </div>
        );
      })}
    </div>
  );
}
