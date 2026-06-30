import React from 'react';
import { UserSettings, FavoriteSite, GameItem } from '../types';
import {
  BookmarkContextMenu,
  NewsLinkContextMenu,
  WidgetContextMenu,
  GamesPageContextMenu,
  SelectedTextContextMenu,
  WorkspaceEnginePanel,
  WIDGET_INFO_MAP,
} from './context-menu';
import { motion, AnimatePresence } from 'motion/react';

export type ContextMenuData = {
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
};

interface ContextMenuProps {
  contextMenu: ContextMenuData;
  setContextMenu: React.Dispatch<React.SetStateAction<ContextMenuData | null>>;
  settings: UserSettings;
  favorites: FavoriteSite[];
  onUpdateSettings: (updates: Partial<UserSettings>) => void;
  onToggleFavorite: (id: string) => void;
  onDeleteFavorite: (id: string) => void;
  onOpenGame: (game: GameItem) => void;
  setTab: (tab: 'home' | 'settings' | 'widgets' | 'news' | 'sports' | 'games') => void;
  currentTab: 'home' | 'settings' | 'widgets' | 'news' | 'sports' | 'games';
}

export default function ContextMenu({
  contextMenu,
  setContextMenu,
  settings,
  favorites,
  onUpdateSettings,
  onToggleFavorite,
  onDeleteFavorite,
  onOpenGame,
  setTab,
  currentTab
}: ContextMenuProps) {
  const close = () => setContextMenu((prev) => prev ? { ...prev, visible: false } : null);

  const handleWidgetAction = (widgetId: string, actionName: string) => {
    if (widgetId === 'pomodoro') {
      window.dispatchEvent(new CustomEvent('gaidrid-pomodoro-action', { detail: { action: actionName } }));
    } else if (widgetId === 'todo') {
      window.dispatchEvent(new CustomEvent('gaidrid-todo-action', { detail: { action: actionName } }));
    } else if (widgetId === 'notes') {
      window.dispatchEvent(new CustomEvent('gaidrid-notes-action', { detail: { action: actionName } }));
    } else if (widgetId === 'calendar') {
      window.dispatchEvent(new CustomEvent('gaidrid-calendar-action', { detail: { action: actionName } }));
    }

    if (actionName !== 'filter-all' && actionName !== 'filter-active' && actionName !== 'filter-completed') {
      setContextMenu((prev) => prev ? { ...prev, visible: false } : null);
    }
  };

  const toggleWidget = (widgetId: string) => {
    const isCurrentlyActive = settings.activeWidgets.includes(widgetId);
    let newActive = [...settings.activeWidgets];
    if (isCurrentlyActive) {
      newActive = newActive.filter(id => id !== widgetId);
    } else {
      newActive.push(widgetId);
    }

    let newLayout = [...settings.widgetLayout];
    if (!newLayout.includes(widgetId)) {
      newLayout.push(widgetId);
    }

    onUpdateSettings({
      activeWidgets: newActive,
      widgetLayout: newLayout
    });
  };

  return (
    <AnimatePresence>
      {contextMenu && contextMenu.visible && (
        <motion.div
          id="gaidrid-context-menu"
          role="menu"
          aria-label="Context menu"
          initial={{ opacity: 0, scale: 0.96, y: -4 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -4 }}
          transition={{ duration: 0.1, ease: 'easeOut' }}
          onContextMenu={(e) => e.preventDefault()}
          style={{
            position: 'fixed',
            left: contextMenu.x,
            top: contextMenu.y,
          }}
          className="z-[200] w-[230px] bg-theme-card/90 backdrop-blur-md border border-theme-border rounded-[18px] shadow-none flex flex-col p-1.5 text-theme-text overflow-y-auto max-h-[440px] scrollbar-thin font-sans text-xs select-none"
        >
          {/* Context Bookmark-Specific Panel */}
          {contextMenu.portalId && (() => {
            const portal = favorites.find((fav) => fav.id === contextMenu.portalId);
            if (!portal) return null;
            return (
              <BookmarkContextMenu
                portal={portal}
                onToggleFavorite={onToggleFavorite}
                onDeleteFavorite={onDeleteFavorite}
                onClose={close}
              />
            );
          })()}

          {/* Context News-Specific Panel (only when NOT on news widget) */}
          {contextMenu.newsLink && contextMenu.widgetId !== 'news' && (
            <NewsLinkContextMenu
              newsLink={contextMenu.newsLink}
              newsTitle={contextMenu.newsTitle}
              onClose={close}
            />
          )}

          {/* Context Widget-Specific Panel */}
          {contextMenu.widgetId && WIDGET_INFO_MAP[contextMenu.widgetId] && (
            <WidgetContextMenu
              widgetId={contextMenu.widgetId}
              onWidgetAction={handleWidgetAction}
              onOpenGame={onOpenGame}
              onSetTab={setTab}
              onClose={close}
              onToggleWidget={toggleWidget}
              newsLink={contextMenu.newsLink}
              newsTitle={contextMenu.newsTitle}
              gameItem={contextMenu.gameItem}
            />
          )}

          {/* Games Page context menu */}
          {contextMenu.gamesPageId === 'games' && (
            <GamesPageContextMenu
              gameItem={contextMenu.gameItem}
              onOpenGame={onOpenGame}
              onClose={close}
            />
          )}

          {/* Selected Text Section */}
          {contextMenu.selectedText && (
            <SelectedTextContextMenu
              selectedText={contextMenu.selectedText}
              onClose={close}
            />
          )}

          {/* Global Workspace Control Panel */}
          <WorkspaceEnginePanel
            settings={settings}
            currentTab={currentTab}
            onUpdateSettings={onUpdateSettings}
            onToggleWidget={toggleWidget}
            onSetTab={setTab}
            onClose={close}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
