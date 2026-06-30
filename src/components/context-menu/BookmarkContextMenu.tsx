import { FavoriteSite } from '../../types';

interface BookmarkContextMenuProps {
  portal: FavoriteSite;
  onToggleFavorite: (id: string) => void;
  onDeleteFavorite: (id: string) => void;
  onClose: () => void;
}

export function BookmarkContextMenu({
  portal,
  onToggleFavorite,
  onDeleteFavorite,
  onClose
}: BookmarkContextMenuProps) {
  return (
    <div className="flex flex-col gap-0.5">
      <div className="mx-1 mb-1 px-2 py-1.5 bg-theme-input-bg/40 rounded-xl border border-theme-border/15 flex flex-col gap-0.5">
        <div className="text-[10px] font-bold text-theme-accent uppercase tracking-wider">
          <span>Bookmark: {portal.name}</span>
        </div>
        <span className="text-[9px] text-theme-text-muted leading-none truncate font-mono">
          {portal.url}
        </span>
      </div>

      <a
        href={portal.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center px-2.5 py-1.5 w-full text-left rounded-lg hover:bg-theme-input-bg/80 transition-colors text-[11px]"
        onClick={() => onClose()}
      >
        <span>Open Bookmark</span>
      </a>

      <button
        onClick={() => {
          onToggleFavorite(portal.id);
          onClose();
        }}
        className="flex items-center px-2.5 py-1.5 w-full text-left rounded-lg hover:bg-theme-input-bg/80 transition-colors text-[11px]"
      >
        <span>{portal.isFavorite === true ? 'Remove from Favorites' : 'Add to Favorites'}</span>
      </button>

      <button
        onClick={() => {
          navigator.clipboard.writeText(portal.url);
          onClose();
        }}
        className="flex items-center px-2.5 py-1.5 w-full text-left rounded-lg hover:bg-theme-input-bg/80 transition-colors text-[11px]"
      >
        <span>Copy Address</span>
      </button>

      <button
        onClick={() => {
          onDeleteFavorite(portal.id);
          onClose();
        }}
        className="flex items-center px-2.5 py-1.5 w-full text-left rounded-lg hover:bg-red-500/10 text-red-500 transition-colors text-[11px] mt-1"
      >
        <span>Delete Bookmark</span>
      </button>

      <div className="h-[1px] bg-theme-border/20 my-1.5" />
    </div>
  );
}
