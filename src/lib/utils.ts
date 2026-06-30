export function getDomain(urlStr: string): string {
  try {
    const parsed = new URL(urlStr);
    return parsed.hostname.replace('www.', '');
  } catch {
    return '';
  }
}

export function buildSearchUrl(query: string, engine: string): string {
  const encoded = encodeURIComponent(query);
  switch (engine) {
    case 'google': return `https://www.google.com/search?q=${encoded}`;
    case 'duckduckgo': return `https://duckduckgo.com/?q=${encoded}`;
    case 'bing': return `https://www.bing.com/search?q=${encoded}`;
    case 'youtube': return `https://www.youtube.com/results?search_query=${encoded}`;
    case 'github': return `https://github.com/search?q=${encoded}`;
    case 'gemini': return `https://gemini.google.com/app?q=${encoded}`;
    default: return `https://www.google.com/search?q=${encoded}`;
  }
}
