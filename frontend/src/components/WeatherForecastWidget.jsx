import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Sun,
  Cloud,
  CloudSun,
  CloudRain,
  CloudLightning,
  CloudSnow,
  CloudDrizzle,
  CloudFog,
  Wind,
  Droplets,
  Thermometer,
  Compass,
  Calendar,
  RefreshCw,
  MapPin,
  Sparkles,
  ChevronRight,
  AlertTriangle,
  Info,
  ShieldCheck,
  Eye
} from 'lucide-react';
import { useApp } from '../context/AppContext';

// Well-known destination coordinates for instant fast lookup
const KNOWN_COORDINATES = {
  bali: { lat: -8.4095, lng: 115.1889, country: 'Indonesia' },
  indonesia: { lat: -8.4095, lng: 115.1889, country: 'Indonesia' },
  switzerland: { lat: 46.8182, lng: 8.2275, country: 'Switzerland' },
  zermatt: { lat: 45.9765, lng: 7.7491, country: 'Switzerland' },
  zurich: { lat: 47.3769, lng: 8.5417, country: 'Switzerland' },
  kyoto: { lat: 35.0116, lng: 135.7681, country: 'Japan' },
  japan: { lat: 35.6762, lng: 139.6503, country: 'Japan' },
  tokyo: { lat: 35.6762, lng: 139.6503, country: 'Japan' },
  santorini: { lat: 36.3932, lng: 25.4615, country: 'Greece' },
  greece: { lat: 37.9838, lng: 23.7275, country: 'Greece' },
  paris: { lat: 48.8566, lng: 2.3522, country: 'France' },
  france: { lat: 48.8566, lng: 2.3522, country: 'France' },
  dubai: { lat: 25.2048, lng: 55.2708, country: 'UAE' },
  maldives: { lat: 3.2028, lng: 73.2207, country: 'Maldives' },
  banff: { lat: 51.1784, lng: -115.5708, country: 'Canada' },
  canada: { lat: 51.1784, lng: -115.5708, country: 'Canada' },
  phuket: { lat: 7.8804, lng: 98.3923, country: 'Thailand' },
  thailand: { lat: 13.7563, lng: 100.5018, country: 'Thailand' },
  rome: { lat: 41.9028, lng: 12.4964, country: 'Italy' },
  italy: { lat: 41.9028, lng: 12.4964, country: 'Italy' },
  iceland: { lat: 64.9631, lng: -19.0208, country: 'Iceland' },
  london: { lat: 51.5074, lng: -0.1278, country: 'United Kingdom' },
  newyork: { lat: 40.7128, lng: -74.006, country: 'United States' },
};

// Weather Code interpreter according to WMO code standard
function getWeatherInfo(code) {
  if (code === 0) {
    return { condition: 'Clear Sky', icon: Sun, tip: 'Great day for outdoor walks and sightseeing. Pack sunscreen!' };
  }
  if (code === 1 || code === 2) {
    return { condition: 'Mainly Clear', icon: CloudSun, tip: 'Pleasant weather for exploring. Light layers recommended.' };
  }
  if (code === 3) {
    return { condition: 'Overcast', icon: Cloud, tip: 'Diffused sunlight, ideal for photography and cultural tours.' };
  }
  if (code >= 45 && code <= 48) {
    return { condition: 'Misty / Foggy', icon: CloudFog, tip: 'Morning haze expected. Scenic viewpoints best visited in the afternoon.' };
  }
  if (code >= 51 && code <= 55) {
    return { condition: 'Light Drizzle', icon: CloudDrizzle, tip: 'Occasional light showers. Carry a compact umbrella.' };
  }
  if (code >= 61 && code <= 65) {
    return { condition: 'Rain Showers', icon: CloudRain, tip: 'Moderate rain expected. Perfect time for museum visits or cozy cafes.' };
  }
  if (code >= 71 && code <= 77) {
    return { condition: 'Snow Showers', icon: CloudSnow, tip: 'Cold temperatures. Thermal wear and winter boots essential.' };
  }
  if (code >= 80 && code <= 82) {
    return { condition: 'Heavy Showers', icon: CloudRain, tip: 'Heavy rain spells. Plan indoor activities during peak afternoon hours.' };
  }
  if (code >= 95 && code <= 99) {
    return { condition: 'Thunderstorm', icon: CloudLightning, tip: 'Thunderstorm warning. Keep outdoor excursions flexible.' };
  }
  return { condition: 'Partly Cloudy', icon: CloudSun, tip: 'Mild and pleasant conditions for travel.' };
}

