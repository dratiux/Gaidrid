import React, { useState, useEffect } from 'react';
import { Newspaper, RefreshCw, ExternalLink, Clock, ChevronDown } from 'lucide-react';
import { motion } from 'motion/react';
import { Article } from './types';

interface ArticleGridProps {
  articles: Article[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
}

function getRelativeTime(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHrs = Math.floor(diffMs / 3600000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHrs < 24) return `${diffHrs}h ago`;
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  } catch (e) {
    return dateStr;
  }
}

export default function ArticleGrid({ articles, loading, error, onRetry }: ArticleGridProps) {
  const [visibleCount, setVisibleCount] = useState(20);

  useEffect(() => {
    setVisibleCount(20);
  }, [articles]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
        <div className="w-12 h-12 relative flex items-center justify-center">
          <div className="absolute inset-0 border-3 border-theme-accent/10 rounded-full"></div>
          <div className="absolute inset-0 border-3 border-t-theme-accent rounded-full animate-spin"></div>
        </div>
        <p className="text-xs font-mono text-theme-text-muted uppercase tracking-widest animate-pulse">
          Fetching stream coordinates...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 border border-red-500/10 rounded-2xl bg-red-500/5 text-center flex flex-col items-center gap-2">
        <span className="text-red-500 font-bold text-sm">Stream Parsing Blocked</span>
        <p className="text-xs text-theme-text-muted font-mono leading-relaxed max-w-md">
          {error}
        </p>
        <button
          onClick={onRetry}
          className="mt-2 px-4 py-2 text-xs font-bold uppercase rounded-xl bg-theme-input-bg border border-theme-border/40 hover:border-theme-accent/40 text-theme-text cursor-pointer transition-all flex items-center gap-1.5"
        >
          <RefreshCw size={11} />
          <span>Retry Connection</span>
        </button>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="py-20 border border-theme-border/30 rounded-2xl text-center text-theme-text-muted flex flex-col items-center gap-2">
        <Newspaper size={32} className="opacity-40" />
        <p className="text-sm font-medium">No Articles Found</p>
        <p className="text-xs text-theme-text-muted font-mono">
          No matching results were found for your search criteria.
        </p>
      </div>
    );
  }

    return (
    <>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {articles.slice(0, visibleCount).map((article, idx) => {
        const relTime = getRelativeTime(article.pubDate);
        return (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: Math.min(idx * 0.03, 0.3) }}
            data-news-link={article.link || ''}
            data-news-title={article.title || ''}
            data-news-date={article.pubDate || ''}
            data-news-desc={article.description || ''}
            data-news-author={article.author || ''}
            data-news-thumbnail={article.thumbnail || ''}
            data-news-content={article.fullContent || ''}
            onClick={() => article.link && window.open(article.link, '_blank', 'noopener,noreferrer')}
            className="group flex flex-col justify-between p-4 rounded-2xl bg-theme-card hover:bg-theme-input-bg/30 border border-theme-border/45 hover:border-theme-accent/50 cursor-pointer transition-all duration-200 shadow-none hover:shadow-lg hover:shadow-theme-accent/5"
          >
            <div className="space-y-3">
              {article.thumbnail && (
                <div className="w-full h-40 rounded-xl overflow-hidden border border-theme-border/25 bg-theme-input-bg shrink-0">
                  <img
                    src={article.thumbnail}
                    alt=""
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                  />
                </div>
              )}

              <div className="space-y-1.5">
                <h2 className="text-sm font-semibold leading-snug tracking-tight text-theme-text group-hover:text-theme-accent transition-colors line-clamp-2">
                  {article.title}
                </h2>
                {article.description && (
                  <p className="text-xs leading-relaxed text-theme-text-muted line-clamp-3">
                    {article.description}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 border-t border-theme-border/20 pt-3 mt-4 text-[10px] text-theme-text-muted font-mono">
              <div className="flex items-center gap-1.5 truncate">
                {article.author ? (
                  <span className="truncate max-w-[100px]" title={article.author}>
                    by <span className="text-theme-text font-sans font-medium">{article.author}</span>
                  </span>
                ) : (
                  <span className="truncate">Global Feed</span>
                )}
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock size={10} />
                  <span>{relTime}</span>
                </span>
              </div>

              <div className="flex items-center gap-1 text-theme-accent font-sans font-bold uppercase tracking-wider text-[9px] opacity-0 group-hover:opacity-100 transition-opacity">
                <span>Read</span>
                <ExternalLink size={9} />
              </div>
            </div>
          </motion.div>
        );
      })}
      </div>
      {visibleCount < articles.length && (
        <div className="flex justify-center mt-6">
          <button
            onClick={() => setVisibleCount((prev) => prev + 10)}
            className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl bg-theme-input-bg/40 border border-theme-border/40 hover:border-theme-accent/60 text-theme-text hover:text-theme-accent cursor-pointer transition-all"
          >
            Load More
            <span className="text-[10px] text-theme-text-muted font-mono">
              ({articles.length - visibleCount} left)
            </span>
            <ChevronDown size={14} />
          </button>
        </div>
      )}
    </>
  );
}
