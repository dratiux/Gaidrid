// State Management
const NEWS_DEFAULTS = [
    { name: 'Hacker News', url: 'https://news.ycombinator.com/rss', builtin: true },
    { name: 'The Verge', url: 'https://www.theverge.com/rss/index.xml', builtin: true },
    { name: 'BBC News', url: 'https://feeds.bbci.co.uk/news/rss.xml', builtin: true },
    { name: 'The Guardian', url: 'https://www.theguardian.com/world/rss', builtin: true },
    { name: 'Ars Technica', url: 'https://feeds.arstechnica.com/arstechnica/index', builtin: true },
    { name: 'NPR News', url: 'https://feeds.npr.org/1001/rss.xml', builtin: true }
];
const state = {
            use24Hour: false,
            showSeconds: false,
            showDate: true,
            showGreeting: true,
            showWeather: true,
            showCondition: true,
            weatherLocation: 'Cairo',
            isCelsius: true,
            tempC: 28,
            weatherCode: 0,
            isDay: 1, // 1 for day, 0 for night
            searchEngine: 'google',
            searchMode: 'all',
            userName: '',
            useGeolocation: false,
            geoLat: null,
            geoLon: null,
            geoAt: 0,
            notes: '',
            history: [],
            showTopSites: true,
            themeMode: 'auto',
            accent: 'blue',
            autoNight: false,
            autoNightStart: '22:00',
            autoNightEnd: '07:00',
            sportsLeague: 'ucl',
            sportsDay: 0,
            sportsFav: {},
            sportsAuto: true,
            sportsShowFinished: true,
            pomoNotify: false,
            newsFeeds: JSON.parse(JSON.stringify(NEWS_DEFAULTS)),
            newsAuto: true,
            newsRead: [],
            newsFilter: 'all',
            newsFontStep: 0,
            suggestions: [
                'edx pickup',
                'google redesign search page',
                'weather today near me',
                'latest tech news 2026',
                'best developer tools chrome extension',
                'github trending repositories'
            ],
            apps: [
                { id: '1', title: 'YouTube', url: 'https://youtube.com', icon: 'fa-brands fa-youtube', color: 'bg-red-50 text-google-red dark:bg-red-950/40' },
                { id: '2', title: 'GitHub', url: 'https://github.com', icon: 'fa-brands fa-github', color: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100' },
                { id: '3', title: 'X / Twitter', url: 'https://x.com', icon: 'fa-brands fa-x-twitter', color: 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100' },
                { id: '6', title: 'Reddit', url: 'https://reddit.com', icon: 'fa-brands fa-reddit-alien', color: 'bg-orange-50 text-orange-600 dark:bg-orange-950/40' },
                { id: '8', title: 'Spotify', url: 'https://spotify.com', icon: 'fa-brands fa-spotify', color: 'bg-green-50 text-google-green dark:bg-green-950/40' },
                { id: '9', title: 'Amazon', url: 'https://amazon.com', icon: 'fa-brands fa-amazon', color: 'bg-yellow-50 text-amber-600 dark:bg-yellow-950/40' },
                { id: '10', title: 'LinkedIn', url: 'https://linkedin.com', icon: 'fa-brands fa-linkedin-in', color: 'bg-blue-50 text-[#1a73e8] dark:bg-blue-950/40' },
                { id: '12', title: 'Stack Overflow', url: 'https://stackoverflow.com', icon: 'fa-brands fa-stack-overflow', color: 'bg-orange-50 text-orange-500 dark:bg-orange-950/40' }
            ]
        };

        // All result-type modes; engines advertise their supported subset via modes
        const modesList = ['all', 'news', 'maps', 'images', 'videos'];
        let visibleModes = modesList;

        // Engine Configuration Map
        const engineConfig = {
            google: {
                name: 'Google',
                url: 'https://www.google.com/search?q=',
                imagesUrl: 'https://www.google.com/search?tbm=isch&q=',
                mapsUrl: 'https://www.google.com/maps/search/',
                newsUrl: 'https://www.google.com/search?tbm=nws&q=',
                videosUrl: 'https://www.google.com/search?tbm=vid&q=',
            },
            youtube: {
                name: 'YouTube',
                url: 'https://www.youtube.com/results?search_query=',
                modes: ['all'],
            },
            bing: {
                name: 'Bing',
                url: 'https://www.bing.com/search?q=',
                imagesUrl: 'https://www.bing.com/images/search?q=',
                mapsUrl: 'https://www.bing.com/maps?q=',
                newsUrl: 'https://www.bing.com/news/search?q=',
                videosUrl: 'https://www.bing.com/videos/search?q=',
            },
            duckduckgo: {
                name: 'DuckDuckGo',
                url: 'https://duckduckgo.com/?q=',
                imagesUrl: 'https://duckduckgo.com/?iax=images&ia=images&q=',
                mapsUrl: 'https://duckduckgo.com/?iaxm=maps&q=',
                newsUrl: 'https://duckduckgo.com/?iar=news&ia=news&q=',
                videosUrl: 'https://duckduckgo.com/?iax=videos&ia=videos&q=',
            },
            brave: {
                name: 'Brave',
                url: 'https://search.brave.com/search?q=',
                imagesUrl: 'https://search.brave.com/images?q=',
                mapsUrl: 'https://search.brave.com/maps?q=',
                newsUrl: 'https://search.brave.com/news?q=',
                videosUrl: 'https://search.brave.com/videos?q=',
            },
            yahoo: {
                name: 'Yahoo!',
                modes: ['all', 'news', 'images', 'videos'],
                url: 'https://search.yahoo.com/search?p=',
                imagesUrl: 'https://images.search.yahoo.com/search/images?p=',
                newsUrl: 'https://news.search.yahoo.com/search?p=',
                videosUrl: 'https://video.search.yahoo.com/search/video?p=',
            },
            ecosia: {
                name: 'Ecosia',
                modes: ['all', 'news', 'images', 'videos'],
                url: 'https://www.ecosia.org/search?q=',
                imagesUrl: 'https://www.ecosia.org/images?q=',
                newsUrl: 'https://www.ecosia.org/news?q=',
                videosUrl: 'https://www.ecosia.org/videos?q=',
            }
        };

        // Bangs: one-off engine override for this search only (!yt, !b, !dd, ...)
        const BANGS = { g: 'google', yt: 'youtube', b: 'bing', dd: 'duckduckgo', br: 'brave', ya: 'yahoo', ec: 'ecosia' };

        // Mode Colors Map
        const modeColors = {
            // Mode identity colors are fixed (paired with the fixed circle backgrounds
            // in the mode reel); only site chrome follows the accent color.
            all: { bg: 'bg-[#1a73e8]/10', text: 'text-[#1a73e8]' },
            news: { bg: 'bg-google-yellow/10', text: 'text-google-yellow' },
            maps: { bg: 'bg-google-green/10', text: 'text-google-green' },
            images: { bg: 'bg-[#1a73e8]/10', text: 'text-[#1a73e8]' },
            videos: { bg: 'bg-google-red/10', text: 'text-google-red' }
        };

        // DOM Elements Initialization
        const bgWatermarkImg = document.getElementById('bgWatermark');
        let offlineMode = false;       // true while the connection is down (dino screen)
        let dinoMoon = null;           // game's moon state (inverted XOR system dark), follows while offline
        let dinoWatermark = false;     // dino.svg currently shown as watermark

        // Side panel context (sidepanel.html frames this page with ?sidepanel=1):
        // navigation must open a new tab instead of replacing the panel.
        const IS_PANEL = /[?&]sidepanel=1/.test(location.search);
        function navTo(url) {
            if (IS_PANEL) window.open(url, '_blank', 'noopener');
            else window.location.href = url;
        }
        const digitalClock = document.getElementById('digitalClock');
        const digitalDate = document.getElementById('digitalDate');
        const digitalGreeting = document.getElementById('digitalGreeting');
        const searchForm = document.getElementById('searchForm');
        const searchInput = document.getElementById('searchInput');
        const clearSearchBtn = document.getElementById('clearSearchBtn');
        const voiceSearchBtn = document.getElementById('voiceSearchBtn');
        const engineReel = document.getElementById('engineReel');
        const engineArrowUp = document.getElementById('engineArrowUp');
        const engineArrowDown = document.getElementById('engineArrowDown');
        const modeReel = document.getElementById('modeReel');
        const arrowUp = document.getElementById('arrowUp');
        const arrowDown = document.getElementById('arrowDown');
        const activeModeBadge = document.getElementById('activeModeBadge');
        const suggestionsBox = document.getElementById('suggestionsBox');
        const suggestionsList = document.getElementById('suggestionsList');
        const appsDrawerBtn = document.getElementById('appsDrawerBtn');
        const closeDrawerBtn = document.getElementById('closeDrawerBtn');
        const appsDrawer = document.getElementById('appsDrawer');
        const appsOverlay = document.getElementById('appsOverlay');
        const appsGrid = document.getElementById('appsGrid');
        const addAppModal = document.getElementById('addAppModal');
        const addAppForm = document.getElementById('addAppForm');
        const appTitleInput = document.getElementById('appTitleInput');
        const appUrlInput = document.getElementById('appUrlInput');
        const appIconInput = document.getElementById('appIconInput');
        const openAddAppBtn = document.getElementById('openAddAppBtn');
        const closeAddAppBtn = document.getElementById('closeAddAppBtn');
        const cancelAddAppBtn = document.getElementById('cancelAddAppBtn');
        const voiceModal = document.getElementById('voiceModal');
        const closeVoiceBtn = document.getElementById('closeVoiceBtn');
        const voiceStatusText = document.getElementById('voiceStatusText');
        const settingsBtn = document.getElementById('settingsBtn');
        const infoBtn = document.getElementById('infoBtn');
        const settingsModal = document.getElementById('settingsModal');
        const closeSettingsBtn = document.getElementById('closeSettingsBtn');
        const showWeatherBtn = document.getElementById('showWeatherBtn');
        const weatherToggleCircle = document.getElementById('weatherToggleCircle');
        const showConditionBtn = document.getElementById('showConditionBtn');
        const conditionToggleCircle = document.getElementById('conditionToggleCircle');

        const weatherCodeMap = {
            0: { day: { label: 'Sunny', icon: 'fa-sun', color: 'text-amber-400 animate-spin-slow' }, night: { label: 'Clear Night', icon: 'fa-moon', color: 'text-indigo-300' } },
            1: { day: { label: 'Mainly Clear', icon: 'fa-cloud-sun', color: 'text-amber-300' }, night: { label: 'Mostly Clear', icon: 'fa-cloud-moon', color: 'text-slate-300' } },
            2: { day: { label: 'Partly Cloudy', icon: 'fa-cloud-sun', color: 'text-sky-400' }, night: { label: 'Partly Cloudy', icon: 'fa-cloud-moon', color: 'text-slate-400' } },
            3: { day: { label: 'Overcast', icon: 'fa-cloud', color: 'text-gray-400' }, night: { label: 'Overcast', icon: 'fa-cloud', color: 'text-gray-400' } },
            45: { day: { label: 'Foggy', icon: 'fa-smog', color: 'text-gray-400' }, night: { label: 'Foggy', icon: 'fa-smog', color: 'text-gray-400' } },
            48: { day: { label: 'Icy Fog', icon: 'fa-smog', color: 'text-cyan-300' }, night: { label: 'Icy Fog', icon: 'fa-smog', color: 'text-cyan-300' } },
            51: { day: { label: 'Light Drizzle', icon: 'fa-cloud-rain', color: 'text-sky-400' }, night: { label: 'Light Drizzle', icon: 'fa-cloud-rain', color: 'text-sky-400' } },
            53: { day: { label: 'Drizzle', icon: 'fa-cloud-rain', color: 'text-blue-400' }, night: { label: 'Drizzle', icon: 'fa-cloud-rain', color: 'text-blue-400' } },
            55: { day: { label: 'Heavy Drizzle', icon: 'fa-cloud-showers-heavy', color: 'text-blue-500' }, night: { label: 'Heavy Drizzle', icon: 'fa-cloud-showers-heavy', color: 'text-blue-500' } },
            56: { day: { label: 'Freezing Drizzle', icon: 'fa-snowflake', color: 'text-cyan-300' }, night: { label: 'Freezing Drizzle', icon: 'fa-snowflake', color: 'text-cyan-300' } },
            57: { day: { label: 'Heavy Freezing Drizzle', icon: 'fa-snowflake', color: 'text-cyan-400' }, night: { label: 'Heavy Freezing Drizzle', icon: 'fa-snowflake', color: 'text-cyan-400' } },
            61: { day: { label: 'Slight Rain', icon: 'fa-cloud-rain', color: 'text-blue-400' }, night: { label: 'Slight Rain', icon: 'fa-cloud-rain', color: 'text-blue-400' } },
            63: { day: { label: 'Moderate Rain', icon: 'fa-cloud-showers-heavy', color: 'text-[#1a73e8]' }, night: { label: 'Moderate Rain', icon: 'fa-cloud-showers-heavy', color: 'text-[#1a73e8]' } },
            65: { day: { label: 'Heavy Rain', icon: 'fa-cloud-showers-water', color: 'text-blue-600' }, night: { label: 'Heavy Rain', icon: 'fa-cloud-showers-water', color: 'text-blue-600' } },
            66: { day: { label: 'Freezing Rain', icon: 'fa-snowflake', color: 'text-cyan-300' }, night: { label: 'Freezing Rain', icon: 'fa-snowflake', color: 'text-cyan-300' } },
            67: { day: { label: 'Heavy Freezing Rain', icon: 'fa-snowflake', color: 'text-cyan-400' }, night: { label: 'Heavy Freezing Rain', icon: 'fa-snowflake', color: 'text-cyan-400' } },
            71: { day: { label: 'Slight Snow', icon: 'fa-snowflake', color: 'text-sky-200' }, night: { label: 'Slight Snow', icon: 'fa-snowflake', color: 'text-sky-200' } },
            73: { day: { label: 'Snow Fall', icon: 'fa-snowflake', color: 'text-sky-300' }, night: { label: 'Snow Fall', icon: 'fa-snowflake', color: 'text-sky-300' } },
            75: { day: { label: 'Heavy Snow', icon: 'fa-snowflake', color: 'text-blue-100' }, night: { label: 'Heavy Snow', icon: 'fa-snowflake', color: 'text-blue-100' } },
            77: { day: { label: 'Snow Grains', icon: 'fa-snowflake', color: 'text-sky-200' }, night: { label: 'Snow Grains', icon: 'fa-snowflake', color: 'text-sky-200' } },
            80: { day: { label: 'Rain Showers', icon: 'fa-cloud-sun-rain', color: 'text-blue-400' }, night: { label: 'Rain Showers', icon: 'fa-cloud-moon-rain', color: 'text-indigo-400' } },
            81: { day: { label: 'Heavy Showers', icon: 'fa-cloud-showers-heavy', color: 'text-blue-500' }, night: { label: 'Heavy Showers', icon: 'fa-cloud-showers-heavy', color: 'text-blue-500' } },
            82: { day: { label: 'Violent Showers', icon: 'fa-cloud-showers-water', color: 'text-blue-700' }, night: { label: 'Violent Showers', icon: 'fa-cloud-showers-water', color: 'text-blue-700' } },
            85: { day: { label: 'Snow Showers', icon: 'fa-snowflake', color: 'text-sky-200' }, night: { label: 'Snow Showers', icon: 'fa-snowflake', color: 'text-sky-200' } },
            86: { day: { label: 'Heavy Snow Showers', icon: 'fa-snowflake', color: 'text-sky-300' }, night: { label: 'Heavy Snow Showers', icon: 'fa-snowflake', color: 'text-sky-300' } },
            95: { day: { label: 'Thunderstorm', icon: 'fa-cloud-bolt', color: 'text-amber-500' }, night: { label: 'Thunderstorm', icon: 'fa-cloud-bolt', color: 'text-purple-400' } },
            96: { day: { label: 'Thunderstorm & Hail', icon: 'fa-cloud-bolt', color: 'text-purple-400' }, night: { label: 'Thunderstorm & Hail', icon: 'fa-cloud-bolt', color: 'text-purple-400' } },
            99: { day: { label: 'Heavy Thunderstorm', icon: 'fa-bolt-lightning', color: 'text-red-500' }, night: { label: 'Heavy Thunderstorm', icon: 'fa-bolt-lightning', color: 'text-red-500' } }
        };

        async function fetchLiveWeather(city, fromGeo) {
            if (state.useGeolocation && !fromGeo && typeof navigator !== 'undefined' && navigator.geolocation) {
                fetchGeoWeather(false);
                return;
            }
            if (!city) return;
            const weatherCondition = document.getElementById('weatherCondition');
            const weatherLocation = document.getElementById('weatherLocation');
            
            try {
                // 1. Geocoding API to get precise lat/lon for specified city/country
                const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;
                const geoRes = await fetch(geoUrl);
                const geoData = await geoRes.json();

                if (!geoData.results || geoData.results.length === 0) {
                    if (weatherCondition) weatherCondition.textContent = 'City Not Found,';
                    return;
                }

                const { latitude, longitude, name, country } = geoData.results[0];
                const displayLocation = country ? `${name}, ${country}` : name;
                state.weatherLocation = name;
                
                if (weatherLocation) {
                    weatherLocation.textContent = `${displayLocation} •`;
                    weatherLocation.classList.remove('hidden');
                }

                // 2. Weather Forecast API (Includes current weather and is_day indicator)
                const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;
                const weatherRes = await fetch(weatherUrl);
                const weatherData = await weatherRes.json();

                if (weatherData && weatherData.current_weather) {
                    const current = weatherData.current_weather;
                    state.tempC = Math.round(current.temperature);
                    state.weatherCode = current.weathercode;
                    state.isDay = typeof current.is_day !== 'undefined' ? current.is_day : 1;

                    // Update UI Display immediately
                    updateWeatherUI();
                }
            } catch (err) {
                console.error('Failed to fetch weather:', err);
                if (weatherCondition) weatherCondition.textContent = 'Offline,';
            }
        }

        function updateWeatherUI() {
            const entry = weatherCodeMap[state.weatherCode] || weatherCodeMap[0];
            const isDaytime = state.isDay === 1;
            const info = entry[isDaytime ? 'day' : 'night'] || entry.day || { label: 'Clear', icon: 'fa-sun', color: 'text-google-yellow' };
            
            const weatherIcon = document.getElementById('weatherIcon');
            const weatherCondition = document.getElementById('weatherCondition');
            const weatherTemp = document.getElementById('weatherTemp');

            if (weatherIcon) {
                weatherIcon.className = `fa-solid ${info.icon} ${info.color} text-lg transition-all duration-300`;
            }

            if (weatherCondition) {
                weatherCondition.textContent = `${info.label},`;
            }

            if (weatherTemp) {
                if (state.isCelsius) {
                    weatherTemp.textContent = `${state.tempC}°C`;
                } else {
                    const tempF = Math.round((state.tempC * 9/5) + 32);
                    weatherTemp.textContent = `${tempF}°F`;
                }
            }
        }

        // Automatic Weather Refresh Timers & Visibility Handlers
        // 1. Refresh every 10 minutes automatically
        setInterval(() => {
            if (state.weatherLocation) {
                fetchLiveWeather(state.weatherLocation);
            }
        }, 10 * 60 * 1000);

        // 2. Refresh immediately when switching back to tab
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden && state.weatherLocation) {
                fetchLiveWeather(state.weatherLocation);
            }
        });

        // Debounce weather fetching on location input in preferences
        let weatherFetchTimeout;
        const weatherLocationInput = document.getElementById('weatherLocationInput');
        if (weatherLocationInput) {
            weatherLocationInput.addEventListener('input', (e) => {
                const loc = e.target.value.trim();
                clearTimeout(weatherFetchTimeout);
                if (loc) {
                    const weatherLocation = document.getElementById('weatherLocation');
                    if (weatherLocation) {
                        weatherLocation.textContent = `${loc} •`;
                        weatherLocation.classList.remove('hidden');
                    }
                    weatherFetchTimeout = setTimeout(() => {
                        fetchLiveWeather(loc);
                    }, 500);
                }
                showCitySuggestions(e.target.value);
            });
        }

        // Refresh weather manually when clicking weather widget (Optional quick refresh)
        const weatherWidget = document.getElementById('weatherWidget');
        if (weatherWidget) {
            weatherWidget.addEventListener('click', () => {
                if (state.useGeolocation) fetchGeoWeather(true);
                else fetchLiveWeather(state.weatherLocation || 'Cairo');
            });
        }

        // Initialize Live Weather on Load
        fetchLiveWeather(state.weatherLocation);
        const unitC = document.getElementById('unitC');
        const unitF = document.getElementById('unitF');

        // Clock Control Elements
        const clockFormatBtn = document.getElementById('clockFormatBtn');
        const clockToggleCircle = document.getElementById('clockToggleCircle');
        const showSecondsBtn = document.getElementById('showSecondsBtn');
        const secondsToggleCircle = document.getElementById('secondsToggleCircle');
        const showDateBtn = document.getElementById('showDateBtn');
        const dateToggleCircle = document.getElementById('dateToggleCircle');
        const showGreetingBtn = document.getElementById('showGreetingBtn');
        const greetingToggleCircle = document.getElementById('greetingToggleCircle');

        function updateClock() {
            const now = new Date();
            let hours = now.getHours();
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');
            
            let timeStr = '';
            if (!state.use24Hour) {
                const ampm = hours >= 12 ? ' PM' : ' AM';
                hours = hours % 12 || 12;
                timeStr = `${String(hours).padStart(2, '0')}:${minutes}${state.showSeconds ? ':' + seconds : ''}${ampm}`;
            } else {
                timeStr = `${String(hours).padStart(2, '0')}:${minutes}${state.showSeconds ? ':' + seconds : ''}`;
            }

            digitalClock.textContent = timeStr;

            // Date Visibility
            if (state.showDate) {
                digitalDate.classList.remove('hidden');
                const options = { weekday: 'long', day: 'numeric', month: 'short' };
                digitalDate.textContent = now.toLocaleDateString('en-US', options);
            } else {
                digitalDate.classList.add('hidden');
            }

            // Contextual Greeting
            if (state.showGreeting) {
                digitalGreeting.classList.remove('hidden');
                let greeting = 'Good Morning';
                const currentHour = now.getHours();
                if (currentHour >= 12 && currentHour < 17) greeting = 'Good Afternoon';
                else if (currentHour >= 17 || currentHour < 5) greeting = 'Good Evening';
                const nm = (state.userName || '').trim();
                digitalGreeting.textContent = nm ? greeting + ', ' + nm : greeting;
            } else {
                digitalGreeting.classList.add('hidden');
            }
        }

        setInterval(updateClock, 1000);
        updateClock();

        // Clock Event Listeners
        clockFormatBtn.addEventListener('click', () => {
            state.use24Hour = !state.use24Hour;
            syncSettingsUI();
        });

        showSecondsBtn.addEventListener('click', () => {
            state.showSeconds = !state.showSeconds;
            syncSettingsUI();
        });

        showDateBtn.addEventListener('click', () => {
            state.showDate = !state.showDate;
            syncSettingsUI();
        });

        showGreetingBtn.addEventListener('click', () => {
            state.showGreeting = !state.showGreeting;
            syncSettingsUI();
        });

        // Weather Customization Handlers
        showWeatherBtn.addEventListener('click', () => {
            state.showWeather = !state.showWeather;
            syncSettingsUI();
        });

        showConditionBtn.addEventListener('click', () => {
            state.showCondition = !state.showCondition;
            syncSettingsUI();
        });

        // Popular City Suggestions List & Auto-complete
        const popularCities = [
            'Alexandria', 'Cairo', 'Giza', 'Luxor', 'Aswan', 'Sharm El Sheikh', 'Hurghada',
            'London', 'New York', 'Paris', 'Tokyo', 'Dubai', 'Riyadh', 'Istanbul', 'Berlin',
            'Rome', 'Madrid', 'Toronto', 'Sydney', 'Barcelona', 'Amsterdam', 'Singapore',
            'Los Angeles', 'Chicago', 'Miami', 'Seoul', 'Bangkok', 'Beijing', 'Vienna'
        ];

        const citySuggestionsBox = document.getElementById('citySuggestionsBox');
        const citySuggestionsList = document.getElementById('citySuggestionsList');

        function showCitySuggestions(query) {
            if (!citySuggestionsBox || !citySuggestionsList) return;
            const matches = popularCities.filter(c => c.toLowerCase().includes(query.toLowerCase()));
            if (matches.length === 0 || !query.trim()) {
                citySuggestionsBox.classList.add('hidden');
                return;
            }
            citySuggestionsList.innerHTML = matches.map(city => `
                <div class="city-suggestion-item px-3.5 py-2 hover:bg-gray-100 dark:hover:bg-white/10 cursor-pointer text-xs text-gray-700 dark:text-gray-200 flex items-center justify-between transition-colors">
                    <span>${city}</span>
                    <i class="fa-solid fa-location-dot text-[10px] text-google-blue/70"></i>
                </div>
            `).join('');
            citySuggestionsBox.classList.remove('hidden');

            document.querySelectorAll('.city-suggestion-item').forEach(item => {
                item.addEventListener('click', () => {
                    const selectedCity = item.querySelector('span').textContent;
                    if (weatherLocationInput) weatherLocationInput.value = selectedCity;
                    state.weatherLocation = selectedCity;
                    citySuggestionsBox.classList.add('hidden');
                    // Fetch new city weather immediately on selection
                    fetchLiveWeather(selectedCity);
                });
            });
        }

        if (weatherLocationInput) {
            weatherLocationInput.addEventListener('input', (e) => {
                const loc = e.target.value.trim();
                state.weatherLocation = loc;
                if (loc) {
                    weatherLocation.textContent = `${loc} •`;
                    weatherLocation.classList.remove('hidden');
                } else {
                    weatherLocation.classList.add('hidden');
                }
                showCitySuggestions(e.target.value);
            });

            weatherLocationInput.addEventListener('focus', () => {
                if (weatherLocationInput.value.trim()) {
                    showCitySuggestions(weatherLocationInput.value);
                }
            });
        }

        // Close city suggestions on outside click
        document.addEventListener('click', (e) => {
            if (weatherLocationInput && citySuggestionsBox && !weatherLocationInput.contains(e.target) && !citySuggestionsBox.contains(e.target)) {
                citySuggestionsBox.classList.add('hidden');
            }
        });

        // Engine Reel Lists
        const enginesList = ['google', 'youtube', 'bing', 'duckduckgo', 'brave', 'yahoo', 'ecosia'];

        function updateEngineReelArrows() {
            if (!engineArrowUp || !engineArrowDown) return;
            const currentIndex = enginesList.indexOf(state.searchEngine);

            if (currentIndex <= 0) {
                engineArrowUp.classList.add('hidden');
            } else {
                engineArrowUp.classList.remove('hidden');
            }

            if (currentIndex >= enginesList.length - 1) {
                engineArrowDown.classList.add('hidden');
            } else {
                engineArrowDown.classList.remove('hidden');
            }
        }

        function updateInputPlaceholder() {
            const engineName = engineConfig[state.searchEngine]?.name || 'Google';
            if (state.searchMode === 'all') {
                searchInput.placeholder = `Search ${engineName} or type a URL`;
            } else if (state.searchMode === 'news') {
                searchInput.placeholder = `Search ${engineName} News...`;
            } else if (state.searchMode === 'maps') {
                searchInput.placeholder = `Search ${engineName} Maps...`;
            } else if (state.searchMode === 'images') {
                searchInput.placeholder = `Search ${engineName} Images...`;
            } else if (state.searchMode === 'videos') {
                searchInput.placeholder = `Search ${engineName} Videos...`;
            }
        }

        function setSearchEngine(engineKey, scrollReel = true) {
            if (!engineConfig[engineKey]) return;
            state.searchEngine = engineKey;

            // Update background watermark with smooth fade (assets/engines)
            if (bgWatermarkImg && !offlineMode) {
                const icons = (window.GaidridConfig && window.GaidridConfig.engineIcons) || {};
                swapWatermark(bgWatermarkImg,
                    icons[engineKey] || ('assets/engines/' + engineKey + '.svg'),
                    (engineConfig[engineKey] && engineConfig[engineKey].name) || engineKey);
            }

            // Update Placeholder
            updateInputPlaceholder();

            // Update Arrow Limits
            updateEngineReelArrows();

            // Hide result-type modes this engine doesn't support
            const supported = engineConfig[engineKey].modes || modesList;
            visibleModes = supported;
            document.querySelectorAll('#modeReel [data-mode]').forEach((el) => {
                el.classList.toggle('hidden', !supported.includes(el.getAttribute('data-mode')));
            });
            // Re-align reel/badge to the visible mode set (may shift when maps is hidden)
            setSearchMode(supported.includes(state.searchMode) ? state.searchMode : 'all', true);

            // Scroll Reel to centered mode element if triggered programmatically
            if (scrollReel && engineReel) {
                const targetIdx = enginesList.indexOf(engineKey);
                if (targetIdx !== -1) {
                    engineReel.scrollTo({
                        top: targetIdx * 48,
                        behavior: 'smooth'
                    });
                }
            }
        }

        updateEngineReelArrows();


        // Quantized wheel: one detent = exactly one item (no more double-skip)
        let engineWheelAcc = 0;
        let engineWheelLock = false;
        let engineWheelLast = 0;
        function engineStep(dir) {
            const max = enginesList.length - 1;
            const next = Math.min(Math.max(Math.round(engineReel.scrollTop / 48) + dir, 0), max);
            engineReel.scrollTo({ top: next * 48, behavior: 'smooth' });
        }

        if (engineReel) {
            engineReel.addEventListener('wheel', (e) => {
                e.preventDefault();
                const now = Date.now();
                const d = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY;
                if (now - engineWheelLast > 800) engineWheelAcc = 0;
                engineWheelLast = now;
                engineWheelAcc += d;
                if (engineWheelLock) return;
                engineWheelLock = true;
                const run = () => {
                    if (Math.abs(engineWheelAcc) >= 25) {
                        engineStep(engineWheelAcc > 0 ? 1 : -1);
                        engineWheelAcc = 0;
                        setTimeout(run, 170);
                    } else { engineWheelLock = false; }
                };
                run();
            }, { passive: false });
        }

        // Settle state after drag release / wheel steps
        if (engineReel) {
            let engineSettleTimeout;
            engineReel.addEventListener('scroll', () => {
                clearTimeout(engineSettleTimeout);
                engineSettleTimeout = setTimeout(() => {
                    const index = Math.round(engineReel.scrollTop / 48);
                    const activeEngine = enginesList[Math.min(Math.max(index, 0), enginesList.length - 1)];
                    if (activeEngine && activeEngine !== state.searchEngine) {
                        setSearchEngine(activeEngine, false);
                    }
                }, 180);
            });
        }

        // Click engine item in reel (delegated: covers custom engines added later)
        if (engineReel) engineReel.addEventListener('click', (e) => {
            const item = e.target && e.target.closest ? e.target.closest('[data-engine]') : null;
            if (!item || !engineReel.contains(item)) return;
            e.stopPropagation();
            setSearchEngine(item.getAttribute('data-engine'), true);
            searchInput.focus();
        });

        // Mouse Drag Support for Engine Reel
        let isEngineDragging = false;
        let startEngineY, engineScrollTop;

        if (engineReel) {
            engineReel.addEventListener('mousedown', (e) => {
                isEngineDragging = true;
                startEngineY = e.pageY - engineReel.offsetTop;
                engineScrollTop = engineReel.scrollTop;
            });

            engineReel.addEventListener('mouseleave', () => isEngineDragging = false);
            engineReel.addEventListener('mouseup', () => {
                isEngineDragging = false;
                engineReel.scrollTo({ top: Math.round(engineReel.scrollTop / 48) * 48, behavior: 'smooth' });
            });

            engineReel.addEventListener('mousemove', (e) => {
                if(!isEngineDragging) return;
                e.preventDefault();
                const y = e.pageY - engineReel.offsetTop;
                const walk = (y - startEngineY) * 1.5;
                engineReel.scrollTop = engineScrollTop - walk;
            });
        }

        // Mode Reel Drag & Scroll Sync
        function updateReelArrows() {
            if (!arrowUp || !arrowDown) return;
            const currentIndex = visibleModes.indexOf(state.searchMode);

            // Hide Up Arrow when at top item ('all')
            if (currentIndex <= 0) {
                arrowUp.classList.add('hidden');
            } else {
                arrowUp.classList.remove('hidden');
            }

            // Hide Down Arrow at last visible item
            if (currentIndex >= visibleModes.length - 1) {
                arrowDown.classList.add('hidden');
            } else {
                arrowDown.classList.remove('hidden');
            }
        }

        function setSearchMode(mode, scrollReel = true) {
            state.searchMode = mode;
            
            // Update Placeholder
            updateInputPlaceholder();

            // Update Badge
            if (mode === 'all') {
                activeModeBadge.classList.add('hidden');
            } else {
                activeModeBadge.textContent = mode;
                activeModeBadge.className = `text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full mr-1 transition-all ${modeColors[mode].bg} ${modeColors[mode].text}`;
                activeModeBadge.classList.remove('hidden');
            }

            // Update arrow limits
            updateReelArrows();

            // Scroll Reel to centered mode element if triggered programmatically
            if (scrollReel && modeReel) {
                const targetIdx = visibleModes.indexOf(mode);
                if (targetIdx !== -1) {
                    modeReel.scrollTo({
                        top: targetIdx * 48,
                        behavior: 'smooth'
                    });
                }
            }
        }

        // Initial setup for arrow limit visibility
        updateReelArrows();


        // Quantized wheel: one detent = exactly one item (no more double-skip)
        let modeWheelAcc = 0;
        let modeWheelLock = false;
        let modeWheelLast = 0;
        function modeStep(dir) {
            const max = visibleModes.length - 1;
            const next = Math.min(Math.max(Math.round(modeReel.scrollTop / 48) + dir, 0), max);
            modeReel.scrollTo({ top: next * 48, behavior: 'smooth' });
        }

        
         modeReel.addEventListener('wheel', (e) => {
                e.preventDefault();
                const now = Date.now();
                const d = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY;
                if (now - modeWheelLast > 800) modeWheelAcc = 0;
                modeWheelLast = now;
                modeWheelAcc += d;
                if (modeWheelLock) return;
                modeWheelLock = true;
                const run = () => {
                    if (Math.abs(modeWheelAcc) >= 25) {
                        modeStep(modeWheelAcc > 0 ? 1 : -1);
                        modeWheelAcc = 0;
                        setTimeout(run, 170);
                    } else { modeWheelLock = false; }
                };
                run();
            }, { passive: false });
        

        // Settle state after drag release / wheel steps
        let modeSettleTimeout;
        modeReel.addEventListener('scroll', () => {
            clearTimeout(modeSettleTimeout);
            modeSettleTimeout = setTimeout(() => {
                const index = Math.round(modeReel.scrollTop / 48);
                const activeMode = visibleModes[Math.min(Math.max(index, 0), visibleModes.length - 1)];
                if (activeMode && activeMode !== state.searchMode) {
                    setSearchMode(activeMode, false);
                }
            }, 180);
        });

        // Click direct mode item in reel
        document.querySelectorAll('#modeReel .mode-reel-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.stopPropagation();
                const mode = item.getAttribute('data-mode');
                setSearchMode(mode, true);
                searchInput.focus();
            });
        });

        // Mouse Drag Support for Reel
        let isDragging = false;
        let startY, scrollTop;

        modeReel.addEventListener('mousedown', (e) => {
            isDragging = true;
            startY = e.pageY - modeReel.offsetTop;
            scrollTop = modeReel.scrollTop;
        });

        modeReel.addEventListener('mouseleave', () => isDragging = false);
        modeReel.addEventListener('mouseup', () => {
            isDragging = false;
            modeReel.scrollTo({ top: Math.round(modeReel.scrollTop / 48) * 48, behavior: 'smooth' });
        });

        modeReel.addEventListener('mousemove', (e) => {
            if(!isDragging) return;
            e.preventDefault();
            const y = e.pageY - modeReel.offsetTop;
            const walk = (y - startY) * 1.5;
            modeReel.scrollTop = scrollTop - walk;
        });

        // Set when the user explicitly picks a "... - Search" row for a URL-like
        // query; submit then searches it instead of visiting it.
        let forceSearchOnce = false;

        function isUrlLike(q) {
            return /^(https?:\/\/|www\.)\S+\.\S+/i.test(q) || /^[\w-]+(\.[\w-]+)+([\/?#]\S*)?$/.test(q);
        }
        function gotoUrl(q) {
            navTo(/^[a-z][a-z0-9+.-]*:\/\//i.test(q) ? q : 'https://' + q);
        }

        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let query = searchInput.value.trim();
            if (!query) return;
            const forceSearch = forceSearchOnce;
            forceSearchOnce = false;

            // Bangs: "!yt cats" searches YouTube for this query only (saved engine untouched).
            let engine = engineConfig[state.searchEngine] || engineConfig.google;
            const bm = query.match(/^!(\w+)\s+([\s\S]+)$/);
            if (bm && BANGS[bm[1]] && engineConfig[BANGS[bm[1]]]) {
                engine = engineConfig[BANGS[bm[1]]];
                query = bm[2].trim();
                if (!query) return;
            }
            pushHistory(query);

            if (isUrlLike(query) && !forceSearch) {
                gotoUrl(query);
                return;
            }

            const modeUrls = { images: engine.imagesUrl, maps: engine.mapsUrl, news: engine.newsUrl, videos: engine.videosUrl };
            const url = (modeUrls[state.searchMode] || engine.url) + encodeURIComponent(query);

            navTo(url);
        });

        // Search Input Suggestions Toggle
        searchInput.addEventListener('input', (e) => {
            const val = e.target.value;
            if (val.length > 0) {
                clearSearchBtn.classList.remove('hidden');
                showSuggestions(val);
            } else {
                clearSearchBtn.classList.add('hidden');
                suggestionsBox.classList.add('hidden');
            }
        });

        clearSearchBtn.addEventListener('click', () => {
            searchInput.value = '';
            clearSearchBtn.classList.add('hidden');
            suggestionsBox.classList.add('hidden');
            searchInput.focus();
        });

        let suggActive = -1;
        let suggSeq = 0;
        let suggCtl = null;

        function escHtml(s) {
            return String(s).replace(/[&<>"']/g, function (c) {
                return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
            });
        }

        function suggEngineName() {
            return (engineConfig[state.searchEngine] && engineConfig[state.searchEngine].name) || 'Google';
        }

        function paintSuggActive() {
            document.querySelectorAll('.suggestion-item').forEach(function (el, i) {
                el.classList.toggle('sugg-active', i === suggActive);
            });
        }

        function renderSuggestionItems(displayList) {
            const engineName = suggEngineName();
            suggestionsList.innerHTML = displayList.map(function (item) {
                const isCalc = item.indexOf('= ') === 0;
                const cleaned = isCalc ? item : item.replace(' - Search ' + engineName, '');
                const isSearchRow = !isCalc && cleaned !== item;
                const act = isCalc ? 'calc' : (isSearchRow ? 'search' : (isUrlLike(cleaned) ? 'url' : 'search'));
                return '<div class="suggestion-item px-5 py-2.5 hover:bg-gray-50 dark:hover:bg-white/10 flex items-center gap-3 cursor-pointer text-sm text-gray-700 dark:text-gray-200" data-act="' + act + '">'
                    + (isCalc ? '<i class="fa-solid fa-calculator text-google-blue text-xs"></i>'
                        : act === 'url' ? '<i class="fa-solid fa-globe text-gray-400 text-xs"></i>'
                        : '<i class="fa-solid fa-magnifying-glass text-gray-400 text-xs"></i>')
                    + '<span>' + escHtml(item) + '</span></div>';
            }).join('');

            suggestionsBox.classList.remove('hidden');
            suggActive = -1;
            paintSuggActive();

            document.querySelectorAll('.suggestion-item').forEach(function (el) {
                el.addEventListener('click', function () {
                    const act = el.getAttribute('data-act');
                    const raw = el.querySelector('span').textContent;
                    if (act === 'calc') {
                        searchInput.value = raw.slice(2);
                        suggestionsBox.classList.add('hidden');
                        searchInput.focus();
                        return;
                    }
                    const cleaned = raw.replace(' - Search ' + engineName, '');
                    if (act === 'search' && isUrlLike(cleaned)) forceSearchOnce = true;
                    searchInput.value = cleaned;
                    searchForm.dispatchEvent(new Event('submit'));
                });
            });
        }

        // Rows offered when the query itself looks like a URL: visit it, or search for it.
        function urlSuggestionRows(query) {
            if (!isUrlLike(query)) return [];
            return [query, query + ' - Search ' + suggEngineName()];
        }

        // Engine bang cheat-sheet: "!yt" rows fill the input instead of searching.
        function fillBang(bang) {
            if (!bang) return;
            const cur = searchInput.value;
            const m = cur.match(/^!(\w*)([\s\S]*)$/);
            const after = (m && m[2] ? m[2].trim() : '');
            searchInput.value = bang + (after ? ' ' + after : ' ');
            suggestionsBox.classList.add('hidden');
            searchInput.focus();
        }
        function renderBangHelp(query) {
            const m = query.match(/^!(\w*)([\s\S]*)$/);
            const typed = m ? m[1] : '';
            const full = query.match(/^!(\w+)\s+([\s\S]+)$/);
            // Complete bang with a query: one row, submit parses it (existing path).
            if (full && BANGS[full[1]] && engineConfig[BANGS[full[1]]]) {
                renderSuggestionItems([query]);
                return;
            }
            const rows = Object.keys(BANGS)
                .filter((k) => k.indexOf(typed) === 0 && engineConfig[BANGS[k]])
                .map((k) => ({ key: k, name: engineConfig[BANGS[k]].name }));
            if (!rows.length) { renderSuggestionItems([query]); return; }
            suggestionsList.innerHTML = rows.map(function (r) {
                return '<div class="suggestion-item px-5 py-2.5 hover:bg-gray-50 dark:hover:bg-white/10 flex items-center gap-3 cursor-pointer text-sm text-gray-700 dark:text-gray-200" data-bang="!' + r.key + '">'
                    + '<i class="fa-solid fa-bolt text-google-blue text-xs"></i>'
                    + '<span>!' + r.key + ' — ' + escHtml(r.name) + '</span></div>';
            }).join('');
            suggestionsBox.classList.remove('hidden');
            suggActive = -1;
            paintSuggActive();
            document.querySelectorAll('.suggestion-item').forEach(function (el) {
                el.addEventListener('click', function () { fillBang(el.getAttribute('data-bang')); });
            });
        }

        function showSuggestions(query) {
            if (query.charAt(0) === '!') { renderBangHelp(query); return; }
            const calc = tryCalc(query);
            if (calc !== null) {
                renderSuggestionItems(['= ' + calc]);
                return;
            }
            const q = query.toLowerCase();
            const hist = (state.history || []).filter(function (item) { return item.toLowerCase().includes(q) && item.toLowerCase() !== q; });
            const matches = state.suggestions.filter(function (item) { return item.toLowerCase().includes(q); });
            const base = urlSuggestionRows(query);
            const baseKeys = base.map(function (x) { return x.toLowerCase(); });
            const combined = hist.concat(matches).filter(function (item) {
                return baseKeys.indexOf(item.toLowerCase()) === -1;
            }).slice(0, 7);
            const list = base.concat(combined);
            if (!list.length) list.push(query + ' - Search ' + suggEngineName());
            renderSuggestionItems(list.slice(0, 8));
            refreshLiveSuggestions(query);
        }

        function suggestUrl(engine, q) {
            const e = encodeURIComponent(q);
            if (engine === 'google') return 'https://suggestqueries.google.com/complete/search?client=chrome&q=' + e;
            if (engine === 'bing') return 'https://api.bing.com/osjson.aspx?query=' + e;
            if (engine === 'duckduckgo') return 'https://duckduckgo.com/ac/?q=' + e;
            if (engine === 'brave') return 'https://search.brave.com/api/suggest?q=' + e;
            return null;
        }

        function parseSuggest(engine, data) {
            try {
                if (engine === 'duckduckgo' && Array.isArray(data)) {
                    return data.map(function (d) { return d && d.phrase; }).filter(function (s) { return typeof s === 'string'; });
                }
                if (engine === 'brave' && data && Array.isArray(data.suggestions)) {
                    return data.suggestions.map(function (d) { return typeof d === 'string' ? d : (d && (d.value || d.text)); }).filter(function (s) { return typeof s === 'string'; });
                }
                if (data && Array.isArray(data[1])) {
                    return data[1].filter(function (s) { return typeof s === 'string'; });
                }
            } catch (err) {}
            return [];
        }

        async function refreshLiveSuggestions(query) {
            const url = suggestUrl(state.searchEngine, query);
            if (!url) return;
            const seq = ++suggSeq;
            if (suggCtl) suggCtl.abort();
            suggCtl = new AbortController();
            const timer = setTimeout(function () { suggCtl.abort(); }, 2000);
            try {
                const res = await fetch(url, { signal: suggCtl.signal });
                const data = await res.json();
                const items = parseSuggest(state.searchEngine, data).slice(0, 7);
                if (seq !== suggSeq) return;
                if (searchInput.value.trim() !== query || !items.length) return;
                // Keep the visit/search rows for URL-like queries pinned above live results.
                const base = urlSuggestionRows(query);
                const baseKeys = base.map(function (x) { return x.toLowerCase(); });
                renderSuggestionItems(base.concat(items.filter(function (i) {
                    return baseKeys.indexOf(String(i).toLowerCase()) === -1;
                })).slice(0, 8));
            } catch (err) { /* keep local list */ }
            finally { clearTimeout(timer); }
        }

        // Close suggestions on outside click
        document.addEventListener('click', (e) => {
            if (!searchForm.contains(e.target)) {
                suggestionsBox.classList.add('hidden');
            }
        });

        function openDrawer() {
            if (appsDrawer) appsDrawer.classList.remove('translate-x-full');
            if (appsOverlay) appsOverlay.classList.remove('opacity-0', 'pointer-events-none');
        }

        function closeDrawer() {
            if (appsDrawer) appsDrawer.classList.add('translate-x-full');
            if (appsOverlay) appsOverlay.classList.add('opacity-0', 'pointer-events-none');
        }

        if (appsDrawerBtn) appsDrawerBtn.addEventListener('click', openDrawer);
        if (closeDrawerBtn) closeDrawerBtn.addEventListener('click', closeDrawer);
        if (appsOverlay) appsOverlay.addEventListener('click', closeDrawer);

        let draggedIndex = null;

        function renderApps() {
            if (!appsGrid) return;
            appsGrid.innerHTML = '';

            state.apps.forEach((app, index) => {
                const appCard = document.createElement('div');
                appCard.className = 'group relative flex flex-col items-center p-2 rounded-xl hover:bg-gray-100/70 dark:hover:bg-white/10 transition-all cursor-grab active:cursor-grabbing border border-transparent hover:border-gray-200 dark:hover:border-white/10';
                appCard.setAttribute('draggable', 'true');
                appCard.setAttribute('data-index', index);

                appCard.innerHTML = `
                    <div class="absolute top-1 right-1 z-10 opacity-0 group-hover:opacity-100 transition-all">
                        <button class="card-menu-btn w-6 h-6 rounded-full bg-white/95 dark:bg-[#232c38]/95 border border-gray-200/70 dark:border-white/10 shadow-md flex items-center justify-center text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white transition-all" title="Options">
                            <i class="fa-solid fa-ellipsis-vertical text-[10px]"></i>
                        </button>
                        <div class="card-menu hidden absolute right-0 top-7 w-28 bg-white/95 dark:bg-[#232c38]/95 border border-gray-200/70 dark:border-white/10 rounded-xl shadow-float overflow-hidden py-1">
                            <button data-act="edit" class="w-full flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                                <i class="fa-solid fa-pen text-[9px] text-google-blue"></i>Edit
                            </button>
                            <button data-act="del" class="w-full flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50 dark:hover:bg-white/10 transition-colors">
                                <i class="fa-solid fa-xmark text-[10px]"></i>Delete
                            </button>
                        </div>
                    </div>
                    <div class="app-link flex flex-col items-center w-full cursor-pointer" tabindex="0" role="link" title="${app.title}">
                        <div class="w-12 h-12 rounded-2xl ${app.color} flex items-center justify-center text-xl mb-1.5 group-hover:scale-105 transition-transform shadow-xs">
                            ${appIconHTML(app)}
                        </div>
                        <span class="text-xs font-medium text-gray-700 dark:text-gray-300 truncate w-full px-1 text-center"><span class="marq">${app.title}</span></span>
                    </div>
                `;



                // Shortcut open (div-based: no native link drag, same gestures)
                const linkEl = appCard.querySelector('.app-link');
                linkEl.addEventListener('click', () => {
                    window.open(app.url, '_blank', 'noopener');
                });
                linkEl.addEventListener('auxclick', (e) => {
                    if (e.button === 1) {
                        e.preventDefault();
                        window.open(app.url, '_blank', 'noopener');
                    }
                });
                linkEl.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        window.open(app.url, '_blank', 'noopener');
                    }
                });

                // Drag and Drop Events (lifted card + highlighted drop target)
                function clearDropTargets() {
                    document.querySelectorAll('#appsGrid .drop-target').forEach((el) => {
                        el.classList.remove('drop-target', 'ring-2', 'ring-google-blue/60', 'bg-google-blue/10', 'scale-105');
                    });
                }

                appCard.addEventListener('dragstart', (e) => {
                    draggedIndex = index;
                    closeCardMenus();
                    appCard.classList.add('opacity-60', 'scale-110', 'shadow-float', 'ring-2', 'ring-google-blue/40', 'z-10');
                    e.dataTransfer.effectAllowed = 'move';
                    try { e.dataTransfer.setData('text/plain', String(index)); } catch (err) {}
                });

                appCard.addEventListener('dragend', () => {
                    appCard.classList.remove('opacity-60', 'scale-110', 'shadow-float', 'ring-2', 'ring-google-blue/40', 'z-10');
                    draggedIndex = null;
                    clearDropTargets();
                });

                appCard.addEventListener('dragenter', (e) => {
                    e.preventDefault();
                    if (draggedIndex === null || draggedIndex === index) return;
                    clearDropTargets();
                    appCard.classList.add('drop-target', 'ring-2', 'ring-google-blue/60', 'bg-google-blue/10', 'scale-105');
                });

                appCard.addEventListener('dragleave', () => {
                    appCard.classList.remove('drop-target', 'ring-2', 'ring-google-blue/60', 'bg-google-blue/10', 'scale-105');
                });

                appCard.addEventListener('dragover', (e) => {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = 'move';
                });

                appCard.addEventListener('drop', (e) => {
                    e.preventDefault();
                    clearDropTargets();
                    if (draggedIndex !== null && draggedIndex !== index) {
                        const draggedItem = state.apps.splice(draggedIndex, 1)[0];
                        state.apps.splice(index, 0, draggedItem);
                        renderApps();
                    }
                });

                appsGrid.appendChild(appCard);
            });
            requestAnimationFrame(() => { if (typeof paintMarquee === 'function') paintMarquee(); });
        }

        renderApps();

        // Add / Edit Shortcut Modal
        let editingAppId = null;

        const PREVIEW_BASE = 'w-9 h-9 rounded-xl border border-gray-200 dark:border-white/10 flex items-center justify-center text-lg overflow-hidden shrink-0 ';
        function paintIconPreview() {
            const prev = document.getElementById('appIconPreview');
            const hidden = document.getElementById('appIconInput');
            const colorHidden = document.getElementById('appColorInput');
            const val = (hidden ? hidden.value : '').trim() || 'fa-solid fa-globe';
            const color = (colorHidden ? colorHidden.value : '').trim() || 'bg-blue-50 text-[#1a73e8] dark:bg-blue-950/40';
            if (!prev) return;
            prev.className = PREVIEW_BASE + color;
            if (val.indexOf('iconify:') === 0) {
                const parts = val.split(':');
                prev.innerHTML = '<img src="https://api.iconify.design/' + parts[1] + '/' + parts.slice(2).join(':') + '.svg" alt="" class="w-5 h-5 object-contain dark:invert">';
            } else {
                prev.innerHTML = '<i class="' + val + '"></i>';
            }
        }

        function appIconHTML(app) {
            const ic = (app && app.icon ? app.icon : 'fa-solid fa-globe').trim();
            if (ic.indexOf('iconify:') === 0) {
                const parts = ic.split(':');
                return '<img src="https://api.iconify.design/' + parts[1] + '/' + parts.slice(2).join(':') + '.svg" alt="" class="w-6 h-6 object-contain dark:invert">';
            }
            return '<i class="' + ic + '"></i>';
        }

        function openAddAppModal(app) {
            editingAppId = (app && app.id) || null;
            const titleEl = document.getElementById('addAppTitle');
            const subEl = document.getElementById('addAppSubmit');
            if (titleEl) titleEl.textContent = editingAppId ? 'Edit shortcut' : 'Add shortcut';
            if (subEl) subEl.textContent = editingAppId ? 'Save' : 'Add shortcut';
            appTitleInput.value = app ? app.title : '';
            appUrlInput.value = app ? app.url : '';
            const hidden = document.getElementById('appIconInput');
            if (hidden) hidden.value = app ? app.icon : 'fa-solid fa-globe';
            const s = document.getElementById('appIconSearch');
            if (s) s.value = '';
            const r = document.getElementById('appIconResults');
            if (r) { r.innerHTML = ''; r.classList.add('hidden'); }
            const hc = document.getElementById('appColorInput');
            if (hc) hc.value = (app && app.color) ? app.color : 'bg-blue-50 text-[#1a73e8] dark:bg-blue-950/40';
            paintColorRow();
            paintIconPreview();
            addAppModal.classList.remove('opacity-0', 'pointer-events-none');
        }

        function closeAddAppModal() {
            editingAppId = null;
            addAppModal.classList.add('opacity-0', 'pointer-events-none');
            addAppForm.reset();
        }

        openAddAppBtn.addEventListener('click', () => openAddAppModal(null));
        closeAddAppBtn.addEventListener('click', closeAddAppModal);
        cancelAddAppBtn.addEventListener('click', closeAddAppModal);

        addAppForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const title = appTitleInput.value.trim();
            const url = appUrlInput.value.trim();
            const icon = appIconInput.value.trim() || 'fa-solid fa-globe';
            const colorEl = document.getElementById('appColorInput');
            const color = (colorEl ? colorEl.value : '').trim() || 'bg-blue-50 text-[#1a73e8] dark:bg-blue-950/40';

            if (title && url) {
                if (editingAppId) {
                    const it = state.apps.find((a) => a.id === editingAppId);
                    if (it) { it.title = title; it.url = url; it.icon = icon; it.color = color; }
                } else {
                    state.apps.push({
                        id: Date.now().toString(),
                        title,
                        url,
                        icon,
                        color
                    });
                }
                editingAppId = null;
                renderApps();
                closeAddAppModal();
            }
        });

        function openVoiceModal() {
            voiceModal.classList.remove('opacity-0', 'pointer-events-none');
            voiceStatusText.textContent = "Listening...";

            // Simulate Web Speech Recognition
            if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
                const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
                const recognition = new SpeechRecognition();
                recognition.onresult = (event) => {
                    const transcript = event.results[0][0].transcript;
                    searchInput.value = transcript;
                    closeVoiceModal();
                    searchForm.dispatchEvent(new Event('submit'));
                };
                recognition.start();
            } else {
                // Fallback simulation delay
                setTimeout(() => {
                    voiceStatusText.textContent = "Try saying 'Google News'";
                }, 2000);
            }
        }

        function closeVoiceModal() {
            voiceModal.classList.add('opacity-0', 'pointer-events-none');
        }

        voiceSearchBtn.addEventListener('click', openVoiceModal);
        closeVoiceBtn.addEventListener('click', closeVoiceModal);

        function openSettings() {
            if (settingsModal) settingsModal.classList.remove('opacity-0', 'pointer-events-none');
        }

        function closeSettings() {
            closeTimePicker();
            if (settingsModal) settingsModal.classList.add('opacity-0', 'pointer-events-none');
        }

        if (settingsBtn) settingsBtn.addEventListener('click', openSettings);
        if (infoBtn) infoBtn.addEventListener('click', openAbout);
        if (closeSettingsBtn) closeSettingsBtn.addEventListener('click', closeSettings);


        // Temperature Unit Switcher
        function setTemperatureUnit(isC) {
            state.isCelsius = isC;
            if (isC) {
                weatherTemp.textContent = `${state.tempC}°C`;
                unitC.className = "px-2.5 py-1 rounded-md bg-white dark:bg-white/10 text-gray-800 dark:text-white shadow-xs font-semibold";
                unitF.className = "px-2.5 py-1 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white";
            } else {
                const tempF = Math.round((state.tempC * 9/5) + 32);
                weatherTemp.textContent = `${tempF}°F`;
                unitF.className = "px-2.5 py-1 rounded-md bg-white dark:bg-white/10 text-gray-800 dark:text-white shadow-xs font-semibold";
                unitC.className = "px-2.5 py-1 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white";
            }
        }

        unitC.addEventListener('click', () => setTemperatureUnit(true));
        unitF.addEventListener('click', () => setTemperatureUnit(false));

        // Keyboard Shortcut: Focus search input (rebindable binding + quick slash key)
        document.addEventListener('keydown', (e) => {
            if ((e.key === '/' || (e.ctrlKey && e.key === 'k')) && document.activeElement !== searchInput && !gaidridTyping() && !gaidridModalOpen()) {
                e.preventDefault();
                searchInput.focus();
            }
        });

