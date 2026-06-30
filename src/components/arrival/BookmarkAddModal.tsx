import React from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import CustomSelect from '../CustomSelect';

interface BookmarkAddModalProps {
  show: boolean;
  onClose: () => void;
  newFavName: string;
  onNewFavNameChange: (value: string) => void;
  newFavUrl: string;
  onNewFavUrlChange: (value: string) => void;
  newFavIcon: string;
  onNewFavIconChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  customCategories: string[];
}

export default function BookmarkAddModal({
  show,
  onClose,
  newFavName,
  onNewFavNameChange,
  newFavUrl,
  onNewFavUrlChange,
  newFavIcon,
  onNewFavIconChange,
  onSubmit,
  customCategories
}: BookmarkAddModalProps) {
  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 bg-black/65 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 cursor-default" 
            onClick={onClose} 
          />
          
          <motion.div
            initial={{ scale: 0.93, opacity: 0, y: 12 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.93, opacity: 0, y: 12 }}
            transition={{ type: 'spring', duration: 0.35, bounce: 0.1 }}
            className="bg-theme-card border border-theme-border w-full max-w-md p-6 rounded-3xl relative z-10"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-5 text-left">
              <div>
                <h3 className="text-sm font-black text-theme-text uppercase tracking-wider font-mono flex items-center gap-2">
                  Add Bookmark Shortcut
                </h3>
                <p className="text-[10px] text-theme-text-muted mt-1">
                  Create a quick launch link on your landing dashboard.
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="h-8 w-8 rounded-xl bg-theme-input-bg border border-theme-border/65 text-theme-text-muted hover:text-theme-text hover:border-theme-border transition-all cursor-pointer flex items-center justify-center"
              >
                <X size={14} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={onSubmit} className="space-y-4 text-left">
              <div>
                <label className="block text-[9px] uppercase tracking-wider font-mono font-black text-theme-text-muted mb-1.5">
                  Bookmark Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Figma, GitHub, Notion"
                  value={newFavName}
                  onChange={(e) => onNewFavNameChange(e.target.value)}
                  className="w-full text-xs px-3 py-2.5 rounded-xl bg-theme-input-bg border border-theme-border/60 text-theme-text placeholder-theme-text-muted/40 focus:outline-none focus:border-theme-accent focus:ring-2 focus:ring-theme-accent/20 transition-all font-medium"
                  required
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-[9px] uppercase tracking-wider font-mono font-black text-theme-text-muted mb-1.5">
                  Destination URL
                </label>
                <input
                  type="text"
                  placeholder="https://example.com"
                  value={newFavUrl}
                  onChange={(e) => onNewFavUrlChange(e.target.value)}
                  className="w-full text-xs px-3 py-2.5 rounded-xl bg-theme-input-bg border border-theme-border/60 text-theme-text placeholder-theme-text-muted/40 focus:outline-none focus:border-theme-accent focus:ring-2 focus:ring-theme-accent/20 transition-all font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-[9px] uppercase tracking-wider font-mono font-black text-theme-text-muted mb-1.5">
                  Category
                </label>
                <CustomSelect
                  value={newFavIcon}
                  onChange={(val) => onNewFavIconChange(val)}
                  className="w-full"
                  options={[
                    { value: "search", label: "Search" },
                    { value: "social", label: "Social" },
                    { value: "games", label: "Games" },
                    { value: "streaming", label: "Streaming" },
                    { value: "entertainment", label: "Entertainment" },
                    { value: "sports", label: "Sports" },
                    { value: "news", label: "News" },
                    ...customCategories.map(cat => ({
                      value: cat.toLowerCase(),
                      label: cat
                    }))
                  ]}
                />
              </div>

              {/* Actions */}
              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full text-xs py-2.5 rounded-xl bg-theme-accent text-theme-accent-text font-bold hover:bg-theme-accent-hover transition-all cursor-pointer text-center"
                >
                  Add Bookmark
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}