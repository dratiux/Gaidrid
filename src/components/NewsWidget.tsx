import React, { useState } from 'react';
import { Newspaper, Plus, RefreshCw, ExternalLink, X, Clock, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNewsFeed } from '../hooks/useNewsFeed';
import { WidgetHeader } from './ui/WidgetHeader';
import { IconButton } from './ui/IconButton';
import { ModalCloseButton } from './ui/ModalCloseButton';
import { TextInput } from './ui/TextInput';
import { PrimaryButton } from './ui/PrimaryButton';

interface NewsWidgetProps {
  onRemove?: () => void;
  onNavigate?: (page: string) => void;
}

const getGradientForTitle = (title: string) => {
  const gradients = [
    'from-indigo-500/10 to-purple-500/10 text-indigo-500 dark:text-indigo-400 border-indigo-500/10',
    'from-blue-500/10 to-teal-500/10 text-blue-500 dark:text-blue-400 border-blue-500/10',
    'from-emerald-500/10 to-green-500/10 text-emerald-500 dark:text-emerald-400 border-emerald-500/10',
    'from-orange-500/10 to-amber-500/10 text-orange-500 dark:text-orange-400 border-orange-500/10',
    'from-rose-500/10 to-pink-500/10 text-rose-500 dark:text-rose-400 border-rose-500/10'
  ];
  let sum = 0;
  for (let i = 0; i < title.length; i++) {
    sum += title.charCodeAt(i);
  }
  return gradients[sum % gradients.length];
};