/* ---- Gaidrid additions: config override + persistence ---- */
(function gaidridInit() {
  var cfg = window.GaidridConfig || {};
  try {
    if (cfg.engines) Object.assign(engineConfig, cfg.engines);
    if (Array.isArray(cfg.extraCities) && cfg.extraCities.length && typeof popularCities !== 'undefined') {
      for (const c of cfg.extraCities) if (!popularCities.includes(c)) popularCities.push(c);
    }
    if (cfg.defaults) Object.assign(state, cfg.defaults);
  } catch (e) { console.warn('GaidridConfig override failed:', e); }

  const KEY = 'gaidrid-prefs-v1';
  const hasChromeStorage = typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local;
  const syncStore = (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) || null;
  /* chrome.storage.sync caps (8KB/item, 100KB total): bulky/ephemeral keys
     (notes, read history, transient view offsets) stay local-only; everything
     the UI treats as a setting syncs across devices. */
  const SYNC_KEYS = ['use24Hour', 'showSeconds', 'showDate', 'showGreeting', 'showWeather', 'showCondition',
    'weatherLocation', 'isCelsius', 'userName', 'useGeolocation', 'geoLat', 'geoLon', 'geoAt',
    'history', 'showTopSites', 'themeMode', 'accent', 'autoNight', 'autoNightStart', 'autoNightEnd',
    'sportsLeague', 'sportsFav', 'sportsAuto', 'sportsShowFinished', 'pomoNotify',
    'newsFeeds', 'newsAuto', 'newsFilter', 'newsFontStep',
    'searchEngine', 'searchMode', 'apps', 'dark'];
  const mem = {
    get: (k) => new Promise((res) => {
      const fromLocal = (cb) => {
        if (hasChromeStorage) chrome.storage.local.get(k, (r) => cb(r && r[k]));
        else { try { cb(JSON.parse(localStorage.getItem(k) || 'null')); } catch (e) { cb(null); } }
      };
      if (syncStore) {
        try { syncStore.get(k, (r) => {
          if (chrome.runtime && chrome.runtime.lastError) fromLocal((v) => res(v));
          else fromLocal((v) => {
            const merged = Object.assign({}, v || {}, (r && r[k]) || {});
            res(Object.keys(merged).length ? merged : null);
          });
        }); } catch (e) { fromLocal((v) => res(v)); }
      } else fromLocal((v) => res(v));
    }),
    set: (obj) => new Promise((res) => {
      try { for (const k of Object.keys(obj)) { try { localStorage.setItem(k, JSON.stringify(obj[k])); } catch (e) {} } } catch (e) {}
      const toLocal = () => {
        if (hasChromeStorage) chrome.storage.local.set(obj, () => res());
        else { try { for (const k of Object.keys(obj)) localStorage.setItem(k, JSON.stringify(obj[k])); } catch (e) {} res(); }
      };
      if (syncStore) {
        const sub = {};
        SYNC_KEYS.forEach((k) => { if (obj[k] !== undefined) sub[k] = obj[k]; });
        try { syncStore.set(sub, () => {
          if (chrome.runtime && chrome.runtime.lastError) toLocal();
          else if (hasChromeStorage) chrome.storage.local.set(obj, () => res());
          else res();
        }); } catch (e) { toLocal(); }
      } else toLocal();
    })
  };
  function collect() {
    return {
      use24Hour: state.use24Hour, showSeconds: state.showSeconds, showDate: state.showDate,
      showGreeting: state.showGreeting, showWeather: state.showWeather, showCondition: state.showCondition,
      weatherLocation: state.weatherLocation, isCelsius: state.isCelsius,
      userName: state.userName, useGeolocation: state.useGeolocation,
      geoLat: state.geoLat, geoLon: state.geoLon, geoAt: state.geoAt,
      notes: state.notes,
      history: state.history, showTopSites: state.showTopSites,
      themeMode: state.themeMode,
      accent: state.accent, autoNight: state.autoNight,
      autoNightStart: state.autoNightStart, autoNightEnd: state.autoNightEnd,
      sportsLeague: state.sportsLeague, sportsDay: state.sportsDay,
      sportsFav: state.sportsFav, sportsAuto: state.sportsAuto, sportsShowFinished: state.sportsShowFinished,
      pomoNotify: state.pomoNotify,
      newsFeeds: state.newsFeeds, newsAuto: state.newsAuto,
      newsRead: state.newsRead, newsFilter: state.newsFilter, newsFontStep: state.newsFontStep,
      searchEngine: state.searchEngine, searchMode: state.searchMode, apps: state.apps,
      dark: document.documentElement.classList.contains('dark')
    };
  }
  function persistNow() { mem.set({ [KEY]: collect() }).catch(() => {}); }
  // ponytail: interval snapshot instead of patching every handler; per-action save if measurable loss
  setInterval(() => { try { persistNow(); } catch (e) {} }, 5000);
  window.addEventListener('beforeunload', persistNow);
  document.addEventListener('visibilitychange', () => { if (document.hidden) persistNow(); });
  window.GaidridSave = function queueSave() { persistNow(); };
  window.GaidridCollect = collect;

  mem.get(KEY).then((p) => {
    if (!p) { if (typeof applyTheme === 'function') applyTheme(); if (typeof showOnboarding === 'function') showOnboarding(); return; }
    try {
      const live = { tempC: state.tempC, weatherCode: state.weatherCode, isDay: state.isDay, suggestions: state.suggestions };
      Object.assign(state, p, live);
      if (!state.themeMode && typeof p.dark === 'boolean') state.themeMode = p.dark ? 'dark' : 'light';
      migrateSportsFavs();
      if (typeof applyTheme === 'function') applyTheme();
      if (state.searchEngine && engineConfig[state.searchEngine]) setSearchEngine(state.searchEngine, true);
      if (state.searchMode) setSearchMode(state.searchMode, true);
      if (typeof migrateTileIcons === 'function') migrateTileIcons();
      if (typeof renderApps === 'function') renderApps();
      const wl = document.getElementById('weatherLocationInput');
      if (wl && state.weatherLocation) wl.value = state.weatherLocation;
      if (typeof syncSettingsUI === 'function') syncSettingsUI();
      if (typeof renderTopSites === 'function') renderTopSites();
      if (typeof fetchLiveWeather === 'function') fetchLiveWeather(state.weatherLocation || 'Cairo');
      refreshSportsHome();
      refreshNewsHome();
      try { if (searchInput) searchInput.focus({ preventScroll: true }); } catch (e) {}
    } catch (e) { console.warn('Gaidrid restore failed:', e); }
  });
})();

