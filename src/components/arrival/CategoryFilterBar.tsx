import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { FavoriteSite } from '../../types';
import { CATEGORY_LABELS, getCategoryForSite } from './constants';

interface CategoryFilterBarProps {
  favorites: FavoriteSite[];
  activeCategoryFilter: string;
  onCategoryFilterChange: (category: string) => void;
  customCategories: string[];
  onAddCustomCategory: (name: string) => void;
  onDeleteCustomCategory: (category: string) => void;
}

export default function CategoryFilterBar({
  favorites,
  activeCategoryFilter,
  onCategoryFilterChange,
  customCategories,
  onAddCustomCategory,
  onDeleteCustomCategory
}: CategoryFilterBarProps) {
  const [showAddCategoryForm, setShowAddCategoryForm] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [categoryError, setCategoryError] = useState('');

  const handleAddCustomCategory = (e: React.FormEvent) => {
    e.preventDefault();
    setCategoryError('');
    const trimmed = newCategoryName.trim();
    if (!trimmed) return;
    
    if (customCategories.length >= 5) {
      setCategoryError('Limit of 5 custom categories reached.');
      return;
    }

    const lower = trimmed.toLowerCase();
    const defaults = ['all', 'search', 'social', 'games', 'streaming', 'entertainment', 'sports', 'news'];
    if (defaults.includes(lower) || customCategories.map(c => c.toLowerCase()).includes(lower)) {
      setCategoryError('Category already exists.');
      return;
    }

    onAddCustomCategory(trimmed);
    setNewCategoryName('');
    setShowAddCategoryForm(false);
  };

  const allCategories = ['Favorite', 'search', 'social', 'games', 'streaming', 'entertainment', 'sports', 'news', ...customCategories];

  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-wrap items-center justify-start gap-1.5 mb-4 max-w-full pb-1">
        {allCategories.map((cat) => {
          const count = favorites.filter(fav => cat === 'Favorite' ? fav.isFavorite === true : getCategoryForSite(fav, customCategories) === cat.toLowerCase()).length;
          
          const isDefault = ['all', 'favorite', 'search', 'social', 'games', 'streaming', 'entertainment', 'sports', 'news'].includes(cat.toLowerCase());
          const isSelected = activeCategoryFilter.toLowerCase() === cat.toLowerCase();
          const label = CATEGORY_LABELS[cat.toLowerCase()] || cat;
          
          return (
            <div
              key={cat}
              className="relative flex items-center group/cat"
            >
              <button
                type="button"
                onClick={() => onCategoryFilterChange(cat)}
                className={`pl-3 ${!isDefault ? 'pr-7' : 'pr-3'} py-1.5 rounded-xl text-[9px] font-mono tracking-wider uppercase font-black border transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-theme-accent text-theme-accent-text border-theme-accent'
                    : 'bg-theme-card/30 text-theme-text-muted border-theme-border/40 hover:border-theme-border/80 hover:text-theme-text'
                }`}
              >
                {label} 
                <span className={`px-1.5 py-0.5 rounded-md text-[8px] ${
                  isSelected 
                    ? 'bg-theme-card/20 text-theme-accent-text' 
                    : 'bg-theme-input-bg text-theme-text-muted'
                }`}>
                  {count}
                </span>
              </button>

              {/* Delete button only for non-default (custom) categories */}
              {!isDefault && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onDeleteCustomCategory(cat);
                  }}
                  className={`absolute right-1.5 p-0.5 rounded-md text-theme-text-muted hover:text-red-500 transition-colors cursor-pointer ${
                    isSelected ? 'hover:bg-theme-card/20 text-theme-accent-text/80' : 'hover:bg-theme-input-bg'
                  }`}
                  title="Delete Category"
                >
                  <X size={8} className="stroke-[3]" />
                </button>
              )}
            </div>
          );
        })}

        {/* Inline Add Category Form / Button */}
        {showAddCategoryForm ? (
          <form 
            onSubmit={handleAddCustomCategory} 
            className="flex items-center gap-1.5 bg-theme-card/50 border border-theme-accent/40 rounded-xl p-1 animate-fade-in"
          >
            <input
              type="text"
              placeholder="New Category..."
              value={newCategoryName}
              onChange={(e) => {
                setNewCategoryName(e.target.value);
                setCategoryError('');
              }}
              className="bg-transparent text-[9px] font-mono font-bold text-theme-text px-2 py-0.5 w-24 focus:outline-none focus-visible:ring-1 focus-visible:ring-theme-accent/30"
              maxLength={15}
              required
              autoFocus
            />
            <button
              type="submit"
              className="p-1 rounded-md bg-theme-accent text-theme-accent-text hover:bg-theme-accent-hover transition-colors cursor-pointer"
              title="Add Category"
            >
              <Plus size={10} className="stroke-[3]" />
            </button>
            <button
              type="button"
              onClick={() => {
                setShowAddCategoryForm(false);
                setNewCategoryName('');
                setCategoryError('');
              }}
              className="p-1 rounded-md bg-theme-input-bg text-theme-text-muted hover:text-theme-text transition-colors cursor-pointer"
              title="Cancel"
            >
              <X size={10} className="stroke-[3]" />
            </button>
          </form>
        ) : (
          customCategories.length < 5 && (
            <button
              type="button"
              onClick={() => setShowAddCategoryForm(true)}
              className="px-3 py-1.5 rounded-xl text-[9px] font-mono tracking-wider uppercase font-black border border-dashed border-theme-border/60 text-theme-text-muted hover:border-theme-accent hover:text-theme-accent transition-all duration-200 cursor-pointer flex items-center gap-1"
              title="Add Custom Category (Max 5)"
            >
              <Plus size={10} className="stroke-[3]" /> Category ({customCategories.length}/5)
            </button>
          )
        )}
      </div>

      {categoryError && (
        <div className="text-[9px] font-mono font-bold text-red-500 mb-2 animate-fade-in text-center w-full">
          {categoryError}
        </div>
      )}
    </div>
  );
}