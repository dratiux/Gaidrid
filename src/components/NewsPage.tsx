import React, { useState, useEffect } from 'react';
import FeedSidebar from './news/FeedSidebar';
import ArticleGrid from './news/ArticleGrid';
import AddFeedModal from './news/AddFeedModal';
import { Article, RSSFeed } from './news/types';

const DEFAULT_FEEDS: RSSFeed[] = [
  { id: 'feed-bbc', name: 'BBC News', url: 'https://feeds.bbci.co.uk/news/rss.xml', isDefault: true },
  { id: 'feed-nyt', name: 'NYT', url: 'https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml', isDefault: true },
  { id: 'feed-techcrunch', name: 'TechCrunch', url: 'https://techcrunch.com/feed/', isDefault: true },
  { id: 'feed-wired', name: 'Wired', url: 'https://www.wired.com/feed/rss', isDefault: true },
];

export default function NewsPage() {
  const [feeds, setFeeds] = useState<RSSFeed[]>(() => {
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
  });

  const [activeFeedId, setActiveFeedId] = useState<string>(feeds[0]?.id || 'feed-bbc');
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    localStorage.setItem('gaidrid_news_feeds', JSON.stringify(feeds));
  }, [feeds]);

  const activeFeed = feeds.find((f) => f.id === activeFeedId) || feeds[0];

  const fetchFeed = async (feedUrl: string) => {
    if (!feedUrl) return;
    setLoading(true);
    setError(null);
    try {
      const proxyUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feedUrl)}`;
      const res = await fetch(proxyUrl);
      if (!res.ok) throw new Error('Primary fetch failed');
      const data = await res.json();

      if (data.status === 'ok' && Array.isArray(data.items)) {
        const parsedArticles = data.items.map((item: { title?: string; link?: string; pubDate?: string; pubDate_ms?: string; description?: string; content?: string; author?: string; thumbnail?: string; enclosure?: { link?: string } }) => {
          let thumbnail = item.thumbnail || '';
          if (!thumbnail && item.enclosure && item.enclosure.link) {
            thumbnail = item.enclosure.link;
          }
          if (!thumbnail && item.description) {
            const match = item.description.match(/<img[^>]+src=["']([^"']+)["']/i);
            if (match) thumbnail = match[1];
          }
          if (!thumbnail && item.content) {
            const match = item.content.match(/<img[^>]+src=["']([^"']+)["']/i);
            if (match) thumbnail = match[1];
          }

          return {
            title: item.title || 'Untitled Article',
            link: item.link || '',
            pubDate: item.pubDate || item.pubDate_ms || '',
            description: item.description ? item.description.replace(/<[^>]*>/g, '').trim() : '',
            fullContent: item.content || item.description || '',
            author: item.author || '',
            thumbnail: thumbnail || undefined,
          };
        });
        setArticles(parsedArticles);
      } else {
        const allOriginsUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(feedUrl)}`;
        const fallbackRes = await fetch(allOriginsUrl);
        if (!fallbackRes.ok) throw new Error('Fallback parser failed');
        const fallbackData = await fallbackRes.json();
        const xmlString = fallbackData.contents;

        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
        const items = xmlDoc.getElementsByTagName('item');
        const parsedArticles: Article[] = [];

        for (let i = 0; i < Math.min(items.length, 15); i++) {
          const item = items[i];
          const title = item.getElementsByTagName('title')[0]?.textContent || 'Untitled';
          const link = item.getElementsByTagName('link')[0]?.textContent || '';
          const pubDate = item.getElementsByTagName('pubDate')[0]?.textContent || '';
          const descriptionRaw = item.getElementsByTagName('description')[0]?.textContent || '';
          const description = descriptionRaw ? descriptionRaw.replace(/<[^>]*>/g, '').trim() : '';
          const contentEncoded = item.getElementsByTagName('content:encoded')[0]?.textContent || item.getElementsByTagName('encoded')[0]?.textContent || '';
          const fullContent = contentEncoded || descriptionRaw || '';

          let thumbnail = '';
          const enclosure = item.getElementsByTagName('enclosure')[0];
          if (enclosure) {
            thumbnail = enclosure.getAttribute('url') || '';
          }
          if (!thumbnail && descriptionRaw) {
            const match = descriptionRaw.match(/<img[^>]+src=["']([^"']+)["']/i);
            if (match) thumbnail = match[1];
          }

          parsedArticles.push({
            title,
            link,
            pubDate,
            description: description.slice(0, 150) + (description.length > 150 ? '...' : ''),
            fullContent,
            thumbnail: thumbnail || undefined,
          });
        }

        if (parsedArticles.length > 0) {
          setArticles(parsedArticles);
        } else {
          throw new Error('No articles found');
        }
      }
    } catch (err) {
      console.error('Error fetching RSS feed:', err);
      setError('Could not fetch feed articles. Please verify the URL or try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeFeed) {
      fetchFeed(activeFeed.url);
    }
  }, [activeFeedId, activeFeed?.url]);

  const handleAddFeed = (name: string, url: string) => {
    let formattedUrl = url;
    if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = 'https://' + formattedUrl;
    }

    const newFeed: RSSFeed = {
      id: `feed-custom-${Date.now()}`,
      name,
      url: formattedUrl,
    };

    const updated = [...feeds, newFeed];
    setFeeds(updated);
    setActiveFeedId(newFeed.id);
    setShowAddModal(false);
  };

  const handleDeleteFeed = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = feeds.filter((f) => f.id !== id);
    setFeeds(updated);
    if (activeFeedId === id) {
      setActiveFeedId(updated[0]?.id || '');
    }
  };

  const filteredArticles = articles.filter((article) =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (article.description && article.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="w-full flex flex-col gap-6 font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-theme-border/20 pb-5">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-theme-text">
            News
          </h2>
          <p className="text-xs text-theme-text-muted mt-0.5 font-sans uppercase tracking-wider">
            Curated updates & articles synced to your browser dashboard
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        <FeedSidebar
          feeds={feeds}
          activeFeedId={activeFeedId}
          searchQuery={searchQuery}
          loading={loading}
          onSearchChange={setSearchQuery}
          onRefresh={() => activeFeed && fetchFeed(activeFeed.url)}
          onSelectFeed={setActiveFeedId}
          onDeleteFeed={handleDeleteFeed}
          onOpenAddFeed={() => setShowAddModal(true)}
        />

        <div className="lg:col-span-3 flex flex-col gap-4">
          <ArticleGrid
            articles={filteredArticles}
            loading={loading}
            error={error}
            onRetry={() => activeFeed && fetchFeed(activeFeed.url)}
          />
        </div>
      </div>

      <AddFeedModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAddFeed={handleAddFeed}
      />
    </div>
  );
}