/* ---- Gaidrid P0/P1: settings sync, keyboard, geo weather, locale wiring ---- */
function paintToggle(btn, circle, on) {
  circle.style.transform = on ? 'translateX(24px)' : 'translateX(0px)';
  btn.className = on ? 'w-12 h-6 bg-google-blue rounded-full p-1 transition-colors relative shrink-0'
    : 'w-12 h-6 bg-gray-200 dark:bg-white/10 rounded-full p-1 transition-colors relative shrink-0';
}

/* Engine bang cheat-sheet: "!yt" rows fill the input instead of searching. */

function paintAccents() {
  const cur = state.accent || 'blue';
  document.querySelectorAll('#accentSwatches [data-accent]').forEach((b) => {
    const on = b.getAttribute('data-accent') === cur;
    b.classList.toggle('outline', on);
    b.classList.toggle('outline-2', on);
    b.classList.toggle('outline-offset-2', on);
    b.classList.toggle('outline-gray-400', on);
    b.classList.toggle('dark:outline-white/70', on);
  });
}

/* ---- Custom night-schedule time picker helpers ---- */
let timePickTarget = null; // 'autoNightStart' | 'autoNightEnd' while the picker is open

function fmtNightTime(hhmm) {
  const p = String(hhmm || '00:00').split(':');
  const h = parseInt(p[0], 10) || 0;
  const m = (p[1] || '00').slice(-2).padStart(2, '0');
  if (state.use24Hour) return (h < 10 ? '0' + h : h) + ':' + m;
  return (h % 12 || 12) + ':' + m + (h >= 12 ? ' PM' : ' AM');
}

function updateTimeButtons() {
  const s = document.getElementById('autoNightStartLabel');
  if (s) s.textContent = fmtNightTime(state.autoNightStart || '22:00');
  const e = document.getElementById('autoNightEndLabel');
  if (e) e.textContent = fmtNightTime(state.autoNightEnd || '07:00');
}

function paintTimePicker() {
  const panel = document.getElementById('timePickerPanel');
  if (!panel || panel.classList.contains('hidden') || !timePickTarget) return;
  const hhmm = state[timePickTarget] || (timePickTarget === 'autoNightEnd' ? '07:00' : '22:00');
  const p = hhmm.split(':');
  const h = parseInt(p[0], 10);
  const m = parseInt(p[1], 10);
  const title = document.getElementById('timePickerTitle');
  if (title) title.textContent = timePickTarget === 'autoNightEnd' ? 'Ends' : 'Starts';
  const preview = document.getElementById('timePickerPreview');
  if (preview) preview.textContent = fmtNightTime(hhmm);
  document.querySelectorAll('#timePickerHours [data-h]').forEach((b) => b.classList.toggle('time-pick-on', +b.getAttribute('data-h') === h));
  document.querySelectorAll('#timePickerMinutes [data-m]').forEach((b) => b.classList.toggle('time-pick-on', +b.getAttribute('data-m') === m));
}

function closeTimePicker() {
  const panel = document.getElementById('timePickerPanel');
  if (!panel || panel.classList.contains('hidden')) return false;
  panel.classList.add('hidden');
  timePickTarget = null;
  ['autoNightStartBtn', 'autoNightEndBtn'].forEach((id) => {
    const b = document.getElementById(id);
    if (b) b.setAttribute('aria-expanded', 'false');
  });
  return true;
}

