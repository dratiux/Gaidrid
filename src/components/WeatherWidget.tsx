import React, { useState, useEffect } from 'react';
import { 
  MapPin, Search, RefreshCw, AlertCircle, X, Thermometer, Sunrise, Sunset, SunDim,
  Droplets, Wind, Cloud, Sun, CloudRain, CloudLightning, CloudSnow
} from 'lucide-react';
import ModalOverlay from './ModalOverlay';
import { useWeatherData } from '../hooks/useWeatherData';
import { WidgetHeader } from './ui/WidgetHeader';
import { IconButton } from './ui/IconButton';
import { ModalCloseButton } from './ui/ModalCloseButton';

const WeatherIcon = ({ condition, size = 24 }: { condition: string; size?: number }) => {
  const getIconPath = (cond: string): string => {
    const c = cond.toLowerCase();
    
    // Explicit mappings for our 53 animated weather icons
    if (c === 'clear-day') return '/weather-icons/clear-day.svg';
    if (c === 'clear-night') return '/weather-icons/clear-night.svg';
    
    if (c === 'partly-cloudy-day') return '/weather-icons/cloudy-1-day.svg';
    if (c === 'partly-cloudy-night') return '/weather-icons/cloudy-1-night.svg';
    
    if (c === 'mostly-cloudy') return '/weather-icons/cloudy-3-day.svg';
    if (c === 'cloudy') return '/weather-icons/cloudy.svg';
    if (c === 'overcast') return '/weather-icons/cloudy.svg';
    
    if (c === 'fog') return '/weather-icons/fog.svg';
    if (c === 'mist') return '/weather-icons/fog.svg';
    if (c === 'haze') return '/weather-icons/haze.svg';
    
    if (c === 'drizzle') return '/weather-icons/rainy-1.svg';
    if (c === 'rain') return '/weather-icons/rainy-2.svg';
    if (c === 'heavy-rain') return '/weather-icons/rainy-3.svg';
    if (c === 'showers') return '/weather-icons/showers.svg';
    
    if (c === 'thunderstorm') return '/weather-icons/thunderstorms.svg';
    
    if (c === 'snow') return '/weather-icons/snowy-1.svg';
    if (c === 'heavy-snow') return '/weather-icons/snowy-3.svg';
    if (c === 'sleet') return '/weather-icons/snow-and-sleet-mix.svg';
    
    if (c === 'wind') return '/weather-icons/wind.svg';
    if (c === 'strong-wind') return '/weather-icons/wind.svg';
    
    if (c === 'tornado') return '/weather-icons/tornado.svg';
    if (c === 'hurricane') return '/weather-icons/hurricane.svg';
    
    if (c === 'hot') return '/weather-icons/hot.svg';
    if (c === 'cold') return '/weather-icons/cold.svg';
    
    if (c === 'sunrise') return '/weather-icons/sunrise.svg';
    if (c === 'sunset') return '/weather-icons/sunset.svg';
    if (c === 'moon') return '/weather-icons/moon.svg';
    if (c === 'rainbow') return '/weather-icons/rainbow.svg';

    // Fallbacks
    if (c.includes('clear')) return '/weather-icons/clear-day.svg';
    if (c.includes('cloud')) return '/weather-icons/cloudy.svg';
    if (c.includes('rain') || c.includes('drizzle') || c.includes('shower')) return '/weather-icons/rainy-2.svg';
    if (c.includes('thunder') || c.includes('storm')) return '/weather-icons/thunderstorms.svg';
    if (c.includes('snow') || c.includes('sleet') || c.includes('ice') || c.includes('hail')) return '/weather-icons/snowy-2.svg';
    if (c.includes('fog') || c.includes('mist') || c.includes('haze')) return '/weather-icons/fog.svg';

    return '/weather-icons/cloudy.svg';
  };

  return (
    <img 
      src={getIconPath(condition)} 
      width={size} 
      height={size} 
      alt={condition}
      className="inline-block"
      onError={(e) => {
        (e.target as HTMLImageElement).src = '/weather-icons/cloudy.svg';
      }}
    />
  );
};

