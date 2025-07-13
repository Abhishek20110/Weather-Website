'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ForecastData } from '@/lib/weather-api';
import { formatTemperature, formatDate } from '@/lib/utils/temperature';
import { getWeatherIcon } from '@/lib/weather-themes';
import { getUserPreferences } from '@/lib/storage';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Droplets } from 'lucide-react';

interface ForecastSectionProps {
  forecast: ForecastData[];
  className?: string;
}

export function ForecastSection({ forecast, className = '' }: ForecastSectionProps) {
  const [temperatureUnit, setTemperatureUnit] = useState<'celsius' | 'fahrenheit'>('celsius');
  
  useEffect(() => {
    const preferences = getUserPreferences();
    setTemperatureUnit(preferences.temperatureUnit);
  }, []);

  // Group forecast by days (take first entry per day)
  const dailyForecast = forecast.filter((_, index) => index % 8 === 0).slice(0, 5);

  return (
    <Card className={`bg-white/10 backdrop-blur-sm border-white/20 text-white ${className}`}>
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-4">5-Day Forecast</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {dailyForecast.map((day, index) => (
            <motion.div
              key={day.dt}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ 
                scale: 1.05, 
                y: -5,
                backgroundColor: "rgba(255,255,255,0.15)",
                boxShadow: "0 8px 25px rgba(0,0,0,0.15)"
              }}
              whileTap={{ scale: 0.98 }}
              transition={{ delay: index * 0.1 }}
              className="text-center p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300 cursor-pointer"
            >
              <motion.div 
                className="text-sm font-medium mb-2"
                whileHover={{ scale: 1.05 }}
              >
                {index === 0 ? 'Today' : formatDate(day.dt)}
              </motion.div>
              
              <motion.div 
                className="text-2xl mb-2"
                animate={{ 
                  rotate: [0, 5, -5, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity,
                  delay: index * 0.5
                }}
                whileHover={{ scale: 1.3, rotate: 15 }}
              >
                {getWeatherIcon(day.weather.main, false)}
              </motion.div>
              
              <motion.div 
                className="text-lg font-semibold mb-1"
                whileHover={{ scale: 1.1, color: "#fdcb6e" }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {formatTemperature(day.temp, temperatureUnit)}
              </motion.div>
              
              <motion.div 
                className="text-sm text-white/80 mb-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 + 0.3 }}
              >
                {formatTemperature(day.temp_min, temperatureUnit)} / {formatTemperature(day.temp_max, temperatureUnit)}
              </motion.div>
              
              <motion.div 
                className="text-xs text-white/70 capitalize mb-2"
                whileHover={{ scale: 1.05 }}
              >
                {day.weather.description}
              </motion.div>
              
              {day.pop > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 + 0.5 }}
                  whileHover={{ scale: 1.1 }}
                >
                  <Badge variant="outline" className="text-xs bg-blue-500/20 border-blue-400/30">
                    <motion.div
                      animate={{ y: [0, -1, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <Droplets className="w-3 h-3 mr-1" />
                    </motion.div>
                  {Math.round(day.pop * 100)}%
                  </Badge>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </Card>
  );
}