import { useState, useEffect } from 'react';

interface WeatherData {
  city: string;
  temp: number;
  condition: string;
  isDay: boolean;
  high: number;
  low: number;
  humidity: number;
  wind: number;
  feelsLike: number;
  precipitation: number;
  uvIndex?: number;
  sunrise?: string;
  sunset?: string;
  hourly: { time: string; temp: number; condition: string; isDay: boolean }[];
  forecast: { day: string; temp: number; condition: string }[];
}

const mapWmoCodeToCondition = (code: number, isDay = true): string => {
  if (code === 0) return isDay ? 'Sunny' : 'Clear';
  if (code === 1) return isDay ? 'Mostly Sunny' : 'Mostly Clear';
  if (code === 2) return 'Partly Cloudy';
  if (code === 3) return 'Cloudy';
  if (code === 45 || code === 48) return 'Foggy';
  if ((code >= 51 && code <= 65) || (code >= 80 && code <= 82)) return 'Rainy';
  if (code >= 71 && code <= 77) return 'Snowy';
  if (code >= 95 && code <= 99) return 'Stormy';
  return 'Cloudy';
};

const formatTimeStr = (isoStr?: string): string => {
  if (!isoStr) return '';
  try {
    const date = new Date(isoStr);
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    return `${hours}:${minutes} ${ampm}`;
  } catch {
    return '';
  }
};