function syncSettingsUI() {
  paintToggle(clockFormatBtn, clockToggleCircle, state.use24Hour);
  paintToggle(showSecondsBtn, secondsToggleCircle, state.showSeconds);
  paintToggle(showDateBtn, dateToggleCircle, state.showDate);
  paintToggle(showGreetingBtn, greetingToggleCircle, state.showGreeting);
  paintToggle(showWeatherBtn, weatherToggleCircle, state.showWeather);
  paintToggle(showConditionBtn, conditionToggleCircle, state.showCondition);
  const geoBtn = document.getElementById('useGeoBtn');
  if (geoBtn) paintToggle(geoBtn, document.getElementById('geoToggleCircle'), !!state.useGeolocation);
  const stb = document.getElementById('showTopBtn');
  if (stb) paintToggle(stb, document.getElementById('showTopCircle'), state.showTopSites !== false);
  const ww = document.getElementById('weatherWidget');
  if (ww) ww.classList.toggle('hidden', !state.showWeather);
  const wc = document.getElementById('weatherCondition');
  if (wc) wc.classList.toggle('hidden', !state.showCondition);
  const un = document.getElementById('userNameInput');
  if (un && un.value !== (state.userName || '')) un.value = state.userName || '';
  syncNotesArea();
  if (typeof setTemperatureUnit === 'function') setTemperatureUnit(!!state.isCelsius);
  paintThemeSeg();
  paintAccents();
  const anb = document.getElementById('autoNightBtn');
  if (anb) paintToggle(anb, document.getElementById('autoNightCircle'), !!state.autoNight);
  const pnb = document.getElementById('pomoNotifyBtn');
  if (pnb) paintToggle(pnb, document.getElementById('pomoNotifyCircle'), !!state.pomoNotify);
  const ant = document.getElementById('autoNightTimes');
  if (ant) { ant.classList.toggle('hidden', !state.autoNight); ant.classList.toggle('flex', !!state.autoNight); }
  updateTimeButtons();
  if (window.repaintTimePicker) window.repaintTimePicker();
  paintSportsSettings();
  paintNewsSettings();
  updateClock();
}

function fetchByCoords(latitude, longitude) {
  fetch('https://api.open-meteo.com/v1/forecast?latitude=' + latitude + '&longitude=' + longitude + '&current_weather=true')
    .then((weatherRes) => weatherRes.json())
    .then((weatherData) => {
      if (weatherData && weatherData.current_weather) {
        const current = weatherData.current_weather;
        state.tempC = Math.round(current.temperature);
        state.weatherCode = current.weathercode;
        state.isDay = typeof current.is_day !== 'undefined' ? current.is_day : 1;
        const wLoc = document.getElementById('weatherLocation');
        if (wLoc) {
          wLoc.textContent = 'Current location •';
          wLoc.classList.remove('hidden');
        }
        updateWeatherUI();
      }
    })
    .catch((err) => { console.error('Failed to fetch weather:', err); });
}

function fetchGeoWeather(userInitiated) {
  const FRESH_MS = 6 * 60 * 60 * 1000;
  // Fresh cache: never touch the browser API (no prompts, ever)
  if (state.geoLat !== null && state.geoLon !== null && Date.now() - (state.geoAt || 0) < FRESH_MS) {
    fetchByCoords(state.geoLat, state.geoLon);
    return;
  }
  // Passive paths (page load / auto-refresh / tab switch): silent city fallback
  if (!userInitiated) {
    fetchLiveWeather(state.weatherLocation || 'Cairo', true);
    return;
  }
  if (typeof navigator === 'undefined' || !navigator.geolocation) {
    fetchLiveWeather(state.weatherLocation || 'Cairo', true);
    return;
  }
  navigator.geolocation.getCurrentPosition((pos) => {
    state.geoLat = pos.coords.latitude;
    state.geoLon = pos.coords.longitude;
    state.geoAt = Date.now();
    fetchByCoords(state.geoLat, state.geoLon);
  }, (err) => {
    // Denied once: respect it, switch the feature off instead of nagging
    if (err && err.code === 1) {
      state.useGeolocation = false;
      state.geoLat = null;
      state.geoLon = null;
      if (typeof syncSettingsUI === 'function') syncSettingsUI();
    }
    fetchLiveWeather(state.weatherLocation || 'Cairo', true);
  }, { maximumAge: FRESH_MS, timeout: 8000 });
}

(function gaidridP1() {
  const un = document.getElementById('userNameInput');
  if (un) {
    if (state.userName) un.value = state.userName;
    un.addEventListener('input', (e) => { state.userName = e.target.value; updateClock(); });
  }
  const geoBtn = document.getElementById('useGeoBtn');
  if (geoBtn) geoBtn.addEventListener('click', () => {
    state.useGeolocation = !state.useGeolocation;
    paintToggle(geoBtn, document.getElementById('geoToggleCircle'), state.useGeolocation);
    if (state.useGeolocation) fetchGeoWeather(true);
    else fetchLiveWeather(state.weatherLocation || 'Cairo', true);
  });

  // Global Escape: closes drawer, modals, suggestions
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    suggestionsBox.classList.add('hidden');
    if (typeof citySuggestionsBox !== 'undefined' && citySuggestionsBox) citySuggestionsBox.classList.add('hidden');
    suggActive = -1;
    // Esc closes the time picker first, before the settings panel itself.
    if (closeTimePicker()) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      return;
    }
    closeDrawer(); closeSettings(); closeAddAppModal(); closeVoiceModal(); closeAbout(); closeNotes(); hideOnboarding(); closePomo(); closeSports(); closeNews(); closeCardMenus();
    if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
  });

  // Suggestion keyboard nav: ArrowUp/ArrowDown/Enter in search suggestions
  searchInput.addEventListener('keydown', (e) => {
    const items = document.querySelectorAll('.suggestion-item');
    if (suggestionsBox.classList.contains('hidden') || !items.length || gaidridModalOpen()) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      suggActive = (suggActive + 1) % items.length;
      paintSuggActive();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      suggActive = (suggActive - 1 + items.length) % items.length;
      paintSuggActive();
    } else if (e.key === 'Enter' && suggActive >= 0) {
      e.preventDefault();
      const el = items[suggActive];
      if (el.getAttribute && el.getAttribute('data-bang')) { fillBang(el.getAttribute('data-bang')); return; }
      const raw = el.querySelector('span').textContent;
      const act = el.getAttribute('data-act');
      if (act === 'calc') {
        searchInput.value = raw.slice(2);
        suggestionsBox.classList.add('hidden');
        return;
      }
      const cleaned = raw.replace(' - Search ' + suggEngineName(), '');
      if (act === 'search' && isUrlLike(cleaned)) forceSearchOnce = true;
      searchInput.value = cleaned;
      searchForm.dispatchEvent(new Event('submit'));
    }
  });
})();

/* ---- Smooth watermark crossfade (img keeps Tailwind transition-all duration-500) ---- */
let wmTimer = null;
let wmSeq = 0;
function swapWatermark(img, src, alt) {
  if (!img) return;
  if (img.getAttribute('src') === src) {
    img.alt = alt;
    img.style.opacity = '';
    return;
  }
  const seq = ++wmSeq;
  clearTimeout(wmTimer);
  const pre = new Image();
  let done = false;
  const go = () => {
    if (done || seq !== wmSeq) return;
    done = true;
    img.style.opacity = '0';
    wmTimer = setTimeout(() => {
      if (seq !== wmSeq) return;
      img.src = src;
      img.alt = alt;
      img.style.opacity = '';
    }, 300);
  };
  pre.onload = go;
  pre.onerror = go;
  pre.src = src;
  setTimeout(go, 1200);
}

/* ---- Offline mode: hide search + top sites + sports button, center the dino game, dino watermark ---- */
function warmThemeRaster() {
  if (warmThemeRaster._done) return;
  const root = document.documentElement;
  const body = document.body;
  if (!body) return;
  warmThemeRaster._done = true;
  const cur = root.classList.contains('dark');
  const flip = (val) => {
    root.classList.toggle('dark', val);
    try {
      const fd = document.getElementById('dinoFrame').contentDocument;
      if (fd && fd.documentElement) fd.documentElement.classList.toggle('gaidrid-dark', val);
    } catch (e) {}
  };
  // mask one warm-up cycle in a deep dip: first moon flip then pays warm ~80ms, not cold ~240ms
  body.style.animation = 'gaidrid-theme-warm 0.5s ease';
  setTimeout(() => { body.style.animation = ''; }, 550);
  setTimeout(() => {
    flip(!cur);
    setTimeout(() => flip(cur), 80);
  }, 180);
}
function applyOfflineMode(off) {
  if (off === offlineMode) return;
  offlineMode = off;
  if (off) dinoMoon = null;
  document.documentElement.classList.toggle('offline-mode', off);
  applyTheme();
  const frame = document.getElementById('dinoFrame');
  if (off) {
    warmThemeRaster();
    if (frame) {
      if (!frame.getAttribute('src')) {
        frame.setAttribute('src', 'offline-game.html');
        frame.addEventListener('load', () => {
          observeDinoMoon();
          try { frame.contentWindow.focus(); } catch (e) {}
        }, { once: true });
      } else {
        observeDinoMoon();
        try { frame.contentWindow.focus(); } catch (e) {}
      }
    }
    if (bgWatermarkImg) {
      swapWatermark(bgWatermarkImg, 'assets/dino.svg', 'Offline');
      dinoWatermark = true;
    }
  } else if (dinoWatermark && bgWatermarkImg) {
    const icons = (window.GaidridConfig && window.GaidridConfig.engineIcons) || {};
    const eng = engineConfig[state.searchEngine] || engineConfig.google;
    swapWatermark(bgWatermarkImg,
      icons[state.searchEngine] || ('assets/engines/' + state.searchEngine + '.svg'),
      eng.name);
    dinoWatermark = false;
  }
}
window.addEventListener('offline', () => applyOfflineMode(true));
window.addEventListener('online', () => applyOfflineMode(false));
applyOfflineMode(!navigator.onLine);

/* ---- About modal (logo-first) ---- */
function openAbout() {
  const m = document.getElementById('aboutModal');
  if (m) m.classList.remove('opacity-0', 'pointer-events-none');
}
function closeAbout() {
  const m = document.getElementById('aboutModal');
  if (m) m.classList.add('opacity-0', 'pointer-events-none');
}
(function gaidridAbout() {
  const c = document.getElementById('closeAboutBtn');
  if (c) c.addEventListener('click', closeAbout);
})();

/* ---- Gaidrid features: history, top sites, backup, notes, onboarding ---- */
function pushHistory(q) {
  q = (q || '').trim();
  if (!q) return;
  state.history = state.history || [];
  state.history = [q].concat(state.history.filter(function (h) { return h.toLowerCase() !== q.toLowerCase(); })).slice(0, 15);
}

function renderTopSites() {
  const wrapEl = document.getElementById('topSitesWrap');
  if (wrapEl && !state.showTopSites) { wrapEl.classList.add('hidden'); return; }
  try {
    if (typeof chrome !== 'undefined' && chrome.permissions && chrome.permissions.contains) {
      chrome.permissions.contains({ permissions: ['topSites'] }, (ok) => {
        if (chrome.runtime && chrome.runtime.lastError) {
          const w = document.getElementById('topSitesWrap');
          if (w) w.classList.add('hidden');
          return;
        }
        if (ok) renderTopSitesGranted();
        else showTopSitesEnable();
      });
      return;
    }
  } catch (e) {}
  renderTopSitesGranted();
}
function showTopSitesEnable() {
  const wrap = document.getElementById('topSitesWrap');
  const grid = document.getElementById('topSitesGrid');
  const btn = document.getElementById('topSitesEnable');
  if (!wrap) return;
  if (grid) grid.classList.add('hidden');
  if (btn) btn.classList.remove('hidden');
  wrap.classList.remove('hidden');
}
function renderTopSitesGranted() {
  const wrap = document.getElementById('topSitesWrap');
  const grid = document.getElementById('topSitesGrid');
  if (!wrap || !grid) return;
  grid.classList.remove('hidden');
  const en = document.getElementById('topSitesEnable');
  if (en) en.classList.add('hidden');
  if (!state.showTopSites || typeof chrome === 'undefined' || !chrome.topSites) { wrap.classList.add('hidden'); return; }
  try {
    chrome.topSites.get(function (sites) {
      const list = (sites || []).slice(0, 8);
      if (!list.length) { wrap.classList.add('hidden'); return; }
      grid.innerHTML = list.map(topTileHTML).join('');
      grid.querySelectorAll('img[data-fav]').forEach((img) => {
        const showLetter = () => {
          const box = img.parentElement;
          const l = box ? box.querySelector('[data-letter]') : null;
          if (l) l.classList.remove('hidden');
          img.remove();
        };
        if (img.complete && img.naturalWidth === 0) showLetter();
        else img.addEventListener('error', showLetter);
      });
      wrap.classList.remove('hidden');
      requestAnimationFrame(() => {
        if (typeof paintMarquee === 'function') paintMarquee();
      });
      setTimeout(() => { if (typeof paintMarquee === 'function') paintMarquee(); }, 800);
    });
  } catch (e) { wrap.classList.add('hidden'); }
}

function openNotes() { const m = document.getElementById('notesModal'); if (m) m.classList.remove('opacity-0', 'pointer-events-none'); }
function closeNotes() { const m = document.getElementById('notesModal'); if (m) m.classList.add('opacity-0', 'pointer-events-none'); }
function syncNotesArea() {
  const na = document.getElementById('notesArea');
  if (na && (state.notes || '') !== na.value) na.value = state.notes || '';
}
function showOnboarding() { const m = document.getElementById('onboardModal'); if (m) m.classList.remove('opacity-0', 'pointer-events-none'); }
function hideOnboarding() { const m = document.getElementById('onboardModal'); if (m) m.classList.add('opacity-0', 'pointer-events-none'); }

(function gaidridFeatures() {
  const showTopBtn = document.getElementById('showTopBtn');
  if (showTopBtn) showTopBtn.addEventListener('click', () => {
    const turnOn = !state.showTopSites;
    const applyTop = (on) => {
      state.showTopSites = on;
      paintToggle(showTopBtn, document.getElementById('showTopCircle'), state.showTopSites);
      renderTopSites();
    };
    try {
      if (turnOn && typeof chrome !== 'undefined' && chrome.permissions && chrome.permissions.request) {
        chrome.permissions.request({ permissions: ['topSites'] }, (granted) => {
          if (chrome.runtime && chrome.runtime.lastError) granted = false;
          applyTop(!!granted);
        });
        return;
      }
      if (!turnOn && typeof chrome !== 'undefined' && chrome.permissions && chrome.permissions.remove) {
        try { chrome.permissions.remove({ permissions: ['topSites'] }); } catch (e) {}
      }
    } catch (e) {}
    applyTop(turnOn);
  });
  renderTopSites();

  const topEn = document.getElementById('topSitesEnable');
  if (topEn) topEn.addEventListener('click', () => {
    try {
      chrome.permissions.request({ permissions: ['topSites'] }, () => {
        void (chrome.runtime && chrome.runtime.lastError);
        renderTopSites();
      });
    } catch (e) { renderTopSites(); }
  });

  const notesBtn = document.getElementById('notesBtn');
  if (notesBtn) notesBtn.addEventListener('click', () => { syncNotesArea(); openNotes(); });
  const cn = document.getElementById('closeNotesBtn');
  if (cn) cn.addEventListener('click', closeNotes);
  let notesT = null;
  const na = document.getElementById('notesArea');
  const ns = document.getElementById('notesSaved');
  if (na) {
    if (state.notes) na.value = state.notes;
    na.addEventListener('input', () => {
      state.notes = na.value;
      if (ns) ns.textContent = 'Saving...';
      clearTimeout(notesT);
      notesT = setTimeout(() => { if (window.GaidridSave) window.GaidridSave(); if (ns) ns.textContent = 'Saved automatically'; }, 600);
    });
  }

  const od = document.getElementById('onboardDoneBtn');
  if (od) od.addEventListener('click', () => { hideOnboarding(); if (window.GaidridSave) window.GaidridSave(); searchInput.focus(); });
})();

/* ---- Splash screen: hide after load (click skips, failsafe removes) ---- */
(function gaidridSplash() {
  const hide = () => {
    const s = document.getElementById('splash');
    if (!s || s.classList.contains('hide')) return;
    s.classList.add('hide');
    setTimeout(() => { const el = document.getElementById('splash'); if (el) el.remove(); }, 600);
  };
  const sp = document.getElementById('splash');
  if (sp) sp.addEventListener('click', hide);
  window.addEventListener('load', () => setTimeout(hide, 900));
  setTimeout(hide, 3000);
})();

/* ---- Instant answers: offline calculator (no eval; recursive-descent parser) ---- */
function tryCalc(q) {
  const expr = String(q || '').trim().replace(/,/g, '');
  if (!expr || !/[0-9)]/.test(expr) || !/[+\-*/%^]/.test(expr)) return null;
  if (!/^[0-9+\-*/%^().\s]+$/.test(expr)) return null;
  try {
    const toks = [];
    const re = /\s*(\d+\.?\d*|\.\d+|[+\-*/%^()])\s*/g;
    let m;
    let len = 0;
    while ((m = re.exec(expr)) !== null) { toks.push(m[1]); len += m[0].length; }
    if (!toks.length || len !== expr.length) return null;
    let p = 0;
    const peek = () => toks[p];
    function parseE() {
      let v = parseT();
      while (peek() === '+' || peek() === '-') { const op = toks[p++]; const r = parseT(); v = op === '+' ? v + r : v - r; }
      return v;
    }
    function parseT() {
      let v = parseF();
      while (peek() === '*' || peek() === '/' || peek() === '%') {
        const op = toks[p++];
        const r = parseF();
        if (op === '*') v *= r;
        else if (op === '/') { if (r === 0) return NaN; v /= r; }
        else v %= r;
      }
      return v;
    }
    function parseF() {
      let neg = false;
      while (peek() === '+' || peek() === '-') { if (peek() === '-') neg = !neg; p++; }
      let v = parseP();
      if (peek() === '^') { p++; v = Math.pow(v, parseF()); }
      return neg ? -v : v;
    }
    function parseP() {
      const t = toks[p++];
      if (t === '(') { const v = parseE(); if (toks[p++] !== ')') throw new Error('paren'); return v; }
      const n = parseFloat(t);
      if (isNaN(n)) throw new Error('num');
      return n;
    }
    const v = parseE();
    if (p !== toks.length || typeof v !== 'number' || isNaN(v) || !isFinite(v)) return null;
    return fmtNum(v);
  } catch (e) { return null; }
}
function fmtNum(v) {
  if (Object.is(v, -0)) v = 0;
  return parseFloat(v.toPrecision(10)).toString();
}

/* ---- Pomodoro (25 focus / 5 break, silent) ---- */
const POMO_FOCUS = 25 * 60;
const POMO_BREAK = 5 * 60;
let pomoMode = 'focus';
let pomoLeft = POMO_FOCUS;
let pomoOn = false;
let pomoTimer = null;
function pomoPaint() {
  const t = document.getElementById('pomoTime');
  const l = document.getElementById('pomoLabel');
  const ic = document.getElementById('pomoToggleIcon');
  const tb = document.getElementById('pomoToggle');
  if (t) t.textContent = String(Math.floor(pomoLeft / 60)).padStart(2, '0') + ':' + String(pomoLeft % 60).padStart(2, '0');
  if (l) l.textContent = pomoMode === 'focus' ? 'Focus' : 'Break';
  if (ic) ic.className = pomoOn ? 'fa-solid fa-pause text-[10px]' : 'fa-solid fa-play text-[10px]';
  if (tb) tb.title = pomoOn ? 'Pause timer' : 'Start focus timer';
}
function pomoTick() {
  if (pomoLeft > 0) { pomoLeft--; pomoPaint(); return; }
  pomoMode = pomoMode === 'focus' ? 'break' : 'focus';
  pomoLeft = pomoMode === 'focus' ? POMO_FOCUS : POMO_BREAK;
  pomoPaint();
  pomoNotifyDone(pomoMode === 'break' ? 'Focus done — take a break' : 'Break over — back to focus');
}
/* Timer-end notification: optional permission, asked once at toggle time. */
function hasNotifyPerm() {
  return new Promise((res) => {
    if (typeof chrome === 'undefined' || !chrome.notifications || !chrome.permissions || !chrome.permissions.contains) { res(true); return; }
    try { chrome.permissions.contains({ permissions: ['notifications'] }, (g) => res(!!g)); } catch (e) { res(false); }
  });
}
function ensureNotifyPerm() {
  return hasNotifyPerm().then((g) => {
    if (g) return true;
    return new Promise((res) => {
      if (typeof chrome === 'undefined' || !chrome.permissions || !chrome.permissions.request) { res(true); return; }
      try { chrome.permissions.request({ permissions: ['notifications'] }, (x) => res(!!x)); } catch (e) { res(false); }
    });
  });
}
function pomoNotifyDone(msg) {
  if (!state.pomoNotify) return;
  try {
    if (typeof chrome === 'undefined' || !chrome.notifications) return;
    hasNotifyPerm().then((g) => {
      if (!g) return;
      chrome.notifications.create('gaidrid-pomo', { type: 'basic', iconUrl: 'assets/icons/icon128.png', title: 'Gaidrid · Focus timer', message: msg, priority: 1 });
    });
  } catch (e) {}
}

/* ---- Daily quote (local rotation, no network) ---- */
const QUOTES = [
  'Calm mind, clear tab.',
  'Focus is a feature.',
  'Less noise, more signal.',
  'Start small, finish calm.',
  'Attention is precious. Spend it well.',
  'One tab, one task.',
  'Breathe in, begin.',
  'Clarity comes from subtraction.',
  'Do the next right thing.',
  'Quiet tools, loud results.',
  'Make today load fast.',
  'Less, but better.'
];
(function paintQuote() {
  const el = document.getElementById('quoteText');
  if (!el) return;
  const day = Math.floor(Date.now() / 86400000);
  el.textContent = '\u201C' + QUOTES[day % QUOTES.length] + '\u201D';
})();

