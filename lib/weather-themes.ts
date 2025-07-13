import { WeatherData } from './weather-api';

export interface WeatherTheme {
  name: string;
  background: string;
  primaryColor: string;
  secondaryColor: string;
  textColor: string;
  cardBackground: string;
  accentColor: string;
}

export function getWeatherTheme(weather: WeatherData): WeatherTheme {
  const currentTime = new Date().getTime() / 1000;
  const isNight = currentTime < weather.sunrise || currentTime > weather.sunset;
  const weatherMain = weather.weather.main.toLowerCase();
  
  // Base themes for different weather conditions
  const themes: Record<string, WeatherTheme> = {
    clear: {
      name: 'Clear',
      background: isNight 
        ? 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)'
        : 'linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)',
      primaryColor: isNight ? '#ffeaa7' : '#fdcb6e',
      secondaryColor: isNight ? '#74b9ff' : '#0984e3',
      textColor: '#ffffff',
      cardBackground: 'rgba(255, 255, 255, 0.1)',
      accentColor: '#fdcb6e'
    },
    clouds: {
      name: 'Cloudy',
      background: isNight
        ? 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)'
        : 'linear-gradient(135deg, #bdc3c7 0%, #2c3e50 100%)',
      primaryColor: '#ecf0f1',
      secondaryColor: '#95a5a6',
      textColor: '#ffffff',
      cardBackground: 'rgba(255, 255, 255, 0.15)',
      accentColor: '#74b9ff'
    },
    rain: {
      name: 'Rainy',
      background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      primaryColor: '#00b894',
      secondaryColor: '#0984e3',
      textColor: '#ffffff',
      cardBackground: 'rgba(255, 255, 255, 0.12)',
      accentColor: '#00cec9'
    },
    drizzle: {
      name: 'Drizzle',
      background: 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)',
      primaryColor: '#74b9ff',
      secondaryColor: '#0984e3',
      textColor: '#ffffff',
      cardBackground: 'rgba(255, 255, 255, 0.12)',
      accentColor: '#00cec9'
    },
    thunderstorm: {
      name: 'Thunderstorm',
      background: 'linear-gradient(135deg, #2c3e50 0%, #000428 100%)',
      primaryColor: '#e17055',
      secondaryColor: '#636e72',
      textColor: '#ffffff',
      cardBackground: 'rgba(255, 255, 255, 0.08)',
      accentColor: '#fd79a8'
    },
    snow: {
      name: 'Snow',
      background: 'linear-gradient(135deg, #e6ddd4 0%, #f0f0f0 100%)',
      primaryColor: '#74b9ff',
      secondaryColor: '#0984e3',
      textColor: '#2d3436',
      cardBackground: 'rgba(255, 255, 255, 0.4)',
      accentColor: '#00cec9'
    },
    mist: {
      name: 'Mist',
      background: 'linear-gradient(135deg, #c7ecee 0%, #65c7f7 100%)',
      primaryColor: '#636e72',
      secondaryColor: '#2d3436',
      textColor: '#ffffff',
      cardBackground: 'rgba(255, 255, 255, 0.2)',
      accentColor: '#74b9ff'
    }
  };

  return themes[weatherMain] || themes.clear;
}

export function getTemperatureColor(temp: number): string {
  if (temp <= 0) return '#74b9ff'; // Very cold - blue
  if (temp <= 10) return '#00b894'; // Cold - cyan
  if (temp <= 20) return '#00cec9'; // Cool - teal
  if (temp <= 30) return '#fdcb6e'; // Warm - yellow
  if (temp <= 35) return '#e17055'; // Hot - orange
  return '#d63031'; // Very hot - red
}

export function getWeatherIcon(weatherMain: string, isNight: boolean): string {
  const icons: Record<string, { day: string; night: string }> = {
    clear: { day: '☀️', night: '🌙' },
    clouds: { day: '☁️', night: '☁️' },
    rain: { day: '🌧️', night: '🌧️' },
    drizzle: { day: '🌦️', night: '🌦️' },
    thunderstorm: { day: '⛈️', night: '⛈️' },
    snow: { day: '❄️', night: '❄️' },
    mist: { day: '🌫️', night: '🌫️' },
    smoke: { day: '🌫️', night: '🌫️' },
    haze: { day: '🌫️', night: '🌫️' },
    dust: { day: '🌪️', night: '🌪️' },
    fog: { day: '🌫️', night: '🌫️' },
    sand: { day: '🌪️', night: '🌪️' },
    ash: { day: '🌋', night: '🌋' },
    squall: { day: '💨', night: '💨' },
    tornado: { day: '🌪️', night: '🌪️' }
  };

  const weatherIcon = icons[weatherMain.toLowerCase()] || icons.clear;
  return isNight ? weatherIcon.night : weatherIcon.day;
}