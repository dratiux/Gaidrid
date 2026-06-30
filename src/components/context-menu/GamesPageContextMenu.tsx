import { GameItem } from '../../types';

interface GamesPageContextMenuProps {
  gameItem?: GameItem | null;
  onOpenGame: (game: GameItem) => void;
  onClose: () => void;
}

export function GamesPageContextMenu({
  gameItem,
  onOpenGame,
  onClose
}: GamesPageContextMenuProps) {
  return (
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

      <div className="h-[1px] bg-theme-border/20 my-1.5" />
    </div>
  );
}
