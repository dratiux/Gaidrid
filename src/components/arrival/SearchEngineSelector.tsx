import { useState, useEffect, useRef } from 'react';
import { Search, Mic } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { buildSearchUrl } from '../../lib/utils';

const ENGINES = [
  { value: 'google', label: 'Google', domain: 'google.com' },
  { value: 'youtube', label: 'YouTube', domain: 'youtube.com' },
  { value: 'duckduckgo', label: 'DuckDuckGo', domain: 'duckduckgo.com' },
  { value: 'bing', label: 'Bing', domain: 'bing.com' },
  { value: 'github', label: 'GitHub', domain: 'github.com' },
  { value: 'gemini', label: 'Gemini', domain: 'gemini.google.com' },
];

const ENGINE_MAP = Object.fromEntries(ENGINES.map(e => [e.value, e]));

const PLACEHOLDERS = [
  'Search Google or type a URL...',
  'Search YouTube videos...',
  'Ask Gemini anything...',
  'Search GitHub repositories...',
  'Search the web privately...',
  'What are you looking for?',
];

function getFaviconUrl(domain: string) {
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
}

const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

async function fetchSuggestions(query: string, engine: string): Promise<string[]> {
  const q = encodeURIComponent(query);

  if (engine === 'youtube') {
    try {
      const url = isDev
        ? `/api/suggest/youtube?client=youtube&ds=yt&q=${q}`
        : `https://suggestqueries.google.com/complete/search?client=youtube&ds=yt&q=${q}`;
      const res = await fetch(url);
      const data = await res.json();
      if (Array.isArray(data) && data.length > 1) return data[1].slice(0, 6);
    } catch {}
  }

  try {
    const url = isDev
      ? `/api/suggest/google?client=firefox&q=${q}`
      : `https://suggestqueries.google.com/complete/search?client=firefox&q=${q}`;
    const res = await fetch(url);
    const data = await res.json();
    if (Array.isArray(data) && data.length > 1) return data[1].slice(0, 6);
  } catch {}

  try {
    const url = isDev
      ? `/api/suggest/duckduckgo?q=${q}&type=list`
      : `https://duckduckgo.com/ac/?q=${q}&type=list`;
    const res = await fetch(url);
    const data = await res.json();
    if (Array.isArray(data)) return data.map((item: any) => item.phrase || item).slice(0, 6);
  } catch {}

  return [];
}

interface SearchEngineSelectorProps {
  searchEngine: string;
  onSearchEngineChange: (engine: string) => void;
  getSearchEnginePlaceholder: () => string;
}

