import { useState, useEffect, useCallback } from 'react';

interface RSSFeed {
  id: string;
  name: string;
  url: string;
  isDefault: boolean;
}

interface Article {
  title: string;
  link: string;
  pubDate: string;
  description?: string;
  fullContent?: string;
  author?: string;
  thumbnail?: string;
}

const DEFAULT_FEEDS: RSSFeed[] = [
  { id: 'feed-bbc', name: 'BBC News', url: 'https://feeds.bbci.co.uk/news/rss.xml', isDefault: true },
  { id: 'feed-nyt', name: 'NYT', url: 'https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml', isDefault: true },
  { id: 'feed-techcrunch', name: 'TechCrunch', url: 'https://techcrunch.com/feed/', isDefault: true },
  { id: 'feed-wired', name: 'Wired', url: 'https://www.wired.com/feed/rss', isDefault: true },
  { id: 'feed-nasa', name: 'NASA', url: 'https://www.nasa.gov/feed/', isDefault: true }
];

function loadFeeds(): RSSFeed[] {
  const saved = localStorage.getItem('gaidrid_news_feeds');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } catch (e) {
      console.error('Error parsing news feeds:', e);
    }
  }
  return DEFAULT_FEEDS;
}

export function useNewsFeed() {
  const [feeds, setFeeds] = useState<RSSFeed[]>(loadFeeds);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedFeed, setSelectedFeed] = useState<string>(feeds[0]?.id || 'feed-bbc');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('gaidrid_news_feeds', JSON.stringify(feeds));
  }, [feeds]);

  const fetchFeed = useCallback(async (feedUrl: string) => {
    if (!feedUrl) return;
    setLoading(true);
    setError(null);
    try {
      const proxyUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feedUrl)}`;
      const res = await fetch(proxyUrl);
      if (!res.ok) throw new Error('Network response was not ok');
      const data = await res.json();

      if (data.status === 'ok' && Array.isArray(data.items)) {
        const parsedArticles = data.items.map((item: { title?: string; link?: string; pubDate?: string; pubDate_ms?: string; description?: string; content?: string; author?: string; thumbnail?: string; enclosure?: { link?: string } }) => {
          let thumbnail = item.thumbnail || '';
          if (!thumbnail && item.enclosure && item.enclosure.link) {
            thumbnail = item.enclosure.link;
          }
          if (!thumbnail && item.description) {
            const match = item.description.match(/<img[^>]+src=["']([^"']+)["']/i);
            if (match) {
              thumbnail = match[1];
            }
          }
          if (!thumbnail && item.content) {
            const match = item.content.match(/<img[^>]+src=["']([^"']+)["']/i);
            if (match) {
              thumbnail = match[1];
            }
          }
          return {
            title: item.title || 'Untitled Article',
            link: item.link || '',
            pubDate: item.pubDate || item.pubDate_ms || '',
            description: item.description ? item.description.replace(/<[^>]*>/g, '').slice(0, 120) + '...' : '',
            fullContent: item.content || item.description || '',
            author: item.author || '',
            thumbnail: thumbnail || undefined
          };
        });
        setArticles(parsedArticles);
      } else {
        const allOriginsUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(feedUrl)}`;
        const fallbackRes = await fetch(allOriginsUrl);
        if (!fallbackRes.ok) throw new Error('Fallback parser also failed');
        const fallbackData = await fallbackRes.json();
        const xmlString = fallbackData.contents;

        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
        const items = xmlDoc.getElementsByTagName('item');
        const parsedArticles: Article[] = [];

        for (let i = 0; i < Math.min(items.length, 10); i++) {
          const item = items[i];
          const title = item.getElementsByTagName('title')[0]?.textContent || 'Untitled';
          const link = item.getElementsByTagName('link')[0]?.textContent || '';
          const pubDate = item.getElementsByTagName('pubDate')[0]?.textContent || '';
          const descriptionRaw = item.getElementsByTagName('description')[0]?.textContent || '';
          const description = descriptionRaw ? descriptionRaw.replace(/<[^>]*>/g, '').slice(0, 120) + '...' : '';
          const contentEncoded = item.getElementsByTagName('content:encoded')[0]?.textContent || item.getElementsByTagName('encoded')[0]?.textContent || '';
          const fullContent = contentEncoded || descriptionRaw || '';

          let thumbnail = '';
          const enclosure = item.getElementsByTagName('enclosure')[0];
          if (enclosure) {
            thumbnail = enclosure.getAttribute('url') || '';
          }
          if (!thumbnail && descriptionRaw) {
            const match = descriptionRaw.match(/<img[^>]+src=["']([^"']+)["']/i);
            if (match) {
              thumbnail = match[1];
            }
          }

          parsedArticles.push({ title, link, pubDate, description, fullContent, thumbnail: thumbnail || undefined });
        }

        if (parsedArticles.length > 0) {
          setArticles(parsedArticles);
        } else {
          throw new Error('Failed to parse RSS feed format.');
        }
      }
    } catch (err) {
      console.error('Error fetching RSS feed:', err);
      setError('Could not fetch feed articles. Check the URL or connection.');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAllArticles = useCallback(async () => {
    const activeFeed = feeds.find((f) => f.id === selectedFeed) || feeds[0];
    if (activeFeed) {
      await fetchFeed(activeFeed.url);
    }
  }, [feeds, selectedFeed, fetchFeed]);

  useEffect(() => {
    fetchAllArticles();
  }, [selectedFeed, fetchAllArticles]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchAllArticles();
    }, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchAllArticles]);

  const addFeed = useCallback((feed: RSSFeed) => {
    setFeeds((prev) => [...prev, feed]);
    setSelectedFeed(feed.id);
  }, []);

  const deleteFeed = useCallback((id: string) => {
    const isDeletingActive = id === selectedFeed;
    const filtered = feeds.filter((f) => f.id !== id);
    setFeeds(filtered);
    if (isDeletingActive && filtered.length > 0) {
      setSelectedFeed(filtered[0].id);
    }
  }, [feeds, selectedFeed]);

  return {
    feeds,
    setFeeds,
    articles,
    loading,
    selectedFeed,
    setSelectedFeed,
    addFeed,
    deleteFeed,
    refetch: fetchAllArticles
  };
}