/* ---- Theme modes: light / dark / auto ---- */
function syncDinoTheme(dark) {
  try {
    const f = document.getElementById('dinoFrame');
    if (f && f.contentDocument) f.contentDocument.documentElement.classList.toggle('gaidrid-dark', dark);
  } catch (e) {}
}
function readDinoMoon() {
  const f = document.getElementById('dinoFrame');
  try {
    if (!f || !f.contentDocument) return;
    const sysDark = f.contentWindow.matchMedia('(prefers-color-scheme: dark)').matches;
    dinoMoon = f.contentDocument.documentElement.classList.contains('inverted') !== sysDark;
    // defer the parent re-theme one frame so the game's own invert frame paints alone
    if (readDinoMoon._c) cancelAnimationFrame(readDinoMoon._c);
    readDinoMoon._c = requestAnimationFrame(() => {
      readDinoMoon._c = requestAnimationFrame(() => applyTheme());
    });
  } catch (e) {}
}
function observeDinoMoon() {
  const f = document.getElementById('dinoFrame');
  try {
    const d = f && f.contentDocument;
    if (!d || !d.documentElement) return;
    readDinoMoon();
    if (d.__moonObserved) return;
    d.__moonObserved = true;
    new MutationObserver(readDinoMoon).observe(d.documentElement, { attributes: true, attributeFilter: ['class'] });
  } catch (e) {}
}
// Night window: true when now is inside [start, end) (wraps past midnight).
function nightNow(s, e) {
  if (!s || !e) return false;
  const now = new Date();
  const cur = now.getHours() * 60 + now.getMinutes();
  const t = (x) => { const p = String(x).split(':'); return (parseInt(p[0], 10) || 0) * 60 + (parseInt(p[1], 10) || 0); };
  const a = t(s), b = t(e);
  return a <= b ? (cur >= a && cur < b) : (cur >= a || cur < b);
}
function applyTheme() {
  const mode = state.themeMode || 'auto';
  let dark = true;
  if (mode === 'light') dark = false;
  else if (mode === 'auto' && window.matchMedia) {
    dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (state.autoNight && nightNow(state.autoNightStart, state.autoNightEnd)) dark = true;
  }
  if (offlineMode && dinoMoon !== null) dark = dinoMoon;
  const root = document.documentElement;
  root.setAttribute('data-accent', state.accent || 'blue');
  const changed = root.classList.toggle('dark', dark);
  if (changed && !root.classList.contains('theme-swap')) {
    root.classList.add('theme-swap');
    clearTimeout(applyTheme.swapT);
    applyTheme.swapT = setTimeout(() => root.classList.remove('theme-swap'), 700);
  }
  syncDinoTheme(dark);
}
function paintThemeSeg() {
  const on = 'px-2.5 py-1 rounded-md bg-white dark:bg-white/10 text-gray-800 dark:text-white shadow-xs font-semibold';
  const off = 'px-2.5 py-1 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white';
  const m = state.themeMode || 'auto';
  const map = { light: 'themeLight', dark: 'themeDark', auto: 'themeAuto' };
  Object.keys(map).forEach((k) => {
    const b = document.getElementById(map[k]);
    if (b) b.className = (k === m) ? on : off;
  });
}

(function gaidridV2() {
  pomoPaint();
  const pt = document.getElementById('pomoToggle');
  if (pt) pt.addEventListener('click', () => {
    pomoOn = !pomoOn;
    if (pomoOn) pomoTimer = setInterval(pomoTick, 1000);
    else clearInterval(pomoTimer);
    pomoPaint();
  });
  const pr = document.getElementById('pomoReset');
  if (pr) pr.addEventListener('click', () => {
    pomoOn = false;
    clearInterval(pomoTimer);
    pomoLeft = pomoMode === 'focus' ? POMO_FOCUS : POMO_BREAK;
    pomoPaint();
  });
  const pnb = document.getElementById('pomoNotifyBtn');
  if (pnb) pnb.addEventListener('click', async () => {
    if (!state.pomoNotify) {
      if (!(await ensureNotifyPerm())) return;
    }
    state.pomoNotify = !state.pomoNotify;
    syncSettingsUI();
    if (window.GaidridSave) window.GaidridSave();
  });

  document.addEventListener('keydown', (e) => {
    if (!/^[1-8]$/.test(e.key)) return;
    if (gaidridTyping() || gaidridModalOpen()) return;
    const links = document.querySelectorAll('#topSitesGrid a');
    const a = links[parseInt(e.key, 10) - 1];
    if (a && a.href) navTo(a.href);
  });

  // In the side panel, top-site tiles must open a new tab (an iframe cannot
  // navigate to sites that send X-Frame-Options).
  if (IS_PANEL) document.addEventListener('click', (e) => {
    const a = e.target && e.target.closest ? e.target.closest('#topSitesGrid a') : null;
    if (a && a.href) { e.preventDefault(); window.open(a.href, '_blank', 'noopener'); }
  });

  const seg = (id, mode) => {
    const b = document.getElementById(id);
    if (b) b.addEventListener('click', () => { state.themeMode = mode; applyTheme(); paintThemeSeg(); });
  };
  seg('themeLight', 'light');
  seg('themeDark', 'dark');
  seg('themeAuto', 'auto');
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').addEventListener) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => { if (state.themeMode === 'auto') applyTheme(); });
  }
  paintThemeSeg();

  // Night schedule toggle (time fields use the custom picker wired below).
  const anb = document.getElementById('autoNightBtn');
  if (anb) anb.addEventListener('click', () => {
    state.autoNight = !state.autoNight;
    if (typeof syncSettingsUI === 'function') syncSettingsUI();
    applyTheme();
    if (window.GaidridSave) window.GaidridSave();
  });
  // Re-evaluate the night window while the tab stays open.
  setInterval(() => { if (state.themeMode === 'auto' && state.autoNight) applyTheme(); }, 30000);

  // Accent color swatches.
  const sw = document.getElementById('accentSwatches');
  if (sw) sw.addEventListener('click', (e) => {
    const b = e.target && e.target.closest ? e.target.closest('[data-accent]') : null;
    if (!b) return;
    state.accent = b.getAttribute('data-accent') || 'blue';
    applyTheme();
    if (typeof syncSettingsUI === 'function') syncSettingsUI();
    if (window.GaidridSave) window.GaidridSave();
  });
})();

/* ---- Custom time picker for the night schedule (replaces the native time input) ---- */
(function gaidridTimePicker() {
  const panel = document.getElementById('timePickerPanel');
  const startBtn = document.getElementById('autoNightStartBtn');
  const endBtn = document.getElementById('autoNightEndBtn');
  const hoursCol = document.getElementById('timePickerHours');
  const minutesCol = document.getElementById('timePickerMinutes');
  if (!panel || !startBtn || !endBtn || !hoursCol || !minutesCol) return;

  const HOURS = [];
  for (let h = 0; h < 24; h++) HOURS.push(h);
  const MINUTES = [];
  for (let m = 0; m < 60; m++) MINUTES.push(m);
  const itemCls = 'py-1.5 rounded-lg text-xs tabular-nums text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors';

  const curTime = () => state[timePickTarget] || (timePickTarget === 'autoNightEnd' ? '07:00' : '22:00');

  function renderCols() {
    hoursCol.innerHTML = HOURS.map((h) => {
      const label = state.use24Hour ? (h < 10 ? '0' + h : h) : ((h % 12) || 12) + (h >= 12 ? ' PM' : ' AM');
      return '<button type="button" data-h="' + h + '" class="' + itemCls + '">' + label + '</button>';
    }).join('');
    minutesCol.innerHTML = MINUTES.map((m) => '<button type="button" data-m="' + m + '" class="' + itemCls + '">' + (m < 10 ? '0' + m : m) + '</button>').join('');
  }

  function openPicker(t) {
    timePickTarget = t;
    renderCols();
    panel.classList.remove('hidden');
    paintTimePicker();
    startBtn.setAttribute('aria-expanded', String(t === 'autoNightStart'));
    endBtn.setAttribute('aria-expanded', String(t === 'autoNightEnd'));
    const on = hoursCol.querySelector('.time-pick-on');
    if (on) hoursCol.scrollTop = Math.max(0, on.offsetTop - hoursCol.clientHeight / 2 + on.offsetHeight / 2);
  }

  function commit(hhmm) {
    state[timePickTarget] = hhmm;
    updateTimeButtons();
    paintTimePicker();
    applyTheme();
    if (window.GaidridSave) window.GaidridSave();
  }

  hoursCol.addEventListener('click', (e) => {
    const b = e.target && e.target.closest ? e.target.closest('[data-h]') : null;
    if (!b || !timePickTarget) return;
    commit(b.getAttribute('data-h') + ':' + curTime().split(':')[1]);
  });
  minutesCol.addEventListener('click', (e) => {
    const b = e.target && e.target.closest ? e.target.closest('[data-m]') : null;
    if (!b || !timePickTarget) return;
    commit(curTime().split(':')[0] + ':' + String(b.getAttribute('data-m')).padStart(2, '0'));
  });

  const toggle = (t) => {
    if (timePickTarget === t && !panel.classList.contains('hidden')) closeTimePicker();
    else openPicker(t);
  };
  startBtn.addEventListener('click', () => toggle('autoNightStart'));
  endBtn.addEventListener('click', () => toggle('autoNightEnd'));

  // Clicking anywhere else in settings closes the picker.
  document.addEventListener('click', (e) => {
    if (panel.classList.contains('hidden')) return;
    if (!panel.contains(e.target) && !startBtn.contains(e.target) && !endBtn.contains(e.target)) closeTimePicker();
  });

  // Re-render labels (12/24h) when settings repaint while the picker is open.
  window.repaintTimePicker = () => {
    if (timePickTarget && !panel.classList.contains('hidden')) openPicker(timePickTarget);
  };

  updateTimeButtons();
})();

/* ---- Pomodoro modal wiring ---- */
function openPomo() { const m = document.getElementById('pomoModal'); if (m) m.classList.remove('opacity-0', 'pointer-events-none'); }
function closePomo() { const m = document.getElementById('pomoModal'); if (m) m.classList.add('opacity-0', 'pointer-events-none'); }
(function gaidridPomo() {
  const b = document.getElementById('pomoBtn');
  if (b) b.addEventListener('click', openPomo);
  const c = document.getElementById('closePomoBtn');
  if (c) c.addEventListener('click', closePomo);
})();

/* ---- Click outside any modal closes it ---- */
(function gaidridOutsideClose() {
  const pairs = [
    ['settingsModal', closeSettings],
    ['addAppModal', closeAddAppModal],
    ['voiceModal', closeVoiceModal],
    ['notesModal', closeNotes],
    ['pomoModal', closePomo],
    ['sportsModal', closeSports],
    ['newsModal', closeNews],
    ['aboutModal', closeAbout]
  ];
  pairs.forEach(([id, fn]) => {
    const m = document.getElementById(id);
    if (m) m.addEventListener('click', (e) => { if (e.target === m) fn(); });
  });
  const ob = document.getElementById('onboardModal');
  if (ob) ob.addEventListener('click', (e) => {
    if (e.target === ob) { hideOnboarding(); if (window.GaidridSave) window.GaidridSave(); }
  });
})();

/* ---- Backup (collapsible section): export / import JSON ---- */
function collectExport() {
  return {
    app: 'Gaidrid', kind: 'newtab-backup', version: 1,
    exportedAt: new Date().toISOString(),
    // ponytail: derive from the live collect() so new prefs can never go stale here
    prefs: window.GaidridCollect ? window.GaidridCollect() : {}
  };
}
function applyImportedPrefs(prefs) {
  const live = { tempC: state.tempC, weatherCode: state.weatherCode, isDay: state.isDay, suggestions: state.suggestions };
  Object.assign(state, prefs, live);
  migrateSportsFavs();
  if (!state.themeMode && typeof prefs.dark === 'boolean') state.themeMode = prefs.dark ? 'dark' : 'light';
  applyTheme();
  if (state.searchEngine && engineConfig[state.searchEngine]) setSearchEngine(state.searchEngine, true);
  if (state.searchMode) setSearchMode(state.searchMode, true);
  if (typeof renderApps === 'function') renderApps();
  syncSettingsUI();
  renderTopSites();
  fetchLiveWeather(state.weatherLocation || 'Cairo');
  refreshSportsHome();
  refreshNewsHome();
  if (window.GaidridSave) window.GaidridSave();
}
(function gaidridBackup() {
  const exp = document.getElementById('exportBtn');
  const imp = document.getElementById('importBtn');
  const file = document.getElementById('importFileInput');
  const status = document.getElementById('backupStatus');
  const say = (t) => { if (status) status.textContent = t; };
  if (exp) exp.addEventListener('click', () => {
    try {
      const blob = new Blob([JSON.stringify(collectExport(), null, 2)], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'gaidrid-backup.json';
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 2000);
      say('Backup exported');
    } catch (e) { say('Export failed'); }
  });
  if (imp && file) {
    imp.addEventListener('click', () => file.click());
    file.addEventListener('change', () => {
      const f = file.files && file.files[0];
      if (!f) return;
      const rd = new FileReader();
      rd.onload = () => {
        try {
          const data = JSON.parse(rd.result);
          if (!data || data.app !== 'Gaidrid' || !data.prefs) throw new Error('bad file');
          if (typeof data.version === 'number' && data.version > 1) throw new Error('newer backup format');
          applyImportedPrefs(data.prefs);
          say('Backup imported from ' + (data.exportedAt || 'file'));
        } catch (e) { say('Invalid backup file'); }
        file.value = '';
      };
      rd.readAsText(f);
    });
  }
})();

/* ---- Iconify icon search (no key, debounced, abortable) ---- */
(function gaidridIconSearch() {
  const input = document.getElementById('appIconSearch');
  const box = document.getElementById('appIconResults');
  const hidden = document.getElementById('appIconInput');
  if (!input || !box || !hidden) return;
  let t = null;
  let ctl = null;
  input.addEventListener('input', () => {
    const q = input.value.trim();
    clearTimeout(t);
    if (ctl) ctl.abort();
    if (q.length < 2) { box.classList.add('hidden'); box.innerHTML = ''; return; }
    t = setTimeout(async () => {
      try {
        ctl = new AbortController();
        const res = await fetch('https://api.iconify.design/search?query=' + encodeURIComponent(q) + '&limit=24', { signal: ctl.signal });
        const data = await res.json();
        const icons = (data && Array.isArray(data.icons) ? data.icons : []).slice(0, 24);
        if (!icons.length) { box.classList.add('hidden'); return; }
        box.innerHTML = icons.map((n) => {
          const ix = n.indexOf(':');
          const prefix = n.slice(0, ix);
          const name = n.slice(ix + 1);
          return '<button type="button" data-icon="iconify:' + n + '" class="aspect-square rounded-lg bg-gray-50 dark:bg-white/[0.06] border border-gray-200 dark:border-white/10 hover:border-google-blue flex items-center justify-center p-1.5 transition-all" title="' + n + '">'
            + '<img loading="lazy" src="https://api.iconify.design/' + prefix + '/' + name + '.svg" alt="" class="w-6 h-6 object-contain dark:invert pointer-events-none"></button>';
        }).join('');
        box.classList.remove('hidden');
        box.querySelectorAll('[data-icon]').forEach((b) => b.addEventListener('click', () => {
          hidden.value = b.getAttribute('data-icon');
          paintIconPreview();
          box.classList.add('hidden');
        }));
      } catch (e) { /* offline / aborted: manual entry still works */ }
    }, 300);
  });
})();

/* ---- Marquee for overflowing titles + favicon helper ---- */
function paintMarquee() {
  document.querySelectorAll('.marq').forEach((el) => {
    el.classList.remove('marquee');
    el.style.removeProperty('--shift');
    el.style.textOverflow = '';
    if (el.scrollWidth > el.clientWidth + 4) {
      el.style.setProperty('--shift', (-(el.scrollWidth - el.clientWidth)) + 'px');
      el.style.textOverflow = 'clip';
      el.classList.add('marquee');
    }
  });
}
function favImg(url) {
  try {
    const host = new URL(url).hostname;
    if (!host) return '';
    return '<img loading="lazy" data-fav="1" src="https://www.google.com/s2/favicons?domain=' + encodeURIComponent(host) + '&sz=64" alt="" class="w-5 h-5 object-contain shrink-0">';
  } catch (e) { return ''; }
}
(function gaidridMarquee() {
  paintMarquee();
  let rzT = null;
  window.addEventListener('resize', () => { clearTimeout(rzT); rzT = setTimeout(paintMarquee, 250); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => paintMarquee());
})();

/* ---- Top-site tile: clip-box title, fitted favicon, letter fallback ---- */
function topTileHTML(s, idx) {
  const label = s.title || s.url;
  const m = (label || '').trim().match(/[A-Za-z0-9\u00C0-\u024F\u0600-\u06FF]/);
  const letter = m ? m[0].toUpperCase() : '•';
  const fav = favImg(s.url);
  const letterSpan = '<span data-letter class="text-sm font-bold text-gray-500 dark:text-gray-300' + (fav ? ' hidden' : '') + '">' + escHtml(letter) + '</span>';
  const iconBox = '<span class="relative w-9 h-9 rounded-2xl bg-white dark:bg-white/[0.07] border border-gray-200/60 dark:border-white/10 shadow-xs flex items-center justify-center overflow-hidden">' + letterSpan + fav + '</span>';
  const titleBox = '<span class="text-[11px] text-gray-500 dark:text-gray-400 truncate w-full text-center"><span class="marq">' + escHtml(label) + '</span></span>';
  return '<a href="' + escHtml(s.url) + '" class="group relative flex flex-col items-center gap-1.5 w-16 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 transition-all">'
    + '<span class="absolute top-1 right-1.5 text-[9px] font-bold text-gray-300 dark:text-gray-600">' + (idx + 1) + '</span>'
    + iconBox + titleBox + '</a>';
}

/* ---- Tile color presets (same look as default shortcuts) ---- */
const APPCOLORS = [
  'bg-blue-50 text-[#1a73e8] dark:bg-blue-950/40',
  'bg-red-50 text-google-red dark:bg-red-950/40',
  'bg-orange-50 text-orange-600 dark:bg-orange-950/40',
  'bg-yellow-50 text-amber-600 dark:bg-yellow-950/40',
  'bg-green-50 text-google-green dark:bg-green-950/40',
  'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40',
  'bg-purple-50 text-purple-600 dark:bg-purple-950/40',
  'bg-pink-50 text-pink-600 dark:bg-pink-950/40',
  'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100'
];
function paintColorRow() {
  const row = document.getElementById('appColorRow');
  const hidden = document.getElementById('appColorInput');
  if (!row || !hidden) return;
  const cur = hidden.value;
  row.innerHTML = APPCOLORS.map((c) => {
    const on = c === cur;
    return '<button type="button" data-color="' + c + '" title="Tile color" class="w-8 h-8 rounded-xl flex items-center justify-center transition-all ' + c + (on ? ' ring-2 ring-google-blue/70 ring-offset-1 ring-offset-white dark:ring-offset-[#232c38]' : ' hover:scale-105') + '">'
      + '<span class="w-3 h-3 rounded-full bg-current"></span></button>';
  }).join('');
  row.querySelectorAll('[data-color]').forEach((b) => b.addEventListener('click', () => {
    hidden.value = b.getAttribute('data-color');
    paintColorRow();
    paintIconPreview();
  }));
}

/* ---- Shortcut guards: typing anywhere or any modal/drawer open silences globals ---- */
function gaidridTyping() {
  const ae = document.activeElement;
  return !!ae && (ae.tagName === 'INPUT' || ae.tagName === 'TEXTAREA' || ae.isContentEditable);
}
function gaidridModalOpen() {
  const ids = ['settingsModal', 'addAppModal', 'voiceModal', 'notesModal', 'pomoModal', 'aboutModal', 'onboardModal'];
  for (const id of ids) {
    const m = document.getElementById(id);
    if (m && !m.classList.contains('opacity-0')) return true;
  }
  if (typeof appsDrawer !== 'undefined' && appsDrawer && !appsDrawer.classList.contains('translate-x-full')) return true;
  return false;
}

/* ---- One-time tile upgrade: stale FA approximations -> real brand marks ---- */
function migrateTileIcons() {
  const gray = 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100';
  const map = {
    '4': { old: 'fa-solid fa-robot', icon: 'iconify:simple-icons:openai' },
    '5': { old: 'fa-solid fa-book', icon: 'iconify:simple-icons:wikipedia' },
    '7': { old: 'fa-solid fa-film', icon: 'iconify:simple-icons:netflix' },
    '11': { old: 'fa-solid fa-file-pen', icon: 'iconify:simple-icons:notion' }
  };
  let changed = false;
  (state.apps || []).forEach((a) => {
    const m = map[a.id];
    if (m && (a.icon || '').trim() === m.old) {
      a.icon = m.icon;
      a.color = gray;
      changed = true;
    }
    // Old saves stored the blue tile color as the accent-driven token; pin it to
    // the fixed brand blue so a saved tile color never follows the accent.
    if (typeof a.color === 'string' && a.color.indexOf('text-google-blue') !== -1) {
      a.color = a.color.split('text-google-blue').join('text-[#1a73e8]');
      changed = true;
    }
  });
  return changed;
}

/* ---- Card 3-dots menu (single delegated handler survives re-renders) ---- */
function closeCardMenus() {
  document.querySelectorAll('#appsGrid .card-menu').forEach((m) => m.classList.add('hidden'));
}
(function gaidridCardMenu() {
  const grid = document.getElementById('appsGrid');
  if (!grid) return;
  grid.addEventListener('mouseout', (e) => {
    const card = e.target && e.target.closest ? e.target.closest('[data-index]') : null;
    if (!card || !grid.contains(card)) return;
    if (e.relatedTarget && card.contains(e.relatedTarget)) return;
    closeCardMenus();
  });
  grid.addEventListener('click', (e) => {
    const menuBtn = e.target && e.target.closest ? e.target.closest('.card-menu-btn') : null;
    if (menuBtn) {
      e.stopPropagation();
      const menu = menuBtn.parentElement.querySelector('.card-menu');
      const willOpen = menu.classList.contains('hidden');
      closeCardMenus();
      if (willOpen) menu.classList.remove('hidden');
      return;
    }
    const act = e.target && e.target.closest ? e.target.closest('[data-act]') : null;
    if (!act) return;
    e.stopPropagation();
    const card = act.closest('[data-index]');
    const idx = card ? parseInt(card.getAttribute('data-index'), 10) : -1;
    closeCardMenus();
    if (idx < 0 || !state.apps[idx]) return;
    if (act.getAttribute('data-act') === 'del') {
      state.apps.splice(idx, 1);
      renderApps();
    } else {
      openAddAppModal(state.apps[idx]);
    }
  });
  document.addEventListener('click', (e) => {
    if (e.target && e.target.closest && (e.target.closest('#appsGrid') || e.target.closest('#openAddAppBtn'))) return;
    closeCardMenus();
  });
})();


/* ---- Sports window (ESPN scoreboard + standings, no key) ---- */
const SPORTS_LEAGUES = [
{ key: 'ucl', label: 'UCL', sport: 'soccer', league: 'uefa.champions', full: 'Champions League', site: 'soccer/scoreboard/_/league/uefa.champions' },
{ key: 'epl', label: 'EPL', sport: 'soccer', league: 'eng.1', full: 'Premier League', site: 'soccer/scoreboard/_/league/eng.1' },
{ key: 'nba', label: 'NBA', sport: 'basketball', league: 'nba', full: 'NBA', site: 'nba/scoreboard' },
{ key: 'nfl', label: 'NFL', sport: 'football', league: 'nfl', full: 'NFL', site: 'nfl/scoreboard' },
{ key: 'laliga', label: 'La Liga', sport: 'soccer', league: 'esp.1', full: 'La Liga', site: 'soccer/scoreboard/_/league/esp.1' },
{ key: 'seriea', label: 'Serie A', sport: 'soccer', league: 'ita.1', full: 'Serie A', site: 'soccer/scoreboard/_/league/ita.1' },
{ key: 'bundesliga', label: 'Bundesliga', sport: 'soccer', league: 'ger.1', full: 'Bundesliga', site: 'soccer/scoreboard/_/league/ger.1' },
{ key: 'ligue1', label: 'Ligue 1', sport: 'soccer', league: 'fra.1', full: 'Ligue 1', site: 'soccer/scoreboard/_/league/fra.1' },
{ key: 'mlb', label: 'MLB', sport: 'baseball', league: 'mlb', full: 'MLB', site: 'mlb/scoreboard' },
{ key: 'nhl', label: 'NHL', sport: 'hockey', league: 'nhl', full: 'NHL', site: 'nhl/scoreboard' }
];
let sportsTab = 'matches';
let sportsCtl = null;
let sportsTimer = null;

/* Per-sport card identity: final-whistle wording, team order, and whether
   events carry a week number (NFL). */
const SPORTS_CARD = {
  soccer: { final: 'FT', order: 'home' },
  basketball: { final: 'Final', order: 'away' },
  football: { final: 'Final', order: 'away', week: true },
  baseball: { final: 'Final', order: 'away' },
  hockey: { final: 'Final', order: 'away' }
};
function sportsCard() { return SPORTS_CARD[(sportsLeague() || {}).sport] || SPORTS_CARD.soccer; }

function sportsLeague() {
  return SPORTS_LEAGUES.find((l) => l.key === state.sportsLeague) || SPORTS_LEAGUES[0];
}
function sportsSelectedDate() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + (state.sportsDay || 0));
  return d;
}
function sportsDayLabel() {
  if (state.sportsDay === 0) return 'Today';
  if (state.sportsDay === -1) return 'Yesterday';
  if (state.sportsDay === 1) return 'Tomorrow';
  return sportsSelectedDate().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}
