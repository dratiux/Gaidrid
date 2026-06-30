import { useRef, useState } from 'react';
import { THEME_MAP } from '../lib/themes';
import { THEME_LIST } from '../lib/constants';

interface ThemePickerProps {
  value: string;
  onChange: (theme: string) => void;
}

export function ThemePicker({ value, onChange }: ThemePickerProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const didDrag = useRef(false);

  const handleMouseDown = (e: any) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    didDrag.current = false;
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseMove = (e: any) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    if (Math.abs(walk) > 5) didDrag.current = true;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleCardClick = (themeValue: string) => {
    if (didDrag.current) return;
    onChange(themeValue);
  };

  return (
    <div className="overflow-hidden rounded-2xl">
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto px-2 py-3 cursor-grab active:cursor-grabbing scrollbar-thin select-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
      {THEME_LIST.map((t) => {
        const theme = THEME_MAP[t.value];
        const isSelected = value === t.value;

        return (
          <button
            key={t.value}
            type="button"
            onClick={() => handleCardClick(t.value)}
            className={`group flex flex-col items-center gap-2.5 shrink-0 transition-all duration-200 cursor-pointer ${
              isSelected
                ? 'scale-105 -translate-y-1'
                : 'hover:scale-[1.03] hover:-translate-y-0.5'
            }`}
          >
            {/* Card Preview */}
            <div
              className={`relative w-[110px] h-[80px] rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                isSelected
                  ? 'border-theme-accent'
                  : 'border-white/10 group-hover:border-white/20'
              }`}
              style={{ backgroundColor: theme.bg }}
            >
              {/* Accent dot */}
              <div
                className="absolute top-2.5 left-2.5 w-3 h-3 rounded-full ring-1 ring-white/10"
                style={{ backgroundColor: theme.accent }}
              />

              {/* Inner card area */}
              <div
                className="absolute top-7 left-3 right-3 bottom-2.5 rounded-lg p-2.5"
                style={{ backgroundColor: theme.card }}
              >
                {/* Simulated content lines */}
                <div
                  className="h-[3px] rounded-full mb-2"
                  style={{ backgroundColor: theme.textMuted, opacity: 0.6, width: '65%' }}
                />
                <div
                  className="h-[3px] rounded-full mb-2"
                  style={{ backgroundColor: theme.textMuted, opacity: 0.4, width: '85%' }}
                />
                <div
                  className="h-[3px] rounded-full"
                  style={{ backgroundColor: theme.textMuted, opacity: 0.3, width: '50%' }}
                />
              </div>
            </div>

            {/* Theme Name */}
            <span
              className={`text-[10px] font-bold tracking-wide whitespace-nowrap transition-colors ${
                isSelected ? 'text-theme-accent' : 'text-theme-text-muted group-hover:text-theme-text'
              }`}
            >
              {t.label}
            </span>
          </button>
        );
      })}
      </div>
    </div>
  );
}