export default function NewsWidget({ onRemove, onNavigate }: NewsWidgetProps) {
  const { feeds, setFeeds, articles, loading, selectedFeed, setSelectedFeed, addFeed, deleteFeed, refetch } = useNewsFeed();

  const [showAddForm, setShowAddForm] = useState(false);
  const [newFeedName, setNewFeedName] = useState('');
  const [newFeedUrl, setNewFeedUrl] = useState('');
  const [error, setError] = useState<string | null>(null);

  const activeFeed = feeds.find((f) => f.id === selectedFeed) || feeds[0];

  const handleAddFeed = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFeedName.trim() || !newFeedUrl.trim()) return;

    let url = newFeedUrl.trim();
    if (!/^https?:\/\//i.test(url)) {
      url = 'https://' + url;
    }

    addFeed({
      id: `feed-${Date.now()}`,
      name: newFeedName.trim(),
      url,
      isDefault: false
    });

    setNewFeedName('');
    setNewFeedUrl('');
    setShowAddForm(false);
  };

  const getRelativeTime = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return '';
      const now = new Date();
      const diffMs = now.getTime() - d.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMins < 60) {
        return diffMins <= 1 ? 'Just now' : `${diffMins}m ago`;
      } else if (diffHours < 24) {
        return `${diffHours}h ago`;
      } else {
        return `${diffDays}d ago`;
      }
    } catch {
      return '';
    }
  };

  return (
    <div id="widget-news" className="flex flex-col h-full justify-between p-5">
      <WidgetHeader
        title="News"
        actions={<>
          <IconButton onClick={() => setShowAddForm(true)} icon={<Plus size={12} />} label="Add custom RSS feed" title="Add Custom Feed" />
          {onRemove && <IconButton onClick={onRemove} variant="danger" icon={<X size={12} />} label="Remove News widget" title="Remove Widget" />}
        </>}
      />

      {/* Feed Selectors Horizontal Scrolling list */}
      <div className="flex items-center gap-1 overflow-x-auto pb-2 mb-2 scrollbar-none scroll-smooth" role="tablist" aria-label="RSS feed tabs">
        {feeds.map((feed) => {
          const isActive = feed.id === selectedFeed;
          return (
            <div
              key={feed.id}
              onClick={() => setSelectedFeed(feed.id)}
              role="tab"
              aria-selected={isActive}
              aria-label={`${feed.name} feed${isActive ? ' (currently selected)' : ''}`}
              className={`group flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg transition-all cursor-pointer whitespace-nowrap font-mono ${
                isActive
                  ? 'bg-theme-accent text-theme-accent-text'
                  : 'bg-theme-input-bg/40 text-theme-text-muted border border-theme-border/30 hover:border-theme-border'
              }`}
            >
              <span>{feed.name}</span>
              {!feed.isDefault && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteFeed(feed.id);
                  }}
                  className="p-0.5 rounded-full hover:bg-red-500/10 text-theme-text-muted hover:text-red-500 transition-colors"
                  title="Delete Feed"
                  aria-label={`Delete ${feed.name} feed`}
                >
                  <X size={8} />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Feed Modal */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[250] p-4"
            onClick={() => setShowAddForm(false)}
            role="dialog"
            aria-modal="true"
            aria-label="Add RSS feed dialog"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="w-full max-w-sm bg-theme-card border border-theme-border rounded-3xl p-6 space-y-4 shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-theme-border/30 pb-3">
                <h3 className="text-xs font-black uppercase tracking-[0.25em] text-theme-text-muted">
                  Add RSS Feed
                </h3>
                <ModalCloseButton onClick={() => setShowAddForm(false)} />
              </div>

              <form onSubmit={handleAddFeed} className="space-y-4 flex flex-col" aria-label="Add new RSS feed">
                <div className="space-y-3.5">
                  <TextInput label="Feed Title" placeholder="e.g. TechCrunch" value={newFeedName} onChange={(e) => setNewFeedName(e.target.value)} required autoFocus aria-label="RSS feed title" />
                  <TextInput label="RSS Feed URL" placeholder="e.g. https://techcrunch.com/feed/" value={newFeedUrl} onChange={(e) => setNewFeedUrl(e.target.value)} required aria-label="RSS feed URL" className="font-medium font-mono" />
                </div>

                <div className="pt-2">
                  <PrimaryButton>Add Stream</PrimaryButton>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Articles Container */}
      <div className="flex-1 overflow-y-auto max-h-[190px] pr-1 space-y-2 scrollbar-thin premium-scroll-mask" role="region" aria-label="News articles">
        {loading ? (
          <div className="space-y-2 py-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-2.5 rounded-xl bg-theme-input-bg/20 border border-theme-border/20 animate-pulse space-y-1.5">
                <div className="h-3 bg-theme-border/40 rounded w-5/6" />
                <div className="h-2 bg-theme-border/20 rounded w-1/3" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-4">
            <span className="text-[11px] text-red-500 font-medium mb-1">{error}</span>
            <button
              onClick={() => refetch()}
              className="text-[10px] font-bold uppercase tracking-wider text-theme-accent hover:underline flex items-center gap-1 cursor-pointer mt-1"
              aria-label="Retry loading feed"
            >
              <RefreshCw size={8} /> Retry
            </button>
          </div>
        ) : articles.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center text-xs text-theme-text-muted py-12">
            <BookOpen size={18} className="opacity-40 mb-1.5" />
            <span>No articles found in this feed.</span>
          </div>
        ) : (
          articles.slice(0, 15).map((article, idx) => {
            const relTime = getRelativeTime(article.pubDate);
            const gradientClass = getGradientForTitle(article.title);
            return (
              <div
                key={idx}
                data-news-link={article.link || ''}
                data-news-title={article.title || ''}
                data-news-date={article.pubDate || ''}
                data-news-desc={article.description || ''}
                data-news-author={article.author || ''}
                data-news-thumbnail={article.thumbnail || ''}
                data-news-content={article.fullContent || ''}
                onClick={(e) => {
                  e.preventDefault();
                  if (article.link) {
                    window.open(article.link, '_blank', 'noopener,noreferrer');
                  }
                }}
                role="article"
                aria-label={`News article: ${article.title}${article.author ? ` by ${article.author}` : ''}`}
                tabIndex={0}
                onKeyDown={(e) => {
                  if ((e.key === 'Enter' || e.key === ' ') && article.link) {
                    e.preventDefault();
                    window.open(article.link, '_blank', 'noopener,noreferrer');
                  }
                }}
                className="group/item flex items-start gap-3 p-2.5 rounded-xl bg-theme-input-bg/40 border border-theme-border/40 hover:border-theme-accent/40 hover:bg-theme-input-bg/60 text-theme-text transition-all duration-200 cursor-pointer"
              >
                {article.thumbnail ? (
                  <div className="w-16 h-12 rounded-lg overflow-hidden shrink-0 bg-theme-input-bg border border-theme-border/30">
                    <img
                      src={article.thumbnail}
                      alt={`Thumbnail for ${article.title}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover/item:scale-105 transition-transform duration-300"
                    />
                  </div>
                ) : (
                  <div className={`w-16 h-12 rounded-lg shrink-0 flex items-center justify-center bg-gradient-to-br ${gradientClass} border`}>
                    <Newspaper size={14} className="opacity-75" />
                  </div>
                )}
                <div className="flex-1 min-w-0 flex flex-col justify-between h-full min-h-[48px]">
                  <div className="flex items-start justify-between gap-1.5">
                    <span className="text-[11px] font-semibold tracking-wide leading-snug group-hover/item:text-theme-accent transition-colors break-words line-clamp-2">
                      {article.title}
                    </span>
                    <ExternalLink size={10} className="text-theme-text-muted group-hover/item:text-theme-accent shrink-0 mt-0.5 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                  </div>
                  <div className="flex items-center gap-2 mt-1.5 text-[9px] text-theme-text-muted font-mono">
                    {relTime && (
                      <div className="flex items-center gap-1">
                        <Clock size={8} />
                        <span>{relTime}</span>
                      </div>
                    )}
                    {article.author && <span className="truncate max-w-[80px]">by {article.author}</span>}
                  </div>
                </div>
              </div>
            );
          })
        )}
        {!loading && !error && articles.length > 8 && (
          <button
            onClick={() => onNavigate?.('news')}
            className="w-full flex items-center justify-center gap-2 py-2 text-[10px] font-bold uppercase tracking-wider rounded-xl bg-theme-input-bg/40 border border-theme-border/40 hover:border-theme-accent/60 text-theme-text hover:text-theme-accent cursor-pointer transition-all"
          >
            View All
          </button>
        )}
      </div>
    </div>
  );
}