export default function SearchEngineSelector({
  searchEngine,
  onSearchEngineChange,
  getSearchEnginePlaceholder
}: SearchEngineSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchSelectOpen, setIsSearchSelectOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState(-1);
  const [isListening, setIsListening] = useState(false);
  const searchSelectRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchSelectRef.current && !searchSelectRef.current.contains(event.target as Node)) {
        setIsSearchSelectOpen(false);
      }
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        event.target !== inputRef.current
      ) {
        setSuggestions([]);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isFocused || searchQuery) return;
    const timer = setInterval(() => {
      setPlaceholderIdx((prev) => (prev + 1) % PLACEHOLDERS.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [isFocused, searchQuery]);

  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setSuggestions([]);
      return;
    }
    const controller = new AbortController();
    const timer = setTimeout(() => {
      fetchSuggestions(searchQuery.trim(), searchEngine)
        .then((results) => {
          if (controller.signal.aborted) return;
          setSuggestions(results);
        })
        .catch(() => {});
    }, 200);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [searchQuery, searchEngine]);

  useEffect(() => {
    (window as any).__searchInputRef = inputRef;
    return () => { (window as any).__searchInputRef = null; };
  }, []);

  const handleSearchSubmit = (e: any) => {
    e.preventDefault();
    const query =
      selectedSuggestion >= 0 && suggestions[selectedSuggestion]
        ? suggestions[selectedSuggestion]
        : searchQuery.trim();
    if (!query) return;
    const url = buildSearchUrl(query, searchEngine);
    window.open(url, '_blank', 'noreferrer');
    setSuggestions([]);
    setSelectedSuggestion(-1);
  };

  const handleSuggestionClick = (suggestion: string) => {
    const url = buildSearchUrl(suggestion, searchEngine);
    window.open(url, '_blank', 'noreferrer');
    setSuggestions([]);
    setSearchQuery('');
    setSelectedSuggestion(-1);
  };

  const handleKeyDown = (e: any) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedSuggestion((prev) => Math.min(prev + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedSuggestion((prev) => Math.max(prev - 1, -1));
    } else if (e.key === 'Escape') {
      setSuggestions([]);
      setSelectedSuggestion(-1);
    }
  };

  const handleVoiceSearch = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setSearchQuery(transcript);
      setSelectedSuggestion(-1);
    };

    recognition.onend = () => {
      setIsListening(false);
      recognitionRef.current = null;
    };

    recognition.onerror = () => {
      setIsListening(false);
      recognitionRef.current = null;
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  };

  const currentEngine = ENGINE_MAP[searchEngine] || ENGINE_MAP.google;
  const showSuggestions = isFocused && suggestions.length > 0;

  return (
    <div className="w-full max-w-xl relative mt-3">
      <form onSubmit={handleSearchSubmit} className="relative group">
        <div className="absolute inset-y-0 left-4.5 flex items-center pointer-events-none text-theme-text-muted">
          <Search
            size={15}
            className="opacity-70 group-focus-within:opacity-100 group-focus-within:text-theme-accent transition-all"
          />
        </div>

        <input
          ref={inputRef}
          id="global-search-input"
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setSelectedSuggestion(-1);
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            setIsFocused(false);
            setTimeout(() => setSuggestions([]), 150);
          }}
          onKeyDown={handleKeyDown}
          placeholder={PLACEHOLDERS[placeholderIdx]}
          className="w-full pl-12 pr-36 py-3.5 rounded-2xl bg-theme-card/50 border border-theme-border/60 focus:outline-none focus:border-theme-accent focus:ring-4 focus:ring-theme-accent/15 text-xs sm:text-sm font-medium text-theme-text placeholder-theme-text-muted/60 transition-all"
          autoComplete="off"
        />

        {/* Keyboard hint */}
        {!isFocused && !searchQuery && (
          <div className="absolute inset-y-0 right-36 flex items-center pointer-events-none">
            <kbd className="text-[10px] font-mono font-bold text-theme-text-muted/40 bg-theme-input-bg/60 px-1.5 py-0.5 rounded border border-theme-border/30">
              /
            </kbd>
          </div>
        )}

        {/* Suggestions dropdown */}
        <AnimatePresence>
          {showSuggestions && (
            <motion.div
              ref={suggestionsRef}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.15 }}
              className="absolute left-0 right-0 top-full mt-1.5 rounded-2xl bg-theme-card border border-theme-border overflow-hidden z-50 shadow-lg"
            >
              <div className="py-1.5">
                {suggestions.map((s, i) => (
                  <button
                    key={i}
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleSuggestionClick(s);
                    }}
                    className={`w-full text-left px-4 py-2.5 flex items-center gap-3 transition-colors cursor-pointer text-xs ${
                      i === selectedSuggestion
                        ? 'bg-theme-accent/10 text-theme-accent'
                        : 'text-theme-text hover:bg-theme-input-bg/50'
                    }`}
                  >
                    <Search size={12} className="text-theme-text-muted/50 shrink-0" />
                    <span className="truncate">{s}</span>
                    <img
                      src={getFaviconUrl(currentEngine.domain)}
                      alt=""
                      className="w-3.5 h-3.5 ml-auto shrink-0 opacity-60"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="absolute inset-y-0 right-3.5 flex items-center gap-1" ref={searchSelectRef}>
          {/* Voice search button */}
          <button
            type="button"
            onClick={handleVoiceSearch}
            className={`p-2 rounded-xl transition-all cursor-pointer outline-none ${
              isListening
                ? 'text-red-500 bg-red-500/10 animate-pulse'
                : 'text-theme-text-muted hover:text-theme-accent hover:bg-theme-accent-hover/10'
            }`}
            title={isListening ? 'Stop listening' : 'Voice search'}
          >
            <Mic size={13} />
          </button>

          {/* Engine selector */}
          <button
            type="button"
            onClick={() => setIsSearchSelectOpen(!isSearchSelectOpen)}
            className="flex items-center gap-1.5 text-[9px] font-black uppercase font-mono tracking-wider text-theme-accent bg-theme-accent-hover/10 px-2.5 py-2 rounded-xl border border-theme-accent/25 cursor-pointer outline-none hover:border-theme-accent/40 hover:bg-theme-accent-hover/20 focus:ring-2 focus:ring-theme-accent/15 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <img
              src={getFaviconUrl(currentEngine.domain)}
              alt=""
              className="w-3 h-3 flex-shrink-0"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
            <span>{currentEngine.label}</span>
          </button>

          <AnimatePresence>
            {isSearchSelectOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ type: 'spring', duration: 0.25, bounce: 0 }}
                className="absolute right-0 top-full mt-2 w-44 rounded-2xl bg-theme-card border border-theme-border overflow-hidden origin-top-right z-50"
              >
                <div className="p-1.5 space-y-0.5">
                  {ENGINES.map((engine) => {
                    const isSelected = searchEngine === engine.value;
                    return (
                      <button
                        key={engine.value}
                        type="button"
                        onClick={() => {
                          onSearchEngineChange(engine.value);
                          setIsSearchSelectOpen(false);
                        }}
                        className={`w-full text-left text-[10px] uppercase tracking-wider font-mono px-3 py-2.5 rounded-xl flex items-center gap-2 transition-colors cursor-pointer font-bold ${
                          isSelected
                            ? 'bg-theme-accent text-theme-accent-text'
                            : 'text-theme-text hover:bg-theme-input-bg'
                        }`}
                      >
                        <img
                          src={getFaviconUrl(engine.domain)}
                          alt=""
                          className="w-3 h-3 flex-shrink-0"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                        <span className="flex-1">{engine.label}</span>
                        {isSelected && <span className="text-[7px] shrink-0">●</span>}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </form>
    </div>
  );
}
