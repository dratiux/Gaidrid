import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
  id?: string;
}

export default function CustomSelect({ options, value, onChange, className = '', id }: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value) || options[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div id={id} ref={containerRef} className={`relative select-none ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-theme-input-bg border border-theme-border/65 text-theme-text flex items-center justify-between focus:outline-none focus:border-theme-accent focus:ring-2 focus:ring-theme-accent/20 transition-all duration-200 cursor-pointer text-left font-medium hover:border-theme-accent/70"
      >
        <span className="truncate">{selectedOption?.label}</span>
        <ChevronDown 
          size={14} 
          className={`text-theme-text-muted/80 transition-transform duration-300 shrink-0 ml-2 ${isOpen ? 'rotate-180 text-theme-accent' : ''}`} 
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ type: 'spring', duration: 0.25, bounce: 0 }}
            className="absolute z-50 w-full mt-2 rounded-xl bg-theme-card border border-theme-border/80 overflow-hidden origin-top"
          >
            <div className="max-h-60 overflow-y-auto p-1.5 space-y-0.5 scrollbar-thin">
              {options.map((option) => {
                const isSelected = option.value === value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      onChange(option.value);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left text-xs px-3 py-2.5 rounded-lg flex items-center justify-between transition-colors cursor-pointer font-medium ${
                      isSelected
                        ? 'bg-theme-accent text-theme-accent-text'
                        : 'text-theme-text hover:bg-theme-input-bg'
                    }`}
                  >
                    <span className="truncate">{option.label}</span>
                    {isSelected && (
                      <Check 
                        size={12} 
                        className="shrink-0 ml-2 stroke-[3]" 
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
