'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, MapPin, Heart, Star } from 'lucide-react';
import { useWeather } from '@/hooks/useWeather';
import { getWeatherTheme } from '@/lib/weather-themes';
import { LocationData } from '@/lib/weather-api';
import { getFavoriteLocations, addFavoriteLocation, removeFavoriteLocation, StoredLocation } from '@/lib/storage';
import { SearchBar } from '@/components/weather/SearchBar';
import { WeatherCard } from '@/components/weather/WeatherCard';
import { ForecastSection } from '@/components/weather/ForecastSection';
import { WeatherSettings } from '@/components/weather/WeatherSettings';
import { LocationPermissionDialog } from '@/components/weather/LocationPermissionDialog';
import { ErrorBoundary, WeatherError } from '@/components/weather/ErrorBoundary';
import { LoadingSpinner, WeatherSkeleton } from '@/components/weather/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function Home() {
  const { weather, forecast, loading, error, fetchWeatherData, fetchUserLocationWeather, refreshWeather } = useWeather();
  const [showLocationDialog, setShowLocationDialog] = useState(false);
  const [favorites, setFavorites] = useState<StoredLocation[]>([]);
  const [theme, setTheme] = useState<any>(null);
  const [windowDimensions, setWindowDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    setFavorites(getFavoriteLocations());
  }, []);

  useEffect(() => {
    const updateWindowDimensions = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    updateWindowDimensions();
    window.addEventListener('resize', updateWindowDimensions);

    return () => window.removeEventListener('resize', updateWindowDimensions);
  }, []);

  useEffect(() => {
    if (weather) {
      const weatherTheme = getWeatherTheme(weather);
      setTheme(weatherTheme);
    }
  }, [weather]);

  const handleLocationSelect = (location: LocationData) => {
    fetchWeatherData(location.lat, location.lon);
  };

  const handleAllowLocation = async () => {
    try {
      await fetchUserLocationWeather();
      setShowLocationDialog(false);
    } catch (error) {
      console.error('Failed to get location:', error);
    }
  };

  const handleDenyLocation = () => {
    setShowLocationDialog(false);
  };

  const handleToggleFavorite = () => {
    if (!weather) return;

    const location: StoredLocation = {
      name: weather.name,
      country: weather.country,
      lat: weather.lat || 0,
      lon: weather.lon || 0,
      timestamp: Date.now()
    };

    const isFavorite = favorites.some(
      fav => fav.name === weather.name && fav.country === weather.country
    );

    if (isFavorite) {
      removeFavoriteLocation(weather.lat || 0, weather.lon || 0);
    } else {
      addFavoriteLocation(location);
    }

    setFavorites(getFavoriteLocations());
  };

  const isFavorite = weather && favorites.some(
    fav => fav.name === weather.name && fav.country === weather.country
  );

  const renderWeatherParticles = () => {
    const particleCount = weather?.weather.main.toLowerCase() === 'thunderstorm' ? 50 :
      weather?.weather.main.toLowerCase() === 'rain' ? 35 :
        weather?.weather.main.toLowerCase() === 'snow' ? 25 : 20;

    if (!weather) return null;

    const weatherMain = weather.weather.main.toLowerCase();

    switch (weatherMain) {
      case 'clear':
        return (
          <>
            {/* Sun rays */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={`sun-ray-${i}`}
                className="absolute w-1 h-20 bg-yellow-300/40 origin-bottom"
                style={{
                  top: '10%',
                  left: '50%',
                  transformOrigin: 'bottom center',
                  transform: `rotate(${i * 45}deg)`,
                }}
                animate={{
                  scaleY: [1, 1.2, 1],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
            {/* Floating light particles and sparkles */}
            {[...Array(particleCount)].map((_, i) => (
              <motion.div
                key={`sun-particle-${i}`}
                className="absolute w-2 h-2 bg-yellow-200/60 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -20, 0],
                  opacity: [0.3, 0.8, 0.3],
                  scale: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: Math.random() * 4 + 3,
                  repeat: Infinity,
                  delay: Math.random() * 2,
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
            {/* Heat shimmer effect */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={`shimmer-${i}`}
                className="absolute w-16 h-32 bg-gradient-to-t from-transparent via-yellow-200/20 to-transparent blur-sm"
                style={{
                  left: `${Math.random() * 100}%`,
                  bottom: '0px',
                }}
                animate={{
                  y: [0, -100, 0],
                  x: [0, Math.random() * 20 - 10],
                  opacity: [0, 0.4, 0],
                  scaleX: [1, 1.2, 1],
                }}
                transition={{
                  duration: Math.random() * 4 + 3,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
            {/* Lens flare effect */}
            <motion.div
              className="absolute top-[15%] left-[55%] w-8 h-8 bg-yellow-300/30 rounded-full blur-md"
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

      case 'rain':
      case 'drizzle':
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
            {/* Rain mist */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={`mist-${i}`}
                className="absolute w-20 h-8 bg-blue-200/20 rounded-full blur-md"
                style={{
                  left: `${Math.random() * 100}%`,
                  bottom: '0px',
                }}
                animate={{
                  y: [0, -30],
                  x: [0, Math.random() * 40 - 20],
                  opacity: [0, 0.4, 0],
                  scale: [0.8, 1.2, 0.8],
                }}
                transition={{
                  duration: Math.random() * 3 + 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </>
        );

      case 'snow':
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
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: Math.random() * 3 + 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                  ease: "linear",
                }}
              />
            ))}
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
                  opacity: [0, 0.9, 0],
                }}
                transition={{
                  duration: Math.random() * 4 + 3,
                  repeat: Infinity,
                  delay: Math.random() * 3,
                  ease: "linear",
                }}
              />
            ))}
            {/* Snow accumulation on ground */}
            {[...Array(10)].map((_, i) => (
              <motion.div
                key={`accumulation-${i}`}
                className="absolute bottom-0 w-24 h-2 bg-white/60 rounded-t-full"
                style={{
                  left: `${i * 10}%`,
                }}
                animate={{
                  scaleY: [0.5, 1, 0.8],
                  opacity: [0.4, 0.8, 0.6],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  delay: i * 0.5,
                }}
              />
            ))}
            {/* Frost crystals */}
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={`frost-${i}`}
                className="absolute w-1 h-1 bg-blue-100/80 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  boxShadow: '0 0 2px rgba(191, 219, 254, 0.8)',
                }}
                animate={{
                  opacity: [0, 0.8, 0],
                  scale: [0, 1, 0],
                  rotate: [0, 180],
                }}
                transition={{
                  duration: Math.random() * 3 + 2,
                  repeat: Infinity,
                  delay: Math.random() * 4,
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

      case 'clouds':
        return (
          <>
            {/* Moving clouds */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={`cloud-${i}`}
                className="absolute w-24 h-12 bg-white/30 rounded-full blur-sm"
                style={{
                  top: `${Math.random() * 40 + 10}%`,
                  left: `${Math.random() * 100}%`,
                }}
                animate={{
                  x: [0, -100, 0],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: Math.random() * 20 + 15,
                  repeat: Infinity,
                  delay: Math.random() * 5,
                }}
              />
            ))}
            {/* Layered clouds for depth */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={`layer-cloud-${i}`}
                className="absolute w-40 h-20 bg-gray-300/20 rounded-full blur-md"
                style={{
                  top: `${Math.random() * 50 + 5}%`,
                  left: `${Math.random() * 120 - 20}%`,
                }}
                animate={{
                  x: [0, -80, 0],
                  opacity: [0.2, 0.5, 0.2],
                  scale: [0.8, 1.1, 0.8],
                }}
                transition={{
                  duration: Math.random() * 25 + 20,
                  repeat: Infinity,
                  delay: Math.random() * 8,
                }}
              />
            ))}
            {/* Cloud shadows */}
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={`shadow-${i}`}
                className="absolute w-60 h-8 bg-gray-600/20 rounded-full blur-lg"
                style={{
                  bottom: '20%',
                  left: `${Math.random() * 80}%`,
                }}
                animate={{
                  x: [0, -100, 0],
                  opacity: [0.1, 0.3, 0.1],
                  scaleX: [0.8, 1.2, 0.8],
                }}
                transition={{
                  duration: Math.random() * 30 + 25,
                  repeat: Infinity,
                  delay: Math.random() * 10,
                }}
              />
            ))}
            {/* Sunbeams breaking through clouds */}
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={`sunbeam-${i}`}
                className="absolute w-2 bg-yellow-200/30 blur-sm"
                style={{
                  height: '120px',
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
            {/* Floating dust particles */}
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={`dust-${i}`}
                className="absolute w-1 h-1 bg-gray-400/40 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -20, 0],
                  x: [0, Math.random() * 30 - 15],
                  opacity: [0.2, 0.6, 0.2],
                }}
                transition={{
                  duration: Math.random() * 8 + 5,
                  repeat: Infinity,
                  delay: Math.random() * 5,
                }}
              />
            ))}
          </>
        );

      case 'thunderstorm':
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

      case 'mist':
      case 'fog':
        return (
          <>
            {/* Mist particles */}
            {[...Array(particleCount)].map((_, i) => (
              <motion.div
                key={`mist-${i}`}
                className="absolute w-8 h-8 bg-gray-300/20 rounded-full blur-md"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  x: [0, Math.random() * 50 - 25],
                  y: [0, Math.random() * 30 - 15],
                  opacity: [0.1, 0.3, 0.1],
                  scale: [0.8, 1.2, 0.8],
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
                className="absolute w-full h-32 bg-gray-200/15 blur-xl"
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
            {/* Visibility reduction effect */}
            <motion.div
              className="absolute inset-0 bg-gray-400/10 pointer-events-none"
              animate={{
                opacity: [0.05, 0.15, 0.05],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
              }}
            />
            {/* Distant object silhouettes */}
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={`silhouette-${i}`}
                className="absolute w-8 h-12 bg-gray-600/30 rounded-t-full blur-sm"
                style={{
                  bottom: '10%',
                  left: `${Math.random() * 80 + 10}%`,
                }}
                animate={{
                  opacity: [0, 0.3, 0],
                  scaleY: [0.8, 1.2, 0.8],
                }}
                transition={{
                  duration: Math.random() * 10 + 8,
                  repeat: Infinity,
                  delay: Math.random() * 6,
                }}
              />
            ))}
          </>
        );

      default:
        return null;
    }
  };

  // Enhanced background animation based on weather
  const getWeatherAnimation = () => {
    if (!weather) return {};

    const weatherMain = weather.weather.main.toLowerCase();

    const animations: {
      [key: string]: {
        background: string[];
        transition: {
          duration: number;
          repeat: number;
          ease: string;
        };
      };
    } = {
      rain: {
        background: [
          'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
          'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
          'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
        ],
        transition: { duration: 4, repeat: Infinity, ease: "easeInOut" }
      },
      thunderstorm: {
        background: [
          'linear-gradient(135deg, #2c3e50 0%, #000428 100%)',
          'linear-gradient(135deg, #434343 0%, #000000 100%)',
          'linear-gradient(135deg, #2c3e50 0%, #000428 100%)'
        ],
        transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
      },
      snow: {
        background: [
          'linear-gradient(135deg, #e6ddd4 0%, #f0f0f0 100%)',
          'linear-gradient(135deg, #ffffff 0%, #e6ddd4 100%)',
          'linear-gradient(135deg, #e6ddd4 0%, #f0f0f0 100%)'
        ],
        transition: { duration: 6, repeat: Infinity, ease: "easeInOut" }
      },
      clear: {
        background: [
          'linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)',
          'linear-gradient(135deg, #fdcb6e 0%, #e17055 100%)',
          'linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)'
        ],
        transition: { duration: 8, repeat: Infinity, ease: "easeInOut" }
      }
    };

    return animations[weatherMain] || animations.clear;
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

        {/* Floating particles animation */}
        <div className="absolute inset-0 pointer-events-none">
          {windowDimensions.width > 0 && [...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full"
              initial={{
                x: Math.random() * windowDimensions.width,
                y: windowDimensions.height + 10,
              }}
              animate={{
                y: -10,
                x: Math.random() * windowDimensions.width,
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                ease: "linear",
                delay: Math.random() * 10,
              }}
            />
          ))}
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
              Ghonchu Weather App
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
                  onClick={() => setShowLocationDialog(true)}
                  className="text-white border-white/30 hover:bg-white/20 bg-white/10 backdrop-blur-sm transition-all duration-300"
                >
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <MapPin className="w-4 h-4 mr-2" />
                  </motion.div>
                  Location
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outline"
                  size="sm"
                  onClick={refreshWeather}
                  disabled={loading}
                  className="text-white border-white/30 hover:bg-white/20 bg-white/10 backdrop-blur-sm transition-all duration-300"
                >
                  <motion.div
                    animate={loading ? { rotate: 360 } : {}}
                    transition={loading ? { duration: 1, repeat: Infinity, ease: "linear" } : {}}
                  >
                    <RefreshCw className="w-4 h-4" />
                  </motion.div>
                </Button>
              </motion.div>
            </div>
          </motion.header>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-8"
          >
            <SearchBar
              onLocationSelect={handleLocationSelect}
              className="max-w-md mx-auto"
            />
          </motion.div>

          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="mb-8"
            >
              <WeatherError error={error} onRetry={refreshWeather} />
            </motion.div>
          )}

          {loading && !weather && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <WeatherSkeleton />
            </motion.div>
          )}

          {weather && (
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
                    onClick={handleToggleFavorite}
                    className="text-white border-white/30 hover:bg-white/20 bg-white/10 backdrop-blur-sm transition-all duration-300"
                  >
                    <motion.div
                      animate={isFavorite ? {
                        scale: [1, 1.2, 1],
                        rotate: [0, 10, -10, 0]
                      } : {}}
                      transition={{ duration: 0.5 }}
                    >
                      <Heart className={`w-4 h-4 mr-2 transition-colors duration-300 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                    </motion.div>
                    {isFavorite ? 'Favorited' : 'Add to Favorites'}
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
                    Current Location
                  </Badge>
                </motion.div>
              </div>

              <WeatherCard weather={weather} />

              {forecast && forecast.length > 0 && (
                <ForecastSection forecast={forecast} />
              )}
            </motion.div>
          )}

          {!loading && !weather && !error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center text-white"
            >
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white p-8">
                <motion.h2
                  className="text-2xl font-semibold mb-4"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  Welcome to Weather App
                </motion.h2>
                <motion.p
                  className="text-white/80 mb-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  Search for a city or allow location access to get started with real-time weather updates.
                </motion.p>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={() => setShowLocationDialog(true)}
                    className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm transition-all duration-300"
                  >
                    <MapPin className="w-4 h-4 mr-2" />
                    Get Current Location Weather
                  </Button>
                </motion.div>
              </Card>
            </motion.div>
          )}

          {favorites.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-8"
            >
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                <div className="p-6">
                  <motion.h3
                    className="text-xl font-semibold mb-4"
                    whileHover={{ scale: 1.02 }}
                  >
                    Favorite Locations
                  </motion.h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {favorites.map((location, index) => (
                      <motion.button
                        key={`${location.lat}-${location.lon}`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        whileHover={{
                          scale: 1.05,
                          backgroundColor: "rgba(255,255,255,0.15)",
                          boxShadow: "0 4px 20px rgba(0,0,0,0.1)"
                        }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => handleLocationSelect(location)}
                        className="p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300 text-left"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">{location.name}</div>
                            <div className="text-sm text-white/80">{location.country}</div>
                          </div>
                          <motion.div
                            animate={{
                              scale: [1, 1.2, 1],
                              rotate: [0, 10, -10, 0]
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              delay: index * 0.5
                            }}
                          >
                            <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                          </motion.div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </div>
        <footer className="mt-10 px-6 py-6 w-full text-center bg-gradient-to-br from-[#1e293b]/60 to-[#0f172a]/60 backdrop-blur-lg border-t border-white/10 rounded-t-2xl shadow-inner">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/80">
            <div>
              <p>
                Made with <span className="text-pink-500">❤️</span> by{" "}
                <a
                  href={process.env.NEXT_PUBLIC_PORTFOLIO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-400 hover:underline"
                >
                  Abhishek DEY
                </a>
              </p>
            </div>

            <div className="flex gap-4">
              <a
                href={process.env.NEXT_PUBLIC_PORTFOLIO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white"
              >
                Portfolio
              </a>
              <a
                href="https://github.com/Abhishek20110"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white"
              >
                GitHub
              </a>
              <a
                href="https://www.linkedin.com/in/abhishek-dey-059b781b9/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white"
              >
                LinkedIn
              </a>
            </div>

            <div>
              <p className="text-xs text-white/50">
                © {new Date().getFullYear()} Ghonchu Weather. All rights reserved.
              </p>
            </div>
          </div>
        </footer>


        <LocationPermissionDialog
          isOpen={showLocationDialog}
          onClose={() => setShowLocationDialog(false)}
          onAllowLocation={handleAllowLocation}
          onDenyLocation={handleDenyLocation}
        />
      </motion.div>
    </ErrorBoundary>
  );
}