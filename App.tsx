import React, { useState, useEffect, useCallback } from 'react';
import { Settings, Shirt, ChevronDown, Droplets, Wind, CloudRain, MapPin } from 'lucide-react';
import { CITIES, DEFAULT_CITY } from './constants';
import { City, WeatherData, Unit, Theme, AppSettings } from './types';
import { getWeather, getWeatherDescription } from './services/weatherService';
import { getOutfitSuggestion } from './services/geminiService';
import WeatherIcon from './components/WeatherIcon';
import SettingsModal from './components/SettingsModal';
import OutfitModal from './components/OutfitModal';

function App() {
  // State
  const [selectedCity, setSelectedCity] = useState<City>(DEFAULT_CITY);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [settings, setSettings] = useState<AppSettings>({
    unit: Unit.CELSIUS,
    theme: Theme.LIGHT,
    rainNotification: false,
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isOutfitOpen, setIsOutfitOpen] = useState(false);
  const [outfitSuggestion, setOutfitSuggestion] = useState<string>('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isLoadingWeather, setIsLoadingWeather] = useState(true);

  // Derived State for Image URL (Simple hash for consistency)
  const getCityImageUrl = (cityName: string) => {
    // We use picsum with a seed to get a consistent random image for the city
    // In a real app, this would be a specific city image API or curated list
    const seed = cityName.length * 7; 
    return `https://picsum.photos/seed/${cityName}/600/400`;
  };

  // Logic
  const fetchWeatherData = useCallback(async () => {
    setIsLoadingWeather(true);
    try {
      const data = await getWeather(selectedCity.lat, selectedCity.lng, settings.unit);
      setWeather(data);
    } catch (err) {
      console.error("Failed to fetch weather", err);
    } finally {
      setIsLoadingWeather(false);
    }
  }, [selectedCity, settings.unit]);

  useEffect(() => {
    fetchWeatherData();
  }, [fetchWeatherData]);

  // Apply Theme
  useEffect(() => {
    if (settings.theme === Theme.DARK) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.theme]);

  // Handlers
  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const city = CITIES.find(c => c.name === e.target.value);
    if (city) setSelectedCity(city);
  };

  const handleOutfitClick = async () => {
    setIsOutfitOpen(true);
    if (!weather) return;
    
    // Only fetch if we don't have a suggestion for this specific weather/city combo yet
    // For simplicity in this demo, we just fetch every time or check if empty
    setIsAiLoading(true);
    const suggestion = await getOutfitSuggestion(selectedCity, weather);
    setOutfitSuggestion(suggestion);
    setIsAiLoading(false);
  };

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-start py-8 px-4 sm:px-0 font-sans transition-colors duration-500 ${settings.theme === Theme.DARK ? 'bg-gray-900' : 'bg-gray-100'}`}>
      
      {/* Main Container */}
      <div className="w-full max-w-md flex flex-col gap-6 relative pb-24">
        
        {/* Top Section: Weather Card */}
        <div className="glass-panel rounded-3xl p-6 relative overflow-hidden shadow-glass min-h-[360px] flex flex-col justify-between group transition-all hover:shadow-2xl">
           
           {/* Background Image Layer */}
           <div className="absolute inset-0 z-0">
             <img 
               src={getCityImageUrl(selectedCity.name)} 
               alt={selectedCity.name} 
               className="w-full h-full object-cover opacity-60 dark:opacity-40 transition-opacity duration-700"
             />
             <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-white/90 dark:from-black/40 dark:via-transparent dark:to-black/90"></div>
           </div>

           {/* Content Layer */}
           <div className="relative z-10 flex flex-col h-full justify-between">
             {/* Header */}
             <div className="flex justify-between items-start">
               <div className="flex flex-col">
                 <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-gray-600 dark:text-gray-300" />
                    <span className="text-sm font-bold uppercase tracking-widest text-gray-600 dark:text-gray-300">Current</span>
                 </div>
                 {weather && (
                   <span className="text-lg font-medium text-gray-800 dark:text-gray-100 mt-1">
                     {getWeatherDescription(weather.current.weatherCode)}
                   </span>
                 )}
               </div>
               
               {isLoadingWeather ? (
                 <div className="animate-pulse w-16 h-16 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
               ) : weather ? (
                 <WeatherIcon code={weather.current.weatherCode} isDay={weather.current.isDay} size={64} className="drop-shadow-lg" />
               ) : null}
             </div>

             {/* Center Temp */}
             <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center w-full">
               {isLoadingWeather ? (
                 <div className="h-24 w-32 bg-gray-300 dark:bg-gray-700 rounded mx-auto animate-pulse"></div>
               ) : weather ? (
                 <div className="flex flex-col items-center">
                   <h1 className="text-8xl font-thin tracking-tighter text-gray-900 dark:text-white drop-shadow-sm">
                     {Math.round(weather.current.temp)}°
                   </h1>
                 </div>
               ) : null}
             </div>

             {/* Bottom Metrics */}
             <div className="flex justify-between items-end">
               {/* Precipitation */}
               <div className="flex flex-col gap-1 text-gray-700 dark:text-gray-300">
                 <div className="flex items-center gap-2 bg-white/30 dark:bg-black/30 p-2 rounded-xl backdrop-blur-md">
                   <CloudRain size={18} />
                   <span className="font-semibold">{weather?.current.precipitationProb}%</span>
                 </div>
                 <span className="text-xs ml-1 opacity-80">Precipitation</span>
               </div>

               {/* Right Side Metrics */}
               <div className="flex flex-col gap-2 items-end">
                 <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                   <span className="font-semibold">{weather?.current.humidity}%</span>
                   <Droplets size={18} />
                 </div>
                 <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                   <span className="font-semibold">{weather?.current.windSpeed} <span className="text-xs">{settings.unit === Unit.FAHRENHEIT ? 'mph' : 'km/h'}</span></span>
                   <Wind size={18} />
                 </div>
               </div>
             </div>
           </div>
        </div>

        {/* City Selector (Chrome Style) */}
        <div className="relative group w-full">
            <div className="absolute inset-0 bg-gray-300 dark:bg-gray-700 rounded-full blur opacity-40 group-hover:opacity-60 transition duration-500"></div>
            <div className="relative bg-gradient-to-b from-gray-50 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-full p-[2px] shadow-chrome active:shadow-chrome-pressed transition-all">
              <div className="bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-full h-14 flex items-center px-6 relative">
                 <select 
                    value={selectedCity.name}
                    onChange={handleCityChange}
                    className="w-full h-full bg-transparent appearance-none outline-none text-lg font-bold text-center text-gray-800 dark:text-gray-100 cursor-pointer z-10"
                 >
                    {CITIES.map(city => (
                      <option key={city.name} value={city.name} className="text-black">{city.name}</option>
                    ))}
                 </select>
                 <div className="absolute right-6 pointer-events-none text-gray-500 dark:text-gray-400">
                    <ChevronDown size={20} />
                 </div>
              </div>
            </div>
        </div>

        {/* Weekly Forecast List */}
        <div className="glass-panel rounded-3xl p-6 shadow-lg">
          <h2 className="text-gray-800 dark:text-white font-bold mb-4 tracking-tight">Next 7 Days</h2>
          <div className="space-y-4">
            {isLoadingWeather ? (
              Array(5).fill(0).map((_, i) => (
                <div key={i} className="h-10 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"></div>
              ))
            ) : (
              weather?.daily.map((day, idx) => {
                const date = new Date(day.date);
                const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
                return (
                  <div key={day.date} className="flex items-center justify-between p-2 hover:bg-white/10 dark:hover:bg-black/10 rounded-xl transition">
                     <div className="flex items-center gap-4 w-1/3">
                        <WeatherIcon code={day.weatherCode} size={24} />
                        <span className="text-gray-600 dark:text-gray-300 font-medium">{idx === 0 ? 'Today' : dayName}</span>
                     </div>
                     <div className="w-1/3 text-center">
                        {/* Bars visual representation (just decoration) */}
                        <div className="h-1.5 w-16 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mx-auto">
                          <div 
                             className="h-full bg-gradient-to-r from-blue-400 to-purple-400 opacity-60" 
                             style={{ width: `${Math.min(100, (day.maxTemp / 40) * 100)}%` }}
                          ></div>
                        </div>
                     </div>
                     <div className="w-1/3 text-right flex justify-end gap-2 text-gray-800 dark:text-gray-100 font-semibold">
                        <span>{Math.round(day.maxTemp)}°</span>
                        <span className="text-gray-400 dark:text-gray-500">{Math.round(day.minTemp)}°</span>
                     </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-12 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md flex justify-between px-8 pointer-events-none">
        
        {/* Settings Button */}
        <button 
          onClick={() => setIsSettingsOpen(true)}
          className="pointer-events-auto w-14 h-14 rounded-full bg-gradient-to-b from-gray-100 to-gray-300 dark:from-gray-700 dark:to-gray-800 shadow-chrome hover:shadow-lg active:shadow-chrome-pressed flex items-center justify-center transition-all transform hover:scale-105"
        >
          <Settings className="text-gray-700 dark:text-gray-200" size={24} />
        </button>

        {/* Outfit Suggestion Button */}
        <button 
          onClick={handleOutfitClick}
          className="pointer-events-auto w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 shadow-xl shadow-blue-500/30 flex items-center justify-center text-white transition-all transform hover:scale-110 active:scale-95 border-2 border-white/20"
        >
          <Shirt size={28} />
        </button>
      </div>

      {/* Modals */}
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        updateSettings={updateSettings}
      />

      <OutfitModal
        isOpen={isOutfitOpen}
        onClose={() => setIsOutfitOpen(false)}
        suggestion={outfitSuggestion}
        loading={isAiLoading}
      />
      
    </div>
  );
}

export default App;