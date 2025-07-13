'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, MapPin, Heart, Star, CloudRain, Sun, Cloud, Snowflake, Zap, Eye } from 'lucide-react';
import { getWeatherTheme, getWeatherIcon } from '@/lib/weather-themes';
import { WeatherData } from '@/lib/weather-api';
import { WeatherCard } from '@/components/weather/WeatherCard';
import { ForecastSection } from '@/components/weather/ForecastSection';
import { WeatherSettings } from '@/components/weather/WeatherSettings';
import { ErrorBoundary } from '@/components/weather/ErrorBoundary';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface MockWeatherData extends WeatherData {
  // All properties from WeatherData interface
}

const weatherConditions = {
  sunny: {
    name: 'Sunny Beach',
    main: 'Clear',
    description: 'clear sky',
    icon: '01d',
    temp: 28,
    feels_like: 32,
    humidity: 45,
    wind_speed: 3.2,
    clouds: 5,
    pressure: 1020,
    visibility: 10000
  },
  rainy: {
    name: 'Rainy City',
    main: 'Rain',
    description: 'heavy intensity rain',
    icon: '10d',
    temp: 18,
    feels_like: 16,
    humidity: 85,
    wind_speed: 8.5,
    clouds: 90,
    pressure: 1005,
    visibility: 5000
  },
  cloudy: {
    name: 'Cloudy Hills',
    main: 'Clouds',
    description: 'overcast clouds',
    icon: '04d',
    temp: 22,
    feels_like: 24,
    humidity: 65,
    wind_speed: 4.1,
    clouds: 100,
    pressure: 1013,
    visibility: 8000
  },
  snowy: {
    name: 'Snowy Mountains',
    main: 'Snow',
    description: 'light snow',
    icon: '13d',
    temp: -2,
    feels_like: -6,
    humidity: 78,
    wind_speed: 2.8,
    clouds: 85,
    pressure: 1025,
    visibility: 3000
  },
  stormy: {
    name: 'Storm Valley',
    main: 'Thunderstorm',
    description: 'thunderstorm with heavy rain',
    icon: '11d',
    temp: 20,
    feels_like: 18,
    humidity: 92,
    wind_speed: 12.3,
    clouds: 95,
    pressure: 995,
    visibility: 2000
  },
  foggy: {
    name: 'Misty Harbor',
    main: 'Mist',
    description: 'mist',
    icon: '50d',
    temp: 15,
    feels_like: 13,
    humidity: 95,
    wind_speed: 1.2,
    clouds: 75,
    pressure: 1018,
    visibility: 1000
  }
};

const mockForecast = [
  { dt: Date.now() / 1000, temp: 25, feels_like: 28, temp_min: 20, temp_max: 30, humidity: 60, weather: { main: 'Clear', description: 'clear sky', icon: '01d' }, wind_speed: 3.5, pop: 0 },
  { dt: Date.now() / 1000 + 86400, temp: 23, feels_like: 26, temp_min: 18, temp_max: 28, humidity: 65, weather: { main: 'Clouds', description: 'few clouds', icon: '02d' }, wind_speed: 4.2, pop: 0.1 },
  { dt: Date.now() / 1000 + 172800, temp: 19, feels_like: 17, temp_min: 15, temp_max: 24, humidity: 80, weather: { main: 'Rain', description: 'light rain', icon: '10d' }, wind_speed: 6.1, pop: 0.7 },
  { dt: Date.now() / 1000 + 259200, temp: 21, feels_like: 23, temp_min: 16, temp_max: 26, humidity: 70, weather: { main: 'Clouds', description: 'scattered clouds', icon: '03d' }, wind_speed: 3.8, pop: 0.3 },
  { dt: Date.now() / 1000 + 345600, temp: 26, feels_like: 29, temp_min: 21, temp_max: 31, humidity: 55, weather: { main: 'Clear', description: 'clear sky', icon: '01d' }, wind_speed: 2.9, pop: 0 }
];