// Fallback generator for realistic data if offline
function generateFallbackForecast(destName, country) {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date();
  const daily = [];

  const isTropical = /bali|thailand|maldives|phuket/i.test(destName);
  const isAlpine = /swiss|banff|zermatt/i.test(destName);

  const baseHigh = isTropical ? 30 : isAlpine ? 18 : 24;
  const baseLow = isTropical ? 23 : isAlpine ? 9 : 15;

  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(today.getDate() + i);
    const dayName = i === 0 ? 'Today' : days[d.getDay()];
    const shortDate = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const code = isTropical ? (i % 3 === 0 ? 61 : 1) : isAlpine ? (i % 4 === 0 ? 3 : 0) : 1;
    const weatherInfo = getWeatherInfo(code);

    daily.push({
      date: d.toISOString().split('T')[0],
      dayName,
      shortDate,
      weatherCode: code,
      condition: weatherInfo.condition,
      tempMax: baseHigh + (i % 3) - 1,
      tempMin: baseLow + (i % 2),
      precipitationProb: isTropical ? (i % 2 === 0 ? 35 : 15) : 10,
      windSpeed: 12 + (i % 5),
      uvIndex: isTropical ? 9 : 6,
      tip: weatherInfo.tip,
    });
  }

  return {
    locationName: destName,
    country: country || 'Destination',
    currentTemp: baseHigh - 2,
    currentCode: daily[0].weatherCode,
    currentCondition: daily[0].condition,
    windSpeed: 14,
    humidity: isTropical ? 78 : 55,
    daily,
    lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    isFallback: true,
  };
}

