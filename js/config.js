/* Gaidrid central customization — edit THIS file, not app.js.
   - defaults: initial values (persisted storage wins after first run)
   - extraCities: appended to the city autocomplete list
   - engines: override or add search engines, e.g.
       engines: { myengine: { name: 'My Engine', url: 'https://example.com/?q=',
         imagesUrl: '...', mapsUrl: '...', newsUrl: '...', videosUrl: '...' } }
   - engineIcons: search-engine artwork. Convention (no code change needed):
       replace the SVG files in assets/engines/ keeping the same filenames
       (google.svg, bing.svg, duckduckgo.svg, brave.svg, yahoo.svg, ecosia.svg),
       square viewBox recommended. Optional per-engine path override, e.g.
       engineIcons: { google: 'assets/engines/google.svg' }
*/
window.GaidridConfig = {
  defaults: {
    // searchEngine: 'google',
    // searchMode: 'all',
    // weatherLocation: 'Cairo',
    // isCelsius: true,
    // use24Hour: true,
    // showSeconds: false,
    // showDate: true,
    // showGreeting: true,
    // showWeather: true,
    // showCondition: true,
    // userName: '',
    // useGeolocation: false,
    // showTopSites: true,
    // themeMode: 'auto', // 'light' | 'dark' | 'auto'
    // notes: '', history: [], // managed by UI
  },
  extraCities: [],
  engines: null,
  engineIcons: null,
};
