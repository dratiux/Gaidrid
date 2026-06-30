import { ExternalLink } from 'lucide-react';

interface NewsLinkContextMenuProps {
  newsLink: string;
  newsTitle?: string | null;
  onClose: () => void;
}

export function NewsLinkContextMenu({
  newsLink,
  newsTitle,
  onClose
}: NewsLinkContextMenuProps) {
  return (
    <div className="flex flex-col gap-0.5">
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

      <div className="h-[1px] bg-theme-border/20 my-1.5" />
    </div>
  );
}