/* ESPN buckets ?dates= by the US/Eastern calendar day, not the viewer's. One
   local day therefore covers one ET date for US/Eastern users and two for
   everyone else. */
function espnDatesFor(day) {
  const end = new Date(day.getTime());
  end.setDate(end.getDate() + 1);
  const et = (ms) => {
    const p = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/New_York', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(ms);
    const g = (t) => p.find((x) => x.type === t).value;
    return g('year') + g('month') + g('day');
  };
  const a = et(day.getTime());
  const b = et(end.getTime() - 1);
  return a === b ? [a] : [a, b];
}
function sportsESPNDates() {
  return espnDatesFor(sportsSelectedDate());
}
function sportsOpen() {
  const m = document.getElementById('sportsModal');
  return !!(m && !m.classList.contains('opacity-0'));
}
function openSports(dayOff) {
  const m = document.getElementById('sportsModal');
  if (m) m.classList.remove('opacity-0', 'pointer-events-none');
  state.sportsDay = (typeof dayOff === 'number') ? Math.max(-7, Math.min(7, dayOff)) : 0;
  fetchSports();
  if (!sportsTimer) sportsTimer = setInterval(() => { if (sportsOpen() && state.sportsAuto !== false && !document.hidden) fetchSports(); }, 60000);
}
function closeSports() {
  const was = sportsOpen();
  const m = document.getElementById('sportsModal');
  if (m) m.classList.add('opacity-0', 'pointer-events-none');
  if (was) refreshSportsHome();
}
function paintSportsTabs() {
  const on = 'flex-1 px-2.5 py-1 rounded-md bg-white dark:bg-white/10 text-gray-800 dark:text-white shadow-xs font-semibold';
  const off = 'flex-1 px-2.5 py-1 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white';
  const tabs = { matches: 'sportsTabMatches', table: 'sportsTabTable', favs: 'sportsTabFav' };
  Object.keys(tabs).forEach((k) => {
    const el = document.getElementById(tabs[k]);
    if (el) { el.className = sportsTab === k ? on : off; el.setAttribute('aria-selected', sportsTab === k ? 'true' : 'false'); }
  });
  const day = document.getElementById('sportsDayRow');
  if (day) day.classList.toggle('hidden', sportsTab !== 'matches');
  const leagues = document.getElementById('sportsLeagues');
  if (leagues) leagues.classList.toggle('hidden', sportsTab === 'favs');
}
function paintSportsLeagues() {
  const box = document.getElementById('sportsLeagues');
  if (!box) return;
  // Default league first so it never scrolls out of reach.
  const leagues = SPORTS_LEAGUES.slice().sort((a, b) => (a.key === state.sportsLeague ? -1 : b.key === state.sportsLeague ? 1 : 0));
  box.innerHTML = leagues.map((l) => {
    const on = l.key === state.sportsLeague;
    return '<button type="button" data-league="' + l.key + '" aria-pressed="' + (on ? 'true' : 'false') + '" class="px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border '
      + (on ? 'bg-[#212832] text-white border-[#212832] dark:bg-white dark:text-[#212832] dark:border-white'
        : 'bg-gray-100 dark:bg-white/[0.06] text-gray-600 dark:text-gray-300 border-gray-200 dark:border-white/10 hover:bg-gray-200 dark:hover:bg-white/10') + '">'
      + l.label + '</button>';
  }).join('');
  box.querySelectorAll('[data-league]').forEach((b) => b.addEventListener('click', () => {
    state.sportsLeague = b.getAttribute('data-league');
    fetchSports();
  }));
}
function paintSportsDay() {
  const el = document.getElementById('sportsDayLabel');
  if (el) el.textContent = sportsDayLabel();
}
function sportsTeamOf(c, hideScore) {
  const t = (c && c.team) || {};
  return {
    id: String(t.id || ''),
    name: t.shortDisplayName || t.abbreviation || t.displayName || '?',
    logo: t.logo || '',
    score: hideScore ? '' : ((c && c.score) || ''),
    record: (c && c.records && c.records[0] && c.records[0].summary) || ''
  };
}
function parseSportsMatches(data, sport) {
  const rank = (s) => (s === 'in' ? 0 : s === 'pre' ? 1 : 2);
  return ((data && data.events) || []).map((ev) => {
    const comp = ev.competitions && ev.competitions[0];
    const parts = (comp && comp.competitors) || [];
    const home = parts.find((c) => c.homeAway === 'home') || parts[0] || {};
    const away = parts.find(c2 => c2.homeAway === 'away') || parts[1] || {};
    const st = (comp && comp.status) || {};
    const tp = st.type || {};
    const mstate = tp.state || 'pre';
    const links = ev.links || [];
    return {
      id: ev.id,
      date: ev.date,
      state: mstate,
      detail: tp.shortDetail || tp.detail || '',
      context: sportsEventContext(ev, comp, sport),
      url: (links[0] && (links[0].href || (links[0].web && links[0].web.href))) || '',
      home: sportsTeamOf(home, mstate === 'pre'),
      away: sportsTeamOf(away, mstate === 'pre')
    };
  }).sort((a, b) => rank(a.state) - rank(b.state));
}
/* Round / week context shown under the status: competition note (soccer cups)
   or the week number (NFL). Anything missing stays hidden — never invented. */
function sportsEventContext(ev, comp, sport) {
  try {
    if (comp && Array.isArray(comp.notes) && comp.notes[0]) {
      const n = comp.notes[0].headline || comp.notes[0].text || comp.notes[0];
      if (typeof n === 'string' && n.trim()) return n.trim();
    }
    const sp = sport || (sportsLeague() || {}).sport;
    if (sp === 'football' && ev && ev.week && ev.week.number) {
      return 'Week ' + ev.week.number;
    }
  } catch (e) {}
  return '';
}
function sportsLocalWhen(m) {
  if (!m.date) return m.detail || '';
  const d = new Date(m.date);
  if (isNaN(d.getTime())) return m.detail || '';
  const sameDay = d.toDateString() === sportsSelectedDate().toDateString();
  const opts = sameDay
    ? { hour: 'numeric', minute: '2-digit' }
    : { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' };
  try { return d.toLocaleString('en-US', opts); } catch (e) { return m.detail || ''; }
}
function sportsStatusHTML(m) {
  if (m.state === 'in') {
    return '<span class="flex items-center gap-1.5 text-[11px] font-bold text-red-500"><span class="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>' + escHtml(m.detail || 'LIVE') + '</span>';
  }
  const finalWord = sportsCard().final || 'Final';
  if (m.state === 'post') {
    const d = m.detail || '';
    // Postponed/cancelled games are not results — show the status, not a score style.
    if (/postponed|cancelled|canceled|suspended|delayed/i.test(d)) {
      return '<span class="text-[11px] font-semibold text-gray-400">' + escHtml(d) + '</span>';
    }
    // ESPN often repeats the whistle word inside the detail ("FT", "Final/OT").
    let label;
    if (!d || d === finalWord || d === 'Full Time') label = finalWord;
    else if (d.indexOf(finalWord) === 0) label = d;
    else label = finalWord + ' · ' + d;
    return '<span class="text-[11px] font-semibold text-gray-400">' + escHtml(label) + '</span>';
  }
  return '<span class="text-[11px] font-medium text-gray-400">' + escHtml(sportsLocalWhen(m)) + '</span>';
}
function sportsTeamRow(t, opp, decided) {
  const hs = parseFloat(t.score);
  const os = parseFloat(opp);
  const win = decided && !isNaN(hs) && !isNaN(os) && hs > os;
  const scoreCls = win ? 'font-bold text-gray-900 dark:text-white' : 'font-semibold text-gray-500 dark:text-gray-400';
  let right = '';
  if (t.score !== '' && t.score !== undefined) {
    right = '<span class="block text-base tabular-nums ' + scoreCls + '">' + escHtml(t.score) + '</span>'
      + (t.record ? '<span class="block text-[10px] tabular-nums text-gray-400">' + escHtml(t.record) + '</span>' : '');
  } else if (t.record) {
    right = '<span class="block text-[11px] tabular-nums text-gray-400">' + escHtml(t.record) + '</span>';
  }
  const onFav = isFavTeam(t.id);
  const nameCls = win
    ? 'font-bold text-gray-900 dark:text-white'
    : (onFav ? 'font-semibold text-amber-600 dark:text-amber-400' : 'font-medium text-gray-600 dark:text-gray-300');
  return '<div class="flex items-center gap-2.5">'
    + '<img loading="lazy" data-tlogo src="' + t.logo + '" alt="" class="w-6 h-6 object-contain shrink-0">'
    + '<span class="text-sm ' + nameCls + ' truncate min-w-0 flex-1">' + escHtml(t.name) + '</span>'
    + '<span class="ml-auto text-right leading-tight shrink-0 w-11">' + right + '</span>' + sportsFavBtnHTML(t) + '</div>';
}
function sportsMatchHTML(m) {
  const decided = m.state === 'post';
  const card = sportsCard();
  const first = card.order === 'home' ? m.home : m.away;
  const second = card.order === 'home' ? m.away : m.home;
  const cls = 'px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-white/[0.04] hover:bg-gray-100 dark:hover:bg-white/[0.08] transition-colors ' + (decided ? 'opacity-75 ' : '');
  const open = m.url
    ? '<a href="' + escHtml(m.url) + '" target="_blank" rel="noopener" class="block ' + cls + '">'
    : '<div class="' + cls + '">';
  const close = m.url ? '</a>' : '</div>';
  return open
    + '<div class="mb-1.5 flex items-center gap-2 min-w-0">' + sportsStatusHTML(m) + (m.context ? '<span class="text-[10px] text-gray-400 truncate">' + escHtml(m.context) + '</span>' : '') + '</div>'
    + sportsTeamRow(first, second.score, decided)
    + '<div class="mt-1.5">' + sportsTeamRow(second, first.score, decided) + '</div>' + close;
}
function renderSportsMatches(list) {
  const box = document.getElementById('sportsBody');
  if (!box) return;
  const lg = sportsLeague();
  const favIds = new Set(sportsFavList().map((t) => String(t.id)));
  const sorted = list.slice().sort((a, b) => {
    const fa = favIds.size && (favIds.has(a.home.id || '') || favIds.has(a.away.id || '')) ? 0 : 1;
    const fb = favIds.size && (favIds.has(b.home.id || '') || favIds.has(b.away.id || '')) ? 0 : 1;
    return fa - fb;
  });
  const visible = state.sportsShowFinished === false ? sorted.filter((m) => m.state !== 'post') : sorted;
  const hidden = !visible.length && sorted.length > 0;
  box.innerHTML = visible.length
    ? visible.map((m) => sportsMatchHTML(m)).join('')
    : '<div class="text-center text-xs text-gray-400 py-10">' + (hidden ? 'No upcoming ' : 'No ') + escHtml(lg.full) + ' matches on this day<br><a href="https://www.espn.com/' + lg.site + '" target="_blank" rel="noopener" class="inline-block mt-2 text-google-blue dark:text-[#8AB4F8] hover:underline">Check on ESPN.com</a></div>';
  wireSportsLogos(box);
}
function wireSportsLogos(box) {
  box.querySelectorAll('img[data-tlogo]').forEach((img) => {
    const hide = () => img.classList.add('invisible');
    if (img.complete && img.naturalWidth === 0) hide();
    else img.addEventListener('error', hide);
  });
}
function renderSportsError() {
  const box = document.getElementById('sportsBody');
  if (box) box.innerHTML = '<div class="text-center text-xs text-gray-400 py-10">Could not load ' + (sportsTab === 'table' ? 'standings' : 'scores') + ' — check connection<br><span class="text-[11px]">Use the refresh button to try again</span></div>';
}
let sportsRenderKey = '';
let sportsLastRender = null;
function sportsKeyStr() {
  return state.sportsLeague + '|' + sportsTab + '|' + (state.sportsDay || 0);
}
function sportsStamp() {
  const now = new Date();
  const h = now.getHours();
  const hh = String(state.use24Hour ? h : (h % 12 || 12)).padStart(2, '0');
  return 'Updated ' + hh + ':' + String(now.getMinutes()).padStart(2, '0')
    + (state.use24Hour ? '' : (h >= 12 ? ' PM' : ' AM'));
}
function repaintSports() {
  const key = sportsKeyStr();
  if (!sportsLastRender || sportsLastRender.key !== key) { fetchSports(); return; }
  const box = document.getElementById('sportsBody');
  const top = box ? box.scrollTop : 0;
  if (sportsLastRender.kind === 'matches') renderSportsMatches(sportsLastRender.list);
  else if (sportsLastRender.kind === 'favs') renderFavTab();
  else renderSportsTable(sportsLastRender.groups, sportsLastRender.cols);
  if (box) box.scrollTop = top;
}
async function fetchSports() {
  paintSportsTabs();
  paintSportsLeagues();
  paintSportsDay();
  const title = document.getElementById('sportsTitle');
  if (title) title.textContent = sportsTab === 'favs' ? 'Favorite Teams' : ((sportsLeague() || {}).full || 'Sports');
  const box = document.getElementById('sportsBody');
  const up = document.getElementById('sportsUpdated');
  const key = sportsKeyStr();
  if (sportsTab === 'favs') {
    sportsRenderKey = key;
    sportsLastRender = { key, kind: 'favs' };
    if (box) box.scrollTop = 0;
    renderFavTab();
    if (up) up.textContent = '';
    const ric = document.querySelector('#sportsRefreshBtn i');
    if (ric) ric.classList.remove('animate-spin');
    return;
  }
  const sameKey = key === sportsRenderKey && !!box && box.childElementCount > 0;
  const top = sameKey ? box.scrollTop : 0;
  sportsRenderKey = key;
  if (box) {
    if (sameKey) box.classList.add('opacity-50', 'pointer-events-none');
    else {
      box.scrollTop = 0;
      box.innerHTML = '<div class="animate-pulse space-y-2"><div class="h-14 rounded-xl bg-gray-100 dark:bg-white/[0.05]"></div><div class="h-14 rounded-xl bg-gray-100 dark:bg-white/[0.05]"></div><div class="h-14 rounded-xl bg-gray-100 dark:bg-white/[0.05]"></div></div>';
    }
  }
  if (up) up.textContent = '';
  const ric = document.querySelector('#sportsRefreshBtn i');
  if (ric) ric.classList.add('animate-spin');
  const lg = sportsLeague();
  const base = 'https://site.api.espn.com/apis/site/v2/sports/' + lg.sport + '/' + lg.league;
  try {
    if (sportsCtl) sportsCtl.abort();
    sportsCtl = new AbortController();
    const signal = sportsCtl.signal;
    if (sportsTab === 'matches') {
      const payloads = await Promise.all(sportsESPNDates().map((d) =>
        fetch(base + '/scoreboard?dates=' + d, { signal })
          .then((r) => (r.ok ? r.json() : null))
          .catch((e) => { if (e && e.name === 'AbortError') throw e; return null; })));
      const valid = payloads.filter((p) => p && Array.isArray(p.events));
      if (!valid.length) { renderSportsError(); return; }
      const events = [];
      valid.forEach((p) => p.events.forEach((ev) => events.push(ev)));
      const sel = sportsSelectedDate().toDateString();
      const day = events.filter((ev) => !ev.date || new Date(ev.date).toDateString() === sel);
      const list = parseSportsMatches({ events: day });
      sportsLastRender = { key, kind: 'matches', list };
      renderSportsMatches(list);
    } else {
      const data = await fetchSportsTableData(lg, signal);
      sportsLastRender = { key, kind: 'table', groups: data.groups, cols: data.cols };
      renderSportsTable(data.groups, data.cols);
    }
    if (up) up.textContent = sportsStamp();
  } catch (e) {
    if (e && e.name !== 'AbortError') {
      if (sameKey && box && box.childElementCount) { if (up) up.textContent = "Couldn't refresh"; }
      else renderSportsError();
    }
  } finally {
    if (ric) ric.classList.remove('animate-spin');
    if (box) {
      box.classList.remove('opacity-50', 'pointer-events-none');
      if (sameKey) box.scrollTop = top;
    }
  }
}
(function gaidridSports() {
  const btn = document.getElementById('sportsBtn');
  if (btn) btn.addEventListener('click', openSports);
  const c = document.getElementById('closeSportsBtn');
  if (c) c.addEventListener('click', closeSports);
  const r = document.getElementById('sportsRefreshBtn');
  if (r) r.addEventListener('click', fetchSports);
  const tm = document.getElementById('sportsTabMatches');
  const tt = document.getElementById('sportsTabTable');
  const tf = document.getElementById('sportsTabFav');
  if (tm) tm.addEventListener('click', () => { sportsTab = 'matches'; fetchSports(); });
  if (tt) tt.addEventListener('click', () => { sportsTab = 'table'; fetchSports(); });
  if (tf) tf.addEventListener('click', () => { sportsTab = 'favs'; fetchSports(); });
  const pv = document.getElementById('sportsPrevDay');
  const nx = document.getElementById('sportsNextDay');
  if (pv) pv.addEventListener('click', () => {
    state.sportsDay = Math.max(-7, (state.sportsDay || 0) - 1);
    fetchSports();
  });
  if (nx) nx.addEventListener('click', () => {
    state.sportsDay = Math.min(7, (state.sportsDay || 0) + 1);
    fetchSports();
  });
})();

/* ---- Home extras: live badge + favorite next-match chip ----
   One quiet background fetch per league that has a favorite team
   (today + tomorrow). Silent on failure; skipped offline. */
let sportsHomeCtl = null;
let sportsHomeTimer = null;
/* Live matches involving favorite teams — ids may be one id or an array. */
function favLiveCount(list, favIds) {
  const set = new Set((Array.isArray(favIds) ? favIds : [favIds]).filter((x) => x !== undefined && x !== null && x !== '').map(String));
  if (!set.size) return 0;
  return (list || []).filter((m) => m && m.state === 'in'
    && (set.has(String((m.home || {}).id || '')) || set.has(String((m.away || {}).id || '')))).length;
}
/* Next upcoming match of favorite team(s) — pure, tested in logic-check. */
function nextFavMatch(list, favIds, now) {
  const set = new Set((Array.isArray(favIds) ? favIds : [favIds]).filter((x) => x !== undefined && x !== null && x !== '').map(String));
  if (!set.size) return null;
  const t = (typeof now === 'number') ? now : Date.now();
  const mine = (list || []).filter((m) => m && m.state === 'pre'
    && (set.has(String((m.home || {}).id || '')) || set.has(String((m.away || {}).id || '')))
    && m.date && new Date(m.date).getTime() >= t - 7200000);
  mine.sort((a, b) => new Date(a.date) - new Date(b.date));
  return mine[0] || null;
}
async function refreshSportsHome() {
  const badge = document.getElementById('sportsLiveBadge');
  const chip = document.getElementById('favMatchChip');
  const hideBadge = () => { if (badge) { badge.classList.add('hidden'); badge.classList.remove('flex'); } };
  const hideChip = () => { if (chip) { chip.classList.add('hidden'); chip.classList.remove('flex'); chip.onclick = null; } };
  try {
    if (!navigator.onLine) throw 0;
    const favMap = {};
    SPORTS_LEAGUES.forEach((l) => {
      const arr = ((state.sportsFav || {})[l.key] || []).filter((t) => t && t.id);
      if (arr.length) favMap[l.key] = arr;
    });
    const favKeys = Object.keys(favMap);
    if (!favKeys.length) { hideBadge(); hideChip(); return; }
    if (sportsHomeCtl) sportsHomeCtl.abort();
    sportsHomeCtl = new AbortController();
    const signal = sportsHomeCtl.signal;
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today.getTime()); tomorrow.setDate(tomorrow.getDate() + 1);
    const dates = Array.from(new Set(espnDatesFor(today).concat(espnDatesFor(tomorrow))));
    const perLeague = await Promise.all(favKeys.map(async (key) => {
      const lg = SPORTS_LEAGUES.find((l) => l.key === key);
      const base = 'https://site.api.espn.com/apis/site/v2/sports/' + lg.sport + '/' + lg.league;
      const payloads = await Promise.all(dates.map((d) =>
        fetch(base + '/scoreboard?dates=' + d, { signal })
          .then((r) => (r.ok ? r.json() : null))
          .catch((e) => { if (e && e.name === 'AbortError') throw e; return null; })));
      const seen = {};
      const events = [];
      payloads.forEach((p) => {
        if (p && Array.isArray(p.events)) p.events.forEach((ev) => {
          if (ev && ev.id && !seen[ev.id]) { seen[ev.id] = true; events.push(ev); }
        });
      });
      return { key, list: parseSportsMatches({ events }, lg.sport) };
    }));
    let live = 0;
    let best = null;
    perLeague.forEach(({ key, list }) => {
      const ids = favMap[key].map((t) => t.id);
      live += favLiveCount(list, ids);
      const nxt = nextFavMatch(list, ids);
      if (nxt && (!best || new Date(nxt.date) < new Date(best.m.date))) {
        const fav = favMap[key].find((t) => String(t.id) === String((nxt.home || {}).id || '') || String(t.id) === String((nxt.away || {}).id || '')) || favMap[key][0];
        best = { key, m: nxt, fav };
      }
    });
    if (badge) {
      badge.textContent = live > 9 ? '9+' : String(live);
      badge.classList.toggle('hidden', !live);
      badge.classList.toggle('flex', !!live);
    }
    if (chip) {
      if (best) {
        const isHome = String((best.m.home || {}).id || '') === String(best.fav.id);
        const opp = isHome ? best.m.away.name : best.m.home.name;
        const d = new Date(best.m.date);
        const chipDay = d.toDateString() === today.toDateString() ? 0 : 1;
        const t = d.toLocaleString('en-US', state.use24Hour ? { hour: '2-digit', minute: '2-digit', hour12: false } : { hour: 'numeric', minute: '2-digit' });
        const label = document.getElementById('favMatchLabel');
        if (label) label.textContent = best.fav.name + (isHome ? ' vs ' : ' at ') + opp + ' · ' + (chipDay === 0 ? 'Today ' : 'Tomorrow ') + t;
        chip.classList.remove('hidden');
        chip.classList.add('flex');
        chip.onclick = () => { state.sportsLeague = best.key; openSports(chipDay); };
      } else hideChip();
    }
  } catch (e) {
    hideBadge();
    hideChip();
  }
}
if (!sportsHomeTimer) {
  // ponytail: no call here — state.sportsFav loads async below; the restore,
  // import, modal-close and fav-change paths trigger the first fetch instead.
  // 5-minute poll, skipped while hidden or while the modal owns the data
  sportsHomeTimer = setInterval(() => { if (!document.hidden && !sportsOpen()) refreshSportsHome(); }, 300000);
}

