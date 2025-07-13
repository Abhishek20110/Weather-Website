'use client';

import { useState, useEffect, useCallback } from 'react';
import { WeatherData, getCurrentWeather, getForecast, ForecastData } from '@/lib/weather-api';
import { getUserLocation, GeolocationError } from '@/lib/geolocation';
import { getUserPreferences } from '@/lib/storage';

export interface WeatherState {
  weather: WeatherData | null;
  forecast: ForecastData[] | null;
  loading: boolean;
  error: string | null;
  location: { lat: number; lon: number } | null;
}

export function useWeather() {
  const [state, setState] = useState<WeatherState>({
    weather: null,
    forecast: null,
    loading: false,
    error: null,
    location: null
  });

  const fetchWeatherData = useCallback(async (lat: number, lon: number) => {
    console.log('useWeather: fetchWeatherData called with:', lat, lon);
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      console.log('useWeather: Starting weather data fetch...');
      const [weatherData, forecastData] = await Promise.all([
        getCurrentWeather(lat, lon),
        getForecast(lat, lon)
      ]);

      console.log('useWeather: Weather data received:', weatherData);
      console.log('useWeather: Forecast data received:', forecastData);

      setState(prev => ({
        ...prev,
        weather: weatherData,
        forecast: forecastData,
        loading: false,
        location: { lat, lon }
      }));
    } catch (error) {
      console.error('useWeather: Error fetching weather data:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to fetch weather data',
        loading: false
      }));
    }
  }, []);

  const fetchUserLocationWeather = useCallback(async () => {
    console.log('useWeather: fetchUserLocationWeather called');
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      console.log('useWeather: Getting user location...');
      const location = await getUserLocation();
      console.log('useWeather: User location received:', location);
      await fetchWeatherData(location.lat, location.lon);
    }

    catch (error) {
      console.error('useWeather: Error fetching weather data:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to fetch weather data',
        loading: false
      }));
    }
  }, [fetchWeatherData]);

  const refreshWeather = useCallback(() => {
    console.log('useWeather: refreshWeather called');
    if (state.location) {
      console.log('useWeather: Refreshing with existing location:', state.location);
      fetchWeatherData(state.location.lat, state.location.lon);
    } else {
      console.log('useWeather: No existing location, trying user location');
      fetchUserLocationWeather();
    }
  }, [state.location, fetchWeatherData, fetchUserLocationWeather]);

  // Auto-fetch weather on mount if user has auto-location enabled
  useEffect(() => {
    console.log('useWeather: useEffect triggered');
    const preferences = getUserPreferences();
    console.log('useWeather: User preferences:', preferences);

    if (preferences.autoLocation) {
      console.log('useWeather: Auto-location enabled, fetching user location weather');
      fetchUserLocationWeather();
    } else {
      console.log('useWeather: Auto-location disabled');
    }
  }, [fetchUserLocationWeather]);

  return {
    ...state,
    fetchWeatherData,
    fetchUserLocationWeather,
    refreshWeather
  };
}