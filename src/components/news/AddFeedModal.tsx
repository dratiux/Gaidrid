import React, { useState } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AddFeedModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddFeed: (name: string, url: string) => void;
}

export default function AddFeedModal({ isOpen, onClose, onAddFeed }: AddFeedModalProps) {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !url.trim()) return;
    onAddFeed(name.trim(), url.trim());
    setName('');
    setUrl('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[250] p-4"
          onClick={onClose}
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
              <button
                onClick={onClose}
                className="h-8 w-8 rounded-xl bg-theme-input-bg border border-theme-border/65 text-theme-text-muted hover:text-theme-text hover:border-theme-border transition-all cursor-pointer flex items-center justify-center"
                type="button"
              >
                <X size={14} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 flex flex-col">
              <div className="space-y-3.5">
                <div>
                  <label className="text-[9px] font-black uppercase tracking-wider text-theme-text-muted block mb-1.5 font-mono">
                    Feed Title
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. TechCrunch"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-theme-input-bg border border-theme-border text-theme-text placeholder-theme-text-muted/40 focus:outline-none focus:border-theme-accent focus:ring-2 focus:ring-theme-accent/20 transition-all font-semibold"
                    required
                    autoFocus
                  />
                </div>
                <div>
                  <label className="text-[9px] font-black uppercase tracking-wider text-theme-text-muted block mb-1.5 font-mono">
                    RSS Feed URL
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. https://techcrunch.com/feed/"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-theme-input-bg border border-theme-border text-theme-text placeholder-theme-text-muted/40 focus:outline-none focus:border-theme-accent focus:ring-2 focus:ring-theme-accent/20 transition-all font-medium font-mono"
                    required
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-theme-accent hover:bg-theme-accent-hover text-theme-accent-text text-[10px] font-bold uppercase tracking-wider rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center"
                >
                  Add Stream
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