const getDetailsIcon = (condition: string) => {
  const c = condition.toLowerCase();
  if (c.includes('clear') || c.includes('sunny')) return <Sun size={12} className="text-amber-500/80 shrink-0" />;
  if (c.includes('cloud')) return <Cloud size={12} className="text-theme-text-muted/80 shrink-0" />;
  if (c.includes('rain') || c.includes('drizzle') || c.includes('shower')) return <CloudRain size={12} className="text-blue-400/80 shrink-0" />;
  if (c.includes('thunder') || c.includes('storm')) return <CloudLightning size={12} className="text-indigo-400/80 shrink-0" />;
  if (c.includes('snow') || c.includes('sleet')) return <CloudSnow size={12} className="text-sky-300/80 shrink-0" />;
  return <Cloud size={12} className="text-theme-text-muted/80 shrink-0" />;
};
const getConditionLabel = (condition: string): string => {
  const labels: Record<string, string> = {
    'clear-day': 'Clear Sky', 'clear-night': 'Clear Night',
    'partly-cloudy-day': 'Partly Cloudy', 'partly-cloudy-night': 'Partly Cloudy',
    'mostly-cloudy': 'Mostly Cloudy', 'cloudy': 'Cloudy', 'overcast': 'Overcast',
    'fog': 'Fog', 'mist': 'Mist', 'haze': 'Haze',
    'drizzle': 'Drizzle', 'rain': 'Rain', 'heavy-rain': 'Heavy Rain', 'showers': 'Showers',
    'thunderstorm': 'Thunderstorm',
    'snow': 'Snow', 'heavy-snow': 'Heavy Snow', 'sleet': 'Sleet',
    'wind': 'Windy', 'strong-wind': 'Strong Wind',
    'tornado': 'Tornado', 'hurricane': 'Hurricane',
    'hot': 'Hot', 'cold': 'Cold',
    'sunrise': 'Sunrise', 'sunset': 'Sunset', 'moon': 'Moon', 'rainbow': 'Rainbow',
  };
  return labels[condition] || condition;
};

const POPULAR_CITIES = ['London', 'New York', 'Tokyo', 'Cairo', 'Riyadh', 'Dubai', 'Paris', 'San Francisco'];

interface WeatherWidgetProps { onRemove?: () => void; }

