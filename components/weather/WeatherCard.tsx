'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { WeatherData } from '@/lib/weather-api';
import { formatTemperature, formatTime, getWindDirection, formatWindSpeed } from '@/lib/utils/temperature';
import { getWeatherIcon, getTemperatureColor } from '@/lib/weather-themes';
import { getUserPreferences } from '@/lib/storage';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Thermometer, Eye, Wind, Droplets, Sunrise, Sunset } from 'lucide-react';

interface WeatherCardProps {
  weather: WeatherData;
  className?: string;
}

export function WeatherCard({ weather, className = '' }: WeatherCardProps) {
  const [temperatureUnit, setTemperatureUnit] = useState<'celsius' | 'fahrenheit'>('celsius');
  
  useEffect(() => {
    const preferences = getUserPreferences();
    setTemperatureUnit(preferences.temperatureUnit);
  }, []);

  const currentTime = new Date().getTime() / 1000;
  const isNight = currentTime < weather.sunrise || currentTime > weather.sunset;
  const weatherIcon = getWeatherIcon(weather.weather.main, isNight);
  const tempColor = getTemperatureColor(weather.temp);

  // Weather-specific animations
  const getWeatherAnimation = () => {
    const weatherMain = weather.weather.main.toLowerCase();
    
    switch (weatherMain) {
      case 'rain':
      case 'drizzle':
        return {
          y: [0, -2, 0],
          transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
        };
      case 'thunderstorm':
        return {
          x: [0, -1, 1, 0],
          transition: { duration: 0.5, repeat: Infinity }
        };
      case 'snow':
        return {
          y: [0, -3, 0],
          rotate: [0, 2, -2, 0],
          transition: { duration: 3, repeat: Infinity, ease: "easeInOut" }
        };
      case 'clear':
        return {
          scale: [1, 1.05, 1],
          rotate: [0, 5, -5, 0],
          transition: { duration: 4, repeat: Infinity, ease: "easeInOut" }
        };
      case 'clouds':
        return {
          x: [0, 2, -2, 0],
          transition: { duration: 6, repeat: Infinity, ease: "easeInOut" }
        };
      default:
        return {};
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02, y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={`bg-white/10 backdrop-blur-sm border-white/20 text-white ${className} overflow-hidden relative`}>
        {/* Animated background elements */}
        <div className="absolute inset-0 pointer-events-none">
          {weather.weather.main.toLowerCase() === 'rain' && (
            <>
              {[...Array(15)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-0.5 h-4 bg-blue-300/30"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `-10px`,
                  }}
                  animate={{
                    y: [0, 400],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: Math.random() * 1 + 0.5,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                    ease: "linear",
                  }}
                />
              ))}
            </>
          )}
          
          {weather.weather.main.toLowerCase() === 'snow' && (
            <>
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-white/60 rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `-10px`,
                  }}
                  animate={{
                    y: [0, 400],
                    x: [0, Math.random() * 50 - 25],
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration: Math.random() * 3 + 2,
                    repeat: Infinity,
                    delay: Math.random() * 3,
                    ease: "linear",
                  }}
                />
              ))}
            </>
          )}
        </div>
        <div className="p-6 relative z-10">
          <div className="flex items-center justify-between mb-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-2xl font-bold">{weather.name}</h2>
              <p className="text-white/80">{weather.country}</p>
            </motion.div>
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0, ...getWeatherAnimation() }}
              transition={{ 
                type: "spring", 
                stiffness: 260, 
                damping: 20,
                delay: 0.2
              }}
              className="text-4xl cursor-pointer"
              whileHover={{ scale: 1.2, rotate: 15 }}
            >
              {weatherIcon}
            </motion.div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.1 }}
                transition={{ delay: 0.4, type: "spring" }}
                className="text-4xl font-bold mb-2 cursor-pointer"
                style={{ color: tempColor }}
              >
                {formatTemperature(weather.temp, temperatureUnit)}
              </motion.div>
              <motion.p 
                className="text-sm text-white/80"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Feels like {formatTemperature(weather.feels_like, temperatureUnit)}
              </motion.p>
            </motion.div>
          
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <motion.div 
                className="text-lg font-semibold mb-1"
                whileHover={{ scale: 1.05 }}
              >
                {weather.weather.description.split(' ').map(word => 
                  word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' ')}
              </motion.div>
              <motion.div 
                className="text-sm text-white/80"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                {formatTemperature(weather.temp_min, temperatureUnit)} / {formatTemperature(weather.temp_max, temperatureUnit)}
              </motion.div>
            </motion.div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-3"
            >
              <motion.div 
                className="flex items-center gap-2"
                whileHover={{ x: 5, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <motion.div
                  animate={{ y: [0, -2, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Droplets className="w-4 h-4 text-blue-300" />
                </motion.div>
                <span className="text-sm">Humidity: {weather.humidity}%</span>
              </motion.div>
              <motion.div 
                className="flex items-center gap-2"
                whileHover={{ x: 5, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <Wind className="w-4 h-4 text-green-300" />
                </motion.div>
                <span className="text-sm">
                  Wind: {formatWindSpeed(weather.wind_speed)} {getWindDirection(weather.wind_deg)}
                </span>
              </motion.div>
              <motion.div 
                className="flex items-center gap-2"
                whileHover={{ x: 5, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  <Eye className="w-4 h-4 text-gray-300" />
                </motion.div>
                <span className="text-sm">
                  Visibility: {(weather.visibility / 1000).toFixed(1)} km
                </span>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="space-y-3"
            >
              <motion.div 
                className="flex items-center gap-2"
                whileHover={{ x: -5, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Thermometer className="w-4 h-4 text-red-300" />
                </motion.div>
                <span className="text-sm">Pressure: {weather.pressure} hPa</span>
              </motion.div>
              <motion.div 
                className="flex items-center gap-2"
                whileHover={{ x: -5, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <motion.div
                  animate={{ y: [0, -3, 0], rotate: [0, 10, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  <Sunrise className="w-4 h-4 text-yellow-300" />
                </motion.div>
                <span className="text-sm">
                  Sunrise: {formatTime(weather.sunrise, weather.timezone)}
                </span>
              </motion.div>
              <motion.div 
                className="flex items-center gap-2"
                whileHover={{ x: -5, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <motion.div
                  animate={{ y: [0, 3, 0], rotate: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, delay: 2 }}
                >
                  <Sunset className="w-4 h-4 text-orange-300" />
                </motion.div>
                <span className="text-sm">
                  Sunset: {formatTime(weather.sunset, weather.timezone)}
                </span>
              </motion.div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mt-4 flex justify-center"
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Badge variant="secondary" className="bg-white/20 text-white cursor-pointer">
                Clouds: {weather.clouds}%
              </Badge>
            </motion.div>
          </motion.div>
        </div>
      </Card>
    </motion.div>
  );
}