export default function TestPage() {
  const [selectedWeather, setSelectedWeather] = useState<keyof typeof weatherConditions>('sunny');
  const [theme, setTheme] = useState<any>(null);
  const [mockWeather, setMockWeather] = useState<MockWeatherData | null>(null);

  useEffect(() => {
    const condition = weatherConditions[selectedWeather];
    const weather: MockWeatherData = {
      name: condition.name,
      country: 'Test Location',
      lat: 40.7128,
      lon: -74.0060,
      temp: condition.temp,
      feels_like: condition.feels_like,
      temp_min: condition.temp - 3,
      temp_max: condition.temp + 5,
      humidity: condition.humidity,
      pressure: condition.pressure,
      visibility: condition.visibility,
      wind_speed: condition.wind_speed,
      wind_deg: 180,
      clouds: condition.clouds,
      weather: {
        main: condition.main,
        description: condition.description,
        icon: condition.icon
      },
      sunrise: Math.floor(Date.now() / 1000) - 3600,
      sunset: Math.floor(Date.now() / 1000) + 3600,
      timezone: 0,
      dt: Math.floor(Date.now() / 1000)
    };

    setMockWeather(weather);
    setTheme(getWeatherTheme(weather));
  }, [selectedWeather]);

  const getWeatherAnimation = () => {
    const animations = {
      sunny: {
        background: [
          'linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)',
          'linear-gradient(135deg, #fdcb6e 0%, #e17055 100%)',
          'linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)'
        ],
        transition: { duration: 8, repeat: Infinity, ease: "easeInOut" }
      },
      rainy: {
        background: [
          'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
          'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
          'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
        ],
        transition: { duration: 4, repeat: Infinity, ease: "easeInOut" }
      },
      cloudy: {
        background: [
          'linear-gradient(135deg, #bdc3c7 0%, #2c3e50 100%)',
          'linear-gradient(135deg, #95a5a6 0%, #34495e 100%)',
          'linear-gradient(135deg, #bdc3c7 0%, #2c3e50 100%)'
        ],
        transition: { duration: 6, repeat: Infinity, ease: "easeInOut" }
      },
      snowy: {
        background: [
          'linear-gradient(135deg, #e6ddd4 0%, #f0f0f0 100%)',
          'linear-gradient(135deg, #ffffff 0%, #e6ddd4 100%)',
          'linear-gradient(135deg, #e6ddd4 0%, #f0f0f0 100%)'
        ],
        transition: { duration: 6, repeat: Infinity, ease: "easeInOut" }
      },
      stormy: {
        background: [
          'linear-gradient(135deg, #2c3e50 0%, #000428 100%)',
          'linear-gradient(135deg, #434343 0%, #000000 100%)',
          'linear-gradient(135deg, #2c3e50 0%, #000428 100%)'
        ],
        transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
      },
      foggy: {
        background: [
          'linear-gradient(135deg, #c7ecee 0%, #65c7f7 100%)',
          'linear-gradient(135deg, #a8e6cf 0%, #88d8c0 100%)',
          'linear-gradient(135deg, #c7ecee 0%, #65c7f7 100%)'
        ],
        transition: { duration: 5, repeat: Infinity, ease: "easeInOut" }
      }
    };
    
    return animations[selectedWeather] || animations.sunny;
  };

  const renderWeatherParticles = () => {
    const particleCount = selectedWeather === 'stormy' ? 50 : 
                         selectedWeather === 'rainy' ? 35 : 
                         selectedWeather === 'snowy' ? 25 : 20;
    
    switch (selectedWeather) {
      case 'sunny':
        return (
          <>
            {/* Sun rays */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={`ray-${i}`}
                className="absolute w-1 bg-yellow-300/40"
                style={{
                  height: '100px',
                  top: '10%',
                  right: '10%',
                  transformOrigin: 'bottom center',
                  transform: `rotate(${i * 45}deg)`,
                }}
                animate={{
                  scaleY: [1, 1.3, 1],
                  opacity: [0.4, 0.8, 0.4],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
            {/* Enhanced heat waves and sparkles */}
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={`heat-${i}`}
                className="absolute w-0.5 h-8 bg-orange-300/30"
                style={{
                  left: `${Math.random() * 100}%`,
                  bottom: '0px',
                }}
                animate={{
                  y: [0, -200],
                  x: [0, Math.random() * 20 - 10],
                  opacity: [0, 0.6, 0],
                }}
                transition={{
                  duration: Math.random() * 2 + 2,
                  repeat: Infinity,
                  delay: Math.random() * 3,
                }}
              />
            ))}
            {/* Sun sparkles */}
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={`sparkle-${i}`}
                className="absolute w-1 h-1 bg-white/80 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 60}%`,
                  boxShadow: '0 0 4px rgba(255, 255, 255, 0.8)',
                }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1.5, 0],
                }}
                transition={{
                  duration: Math.random() * 2 + 1,
                  repeat: Infinity,
                  delay: Math.random() * 3,
                }}
              />
            ))}
            {/* Lens flare effect */}
            <motion.div
              className="absolute top-[15%] right-[15%] w-8 h-8 bg-yellow-300/30 rounded-full blur-md"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 0.7, 0.3],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
              }}
            />
          </>
        );

      case 'rainy':
        return (
          <>
            {/* Dark rain clouds */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={`rain-cloud-${i}`}
                className="absolute w-32 h-20 bg-gray-800/40 rounded-full blur-sm"
                style={{
                  top: `${Math.random() * 20}%`,
                  left: `${Math.random() * 100}%`,
                }}
                animate={{
                  x: [0, -50, 0],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: Math.random() * 15 + 10,
                  repeat: Infinity,
                  delay: Math.random() * 5,
                }}
              />
            ))}
            
            {/* Realistic raindrops with light reflection */}
            {[...Array(particleCount)].map((_, i) => (
              <motion.div
                key={`rain-${i}`}
                className="absolute w-0.5 bg-gradient-to-b from-blue-200/80 via-blue-300/60 to-transparent"
                style={{
                  height: `${Math.random() * 8 + 6}px`,
                  left: `${Math.random() * 100}%`,
                  top: `-10px`,
                  boxShadow: '0 0 2px rgba(147, 197, 253, 0.5)',
                }}
                animate={{
                  y: [0, window.innerHeight + 50],
                  opacity: [0, 0.8, 0.9, 0],
                }}
                transition={{
                  duration: Math.random() * 0.8 + 0.4,
                  repeat: Infinity,
                  delay: Math.random() * 1.5,
                  ease: "linear",
                }}
              />
            ))}
            
            {/* Ground splash effects */}
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={`splash-${i}`}
                className="absolute bottom-0 w-12 h-1 bg-blue-300/30 rounded-full blur-sm"
                style={{
                  left: `${Math.random() * 80 + 10}%`,
                }}
                animate={{
                  scaleX: [0.5, 1.5, 0.5],
                  scaleY: [1, 0.3, 1],
                  opacity: [0, 0.6, 0],
                }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
            {/* Water ripples */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={`ripple-${i}`}
                className="absolute bottom-0 w-4 h-4 border border-blue-300/40 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                }}
                animate={{
                  scale: [0, 3, 0],
                  opacity: [0, 0.6, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </>
        );

      case 'cloudy':
        return (
          <>
            {/* Moving clouds */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={`cloud-${i}`}
                className="absolute w-20 h-12 bg-white/20 rounded-full"
                style={{
                  top: `${Math.random() * 40 + 10}%`,
                  left: `-100px`,
                }}
                animate={{
                  x: [0, window.innerWidth + 200],
                }}
                transition={{
                  duration: Math.random() * 20 + 15,
                  repeat: Infinity,
                  delay: Math.random() * 10,
                  ease: "linear",
                }}
              />
            ))}
            {/* Layered clouds for depth */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={`layer-cloud-${i}`}
                className="absolute w-32 h-16 bg-gray-300/25 rounded-full blur-md"
                style={{
                  top: `${Math.random() * 50 + 5}%`,
                  left: `-150px`,
                }}
                animate={{
                  x: [0, window.innerWidth + 300],
                  opacity: [0.2, 0.5, 0.2],
                }}
                transition={{
                  duration: Math.random() * 25 + 20,
                  repeat: Infinity,
                  delay: Math.random() * 8,
                  ease: "linear",
                }}
              />
            ))}
            {/* Sunbeams breaking through */}
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={`sunbeam-${i}`}
                className="absolute w-2 bg-yellow-200/30 blur-sm"
                style={{
                  height: '100px',
                  top: '15%',
                  left: `${Math.random() * 100}%`,
                  transformOrigin: 'top center',
                  transform: `rotate(${Math.random() * 20 - 10}deg)`,
                }}
                animate={{
                  opacity: [0, 0.6, 0],
                  scaleY: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: Math.random() * 6 + 4,
                  repeat: Infinity,
                  delay: Math.random() * 8,
                }}
              />
            ))}
          </>
        );

      case 'snowy':
        return (
          <>
            {/* Snowflakes */}
            {[...Array(particleCount)].map((_, i) => (
              <motion.div
                key={`snow-${i}`}
                className="absolute w-2 h-2 bg-white/80 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `-10px`,
                }}
                animate={{
                  y: [0, window.innerHeight + 50],
                  x: [0, Math.random() * 100 - 50],
                  rotate: [0, 360],
                }}
                transition={{
                  duration: Math.random() * 4 + 3,
                  repeat: Infinity,
                  delay: Math.random() * 5,
                  ease: "linear",
                }}
              />
            ))}
            {/* Enhanced snow effects */}
            {/* Larger snowflakes */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={`big-snow-${i}`}
                className="absolute w-3 h-3 bg-white/90 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `-10px`,
                  boxShadow: '0 0 4px rgba(255, 255, 255, 0.6)',
                }}
                animate={{
                  y: [0, window.innerHeight + 50],
                  x: [0, Math.random() * 80 - 40],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: Math.random() * 4 + 3,
                  repeat: Infinity,
                  delay: Math.random() * 3,
                  ease: "linear",
                }}
              />
            ))}
            {/* Snow accumulation */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={`accumulation-${i}`}
                className="absolute bottom-0 w-32 h-3 bg-white/40 rounded-t-full"
                style={{
                  left: `${i * 12.5}%`,
                }}
                animate={{
                  scaleY: [0.5, 1, 0.8],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  delay: i * 0.5,
                }}
              />
            ))}
            {/* Snow wind effect */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={`wind-${i}`}
                className="absolute w-32 h-1 bg-white/30 rounded-full blur-sm"
                style={{
                  left: `-50px`,
                  top: `${Math.random() * 80 + 10}%`,
                }}
                animate={{
                  x: [0, window.innerWidth + 100],
                  opacity: [0, 0.6, 0],
                }}
                transition={{
                  duration: Math.random() * 3 + 2,
                  repeat: Infinity,
                  delay: Math.random() * 4,
                  ease: "linear",
                }}
              />
            ))}
          </>
        );

      case 'stormy':
        return (
          <>
            {/* Dark storm clouds */}
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={`storm-cloud-${i}`}
                className="absolute w-40 h-24 bg-gray-900/60 rounded-full blur-md"
                style={{
                  top: `${Math.random() * 30}%`,
                  left: `${Math.random() * 100}%`,
                }}
                animate={{
                  x: [0, -30, 0],
                  opacity: [0.4, 0.8, 0.4],
                }}
                transition={{
                  duration: Math.random() * 8 + 5,
                  repeat: Infinity,
                  delay: Math.random() * 3,
                }}
              />
            ))}
            
            {/* Lightning bolts with dramatic illumination */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              animate={{
                background: [
                  'transparent',
                  'transparent',
                  'transparent',
                  'radial-gradient(circle at 70% 20%, rgba(147, 197, 253, 0.4) 0%, transparent 50%)',
                  'transparent',
                  'transparent',
                  'transparent'
                ],
              }}
              transition={{
                duration: 0.4,
                repeat: Infinity,
                repeatDelay: Math.random() * 4 + 2,
              }}
            />
            
            {/* Lightning flash overlay */}
            <motion.div
              className="absolute inset-0 bg-blue-100/30 pointer-events-none"
              animate={{
                opacity: [0, 0, 0, 0.8, 0.3, 0, 0],
              }}
              transition={{
                duration: 0.2,
                repeat: Infinity,
                repeatDelay: Math.random() * 6 + 3,
              }}
            />
            
            {/* Jagged lightning bolt */}
            <motion.svg
              className="absolute top-10 left-1/2 transform -translate-x-1/2 pointer-events-none"
              width="4"
              height="200"
              viewBox="0 0 4 200"
              animate={{
                opacity: [0, 0, 0, 1, 0.5, 0, 0],
                filter: [
                  'drop-shadow(0 0 0px rgba(147, 197, 253, 0))',
                  'drop-shadow(0 0 0px rgba(147, 197, 253, 0))',
                  'drop-shadow(0 0 0px rgba(147, 197, 253, 0))',
                  'drop-shadow(0 0 8px rgba(147, 197, 253, 0.8))',
                  'drop-shadow(0 0 4px rgba(147, 197, 253, 0.4))',
                  'drop-shadow(0 0 0px rgba(147, 197, 253, 0))',
                  'drop-shadow(0 0 0px rgba(147, 197, 253, 0))'
                ],
              }}
              transition={{
                duration: 0.2,
                repeat: Infinity,
                repeatDelay: Math.random() * 6 + 3,
              }}
            >
              <path
                d="M2 0 L1 40 L3 40 L1 80 L3 80 L0 120 L2 120 L1 160 L3 160 L2 200"
                stroke="rgba(147, 197, 253, 0.9)"
                strokeWidth="2"
                fill="none"
              />
            </motion.svg>
            
            {/* Heavy rain with lightning illumination */}
            {[...Array(particleCount)].map((_, i) => (
              <motion.div
                key={`storm-rain-${i}`}
                className="absolute w-0.5 bg-gradient-to-b from-blue-100/90 via-blue-200/70 to-transparent"
                style={{
                  height: `${Math.random() * 12 + 8}px`,
                  left: `${Math.random() * 100}%`,
                  top: `-10px`,
                  boxShadow: '0 0 3px rgba(147, 197, 253, 0.7)',
                }}
                animate={{
                  y: [0, window.innerHeight + 50],
                  x: [0, Math.random() * 30 - 15],
                  opacity: [0, 0.9, 1, 0],
                }}
                transition={{
                  duration: Math.random() * 0.4 + 0.2,
                  repeat: Infinity,
                  delay: Math.random() * 0.8,
                  ease: "linear",
                }}
              />
            ))}
            
            {/* Ground impact splashes */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={`storm-splash-${i}`}
                className="absolute bottom-0 w-8 h-2 bg-blue-200/40 rounded-full blur-sm"
                style={{
                  left: `${Math.random() * 100}%`,
                }}
                animate={{
                  scaleX: [0, 2, 0],
                  scaleY: [1, 0.2, 1],
                  opacity: [0, 0.8, 0],
                }}
                transition={{
                  duration: 0.5,
                  repeat: Infinity,
                  delay: Math.random() * 1.5,
                }}
              />
            ))}
          </>
        );

      case 'foggy':
        return (
          <>
            {/* Mist particles */}
            {[...Array(particleCount)].map((_, i) => (
              <motion.div
                key={`mist-${i}`}
                className="absolute w-8 h-8 bg-gray-300/20 rounded-full blur-sm"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  x: [0, Math.random() * 100 - 50],
                  y: [0, Math.random() * 50 - 25],
                  scale: [0.5, 1.2, 0.8],
                  opacity: [0.1, 0.4, 0.1],
                }}
                transition={{
                  duration: Math.random() * 8 + 5,
                  repeat: Infinity,
                  delay: Math.random() * 3,
                }}
              />
            ))}
            {/* Dense fog layers */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={`fog-layer-${i}`}
                className="absolute w-full h-24 bg-gray-200/15 blur-xl"
                style={{
                  top: `${i * 15}%`,
                  left: '0%',
                }}
                animate={{
                  x: [0, 50, -50, 0],
                  opacity: [0.1, 0.25, 0.1],
                }}
                transition={{
                  duration: Math.random() * 20 + 15,
                  repeat: Infinity,
                  delay: Math.random() * 5,
                }}
              />
            ))}
            {/* Swirling mist */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={`swirl-${i}`}
                className="absolute w-16 h-16 bg-gray-300/25 rounded-full blur-lg"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  rotate: [0, 360],
                  scale: [0.5, 1.5, 0.5],
                  opacity: [0.1, 0.4, 0.1],
                  x: [0, Math.random() * 100 - 50],
                  y: [0, Math.random() * 60 - 30],
                }}
                transition={{
                  duration: Math.random() * 15 + 10,
                  repeat: Infinity,
                  delay: Math.random() * 8,
                }}
              />
            ))}
          </>
        );

      default:
        return null;
    }
  };

  const containerStyle = theme ? {
    background: theme.background,
    minHeight: '100vh',
    transition: 'background 0.5s ease-in-out'
  } : {
    background: 'linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)',
    minHeight: '100vh'
  };

  return (
    <ErrorBoundary>
      <motion.div 
        style={containerStyle}
        className="relative overflow-hidden"
      >
        {/* Weather particles */}
        <div className="absolute inset-0 pointer-events-none">
          {renderWeatherParticles()}
        </div>

        <div className="container mx-auto px-4 py-8">
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-between mb-8"
          >
            <motion.h1 
              className="text-3xl font-bold text-white"
              whileHover={{ 
                scale: 1.05,
                textShadow: "0px 0px 8px rgba(255,255,255,0.8)"
              }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              Weather Test Page
            </motion.h1>
            <div className="flex items-center gap-4">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <WeatherSettings />
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outline"
                  size="sm"
                  className="text-white border-white/30 hover:bg-white/20 bg-white/10 backdrop-blur-sm transition-all duration-300"
                >
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <MapPin className="w-4 h-4 mr-2" />
                  </motion.div>
                  Test Mode
                </Button>
              </motion.div>
            </div>
          </motion.header>

          {/* Weather Condition Selector */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-8 flex justify-center"
          >
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-4">
              <div className="flex items-center gap-4">
                <label className="text-white font-medium">Weather Condition:</label>
                <Select value={selectedWeather} onValueChange={(value) => setSelectedWeather(value as keyof typeof weatherConditions)}>
                  <SelectTrigger className="w-48 bg-white/10 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sunny">
                      <div className="flex items-center gap-2">
                        <Sun className="w-4 h-4" />
                        Sunny
                      </div>
                    </SelectItem>
                    <SelectItem value="rainy">
                      <div className="flex items-center gap-2">
                        <CloudRain className="w-4 h-4" />
                        Rainy
                      </div>
                    </SelectItem>
                    <SelectItem value="cloudy">
                      <div className="flex items-center gap-2">
                        <Cloud className="w-4 h-4" />
                        Cloudy
                      </div>
                    </SelectItem>
                    <SelectItem value="snowy">
                      <div className="flex items-center gap-2">
                        <Snowflake className="w-4 h-4" />
                        Snowy
                      </div>
                    </SelectItem>
                    <SelectItem value="stormy">
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4" />
                        Stormy
                      </div>
                    </SelectItem>
                    <SelectItem value="foggy">
                      <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4" />
                        Foggy
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </Card>
          </motion.div>

          {mockWeather && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-4 mb-4">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-white border-white/30 hover:bg-white/20 bg-white/10 backdrop-blur-sm transition-all duration-300"
                  >
                    <motion.div
                      animate={{ 
                        scale: [1, 1.2, 1],
                        rotate: [0, 10, -10, 0]
                      }}
                      transition={{ duration: 0.5 }}
                    >
                      <Heart className="w-4 h-4 mr-2 fill-red-500 text-red-500" />
                    </motion.div>
                    Test Location
                  </Button>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Badge variant="secondary" className="bg-white/20 text-white">
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    >
                      <Star className="w-3 h-3 mr-1" />
                    </motion.div>
                    Simulation Mode
                  </Badge>
                </motion.div>
              </div>

              <WeatherCard weather={mockWeather} />
              
              <ForecastSection forecast={mockForecast} />
            </motion.div>
          )}

          {/* Animation Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="mt-8"
          >
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-4">Current Animation Effects</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Visual Effects:</h4>
                    <ul className="text-sm text-white/80 space-y-1">
                      {selectedWeather === 'sunny' && (
                        <>
                          <li>• Animated sun rays</li>
                          <li>• Rising heat waves</li>
                          <li>• Warm color transitions</li>
                        </>
                      )}
                      {selectedWeather === 'rainy' && (
                        <>
                          <li>• Falling raindrops</li>
                          <li>• Puddle formations</li>
                          <li>• Cool blue atmosphere</li>
                        </>
                      )}
                      {selectedWeather === 'cloudy' && (
                        <>
                          <li>• Moving cloud formations</li>
                          <li>• Overcast atmosphere</li>
                          <li>• Gray color palette</li>
                        </>
                      )}
                      {selectedWeather === 'snowy' && (
                        <>
                          <li>• Falling snowflakes</li>
                          <li>• Snow accumulation</li>
                          <li>• Winter atmosphere</li>
                        </>
                      )}
                      {selectedWeather === 'stormy' && (
                        <>
                          <li>• Lightning flashes</li>
                          <li>• Heavy rainfall</li>
                          <li>• Dark storm clouds</li>
                        </>
                      )}
                      {selectedWeather === 'foggy' && (
                        <>
                          <li>• Moving mist particles</li>
                          <li>• Reduced visibility</li>
                          <li>• Soft gray tones</li>
                        </>
                      )}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Performance:</h4>
                    <ul className="text-sm text-white/80 space-y-1">
                      <li>• GPU-accelerated animations</li>
                      <li>• Responsive particle count</li>
                      <li>• Optimized for all screen sizes</li>
                      <li>• Smooth 60fps transitions</li>
                    </ul>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </ErrorBoundary>
  );
}