export default function WeatherWidget({ onRemove }: WeatherWidgetProps) {
  const { weather, city, setCity, hourlyForecast, loading, isNight, fetchWeather } = useWeatherData();
  const [cityInput, setCityInput] = useState('');
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'hourly' | 'forecast' | 'details'>('hourly');
  const [suggestions, setSuggestions] = useState<{ name: string; country?: string; admin1?: string }[]>([]);
  const [fetchingSuggestions, setFetchingSuggestions] = useState(false);

  useEffect(() => {
    const query = cityInput.trim();
    if (query.length < 2) { setSuggestions([]); return; }
    const controller = new AbortController();
    setFetchingSuggestions(true);
    const timeout = setTimeout(async () => {
      try {
        const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`, { signal: controller.signal });
        if (!res.ok) return;
        const data = await res.json();
        if (data.results) {
          setSuggestions(data.results.map((r: { name: string; country?: string; admin1?: string }) => ({ name: r.name, country: r.country, admin1: r.admin1 })));
        } else { setSuggestions([]); }
      } catch (e) {
        if (e instanceof Error && e.name !== 'AbortError') setSuggestions([]);
      } finally { setFetchingSuggestions(false); }
    }, 300);
    return () => { clearTimeout(timeout); controller.abort(); };
  }, [cityInput]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = cityInput.trim();
    if (!query) return;
    fetchWeather(query); setCity(query); setShowSearchModal(false); setCityInput(''); setSuggestions([]);
  };

  const selectCity = (cityName: string) => {
    fetchWeather(cityName); setCity(cityName); setShowSearchModal(false); setCityInput(''); setSuggestions([]);
  };

  return (
    <div id="widget-weather" className="flex flex-col h-full justify-between p-5 select-none">
      <WidgetHeader
        title={`Weather • ${weather.city.split(',')[0]}`}
        actions={<>
          <IconButton onClick={() => setShowSearchModal(true)} variant="default" icon={<MapPin size={12} />} label="Change location" title="Change Location" className="!text-theme-text-muted hover:!text-theme-text" />
          {onRemove && <IconButton onClick={onRemove} variant="danger" icon={<X size={12} />} label="Remove widget" title="Remove Widget" />}
        </>}
      />

      {loading ? (
        <div className="flex-1 flex flex-col items-center justify-center py-6">
          <RefreshCw size={24} className="text-theme-accent animate-spin opacity-80" />
          <span className="text-[9px] font-black tracking-wider uppercase text-theme-text-muted font-mono mt-3">Fetching Live Weather...</span>
        </div>
      ) : (
        <div className="flex-1 flex flex-col justify-between">
          <div className="flex items-center justify-between my-2 border-b border-theme-border/10 pb-3">
            <div className="flex items-center gap-4">
              <div><WeatherIcon condition={weather.condition} size={48} /></div>
              <div>
                <div className="text-4xl font-light tracking-tighter text-theme-text flex items-start leading-none font-sans">
                  {weather.temp}<span className="text-lg mt-0.5 ml-0.5 font-normal">°C</span>
                </div>
                <div className="text-[10px] font-bold tracking-wide uppercase text-theme-text-muted font-mono mt-1">
                  {getConditionLabel(weather.condition)} • H:{weather.high}° L:{weather.low}°
                </div>
              </div>
            </div>
            {weather.city.includes('(Offline)') && (
              <div className="text-[9px] font-black text-red-400 font-mono uppercase bg-red-500/10 border border-red-500/20 px-2 py-1 rounded-lg flex items-center gap-1 shrink-0">
                <AlertCircle size={10} /> Offline
              </div>
            )}
          </div>

          <div className="flex border-b border-theme-border/20 mb-2 font-mono">
            {(['hourly', 'forecast', 'details'] as const).map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`flex-1 py-1 text-[9px] font-black uppercase tracking-wider text-center border-b-2 transition-all cursor-pointer ${activeTab === tab ? 'border-theme-accent text-theme-accent font-bold' : 'border-transparent text-theme-text-muted hover:text-theme-text hover:border-theme-border/40'}`}>
                {tab === 'hourly' ? 'Hourly' : tab === 'forecast' ? '3-Day' : 'Details'}
              </button>
            ))}
          </div>

          <div className="flex-1 flex flex-col justify-center min-h-[95px]">
            {activeTab === 'hourly' && (
              <div className="grid grid-cols-5 gap-1.5 text-center">
                {hourlyForecast.map((h, i) => (
                  <div key={i} className="flex flex-col items-center py-1.5 px-1 rounded-xl bg-theme-input-bg/30 border border-theme-border/20 hover:border-theme-accent/20 transition-all">
                    <span className="text-[8px] font-bold text-theme-text-muted uppercase font-mono">{h.time}</span>
                    <div className="my-1"><WeatherIcon condition={h.condition} size={14} /></div>
                    <span className="text-[10px] font-black text-theme-text font-mono">{h.temp}°</span>
                  </div>
                ))}
              </div>
            )}
            {activeTab === 'forecast' && (
              <div className="grid grid-cols-3 gap-2 text-center">
                {weather.forecast.map((fc, i) => (
                  <div key={i} className="flex flex-col items-center p-2 rounded-xl bg-theme-input-bg/40 border border-theme-border/40 hover:border-theme-accent/20 transition-all">
                    <span className="text-[8px] font-black text-theme-text-muted uppercase tracking-[0.15em] font-mono">{fc.day}</span>
                    <div className="my-1.5"><WeatherIcon condition={fc.condition} size={14} /></div>
                    <span className="text-xs font-bold text-theme-text font-mono">{fc.temp}°</span>
                  </div>
                ))}
              </div>
            )}
            {activeTab === 'details' && (
              <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-[10px] font-bold uppercase tracking-wider font-mono text-theme-text-muted py-1">
                <div className="flex items-center gap-1.5 border-b border-theme-border/10 pb-1"><Thermometer size={12} className="text-amber-500/80 shrink-0" /><span className="truncate">Feels Like: {weather.feelsLike}°C</span></div>
                <div className="flex items-center gap-1.5 border-b border-theme-border/10 pb-1"><Droplets size={12} className="text-blue-400/80 shrink-0" /><span className="truncate">Humidity: {weather.humidity}%</span></div>
                <div className="flex items-center gap-1.5 border-b border-theme-border/10 pb-1"><Wind size={12} className="text-theme-text-muted/80 shrink-0" /><span className="truncate">Wind: {weather.wind} km/h</span></div>
                <div className="flex items-center gap-1.5 border-b border-theme-border/10 pb-1"><div className="shrink-0">{getDetailsIcon(weather.condition)}</div><span className="truncate">{getConditionLabel(weather.condition)}</span></div>
                {weather.sunrise && <div className="flex items-center gap-1.5 border-b border-theme-border/10 pb-1"><Sunrise size={12} className="text-amber-400/80 shrink-0" /><span className="truncate">Sunrise: {weather.sunrise}</span></div>}
                {weather.sunset && <div className="flex items-center gap-1.5 border-b border-theme-border/10 pb-1"><Sunset size={12} className="text-indigo-400/80 shrink-0" /><span className="truncate">Sunset: {weather.sunset}</span></div>}
                {weather.uvIndex !== undefined && <div className="flex items-center gap-1.5 border-b border-theme-border/10 pb-1 col-span-2"><SunDim size={12} className="text-orange-400/80 shrink-0" /><span className="truncate">Max UV Index: {weather.uvIndex}</span></div>}
              </div>
            )}
          </div>
        </div>
      )}

      {showSearchModal && (
        <ModalOverlay onClose={() => { setShowSearchModal(false); setCityInput(''); }} label="Search location">
          <div className="flex items-center justify-between border-b border-theme-border/30 pb-3">
            <h3 className="text-xs font-black uppercase tracking-[0.25em] text-theme-text-muted">Change Location</h3>
            <ModalCloseButton onClick={() => { setShowSearchModal(false); setCityInput(''); }} />
          </div>
          <form onSubmit={handleSearchSubmit} className="space-y-4">
            <div>
              <label className="text-[9px] font-black uppercase tracking-wider text-theme-text-muted block mb-1.5 font-mono">Search City / Region</label>
              <div className="relative flex items-center bg-theme-input-bg border border-theme-border rounded-xl px-3 py-2.5 transition-all focus-within:border-theme-accent focus-within:ring-2 focus-within:ring-theme-accent/5">
                <Search size={14} className="text-theme-text-muted mr-2 shrink-0" />
                <input type="text" placeholder="Type city name (e.g. Cairo, Tokyo...)" value={cityInput} onChange={(e) => setCityInput(e.target.value)}
                  className="bg-transparent border-none text-xs focus:outline-none focus-visible:ring-1 focus-visible:ring-theme-accent/30 w-full text-theme-text placeholder-theme-text-muted/40 font-semibold" autoFocus aria-label="Search city" />
                {fetchingSuggestions && <RefreshCw size={12} className="text-theme-accent animate-spin ml-2 shrink-0" />}
              </div>
              {cityInput.trim().length >= 2 && (
                <div className="mt-2 border border-theme-border/50 bg-theme-input-bg/90 backdrop-blur-md rounded-xl max-h-[160px] overflow-y-auto divide-y divide-theme-border/20 z-10">
                  {fetchingSuggestions && suggestions.length === 0 ? (
                    <div className="p-3 text-[10px] text-theme-text-muted text-center font-mono uppercase tracking-wider">Searching locations...</div>
                  ) : suggestions.length > 0 ? (
                    suggestions.map((sug, idx) => (
                      <button key={idx} type="button" onClick={() => selectCity(sug.name)}
                        className="w-full text-left px-4 py-2.5 hover:bg-theme-accent/10 transition-colors text-xs font-semibold text-theme-text flex items-center justify-between cursor-pointer">
                        <span>{sug.name}</span>
                        <span className="text-[9px] text-theme-text-muted font-mono uppercase bg-theme-border/30 px-1.5 py-0.5 rounded">{sug.admin1 ? `${sug.admin1}, ` : ''}{sug.country || ''}</span>
                      </button>
                    ))
                  ) : !fetchingSuggestions ? (
                    <div className="p-3 text-[10px] text-theme-text-muted text-center font-mono">No matches found. Press Enter to search anyway.</div>
                  ) : null}
                </div>
              )}
            </div>
          </form>
          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase tracking-wider text-theme-text-muted block font-mono">Popular Suggested Places</label>
            <div className="flex flex-wrap gap-2 pt-1">
              {POPULAR_CITIES.map((c) => (
                <button key={c} onClick={() => selectCity(c)}
                  className={`px-3 py-1.5 rounded-xl text-[10px] font-bold border transition-all cursor-pointer font-mono ${weather.city.toLowerCase().includes(c.toLowerCase()) ? 'bg-theme-accent/10 border-theme-accent text-theme-accent' : 'bg-theme-input-bg/40 border-theme-border hover:border-theme-accent/30 text-theme-text-muted hover:text-theme-text'}`}>
                  {c}
                </button>
              ))}
            </div>
          </div>
        </ModalOverlay>
      )}
    </div>
  );
}
