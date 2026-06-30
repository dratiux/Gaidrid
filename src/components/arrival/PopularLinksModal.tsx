import React, { useState } from 'react';
import { RotateCcw, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { FavoriteSite } from '../../types';
import { CATEGORIES, CATEGORY_LABELS, POPULAR_LINKS_LIBRARY } from './constants';

interface PopularLinksModalProps {
  show: boolean;
  onClose: () => void;
  favorites: FavoriteSite[];
  onAddFavorite: (name: string, url: string, icon: string, category?: string, isFavorite?: boolean) => void;
  onRestoreFavorites: () => void;
}

export default function PopularLinksModal({
  show,
  onClose,
  favorites,
  onAddFavorite,
  onRestoreFavorites
}: PopularLinksModalProps) {
  const [addMoreActiveCategory, setAddMoreActiveCategory] = useState('search');

  const handleRestoreDefaults = () => {
    onRestoreFavorites();
    onClose();
  };

  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 cursor-default" 
            onClick={onClose} 
          />
          
          <motion.div
            initial={{ scale: 0.93, opacity: 0, y: 12 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.93, opacity: 0, y: 12 }}
            transition={{ type: 'spring', duration: 0.35, bounce: 0.1 }}
            className="bg-theme-card border border-theme-border w-full max-w-2xl p-6 rounded-3xl relative z-10 max-h-[85vh] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-5 text-left shrink-0">
              <div>
                <h3 className="text-sm font-black text-theme-text uppercase tracking-wider font-mono flex items-center gap-2">
                  Famous Bookmarks Directory
                </h3>
                <p className="text-[10px] text-theme-text-muted mt-1">
                  Quickly add highly popular portals to your home workspace or restore all defaults.
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleRestoreDefaults}
                  className="h-8 px-3.5 flex items-center gap-1.5 text-[9px] uppercase font-mono tracking-wider font-black rounded-xl bg-theme-input-bg border border-theme-border/65 text-theme-text-muted hover:text-theme-accent hover:border-theme-accent/80 transition-all cursor-pointer"
                >
                  <RotateCcw size={10} /> Reset Defaults
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="h-8 w-8 rounded-xl bg-theme-input-bg border border-theme-border/65 text-theme-text-muted hover:text-theme-text hover:border-theme-border transition-all cursor-pointer flex items-center justify-center"
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            {/* Categories tab inside modal */}
            <div className="flex flex-wrap items-center gap-1.5 pb-3 border-b border-theme-border/50 mb-4 shrink-0">
              {CATEGORIES.filter(cat => cat !== 'All' && cat !== 'Favorite').map((cat) => {
                const isSelected = addMoreActiveCategory === cat;
                const itemsCount = POPULAR_LINKS_LIBRARY.filter(item => item.category === cat).length;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setAddMoreActiveCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-[9px] font-mono tracking-wider uppercase font-black border transition-all duration-200 cursor-pointer shrink-0 ${
                      isSelected
                        ? 'bg-theme-accent text-theme-accent-text border-theme-accent'
                        : 'bg-theme-card/30 text-theme-text-muted border-theme-border/40 hover:border-theme-border/80 hover:text-theme-text'
                    }`}
                  >
                    {CATEGORY_LABELS[cat]} <span className="text-[8px] opacity-75">({itemsCount})</span>
                  </button>
                );
              })}
            </div>

            {/* Popular links grid */}
            <div className="flex-1 overflow-y-auto pr-1 py-1 space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {POPULAR_LINKS_LIBRARY
                  .filter(item => item.category === addMoreActiveCategory)
                  .map((item) => {
                    const alreadyAdded = favorites.some(fav => fav.url.replace(/\/$/, '') === item.url.replace(/\/$/, ''));
                    return (
                      <div
                        key={item.url}
                        className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                          alreadyAdded 
                            ? 'bg-theme-card/20 border-theme-border/30 opacity-60' 
                            : 'bg-theme-card/45 border-theme-border/50 hover:border-theme-accent/40 hover:bg-theme-card/85'
                        }`}
                      >
                        <div className="text-left truncate mr-2">
                          <span className="text-[10px] font-black tracking-wider uppercase text-theme-text/90 block truncate">
                            {item.name}
                          </span>
                          <span className="text-[8px] font-mono text-theme-text-muted/60 block truncate">
                            {item.url.replace('https://', '')}
                          </span>
                        </div>

                        <button
                          type="button"
                          disabled={alreadyAdded}
                          onClick={() => {
                            const isFavTab = false;
                            onAddFavorite(item.name, item.url, item.category, item.category, isFavTab);
                          }}
                          className={`px-2.5 py-1 rounded-xl text-[8px] font-mono font-black uppercase transition-all shrink-0 ${
                            alreadyAdded
                              ? 'bg-theme-border/40 text-theme-text-muted cursor-default'
                              : 'bg-theme-accent text-theme-accent-text hover:bg-theme-accent-hover cursor-pointer'
                          }`}
                        >
                          {alreadyAdded ? 'Added' : 'Add'}
                        </button>
                      </div>
                    );
                  })}
              </div>
            </div>


          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}