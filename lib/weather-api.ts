const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const GEO_URL = 'https://api.openweathermap.org/geo/1.0';

export interface WeatherData {
  name: string;
  country: string;
  lat: number;
  lon: number;
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  humidity: number;
  pressure: number;
  visibility: number;
  wind_speed: number;
  wind_deg: number;
  clouds: number;
  weather: {
    main: string;
    description: string;
    icon: string;
  };
  sunrise: number;
  sunset: number;
  timezone: number;
  dt: number;
}

export interface ForecastData {
  dt: number;
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  humidity: number;
  weather: {
    main: string;
    description: string;
    icon: string;
  };
  wind_speed: number;
  pop: number;
}

export interface LocationData {
  name: string;
  country: string;
  lat: number;
  lon: number;
  state?: string;
}

export async function getCurrentWeather(lat: number, lon: number): Promise<WeatherData> {
  console.log('Fetching weather for coordinates:', lat, lon);
  
  if (!API_KEY) {
    throw new Error('OpenWeatherMap API key is not configured. Please set NEXT_PUBLIC_OPENWEATHER_API_KEY in your environment variables.');
  }
  
  const url = `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
  console.log('Weather API URL:', url);
  
  try {
    const response = await fetch(url);
    console.log('Weather API response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Weather API error:', errorText);
      throw new Error(`Failed to fetch weather data: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Weather API response data:', data);

    return {
      name: data.name || 'Unknown Location',
      country: data.sys?.country || 'Unknown',
      lat: lat,
      lon: lon,
      temp: data.main?.temp || 0,
      feels_like: data.main?.feels_like || 0,
      temp_min: data.main?.temp_min || 0,
      temp_max: data.main?.temp_max || 0,
      humidity: data.main?.humidity || 0,
      pressure: data.main?.pressure || 0,
      visibility: data.visibility || 10000,
      wind_speed: data.wind?.speed || 0,
      wind_deg: data.wind?.deg || 0,
      clouds: data.clouds?.all || 0,
      weather: {
        main: data.weather?.[0]?.main || 'Clear',
        description: data.weather?.[0]?.description || 'Clear sky',
        icon: data.weather?.[0]?.icon || '01d'
      },
      sunrise: data.sys?.sunrise || 0,
      sunset: data.sys?.sunset || 0,
      timezone: data.timezone || 0,
      dt: data.dt || Math.floor(Date.now() / 1000)
    };
  } catch (error) {
    console.error('Error in getCurrentWeather:', error);
    throw new Error(`Weather service unavailable: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function getForecast(lat: number, lon: number): Promise<ForecastData[]> {
  console.log('Fetching forecast for coordinates:', lat, lon);
  
  if (!API_KEY) {
    throw new Error('OpenWeatherMap API key is not configured. Please set NEXT_PUBLIC_OPENWEATHER_API_KEY in your environment variables.');
  }
  
  const url = `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
  console.log('Forecast API URL:', url);
  
  try {
    const response = await fetch(url);
    console.log('Forecast API response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Forecast API error:', errorText);
      throw new Error(`Failed to fetch forecast data: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Forecast API response data:', data);

    if (!data.list || !Array.isArray(data.list)) {
      console.error('Invalid forecast data structure:', data);
      return [];
    }

    return data.list.map((item: any) => ({
      dt: item.dt || 0,
      temp: item.main?.temp || 0,
      feels_like: item.main?.feels_like || 0,
      temp_min: item.main?.temp_min || 0,
      temp_max: item.main?.temp_max || 0,
      humidity: item.main?.humidity || 0,
      weather: {
        main: item.weather?.[0]?.main || 'Clear',
        description: item.weather?.[0]?.description || 'Clear sky',
        icon: item.weather?.[0]?.icon || '01d'
      },
      wind_speed: item.wind?.speed || 0,
      pop: item.pop || 0
    }));
  } catch (error) {
    console.error('Error in getForecast:', error);
    throw new Error(`Forecast service unavailable: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function searchLocations(query: string): Promise<LocationData[]> {
  console.log('Searching locations for query:', query);
  
  if (!API_KEY) {
    throw new Error('OpenWeatherMap API key is not configured. Please set NEXT_PUBLIC_OPENWEATHER_API_KEY in your environment variables.');
  }
  
  const url = `${GEO_URL}/direct?q=${encodeURIComponent(query)}&limit=5&appid=${API_KEY}`;
  console.log('Search API URL:', url);
  
  try {
    const response = await fetch(url);
    console.log('Search API response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Search API error:', errorText);
      throw new Error(`Failed to search locations: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Search API response data:', data);

    if (!Array.isArray(data)) {
      console.error('Invalid search data structure:', data);
      return [];
    }

    return data.map((item: any) => ({
      name: item.name || 'Unknown',
      country: item.country || 'Unknown',
      lat: item.lat || 0,
      lon: item.lon || 0,
      state: item.state
    }));
  } catch (error) {
    console.error('Error in searchLocations:', error);
    throw new Error(`Location search unavailable: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function getLocationByCoords(lat: number, lon: number): Promise<LocationData> {
  console.log('Getting location name for coordinates:', lat, lon);
  
  if (!API_KEY) {
    throw new Error('OpenWeatherMap API key is not configured. Please set NEXT_PUBLIC_OPENWEATHER_API_KEY in your environment variables.');
  }
  
  const url = `${GEO_URL}/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`;
  console.log('Reverse geocoding API URL:', url);
  
  try {
    const response = await fetch(url);
    console.log('Reverse geocoding API response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Reverse geocoding API error:', errorText);
      throw new Error(`Failed to get location name: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Reverse geocoding API response data:', data);

    if (!Array.isArray(data) || data.length === 0) {
      console.error('No location data found for coordinates');
      return {
        name: 'Unknown Location',
        country: 'Unknown',
        lat,
        lon
      };
    }

    const locationData = data[0];
    return {
      name: locationData.name || 'Unknown Location',
      country: locationData.country || 'Unknown',
      lat: locationData.lat || lat,
      lon: locationData.lon || lon,
      state: locationData.state
    };
  } catch (error) {
    console.error('Error in getLocationByCoords:', error);
    return {
      name: 'Unknown Location',
      country: 'Unknown',
      lat,
      lon
    };
  }
}