/* ---- News / RSS: optional host permission, feeds, reading mode ---- */
const NEWS_ORIGINS = ['https://*/*', 'http://*/*'];
let newsTimer = null;
let newsCtl = null;
let newsArticleCtl = null;
let newsItems = [];
let newsView = 'list';
function hasNewsPerm() {
  return new Promise((res) => {
    if (typeof chrome === 'undefined' || !chrome.permissions || !chrome.permissions.contains) { res(true); return; }
    try { chrome.permissions.contains({ origins: NEWS_ORIGINS }, (g) => res(!!g)); } catch (e) { res(false); }
  });
}
function requestNewsPerm() {
  return new Promise((res) => {
    if (typeof chrome === 'undefined' || !chrome.permissions || !chrome.permissions.request) { res(true); return; }
    try { chrome.permissions.request({ origins: NEWS_ORIGINS }, (g) => res(!!g)); } catch (e) { res(false); }
  });
}
function newsOpen() {
  const m = document.getElementById('newsModal');
  return !!(m && !m.classList.contains('opacity-0'));
}
function showNewsList() {
  newsView = 'list';
  const list = document.getElementById('newsList');
  const art = document.getElementById('newsArticle');
  const back = document.getElementById('newsBackBtn');
  const refresh = document.getElementById('newsRefreshBtn');
  const foot = document.getElementById('newsArticleFoot');
  const fd = document.getElementById('newsFontDec');
  const fi = document.getElementById('newsFontInc');
  const pw = document.getElementById('newsProgressWrap');
  const sw = document.getElementById('newsSearchWrap');
  const fw = document.getElementById('newsFilters');
  if (list) list.classList.remove('hidden');
  if (art) art.classList.add('hidden');
  if (back) back.classList.add('hidden');
  if (refresh) refresh.classList.remove('hidden');
  if (foot) foot.classList.add('hidden');
  if (fd) { fd.classList.add('hidden'); fd.classList.remove('flex'); }
  if (fi) { fi.classList.add('hidden'); fi.classList.remove('flex'); }
  if (pw) pw.classList.add('hidden');
  if (sw) sw.classList.remove('hidden');
  if (fw) fw.classList.remove('hidden');
}
function openNews() {
  const m = document.getElementById('newsModal');
  if (m) m.classList.remove('opacity-0', 'pointer-events-none');
  if (newsView === 'list') fetchNews();
  if (!newsTimer) newsTimer = setInterval(() => { if (newsOpen() && newsView === 'list' && state.newsAuto !== false && !document.hidden) fetchNews(); }, 60000);
}
function closeNews() {
  const was = newsOpen();
  const m = document.getElementById('newsModal');
  if (m) m.classList.add('opacity-0', 'pointer-events-none');
  if (was) refreshNewsHome();
}
/* ---- News home extra: unread badge (same idea as the sports live badge) ----
   Quiet background fetch of every feed; silent on failure or without access. */
