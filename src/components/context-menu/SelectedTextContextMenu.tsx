import { buildSearchUrl } from '../../lib/utils';

interface SelectedTextContextMenuProps {
  selectedText: string;
  onClose: () => void;
}

export function SelectedTextContextMenu({
  selectedText,
  onClose
}: SelectedTextContextMenuProps) {
  return (
    <div className="flex flex-col gap-0.5">
      <div className="px-2.5 py-1 text-[9px] font-bold text-theme-text-muted uppercase tracking-widest">
        Selection Actions
      </div>
      <div className="mx-1 px-2 py-1 text-[9px] font-mono truncate text-theme-text-muted bg-theme-input-bg/30 rounded-md">
        "{selectedText.substring(0, 18)}..."
      </div>
      <button
        onClick={() => {
          navigator.clipboard.writeText(selectedText);
          onClose();
        }}
        className="flex items-center px-2.5 py-1.5 w-full text-left rounded-lg hover:bg-theme-input-bg/80 transition-colors text-[11px]"
      >
        <span>Copy Selection</span>
      </button>

      <a
        href={buildSearchUrl(selectedText, 'google')}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center px-2.5 py-1.5 w-full text-left rounded-lg hover:bg-theme-input-bg/80 transition-colors text-[11px]"
        onClick={() => onClose()}
      >
        <span>Search on Google</span>
      </a>

      <a
        href={buildSearchUrl(selectedText, 'duckduckgo')}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center px-2.5 py-1.5 w-full text-left rounded-lg hover:bg-theme-input-bg/80 transition-colors text-[11px]"
        onClick={() => onClose()}
      >
        <span>Search on DuckDuckGo</span>
      </a>

      <div className="h-[1px] bg-theme-border/20 my-1.5" />
    </div>
  );
}