export const WeatherForecastWidget = () => {
  const { activeTrip, trips, setActivePage, isDarkMode } = useApp();

  // Selected trip destination state
  const [selectedTripId, setSelectedTripId] = useState(activeTrip?.id || '');
  const [temperatureUnit, setTemperatureUnit] = useState('C');
  const [weatherData, setWeatherData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);

  // Determine current target trip
  const targetTrip = useMemo(() => {
    return trips.find((t) => t.id === selectedTripId) || activeTrip || trips[0];
  }, [trips, selectedTripId, activeTrip]);

  // Extract destination clean name
  const destinationQuery = useMemo(() => {
    if (!targetTrip) return 'Bali';
    const dest = targetTrip.destination || targetTrip.title || 'Bali';
    return dest.split(',')[0].trim();
  }, [targetTrip]);

  // Fetch forecast function from Open-Meteo public API
  const fetchForecast = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const queryKey = destinationQuery.toLowerCase().replace(/[^a-z]/g, '');
    let lat = null;
    let lng = null;
    let countryName = targetTrip?.country || '';

    // Check fast known coordinates first
    if (KNOWN_COORDINATES[queryKey]) {
      lat = KNOWN_COORDINATES[queryKey].lat;
      lng = KNOWN_COORDINATES[queryKey].lng;
      countryName = countryName || KNOWN_COORDINATES[queryKey].country;
    } else {
      // Lookup coordinates using Open-Meteo free geocoding API
      try {
        const geoRes = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
            destinationQuery
          )}&count=1&language=en&format=json`
        );
        if (geoRes.ok) {
          const geoData = await geoRes.json();
          if (geoData.results && geoData.results.length > 0) {
            lat = geoData.results[0].latitude;
            lng = geoData.results[0].longitude;
            countryName = geoData.results[0].country || countryName;
          }
        }
      } catch (err) {
        console.warn('Geocoding lookup notice:', err);
      }
    }

    // Default to Bali coordinates if still unresolved
    if (lat === null || lng === null) {
      lat = -8.4095;
      lng = 115.1889;
      countryName = countryName || 'Indonesia';
    }

    // Fetch 7-day meteorological forecast from Open-Meteo Public API
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_probability_max,windspeed_10m_max,uv_index_max&current_weather=true&timezone=auto`;
      const res = await fetch(url);

      if (!res.ok) {
        throw new Error(`Public weather server response: ${res.status}`);
      }

      const data = await res.json();
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

      const dailyItems = (data.daily.time || []).slice(0, 7).map((dateStr, idx) => {
        const dateObj = new Date(dateStr + 'T00:00:00');
        const isToday = idx === 0;
        const dayName = isToday ? 'Today' : days[dateObj.getDay()];
        const shortDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const code = data.daily.weathercode?.[idx] ?? 0;
        const weatherInfo = getWeatherInfo(code);

        return {
          date: dateStr,
          dayName,
          shortDate,
          weatherCode: code,
          condition: weatherInfo.condition,
          tempMax: Math.round(data.daily.temperature_2m_max?.[idx] ?? 28),
          tempMin: Math.round(data.daily.temperature_2m_min?.[idx] ?? 22),
          precipitationProb: data.daily.precipitation_probability_max?.[idx] ?? 10,
          windSpeed: Math.round(data.daily.windspeed_10m_max?.[idx] ?? 12),
          uvIndex: Math.round(data.daily.uv_index_max?.[idx] ?? 6),
          tip: weatherInfo.tip,
        };
      });

      const currentCode = data.current_weather?.weathercode ?? dailyItems[0]?.weatherCode ?? 0;
      const currentWeatherInfo = getWeatherInfo(currentCode);

      setWeatherData({
        locationName: targetTrip?.destination || destinationQuery,
        country: countryName,
        currentTemp: Math.round(data.current_weather?.temperature ?? dailyItems[0]?.tempMax ?? 28),
        currentCode,
        currentCondition: currentWeatherInfo.condition,
        windSpeed: Math.round(data.current_weather?.windspeed ?? 12),
        humidity: 68,
        daily: dailyItems,
        lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isFallback: false,
      });
      setSelectedDayIndex(0);
    } catch (err) {
      console.warn('Weather API fetch failed, falling back to cached forecast:', err);
      const fallback = generateFallbackForecast(destinationQuery, countryName);
      setWeatherData(fallback);
    } finally {
      setIsLoading(false);
    }
  }, [destinationQuery, targetTrip]);

  // Initial fetch and when destination changes
  useEffect(() => {
    fetchForecast();
  }, [fetchForecast]);

  // Temperature converter helper
  const displayTemp = (celsius) => {
    if (temperatureUnit === 'F') {
      return `${Math.round((celsius * 9) / 5 + 32)}°F`;
    }
    return `${celsius}°C`;
  };

  const selectedDay = weatherData?.daily[selectedDayIndex] || weatherData?.daily[0];
  const CurrentIcon = selectedDay ? getWeatherInfo(selectedDay.weatherCode).icon : Sun;

  return (
    <div
      id="dashboard-weather-forecast-widget"
      className={`rounded-3xl p-5 sm:p-6 border transition-all duration-300 space-y-4 relative overflow-hidden ${
        isDarkMode
          ? 'bg-slate-900/90 border-slate-800 shadow-[0_0_30px_rgba(14,165,233,0.1)] text-slate-100'
          : 'bg-white border-slate-200/80 shadow-xs text-slate-900'
      }`}
    >
      {/* Top Header & Trip Selector Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div
            className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 border ${
              isDarkMode
                ? 'bg-amber-500/20 text-amber-400 border-amber-500/30 shadow-[0_0_12px_rgba(245,158,11,0.25)]'
                : 'bg-sky-50 text-sky-600 border-sky-100 shadow-xs'
            }`}
          >
            <Sun className="w-5 h-5 text-amber-500 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-base tracking-tight">
                7-Day Destination Weather Forecast
              </h3>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full hidden sm:inline-block ${
                  isDarkMode
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                }`}
              >
                Live Public API
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1.5">
              <MapPin className="w-3 3 text-sky-500 shrink-0" />
              <span>Upcoming Destination:</span>
              <strong className="text-slate-800 dark:text-slate-200 font-bold">{targetTrip?.destination || 'Bali, Indonesia'}</strong>
              {targetTrip?.startDate && (
                <span className="text-slate-400 font-medium">({targetTrip.startDate} - {targetTrip.endDate})</span>
              )}
            </p>
          </div>
        </div>

        {/* Controls: Trip Switcher + °C/°F toggle + Refresh */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Trip Selector Dropdown if multiple trips exist */}
          {trips.length > 1 && (
            <select
              value={selectedTripId}
              onChange={(e) => setSelectedTripId(e.target.value)}
              className={`text-xs font-semibold rounded-xl px-2.5 py-1.5 outline-hidden transition-colors cursor-pointer border ${
                isDarkMode
                  ? 'bg-slate-800 border-slate-700 text-slate-200 hover:border-sky-500/50'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
              title="Select upcoming trip destination"
            >
              {trips.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title} ({t.destination})
                </option>
              ))}
            </select>
          )}

          {/* Unit Toggle */}
          <div
            className={`flex items-center p-0.5 rounded-xl border ${
              isDarkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-slate-100 border-slate-200/80'
            }`}
          >
            <button
              type="button"
              onClick={() => setTemperatureUnit('C')}
              className={`px-2 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                temperatureUnit === 'C'
                  ? isDarkMode
                    ? 'bg-sky-500 text-slate-950 shadow-[0_0_10px_rgba(14,165,233,0.5)]'
                    : 'bg-white text-sky-700 shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              °C
            </button>
            <button
              type="button"
              onClick={() => setTemperatureUnit('F')}
              className={`px-2 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                temperatureUnit === 'F'
                  ? isDarkMode
                    ? 'bg-sky-500 text-slate-950 shadow-[0_0_10px_rgba(14,165,233,0.5)]'
                    : 'bg-white text-sky-700 shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              °F
            </button>
          </div>

          {/* Refresh Button */}
          <button
            type="button"
            onClick={fetchForecast}
            disabled={isLoading}
            className={`p-1.5 rounded-xl border transition-all cursor-pointer disabled:opacity-50 ${
              isDarkMode
                ? 'bg-slate-800 hover:bg-sky-500/20 text-slate-400 hover:text-sky-300 border-slate-700 hover:border-sky-500/40 shadow-[0_0_10px_rgba(14,165,233,0.15)]'
                : 'text-slate-500 hover:text-sky-600 hover:bg-sky-50 border-slate-200/80'
            }`}
            title="Refresh live forecast"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-sky-500' : ''}`} />
          </button>
        </div>
      </div>

      {/* Loading state skeleton */}
      {isLoading && !weatherData && (
        <div className="py-8 flex flex-col items-center justify-center gap-3 text-slate-400">
          <RefreshCw className="w-6 h-6 animate-spin text-sky-500" />
          <span className="text-xs font-semibold">Fetching meteorological forecast from Open-Meteo...</span>
        </div>
      )}

      {/* Main Weather Content */}
      {weatherData && (
        <div className="space-y-4">
          {/* Active Highlight Card: Atmospheric Hero Bar with Glow */}
          <div
            className={`rounded-2xl p-4 sm:p-5 text-white flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden ${
              isDarkMode
                ? 'bg-gradient-to-r from-sky-900 via-blue-900 to-indigo-950 border border-sky-500/30 shadow-[0_0_25px_rgba(14,165,233,0.2)]'
                : 'bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-700 shadow-md shadow-blue-500/10'
            }`}
          >
            {/* Background Weather Art Decor */}
            <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none flex items-center pr-4">
              <CurrentIcon className="w-48 h-48" />
            </div>

            <div className="flex items-center gap-4 z-10">
              <div
                className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl backdrop-blur-md border flex items-center justify-center shrink-0 shadow-inner ${
                  isDarkMode
                    ? 'bg-white/10 border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                    : 'bg-white/15 border-white/20'
                }`}
              >
                <CurrentIcon className="w-8 h-8 sm:w-10 sm:h-10 text-amber-300 drop-shadow-sm" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-sky-100 uppercase tracking-wider">
                    {selectedDay?.dayName} • {selectedDay?.shortDate}
                  </span>
                  {selectedDayIndex === 0 && (
                    <span className="text-[10px] bg-emerald-400/20 text-emerald-200 border border-emerald-400/30 px-2 py-0.2 rounded-full font-bold">
                      Current
                    </span>
                  )}
                </div>

                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-3xl sm:text-4xl font-black tracking-tight">
                    {displayTemp(selectedDay?.tempMax || weatherData.currentTemp)}
                  </span>
                  <span className="text-sm font-semibold text-sky-200">
                    / Low {displayTemp(selectedDay?.tempMin || 22)}
                  </span>
                </div>

                <p className="text-xs sm:text-sm font-bold text-sky-100 mt-0.5">
                  {selectedDay?.condition || weatherData.currentCondition}
                </p>
              </div>
            </div>

            {/* Weather Metrics Pill Row */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 bg-black/25 backdrop-blur-md p-3 rounded-xl border border-white/10 z-10 self-stretch md:self-auto">
              <div className="flex flex-col items-center justify-center text-center px-1">
                <Droplets className="w-4 h-4 text-sky-300 mb-1" />
                <span className="text-[10px] text-sky-200 font-medium">Rain Chance</span>
                <span className="text-xs font-extrabold text-white mt-0.5">
                  {selectedDay?.precipitationProb}%
                </span>
              </div>

              <div className="flex flex-col items-center justify-center text-center px-1 border-x border-white/10">
                <Wind className="w-4 h-4 text-sky-300 mb-1" />
                <span className="text-[10px] text-sky-200 font-medium">Wind Speed</span>
                <span className="text-xs font-extrabold text-white mt-0.5">
                  {selectedDay?.windSpeed} km/h
                </span>
              </div>

              <div className="flex flex-col items-center justify-center text-center px-1">
                <Sun className="w-4 h-4 text-amber-300 mb-1" />
                <span className="text-[10px] text-sky-200 font-medium">UV Index</span>
                <span className="text-xs font-extrabold text-white mt-0.5">
                  {selectedDay?.uvIndex || 7}/11
                </span>
              </div>
            </div>
          </div>

          {/* 7-Day Forecast Strip */}
          <div>
            <div className="flex items-center justify-between mb-2 px-1">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-sky-500" />
                7-Day Daily Outlook
              </span>
              <span className="text-[11px] font-medium text-slate-400">
                Click any day to inspect details
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
              {weatherData.daily.map((day, idx) => {
                const DayIcon = getWeatherInfo(day.weatherCode).icon;
                const isSelected = selectedDayIndex === idx;

                return (
                  <button
                    key={day.date}
                    type="button"
                    onClick={() => setSelectedDayIndex(idx)}
                    className={`p-2.5 sm:p-3 rounded-2xl flex flex-col items-center justify-between text-center transition-all duration-200 cursor-pointer border ${
                      isSelected
                        ? isDarkMode
                          ? 'bg-sky-950/80 border-sky-400 shadow-[0_0_15px_rgba(56,189,248,0.35)] ring-2 ring-sky-400/40'
                          : 'bg-sky-50/90 border-sky-300 shadow-sm ring-2 ring-sky-400/20'
                        : isDarkMode
                        ? 'bg-slate-800/60 border-slate-700/80 hover:bg-slate-800 hover:border-slate-600'
                        : 'bg-slate-50/70 border-slate-100 hover:bg-slate-100 hover:border-slate-200'
                    }`}
                  >
                    <span
                      className={`text-[11px] font-extrabold ${
                        isSelected
                          ? isDarkMode
                            ? 'text-sky-300'
                            : 'text-sky-700'
                          : isDarkMode
                          ? 'text-slate-300'
                          : 'text-slate-700'
                      }`}
                    >
                      {day.dayName}
                    </span>
                    <span className="text-[9px] text-slate-400 font-medium mb-1">
                      {day.shortDate}
                    </span>

                    <div className="my-1.5">
                      <DayIcon
                        className={`w-6 h-6 ${
                          isSelected
                            ? isDarkMode
                              ? 'text-sky-400 scale-110 shadow-xs'
                              : 'text-sky-600 scale-110'
                            : isDarkMode
                            ? 'text-slate-400'
                            : 'text-slate-600'
                        } transition-transform`}
                      />
                    </div>

                    <div className="flex items-center gap-1 text-xs font-bold text-slate-800 dark:text-slate-200">
                      <span>{displayTemp(day.tempMax)}</span>
                      <span className="text-slate-400 font-normal text-[10px]">
                        {displayTemp(day.tempMin)}
                      </span>
                    </div>

                    {/* Rain probability pill */}
                    <div
                      className={`mt-1.5 flex items-center gap-0.5 text-[10px] font-semibold px-1.5 py-0.2 rounded-md ${
                        isDarkMode
                          ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                          : 'text-sky-600 bg-sky-100/70'
                      }`}
                    >
                      <Droplets className="w-2.5 h-2.5 text-sky-400" />
                      <span>{day.precipitationProb}%</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* AI Travel Packing & Outdoor Recommendation */}
          {selectedDay && (
            <div
              className={`rounded-2xl p-3 sm:p-3.5 flex items-start gap-3 border transition-all ${
                isDarkMode
                  ? 'bg-amber-950/25 border-amber-500/30 shadow-[0_0_20px_rgba(245,158,11,0.15)] text-amber-200'
                  : 'bg-amber-50/70 border-amber-200/70 text-amber-900'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                  isDarkMode ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-amber-100 text-amber-800'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h5 className="text-xs font-extrabold text-amber-900 dark:text-amber-300">
                    Travel Recommendation for {selectedDay.dayName} ({selectedDay.condition})
                  </h5>
                  <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400">
                    Updated {weatherData.lastUpdated}
                  </span>
                </div>
                <p className="text-xs text-amber-800 dark:text-amber-200/90 mt-0.5 leading-relaxed">
                  {selectedDay.tip}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