let newsHomeCtl = null;
let newsHomeTimer = null;
async function refreshNewsHome() {
  const badge = document.getElementById('newsLiveBadge');
  try {
    if (!navigator.onLine) throw 0;
    if (!state.newsFeeds.length) throw 0;
    if (!(await hasNewsPerm())) throw 0;
    if (newsHomeCtl) newsHomeCtl.abort();
    newsHomeCtl = new AbortController();
    const data = await loadNewsItems(newsHomeCtl.signal);
    if (!data) return;
    const n = countNewsUnread(data.items, state.newsRead);
    if (badge) {
      badge.textContent = n > 9 ? '9+' : String(n);
      badge.classList.toggle('hidden', !n);
      badge.classList.toggle('flex', !!n);
    }
  } catch (e) {
    if (badge) { badge.classList.add('hidden'); badge.classList.remove('flex'); }
  }
}
if (!newsHomeTimer) {
  // ponytail: no call here — feeds/read state loads async below; the restore,
  // import, modal-close and settings paths trigger the first fetch instead.
  // 5-minute poll, skipped while hidden or while the modal owns the data
  newsHomeTimer = setInterval(() => { if (!document.hidden && !newsOpen()) refreshNewsHome(); }, 300000);
}
function feedItemImg(n, baseUrl) {
  const pick = (el) => (el && (el.getAttribute('url') || el.getAttribute('href') || '')) || '';
  let raw = '';
  const thumbs = n.getElementsByTagName('media:thumbnail');
  if (thumbs.length) raw = pick(thumbs[0]);
  if (!raw) {
    const contents = n.getElementsByTagName('media:content');
    for (const c of contents) {
      const u = pick(c);
      const t = (c.getAttribute('type') || '') + ' ' + u;
      if (/image|\.jpe?g|\.png|\.webp|\.gif/i.test(t)) { raw = u; break; }
    }
  }
  if (!raw) {
    const encs = n.getElementsByTagName('enclosure');
    for (const e of encs) {
      const u = pick(e);
      if ((e.getAttribute('type') || '').indexOf('image/') === 0 || /\.(jpe?g|png|webp|gif)(\?|#|$)/i.test(u)) { raw = u; break; }
    }
  }
  if (!raw) {
    for (const tag of ['description', 'content:encoded', 'content', 'summary']) {
      const el = n.getElementsByTagName(tag)[0];
      if (!el) continue;
      const m = (el.textContent || '').match(/<img[^>]+src=["']?([^"'\s>]+)/i);
      if (m) { raw = m[1].replace(/&amp;/g, '&'); break; }
    }
  }
  if (!raw) return '';
  try { raw = new URL(raw, baseUrl).href; } catch (e) { return ''; }
  return /^https?:/i.test(raw) ? raw : '';
}
function parseFeed(xmlText, sourceName, feedUrl) {
  const doc = new DOMParser().parseFromString(xmlText, 'text/xml');
  if (doc.querySelector('parsererror')) throw new Error('invalid feed xml');
  const nodes = Array.from(doc.querySelectorAll('item, entry')).slice(0, 10);
  const txt = (n, sel) => { const e = n.querySelector(sel); return e ? (e.textContent || '').trim() : ''; };
  return nodes.map((n) => {
    const linkEl = n.querySelector('link');
    const rawLink = linkEl ? ((linkEl.getAttribute('href') || linkEl.textContent || '').trim()) : '';
    const dateTxt = txt(n, 'pubDate') || txt(n, 'published') || txt(n, 'updated');
    const ts = dateTxt ? Date.parse(dateTxt) : 0;
    return { title: txt(n, 'title') || '(untitled)', link: resolveNewsLink(rawLink, feedUrl), feed: feedUrl, ts: ts || 0, source: sourceName, img: feedItemImg(n, feedUrl) };
  }).filter((it) => !!it.link);
}
function newsFeedName(f) { return f.name || (f.url || '').replace(/^https?:\/\//, '').split('/')[0]; }
/* Fetch + parse every feed, newest first — shared by the window and the badge. */
async function loadNewsItems(signal) {
  const results = await Promise.allSettled(state.newsFeeds.map(async (f) => {
    const res = await fetch(f.url, { signal });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    return parseFeed(await res.text(), newsFeedName(f), f.url);
  }));
  if (signal && signal.aborted) return null;
  const items = [];
  const failed = [];
  results.forEach((r, i) => {
    if (r.status === 'fulfilled') items.push(...r.value);
    else if (!(r.reason && r.reason.name === 'AbortError')) failed.push(newsFeedName(state.newsFeeds[i]));
  });
  items.sort((a, b) => b.ts - a.ts);
  return { items, failed };
}
/* Unread count — pure, tested in logic-check. */
function countNewsUnread(items, read) {
  const seen = new Set(read || []);
  return (items || []).filter((it) => it && it.link && !seen.has(it.link)).length;
}
/* Resolve a feed item link (absolute or relative) — pure, tested in logic-check. */
function resolveNewsLink(link, feedUrl) {
  const l = String(link || '').trim();
  if (!l) return '';
  try {
    const u = new URL(l, feedUrl);
    return /^https?:/i.test(u.href) ? u.href : '';
  } catch (e) { return ''; }
}
/* Estimated minutes to read a text — pure, tested in logic-check. */
function newsReadMins(text) {
  const words = String(text || '').trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}
/* Filter visible news by a free-text query — pure, tested in logic-check. */
function filterNewsItems(items, q) {
  const needle = String(q || '').trim().toLowerCase();
  if (!needle) return (items || []).slice();
  return (items || []).filter((it) => ((it.title || '') + ' ' + (it.source || '')).toLowerCase().indexOf(needle) !== -1);
}
function isNewsRead(link) {
  return (state.newsRead || []).indexOf(link) !== -1;
}
function markNewsRead(link) {
  if (!link || isNewsRead(link)) return;
  state.newsRead = (state.newsRead || []).concat([link]).slice(-300);
  if (window.GaidridSave) window.GaidridSave();
}
async function fetchNews() {
  const box = document.getElementById('newsList');
  if (!box) return;
  if (!(await hasNewsPerm())) {
    box.innerHTML = '<div class="py-6 text-center"><p class="text-sm text-gray-500 dark:text-gray-400 mb-3">Allow site access to load RSS feeds from the web</p>'
      + '<button type="button" id="newsEnableBtn" class="px-4 py-2 rounded-xl bg-google-blue text-white text-xs font-semibold hover:bg-blue-600 transition-all">Enable news access</button></div>';
    const eb = document.getElementById('newsEnableBtn');
    if (eb) eb.addEventListener('click', async () => { if (await requestNewsPerm()) fetchNews(); });
    return;
  }
  if (!state.newsFeeds.length) {
    box.innerHTML = '<div class="py-6 text-center text-sm text-gray-400">No feeds yet — add one in settings</div>';
    return;
  }
  box.innerHTML = '<div class="flex items-center justify-center gap-2 py-6 text-xs text-gray-400"><i class="fa-solid fa-circle-notch animate-spin"></i>Loading feeds&hellip;</div>';
  if (newsCtl) newsCtl.abort();
  newsCtl = new AbortController();
  const signal = newsCtl.signal;
  const data = await loadNewsItems(signal);
  if (!data) return;
  const items = data.items;
  const failed = data.failed;
  if (!items.length && failed.length) {
    box.innerHTML = '<div class="py-6 text-center"><p class="text-sm text-gray-500 dark:text-gray-400 mb-1">Couldn\'t load feeds: ' + escHtml(failed.join(', ')) + '</p>'
      + '<button type="button" id="newsRetryBtn" class="mt-2 px-4 py-2 rounded-xl bg-gray-100 dark:bg-white/[0.06] text-xs font-semibold text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-white/10 hover:bg-gray-200 dark:hover:bg-white/10 transition-all">Retry</button></div>';
    const rb = document.getElementById('newsRetryBtn');
    if (rb) rb.addEventListener('click', fetchNews);
    return;
  }
  items.sort((a, b) => b.ts - a.ts);
  newsAll = items;
  newsWarn = failed.length ? '<div class="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-[11px] text-amber-700 dark:text-amber-300">Couldn\'t load: ' + escHtml(failed.join(', ')) + '</div>' : '';
  renderNewsList();
}
function wireNewsImgs(box) {
  box.querySelectorAll('img').forEach((img) => {
    const hide = () => img.classList.add('invisible');
    if (img.complete && img.naturalWidth === 0) hide();
    else img.addEventListener('error', hide);
  });
}
let newsAll = [];
let newsWarn = '';
function paintNewsFilters() {
  const wrap = document.getElementById('newsFilters');
  if (wrap) {
    const feeds = state.newsFeeds || [];
    wrap.classList.toggle('hidden', !feeds.length);
    const cur = state.newsFilter || 'all';
    const btn = (key, label) => '<button type="button" data-newsfilter="' + escHtml(key) + '" class="px-3 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all '
      + (cur === key ? 'bg-[#212832] text-white dark:bg-white dark:text-[#212832]' : 'bg-gray-100 dark:bg-white/[0.06] text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10') + '">'
      + escHtml(label) + '</button>';
    wrap.innerHTML = btn('all', 'All') + feeds.map((f) => btn(f.url, newsFeedName(f))).join('');
  }
  const mr = document.getElementById('newsMarkRead');
  if (mr) mr.classList.toggle('hidden', !newsAll.some((it) => !isNewsRead(it.link)));
}
function renderNewsList() {
  const box = document.getElementById('newsList');
  if (!box) return;
  paintNewsFilters();
  const q = (document.getElementById('newsSearchInput') || {}).value || '';
  const cur = state.newsFilter || 'all';
  const pool = cur === 'all' ? newsAll : newsAll.filter((it) => it.feed === cur);
  newsItems = filterNewsItems(pool, q);
  const s = document.getElementById('newsSearchWrap');
  if (s) s.classList.toggle('hidden', !newsAll.length && !q);
  if (!newsItems.length) {
    box.innerHTML = newsWarn + '<div class="py-6 text-center text-sm text-gray-400">' + (newsAll.length ? 'No stories match' : 'No stories') + '</div>';
    return;
  }
  box.innerHTML = newsWarn + newsItems.map((it, i) => {
    const d = it.ts ? new Date(it.ts).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : '';
    return '<button type="button" data-news-idx="' + i + '" class="w-full text-left px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-white/[0.06] border border-gray-100 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/10 transition-all">'
      + '<div class="flex gap-3 items-start">'
      + '<div class="min-w-0 flex-1">'
      + '<div class="flex items-center gap-2 mb-0.5">'
      + (!isNewsRead(it.link) ? '<span class="news-unread w-1.5 h-1.5 rounded-full bg-google-blue shrink-0"></span>' : '')
      + '<span class="text-[10px] font-bold uppercase tracking-wider text-google-blue truncate">' + escHtml(it.source) + '</span>'
      + '<span class="text-[10px] text-gray-400 ml-auto shrink-0">' + escHtml(d) + '</span></div>'
      + '<div class="text-sm font-medium text-gray-800 dark:text-gray-100 leading-snug">' + escHtml(it.title) + '</div>'
      + '</div>'
      + (it.img ? '<img src="' + escHtml(it.img) + '" alt="" loading="lazy" referrerpolicy="no-referrer" class="w-14 h-14 rounded-lg object-cover shrink-0 bg-gray-100 dark:bg-white/10">' : '')
      + '</div></button>';
  }).join('');
  wireNewsImgs(box);
}
function sanitizeArticle(html, baseUrl) {
  const box = document.createElement('div');
  box.innerHTML = html;
  box.querySelectorAll('script,style,iframe,object,embed,form,input,button,video,audio,canvas,svg,nav,header,footer').forEach((el) => el.remove());
  const allow = { P: 1, BR: 1, H1: 1, H2: 1, H3: 1, H4: 1, UL: 1, OL: 1, LI: 1, BLOCKQUOTE: 1, STRONG: 1, EM: 1, I: 1, B: 1, CODE: 1, PRE: 1, A: 1, IMG: 1, FIGURE: 1, FIGCAPTION: 1, HR: 1, SPAN: 1, DIV: 1 };
  const keep = { A: ['href'], IMG: ['src', 'alt'] };
  Array.from(box.querySelectorAll('*')).forEach((el) => {
    if (!allow[el.tagName]) { el.replaceWith(...el.childNodes); return; }
    const okAttrs = keep[el.tagName] || [];
    Array.from(el.attributes).forEach((a) => { if (!okAttrs.includes(a.name)) el.removeAttribute(a.name); });
    if (el.tagName === 'A') {
      const href = el.getAttribute('href') || '';
      let final = '';
      try { final = new URL(href, baseUrl).href; } catch (e) {}
      if (/^https?:/i.test(final)) el.setAttribute('href', final);
      else el.removeAttribute('href');
      el.setAttribute('target', '_blank');
      el.setAttribute('rel', 'noopener');
    } else if (el.tagName === 'IMG') {
      let src = '';
      try { src = new URL(el.getAttribute('src') || '', baseUrl).href; } catch (e) {}
      if (/^(https?:|data:image\/)/i.test(src)) el.setAttribute('src', src);
      else el.remove();
    }
  });
  return box.innerHTML;
}
async function openArticle(idx) {
  const item = newsItems[idx];
  if (!item) return;
  newsView = 'article';
  const list = document.getElementById('newsList');
  const art = document.getElementById('newsArticle');
  const back = document.getElementById('newsBackBtn');
  const refresh = document.getElementById('newsRefreshBtn');
  const foot = document.getElementById('newsArticleFoot');
  const srcEl = document.getElementById('newsArticleSource');
  const openTab = document.getElementById('newsOpenTab');
  if (list) list.classList.add('hidden');
  if (back) back.classList.remove('hidden');
  if (refresh) refresh.classList.add('hidden');
  if (foot) foot.classList.remove('hidden');
  if (srcEl) srcEl.textContent = item.source;
  if (openTab) openTab.setAttribute('href', item.link);
  if (!art) return;
  art.classList.remove('hidden');
  art.innerHTML = '<div class="flex items-center justify-center gap-2 py-6 text-xs text-gray-400"><i class="fa-solid fa-circle-notch animate-spin"></i>Loading article&hellip;</div>';
  if (newsArticleCtl) newsArticleCtl.abort();
  newsArticleCtl = new AbortController();
  let content = '';
  let title = item.title;
  try {
    const res = await fetch(item.link, { signal: newsArticleCtl.signal });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const html = await res.text();
    const doc = new DOMParser().parseFromString(html, 'text/html');
    // DOMParser docs inherit the page baseURI — resolve relative URLs against the
    // article URL first, otherwise Readability would resolve them to the wrong origin
    ['href', 'src'].forEach((attr) => {
      doc.querySelectorAll('[' + attr + ']').forEach((el) => {
        const v = el.getAttribute(attr) || '';
        if (!v || /^(https?:|data:|mailto:|#)/i.test(v)) return;
        try { el.setAttribute(attr, new URL(v, item.link).href); } catch (e) {}
      });
    });
    let parsed = null;
    if (typeof Readability !== 'undefined') {
      try { parsed = new Readability(doc).parse(); } catch (e) { parsed = null; }
    }
    if (!parsed || !parsed.content) throw new Error('no readable content');
    content = sanitizeArticle(parsed.content, item.link);
    title = parsed.title || title;
  } catch (e) {
    if (e && e.name === 'AbortError') return;
    content = '<div class="py-4 text-center"><p class="text-sm text-gray-500 dark:text-gray-400 mb-1">Couldn\'t load this article in reading mode.</p>'
      + '<p class="text-xs text-gray-400">Use "Open in new tab" to read it on the source site.</p></div>';
  }
  const mins = newsReadMins(title + ' ' + String(content).replace(/<[^>]+>/g, ' '));
  art.innerHTML = '<div class="text-[10px] font-bold uppercase tracking-wider text-google-blue mb-1">' + escHtml(item.source) + (mins ? ' · ~' + mins + ' min read' : '') + '</div>'
    + '<h2 class="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3 leading-snug">' + escHtml(title) + '</h2>'
    + '<div class="article-body text-sm text-gray-700 dark:text-gray-300 leading-relaxed">' + content + '</div>';
  applyNewsFont();
  const bar = document.getElementById('newsProgress');
  if (bar) bar.style.width = '0%';
  art.scrollTop = 0;
  const fd = document.getElementById('newsFontDec');
  const fi = document.getElementById('newsFontInc');
  const pw = document.getElementById('newsProgressWrap');
  const sw = document.getElementById('newsSearchWrap');
  const fw = document.getElementById('newsFilters');
  if (fd) { fd.classList.remove('hidden'); fd.classList.add('flex'); }
  if (fi) { fi.classList.remove('hidden'); fi.classList.add('flex'); }
  if (pw) pw.classList.remove('hidden');
  if (sw) sw.classList.add('hidden');
  if (fw) fw.classList.add('hidden');
}
function applyNewsFont() {
  const art = document.getElementById('newsArticle');
  const bd = art ? art.querySelector('.article-body') : null;
  if (bd) bd.style.fontSize = (14 + (state.newsFontStep || 0)) + 'px';
}
(function gaidridNews() {
  const btn = document.getElementById('newsBtn');
  if (btn) btn.addEventListener('click', openNews);
  const c = document.getElementById('closeNewsBtn');
  if (c) c.addEventListener('click', closeNews);
  const r = document.getElementById('newsRefreshBtn');
  if (r) r.addEventListener('click', () => { showNewsList(); fetchNews(); });
  const b = document.getElementById('newsBackBtn');
  if (b) b.addEventListener('click', showNewsList);
  const list = document.getElementById('newsList');
  if (list) list.addEventListener('click', (e) => {
    const btn2 = e.target && e.target.closest ? e.target.closest('[data-news-idx]') : null;
    if (!btn2 || !list.contains(btn2)) return;
    const idx = parseInt(btn2.getAttribute('data-news-idx'), 10);
    const item = newsItems[idx];
    if (item && item.link && !isNewsRead(item.link)) {
      markNewsRead(item.link);
      const dot = btn2.querySelector('.news-unread');
      if (dot) dot.remove();
      paintNewsFilters();
    }
    openArticle(idx);
  });
  const filt = document.getElementById('newsFilters');
  if (filt) filt.addEventListener('click', (e) => {
    const b = e.target && e.target.closest ? e.target.closest('[data-newsfilter]') : null;
    if (!b || !filt.contains(b)) return;
    state.newsFilter = b.getAttribute('data-newsfilter') || 'all';
    if (window.GaidridSave) window.GaidridSave();
    renderNewsList();
  });
  const si = document.getElementById('newsSearchInput');
  if (si) si.addEventListener('input', renderNewsList);
  const mr = document.getElementById('newsMarkRead');
  if (mr) mr.addEventListener('click', () => {
    const links = newsAll.map((it) => it.link).filter(Boolean);
    state.newsRead = Array.from(new Set((state.newsRead || []).concat(links))).slice(-300);
    if (window.GaidridSave) window.GaidridSave();
    renderNewsList();
    const badge = document.getElementById('newsLiveBadge');
    if (badge) { badge.classList.add('hidden'); badge.classList.remove('flex'); }
  });
  const stepFont = (d) => {
    state.newsFontStep = Math.max(-2, Math.min(2, (state.newsFontStep || 0) + d));
    if (window.GaidridSave) window.GaidridSave();
    applyNewsFont();
  };
  const fd = document.getElementById('newsFontDec');
  const fi = document.getElementById('newsFontInc');
  if (fd) fd.addEventListener('click', () => stepFont(-1));
  if (fi) fi.addEventListener('click', () => stepFont(1));
  const art = document.getElementById('newsArticle');
  if (art) art.addEventListener('scroll', () => {
    const bar = document.getElementById('newsProgress');
    if (!bar) return;
    const max = art.scrollHeight - art.clientHeight;
    bar.style.width = (max > 0 ? Math.min(100, (art.scrollTop / max) * 100) : 0) + '%';
  });
})();

/* ---- Standings data: chain + teams + per-team records (soccer fallback) ---- */
const sportsTableCache = {};
async function fetchJSON(url, signal) {
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error('HTTP ' + res.status);
  return res.json();
}
const espnHttps = (u) => String(u || '').replace(/^http:/, 'https:');
function sportsStatMap(stats) {
  const m = {};
  (stats || []).forEach((s) => {
    if (!s || !s.name) return;
    m[String(s.name).toLowerCase()] = (s.displayValue !== undefined && s.displayValue !== null && s.displayValue !== '') ? s.displayValue : String(s.value);
  });
  return m;
}
function sportsRowCells(sm) {
  return {
    p: sm.gamesplayed || sm.games || '–',
    w: sm.wins || '–',
    d: sm.draws || sm.ties || '–',
    l: sm.losses || '–',
    pts: sm.points || sm.pts || '–',
    gd: sm.pointdifferential || '–'
  };
}
function sportsRecordURL(tableURL, teamRef) {
  const tid = (((teamRef || '').match(/\/teams\/(\d+)/)) || [])[1];
  const tp = ((tableURL || '').match(/\/types\/(\d+)(?:\/|$)/) || [])[1];
  if (!tid || !tp) return null;
  const noQ = tableURL.split('?')[0];
  const seasonBase = noQ.split('/types/')[0];
  const q = tableURL.includes('?') ? tableURL.slice(tableURL.indexOf('?')) : '';
  return seasonBase + '/types/' + tp + '/teams/' + tid + '/record' + q;
}
async function fetchSportsTableData(lg, signal) {
  const key = lg.sport + '/' + lg.league;
  const now = Date.now();
  const cached = sportsTableCache[key] || {};
  const boot = await fetchJSON('https://sports.core.api.espn.com/v2/sports/' + lg.sport + '/leagues/' + lg.league + '/standings?lang=en&region=us', signal);
  if (!boot || !boot.$ref) return { groups: [] };
  const items = await fetchJSON(espnHttps(boot.$ref), signal);
  const over = ((items.items) || []).find((x) => x.name === 'overall') || items.items[0];
  if (!over) return { groups: [] };
  const tableURL = espnHttps(over.$ref);
  const tbl = await fetchJSON(tableURL, signal);
  const rows = tbl.standings || [];
  if (!cached.metaDone) {
    const idSet = {};
    rows.forEach((row) => {
      const m = (((row.team && row.team.$ref) || '').match(/\/teams\/(\d+)/)) || [];
      if (m[1]) idSet[m[1]] = (row.team && row.team.$ref) || '';
    });
    const sess = sportsMetaCache[key] || {};
    try {
      const stored = await sportsMetaStoreGet();
      Object.keys((stored && stored[key]) || {}).forEach((tid) => { sess[tid] = stored[key][tid]; });
    } catch (e) {}
    const missing = Object.keys(idSet).filter((tid) => !sess[tid]);
    if (missing.length) {
      const fresh = {};
      await Promise.all(missing.map(async (tid) => {
        try {
          const t = await fetchJSON(espnHttps(idSet[tid]), signal);
          fresh[tid] = {
            name: t.shortDisplayName || t.abbreviation || t.displayName || ('#' + tid),
            logo: (t.logos && t.logos[0] && t.logos[0].href) || ''
          };
        } catch (e) { if (e && e.name === 'AbortError') throw e; }
      }));
      Object.keys(fresh).forEach((tid) => { sess[tid] = fresh[tid]; });
      if (Object.keys(fresh).length) sportsMetaStorePut(key, fresh);
    }
    sportsMetaCache[key] = sess;
    cached.metaDone = true;
  }
  const metaOf = (tid) => ((sportsMetaCache[key] || {})[tid]) || { name: '#' + (tid || '?'), logo: '' };
  const jobs = rows.map(async (row) => {
    const teamRef = (row.team && row.team.$ref) || '';
    const tid = ((teamRef.match(/\/teams\/(\d+)/)) || [])[1] || '';
    const meta = metaOf(tid);
    let sm = {};
    const inline = (((row.records || [])[0]) || {}).stats;
    if (inline && inline.length) sm = sportsStatMap(inline);
    else {
      const rc = (cached.records || {})[tid];
      if (rc && now - rc.at < 600000) sm = rc.sm;
      else {
        const url = sportsRecordURL(tableURL, teamRef);
        if (url) {
          try {
            const rec = await fetchJSON(url, signal);
            const it = (rec.items || [])[0] || rec || {};
            sm = sportsStatMap(it.stats);
            cached.records = cached.records || {};
            cached.records[tid] = { sm, at: Date.now() };
          } catch (e) { if (e && e.name === 'AbortError') throw e; sm = {}; }
        }
      }
    }
    const cells = sportsRowCells(sm);
    return { tid: tid || '', name: meta.name, logo: meta.logo, p: cells.p, w: cells.w, d: cells.d, l: cells.l, gd: cells.gd, pts: cells.pts, has: Object.keys(sm).length > 0 };
  });
  const built = await Promise.all(jobs);
  sportsTableCache[key] = cached;
  const usable = built.filter((r) => r.has);
  return { groups: usable.length ? [{ name: '', rows: usable }] : [], cols: SPORTS_COLS[lg.sport] };
}

/* ---- Standings columns per sport (points only meaningful in soccer) ---- */
const SPORTS_COLS = {
  soccer: [['P', 'p'], ['W', 'w'], ['D', 'd'], ['L', 'l'], ['GD', 'gd'], ['Pts', 'pts']],
  basketball: [['GP', 'p'], ['W', 'w'], ['L', 'l']],
  football: [['W', 'w'], ['L', 'l'], ['T', 'd']],
  baseball: [['P', 'p'], ['W', 'w'], ['L', 'l']],
  hockey: [['P', 'p'], ['W', 'w'], ['L', 'l'], ['Pts', 'pts']]
};
function renderSportsTable(groups, cols) {
  const box = document.getElementById('sportsBody');
  if (!box) return;
  cols = cols || [['P', 'p'], ['W', 'w'], ['D', 'd'], ['L', 'l'], ['Pts', 'pts']];
  if (!groups.length) {
    const lg = sportsLeague();
    box.innerHTML = '<div class="text-center text-xs text-gray-400 py-10">No standings for ' + escHtml(lg.full) + ' yet<br><span class="text-[11px]">Use the refresh button to try again</span></div>';
    return;
  }
  const tpl = '1fr repeat(' + cols.length + ',28px)';
  box.innerHTML = groups.map((g) => {
    const head = '<div class="grid sticky top-0 z-10 items-center gap-1 px-3.5 pt-1 pb-0.5 bg-white dark:bg-[#232c38] text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1" style="grid-template-columns:' + tpl + '">'
      + '<span>' + escHtml(g.name || (sportsLeague() || {}).full || 'Table') + '</span>'
      + cols.map((c) => '<span class="text-center">' + c[0] + '</span>').join('') + '</div>';
    const rows = g.rows.map((r, i) => {
      const cells = cols.map((c) => '<span class="text-center tabular-nums text-sm ' + (c[0] === 'Pts' ? 'font-bold text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-300') + '">' + escHtml(r[c[1]]) + '</span>').join('');
      return '<div class="grid items-center gap-1 px-3.5 py-1.5 rounded-xl ' + (i % 2 ? '' : 'bg-gray-50 dark:bg-white/[0.04]') + '" style="grid-template-columns:' + tpl + '">'
        + '<span class="flex items-center gap-2 min-w-0"><span class="text-[10px] font-bold text-gray-400 w-4 shrink-0">' + (i + 1) + '</span>'
        + '<img loading="lazy" data-tlogo src="' + r.logo + '" alt="" class="w-5 h-5 object-contain shrink-0">'
        + '<span class="text-xs font-medium text-gray-700 dark:text-gray-200 truncate">' + escHtml(r.name) + '</span>'
        + sportsFavBtnHTML({ id: r.tid, name: r.name, logo: r.logo }) + '</span>'
        + cells + '</div>';
    }).join('');
    return '<div class="mb-3">' + head + rows + '</div>';
  }).join('');
  wireSportsLogos(box);
}

/* ---- Sports favorites (multiple teams per league) + Sports settings ---- */
// Old saves stored one team object (or null) per league; normalize to arrays.
function migrateSportsFavs() {
  state.sportsFav = state.sportsFav || {};
  Object.keys(state.sportsFav).forEach((k) => {
    const v = state.sportsFav[k];
    if (!v) state.sportsFav[k] = [];
    else if (Array.isArray(v)) state.sportsFav[k] = v.filter((t) => t && t.id).map((t) => ({ id: String(t.id), name: t.name || '', logo: t.logo || '' }));
    else if (v.id) state.sportsFav[k] = [{ id: String(v.id), name: v.name || '', logo: v.logo || '' }];
    else state.sportsFav[k] = [];
  });
}
function sportsFavList() {
  const lg = sportsLeague() || {};
  const v = (state.sportsFav || {})[lg.key];
  return Array.isArray(v) ? v : [];
}
function isFavTeam(id) {
  if (!id) return false;
  return sportsFavList().some((t) => String(t.id) === String(id));
}
function setSportsFav(id, name, logo) {
  if (!id) return;
  const lg = sportsLeague() || {};
  if (!lg.key) return;
  state.sportsFav = state.sportsFav || {};
  const arr = sportsFavList().slice();
  const i = arr.findIndex((t) => String(t.id) === String(id));
  if (i >= 0) arr.splice(i, 1);
  else arr.push({ id: String(id), name: name || '', logo: logo || '' });
  state.sportsFav[lg.key] = arr;
  repaintSports();
  refreshSportsHome();
}
function sportsFavBtnHTML(t) {
  const on = isFavTeam(t.id);
  return '<button type="button" data-favteam="' + escHtml(t.id || '') + '" data-favname="' + escHtml(t.name) + '" data-favlogo="' + escHtml(t.logo) + '" aria-pressed="' + (on ? 'true' : 'false') + '" aria-label="Favorite ' + escHtml(t.name) + '" class="shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all ' + (on ? 'text-amber-400' : 'text-gray-300 dark:text-gray-600 hover:text-amber-400') + '" title="Favorite team"><i class="fa-solid fa-star text-[10px]"></i></button>';
}
function paintSportsSettings() {
  const on = 'px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border bg-[#212832] text-white border-[#212832] dark:bg-white dark:text-[#212832] dark:border-white';
  const off = 'px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border bg-gray-100 dark:bg-white/[0.06] text-gray-600 dark:text-gray-300 border-gray-200 dark:border-white/10 hover:bg-gray-200 dark:hover:bg-white/10';
  document.querySelectorAll('[data-defleague]').forEach((b) => {
    b.className = (b.getAttribute('data-defleague') === state.sportsLeague) ? on : off;
  });
  const ab = document.getElementById('sportsAutoBtn');
  if (ab) paintToggle(ab, document.getElementById('sportsAutoCircle'), state.sportsAuto !== false);
  const fb = document.getElementById('sportsFinishedBtn');
  if (fb) paintToggle(fb, document.getElementById('sportsFinishedCircle'), state.sportsShowFinished !== false);
}
(function gaidridSportsFav() {
  const box = document.getElementById('sportsBody');
  if (box) box.addEventListener('click', (e) => {
    const b = e.target && e.target.closest ? e.target.closest('[data-favteam]') : null;
    if (!b || !box.contains(b)) return;
    e.preventDefault();
    e.stopPropagation();
    setSportsFav(b.getAttribute('data-favteam'), b.getAttribute('data-favname'), b.getAttribute('data-favlogo'));
  });
})();

/* ---- Favorite teams tab (inside the Sports window, no dropdown) ---- */
function renderFavTab() {
  const box = document.getElementById('sportsBody');
  if (!box) return;
  const groups = SPORTS_LEAGUES.map((l) => ({
    lg: l,
    teams: ((state.sportsFav || {})[l.key] || []).filter((t) => t && t.id)
  })).filter((g) => g.teams.length);
  if (!groups.length) {
    box.innerHTML = '<div class="text-center text-xs text-gray-400 py-10">No starred teams yet<br><span class="text-[11px]">Tap the star on any team to keep it here</span><br><button type="button" data-favbrowse="1" class="inline-block mt-3 px-4 py-1.5 rounded-xl text-xs font-semibold bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/15 transition-all">Browse matches</button></div>';
    return;
  }
  box.innerHTML = groups.map((g) =>
    '<div class="px-1 pt-2 pb-0.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">' + escHtml(g.lg.full) + '</div>'
    + g.teams.map((t) =>
      '<div class="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-white/[0.04] hover:bg-gray-100 dark:hover:bg-white/[0.08] cursor-pointer transition-colors" data-favopen="' + g.lg.key + '">'
      + (t.logo ? '<img src="' + escHtml(t.logo) + '" alt="" class="w-6 h-6 object-contain shrink-0">' : '<span class="w-6 h-6 rounded-full bg-gray-200 dark:bg-white/10 flex items-center justify-center text-[10px] font-bold text-gray-400 shrink-0">' + escHtml((t.name || '?').trim().charAt(0).toUpperCase()) + '</span>')
      + '<span class="text-sm font-medium text-gray-700 dark:text-gray-200 truncate flex-1">' + escHtml(t.name || 'Team') + '</span>'
      + '<button type="button" data-favdel="' + g.lg.key + ':' + escHtml(t.id) + '" aria-label="Remove ' + escHtml(t.name || 'team') + ' from favorites" class="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-gray-300 dark:text-gray-600 hover:text-red-500 transition-colors"><i class="fa-solid fa-xmark text-[10px]"></i></button>'
      + '</div>').join('')
  ).join('');
}
(function gaidridFavTab() {
  const box = document.getElementById('sportsBody');
  if (!box) return;
  box.addEventListener('click', (e) => {
    const browse = e.target && e.target.closest ? e.target.closest('[data-favbrowse]') : null;
    if (browse && box.contains(browse)) {
      sportsTab = 'matches';
      fetchSports();
      return;
    }
    const del = e.target && e.target.closest ? e.target.closest('[data-favdel]') : null;
    if (del && box.contains(del)) {
      e.stopPropagation();
      const parts = (del.getAttribute('data-favdel') || '').split(':');
      const arr = ((state.sportsFav || {})[parts[0]] || []).filter((t) => t && String(t.id) !== parts[1]);
      state.sportsFav = state.sportsFav || {};
      state.sportsFav[parts[0]] = arr;
      renderFavTab();
      refreshSportsHome();
      if (window.GaidridSave) window.GaidridSave();
      return;
    }
    const row = e.target && e.target.closest ? e.target.closest('[data-favopen]') : null;
    if (row && box.contains(row)) {
      state.sportsLeague = row.getAttribute('data-favopen');
      sportsTab = 'matches';
      fetchSports();
    }
  });
})();
(function gaidridSportsSettings() {
  const dr = document.getElementById('defLeagueRow');
  if (dr) {
    dr.innerHTML = SPORTS_LEAGUES.map((l) =>
      '<button type="button" data-defleague="' + l.key + '" class="px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border">' + l.label + '</button>'
    ).join('');
    dr.addEventListener('click', (e) => {
      const b = e.target && e.target.closest ? e.target.closest('[data-defleague]') : null;
      if (!b || !dr.contains(b)) return;
      state.sportsLeague = b.getAttribute('data-defleague');
      paintSportsSettings();
      refreshSportsHome();
    });
  }
  const ab = document.getElementById('sportsAutoBtn');
  if (ab) ab.addEventListener('click', () => {
    state.sportsAuto = !(state.sportsAuto !== false);
    paintToggle(ab, document.getElementById('sportsAutoCircle'), state.sportsAuto !== false);
  });
  const fb = document.getElementById('sportsFinishedBtn');
  if (fb) fb.addEventListener('click', () => {
    state.sportsShowFinished = !(state.sportsShowFinished !== false);
    paintToggle(fb, document.getElementById('sportsFinishedCircle'), state.sportsShowFinished !== false);
    repaintSports();
  });
  paintSportsSettings();
})();

function paintNewsSettings() {
  const box = document.getElementById('newsFeedsList');
  if (box) {
    if (!state.newsFeeds.length) {
      box.innerHTML = '<div class="text-xs text-gray-400 px-1">No feeds yet</div>';
    } else {
      box.innerHTML = state.newsFeeds.map((f, i) =>
        '<div class="flex items-center justify-between gap-2 px-3 py-1.5 rounded-xl bg-gray-50 dark:bg-white/[0.06] border border-gray-100 dark:border-white/10">'
        + '<div class="min-w-0"><div class="text-xs font-semibold text-gray-700 dark:text-gray-200 truncate">' + escHtml(newsFeedName(f)) + '</div>'
        + '<div class="text-[10px] text-gray-400 truncate">' + escHtml(f.url) + '</div></div>'
        + '<button type="button" data-delfeed="' + i + '" aria-label="Remove feed" class="w-6 h-6 rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-all shrink-0"><i class="fa-solid fa-xmark text-[10px]"></i></button>'
        + '</div>').join('');
    }
  }
  const nb = document.getElementById('newsAutoBtn');
  if (nb) paintToggle(nb, document.getElementById('newsAutoCircle'), state.newsAuto !== false);
}
(function gaidridNewsSettings() {
  const box = document.getElementById('newsFeedsList');
  if (box) box.addEventListener('click', (e) => {
    const d = e.target && e.target.closest ? e.target.closest('[data-delfeed]') : null;
    if (!d || !box.contains(d)) return;
    state.newsFeeds.splice(parseInt(d.getAttribute('data-delfeed'), 10), 1);
    paintNewsSettings();
    if (window.GaidridSave) window.GaidridSave();
    refreshNewsHome();
  });
  const input = document.getElementById('newsFeedInput');
  const err = document.getElementById('newsFeedErr');
  const add = document.getElementById('newsFeedAdd');
  const sayErr = (t) => { if (err) { err.textContent = t; err.classList.remove('hidden'); } };
  const doAdd = async () => {
    if (!input) return;
    const raw = (input.value || '').trim();
    let u = null;
    try { u = new URL(raw); } catch (e) {}
    if (!u || (u.protocol !== 'http:' && u.protocol !== 'https:')) { sayErr('Enter a valid http(s) feed URL'); return; }
    if (err) err.classList.add('hidden');
    if (state.newsFeeds.some((f) => f.url === u.href)) { input.value = ''; return; }
    if (add) add.disabled = true;
    try {
      // Verify the feed is readable before adding, and take its real title.
      if (!(await hasNewsPerm())) {
        if (!(await requestNewsPerm())) { sayErr('Allow site access first, then try again'); return; }
      }
      const res = await fetch(u.href);
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const xml = await res.text();
      parseFeed(xml, 'verify', u.href);
      let name = u.hostname.replace(/^www\./, '');
      try {
        const doc = new DOMParser().parseFromString(xml, 'text/xml');
        if (!doc.querySelector('parsererror')) {
          const t = doc.querySelector('channel > title, feed > title');
          if (t && t.textContent.trim()) name = t.textContent.trim().slice(0, 60);
        }
      } catch (e) {}
      state.newsFeeds.push({ name, url: u.href, builtin: false });
      input.value = '';
      paintNewsSettings();
      if (window.GaidridSave) window.GaidridSave();
      refreshNewsHome();
    } catch (e) {
      sayErr("Couldn't read a valid feed at this URL");
    } finally {
      if (add) add.disabled = false;
    }
  };
  if (add) add.addEventListener('click', doAdd);
  if (input) input.addEventListener('keydown', (e) => { if (e.key === 'Enter') doAdd(); });
  const rst = document.getElementById('newsFeedsReset');
  if (rst) rst.addEventListener('click', () => {
    state.newsFeeds = JSON.parse(JSON.stringify(NEWS_DEFAULTS));
    state.newsFilter = 'all';
    paintNewsSettings();
    if (window.GaidridSave) window.GaidridSave();
    refreshNewsHome();
  });
  const ab = document.getElementById('newsAutoBtn');
  if (ab) ab.addEventListener('click', () => {
    state.newsAuto = !(state.newsAuto !== false);
    paintToggle(ab, document.getElementById('newsAutoCircle'), state.newsAuto !== false);
  });
  paintNewsSettings();
})();

/* ---- Team meta cache (names+logos persist across sessions) ---- */
const sportsMetaCache = {};
const SPORTS_META_KEY = 'gaidrid-teammeta-v1';
function sportsMetaStoreGet() {
  return new Promise((res) => {
    try {
      if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
        chrome.storage.sync.get(SPORTS_META_KEY, (r) => res((r && r[SPORTS_META_KEY]) || {}));
      } else if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
        chrome.storage.local.get(SPORTS_META_KEY, (r) => res((r && r[SPORTS_META_KEY]) || {}));
      } else {
        try { res(JSON.parse(localStorage.getItem(SPORTS_META_KEY) || '{}')); } catch (e) { res({}); }
      }
    } catch (e) { res({}); }
  });
}
function sportsMetaStorePut(leagueKey, fresh) {
  sportsMetaStoreGet().then((all) => {
    all[leagueKey] = Object.assign(all[leagueKey] || {}, fresh);
    const payload = {};
    payload[SPORTS_META_KEY] = all;
    try {
      if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) chrome.storage.sync.set(payload, () => {});
      else if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) chrome.storage.local.set(payload, () => {});
      else { try { localStorage.setItem(SPORTS_META_KEY, JSON.stringify(all)); } catch (e) {} }
    } catch (e) {}
  }).catch(() => {});
}
