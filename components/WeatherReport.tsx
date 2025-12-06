import React, { useState, useEffect, FormEvent } from 'react';
import { WeatherData } from '../types';
import { Icon } from './Icon';

// Mock weather data for various cities in Kerala
const mockWeatherData: { [key: string]: WeatherData } = {
  kochi: { city: 'Kochi', temperature: 31, condition: 'Scattered Clouds', icon: 'cloud-sun', feelsLike: 35, humidity: 75, windSpeed: 15 },
  munnar: { city: 'Munnar', temperature: 22, condition: 'Light Rain', icon: 'rain', feelsLike: 23, humidity: 88, windSpeed: 10 },
  trivandrum: { city: 'Trivandrum', temperature: 32, condition: 'Clear Sky', icon: 'sun', feelsLike: 36, humidity: 70, windSpeed: 12 },
  alleppey: { city: 'Alleppey', temperature: 30, condition: 'Few Clouds', icon: 'cloud-sun', feelsLike: 34, humidity: 78, windSpeed: 14 },
  kozhikode: { city: 'Kozhikode', temperature: 29, condition: 'Cloudy', icon: 'cloud', feelsLike: 33, humidity: 82, windSpeed: 18 },
  thrissur: { city: 'Thrissur', temperature: 30, condition: 'Scattered Clouds', icon: 'cloud-sun', feelsLike: 34, humidity: 76, windSpeed: 13 },
};

// Mock API call
const fetchWeather = (city: string): Promise<WeatherData> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const cityKey = city.toLowerCase().replace(/\s/g, '');
      if (mockWeatherData[cityKey]) {
        resolve(mockWeatherData[cityKey]);
      } else {
        reject(new Error(`Weather data not found for ${city}. Try "Kochi" or "Munnar".`));
      }
    }, 800);
  });
};

const WeatherReport: React.FC = () => {
  const [query, setQuery] = useState('Kochi');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const searchWeather = async (city: string) => {
    if (!city.trim()) return;
    setIsLoading(true);
    setError(null);
    setWeather(null);
    try {
      const data = await fetchWeather(city);
      setWeather(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    searchWeather('Kochi');
  }, []);

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    searchWeather(query);
  };

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">
          Kerala Weather Report
        </h2>
        <p className="text-slate-500 max-w-lg mx-auto">
          Get the latest weather updates for cities across Kerala.
        </p>
      </div>
      
      <div className="max-w-xl mx-auto mb-6">
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for a city..."
            className="w-full pl-5 pr-12 py-3 border border-slate-300 rounded-full shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            aria-label="Search for a city in Kerala"
          />
          <button
            type="submit"
            className="absolute inset-y-0 right-0 flex items-center justify-center w-12 h-full text-white bg-blue-600 rounded-r-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            aria-label="Search"
            disabled={isLoading}
          >
            <Icon name="search" className="w-6 h-6" />
          </button>
        </form>
      </div>

      <div className="mt-8" aria-live="polite" aria-atomic="true">
        {isLoading && (
          <div role="status" className="text-center p-10 bg-white rounded-xl shadow-lg">
            <p className="text-slate-600 animate-pulse">Fetching weather data...</p>
          </div>
        )}
        {error && (
          <div role="alert" className="text-center p-10 bg-red-50 text-red-700 rounded-xl shadow-lg">
            <p className="font-semibold">Error</p>
            <p>{error}</p>
          </div>
        )}
        {weather && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden animate-fade-in">
            <div className="p-6 sm:p-8 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-2xl font-bold">{weather.city}</h3>
                        <p className="text-blue-200">{weather.condition}</p>
                    </div>
                    <div className="text-right">
                        <Icon name={weather.icon} className="w-16 h-16 sm:w-20 sm:h-20 text-white drop-shadow-lg" />
                    </div>
                </div>
                 <div className="mt-4 flex items-end">
                    <span className="text-6xl sm:text-7xl font-light tracking-tighter">{weather.temperature}</span>
                    <span className="text-4xl font-light ml-1">&deg;C</span>
                </div>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50">
                <div className="flex items-center space-x-3">
                    <Icon name="sun" className="w-6 h-6 text-slate-500" />
                    <div>
                        <p className="text-sm text-slate-500">Feels Like</p>
                        <p className="font-bold text-slate-700">{weather.feelsLike}&deg;C</p>
                    </div>
                </div>
                <div className="flex items-center space-x-3">
                    <Icon name="humidity" className="w-6 h-6 text-slate-500" />
                    <div>
                        <p className="text-sm text-slate-500">Humidity</p>
                        <p className="font-bold text-slate-700">{weather.humidity}%</p>
                    </div>
                </div>
                 <div className="flex items-center space-x-3">
                    <Icon name="wind" className="w-6 h-6 text-slate-500" />
                    <div>
                        <p className="text-sm text-slate-500">Wind</p>
                        <p className="font-bold text-slate-700">{weather.windSpeed} km/h</p>
                    </div>
                </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default WeatherReport;