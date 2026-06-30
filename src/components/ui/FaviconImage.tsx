import { getDomain } from '../../lib/utils';

interface FaviconImageProps {
  url: string;
  size?: number;
  className?: string;
}

const GLOBE_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-globe"><circle cx="12" cy="12" r="10"/><line x1="2" x2="22" y1="12" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`;

export function FaviconImage({ url, size = 32, className = '' }: FaviconImageProps) {
  const domain = getDomain(url) || 'web';
  return (
    <img
      src={`https://www.google.com/s2/favicons?domain=${domain}&sz=${size}`}
      className={className}
      alt=""
      referrerPolicy="no-referrer"
      onError={(e) => {
        (e.target as HTMLImageElement).src = GLOBE_SVG;
      }}
    />
  );
}