const fetchGeocode = async (cityName: string) => {
  const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`;
  const geoRes = await fetch(geoUrl);
  if (!geoRes.ok) throw new Error('Geocoding service unavailable');
  const geoData = await geoRes.json();

  if (!geoData.results || geoData.results.length === 0) {
    throw new Error('City not found');
  }

  const result = geoData.results[0];
  const { latitude, longitude, name, country } = result;
  const formattedCityName = `${name}, ${country || ''}`;

  return { latitude, longitude, name, formattedCityName };
};

const generateFallbackWeather = (cityName: string): WeatherData => {
  const hash = cityName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const temp = 10 + (hash % 20);
  const conditions = ['Sunny', 'Cloudy', 'Rainy', 'Foggy', 'Stormy'];
  const condition = conditions[hash % conditions.length];
  const humidity = 40 + (hash % 50);
  const wind = 5 + (hash % 25);

  const isCurrentlyNight = new Date().getHours() < 6 || new Date().getHours() > 18;

  const fallbackHourly = [];
  const startHour = new Date().getHours();
  for (let i = 0; i < 5; i++) {
    const h = (startHour + i * 2) % 24;
    const isHDay = h >= 6 && h <= 18;
    const ampm = h >= 12 ? 'PM' : 'AM';
    const displayH = h % 12 === 0 ? 12 : h % 12;
    fallbackHourly.push({
      time: `${displayH} ${ampm}`,
      temp: temp + Math.round(Math.sin(i) * 2),
      condition: isHDay && condition === 'Sunny' ? 'Sunny' : 'Cloudy',
      isDay: isHDay
    });
  }

  return {
    city: cityName.charAt(0).toUpperCase() + cityName.slice(1) + ' (Offline)',
    temp,
    condition: isCurrentlyNight && condition === 'Sunny' ? 'Clear Night' : condition,
    isDay: !isCurrentlyNight,
    high: temp + 3,
    low: temp - 4,
    humidity,
    wind,
    feelsLike: temp - 1,
    precipitation: 0.2,
    uvIndex: 4.5,
    sunrise: '6:12 AM',
    sunset: '8:24 PM',
    hourly: fallbackHourly,
    forecast: [
      { day: 'Thu', temp: temp + 1, condition: conditions[(hash + 1) % conditions.length] },
      { day: 'Fri', temp: temp - 2, condition: conditions[(hash + 2) % conditions.length] },
      { day: 'Sat', temp: temp + 2, condition: conditions[(hash + 3) % conditions.length] },
    ]
  };
};

export function useWeatherData() {
  const [weather, setWeather] = useState<WeatherData>(() => {
    return {
      city: 'San Francisco',
      temp: 17,
      condition: 'Foggy',
      isDay: true,
      high: 19,
      low: 12,
      humidity: 78,
      wind: 22,
      feelsLike: 16,
      precipitation: 0.1,
      uvIndex: 2.4,
      sunrise: '6:04 AM',
      sunset: '8:32 PM',
      hourly: [
        { time: '12 PM', temp: 16, condition: 'Foggy', isDay: true },
        { time: '2 PM', temp: 18, condition: 'Mostly Sunny', isDay: true },
        { time: '4 PM', temp: 19, condition: 'Sunny', isDay: true },
        { time: '6 PM', temp: 17, condition: 'Mostly Sunny', isDay: true },
        { time: '8 PM', temp: 14, condition: 'Partly Cloudy', isDay: false },
      ],
      forecast: [
        { day: 'Thu', temp: 18, condition: 'Foggy' },
        { day: 'Fri', temp: 19, condition: 'Sunny' },
        { day: 'Sat', temp: 17, condition: 'Foggy' },
      ]
    };
  });

  const [city, setCity] = useState('San Francisco');
  const [loading, setLoading] = useState(false);
  const [isNight, setIsNight] = useState(false);

  const hourlyForecast = weather.hourly;

  const fetchWeather = async (cityName: string, isRetry = false) => {
    setLoading(true);
    try {
      const { latitude, longitude, name, formattedCityName } = await fetchGeocode(cityName);

      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code,is_day,apparent_temperature,precipitation&hourly=temperature_2m,weather_code,is_day&daily=temperature_2m_max,temperature_2m_min,weather_code,sunrise,sunset,uv_index_max&timezone=auto`;
      const weatherRes = await fetch(weatherUrl);
      if (!weatherRes.ok) throw new Error('Weather forecast service unavailable');
      const weatherData = await weatherRes.json();

      const current = weatherData.current;
      const daily = weatherData.daily;
      const hourly = weatherData.hourly;
      const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

      const isDay = current.is_day !== 0;

      const hourlyList = [];
      const currentHourStr = new Date().toISOString().substring(0, 13) + ":00";
      let startIndex = hourly.time.findIndex((t: string) => t.startsWith(currentHourStr.substring(0, 13)));
      if (startIndex === -1) {
        startIndex = new Date().getHours();
      }

      for (let i = 0; i < 5; i++) {
        const hIdx = startIndex + i * 2;
        if (hourly && hourly.time[hIdx]) {
          const timeVal = new Date(hourly.time[hIdx]);
          let displayHour = timeVal.getHours();
          const ampm = displayHour >= 12 ? 'PM' : 'AM';
          displayHour = displayHour % 12;
          displayHour = displayHour ? displayHour : 12;
          const label = `${displayHour} ${ampm}`;

          hourlyList.push({
            time: label,
            temp: Math.round(hourly.temperature_2m[hIdx]),
            condition: mapWmoCodeToCondition(hourly.weather_code[hIdx], hourly.is_day[hIdx] !== 0),
            isDay: hourly.is_day[hIdx] !== 0
          });
        }
      }

      const forecastList = daily.time.slice(1, 4).map((timeStr: string, idx: number) => {
        const date = new Date(timeStr);
        const dayName = daysOfWeek[date.getDay()];
        const fCode = daily.weather_code[idx + 1] ?? 0;
        const fTemp = Math.round(daily.temperature_2m_max[idx + 1] ?? 0);
        return {
          day: dayName,
          temp: fTemp,
          condition: mapWmoCodeToCondition(fCode, true),
        };
      });

      const updatedWeather: WeatherData = {
        city: formattedCityName,
        temp: Math.round(current.temperature_2m),
        condition: mapWmoCodeToCondition(current.weather_code, isDay),
        isDay,
        high: Math.round(daily.temperature_2m_max[0]),
        low: Math.round(daily.temperature_2m_min[0]),
        humidity: Math.round(current.relative_humidity_2m),
        wind: Math.round(current.wind_speed_10m),
        feelsLike: Math.round(current.apparent_temperature),
        precipitation: current.precipitation || 0,
        uvIndex: daily.uv_index_max ? Math.round(daily.uv_index_max[0] * 10) / 10 : undefined,
        sunrise: daily.sunrise ? formatTimeStr(daily.sunrise[0]) : undefined,
        sunset: daily.sunset ? formatTimeStr(daily.sunset[0]) : undefined,
        hourly: hourlyList,
        forecast: forecastList,
      };

      setWeather(updatedWeather);
      setCity(name);
      setIsNight(!isDay);
      localStorage.setItem('gaidrid_weather_city', name);
    } catch (err) {
      console.error('Weather Fetch Error:', err);
      
      if (!isRetry) {
        const fallbackData = generateFallbackWeather(cityName);
        setWeather(fallbackData);
        setCity(cityName);
        setIsNight(!fallbackData.isDay);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const savedCity = localStorage.getItem('gaidrid_weather_city') || 'San Francisco';
    fetchWeather(savedCity);
  }, []);

  return { weather, city, setCity, hourlyForecast, loading, isNight, fetchWeather };
}
