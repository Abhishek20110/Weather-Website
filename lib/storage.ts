export interface StoredLocation {
  name: string;
  country: string;
  lat: number;
  lon: number;
  state?: string;
  timestamp: number;
}

export interface UserPreferences {
  temperatureUnit: 'celsius' | 'fahrenheit';
  theme: 'auto' | 'light' | 'dark';
  notifications: boolean;
  autoLocation: boolean;
}

const STORAGE_KEYS = {
  FAVORITES: 'weather-favorites',
  RECENT_SEARCHES: 'weather-recent-searches',
  PREFERENCES: 'weather-preferences'
} as const;

export function getFavoriteLocations(): StoredLocation[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.FAVORITES);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading favorite locations:', error);
    return [];
  }
}

export function addFavoriteLocation(location: StoredLocation): void {
  if (typeof window === 'undefined') return;
  
  try {
    const favorites = getFavoriteLocations();
    const exists = favorites.some(
      fav => fav.lat === location.lat && fav.lon === location.lon
    );
    
    if (!exists) {
      favorites.push({
        ...location,
        timestamp: Date.now()
      });
      localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
    }
  } catch (error) {
    console.error('Error adding favorite location:', error);
  }
}

export function removeFavoriteLocation(lat: number, lon: number): void {
  if (typeof window === 'undefined') return;
  
  try {
    const favorites = getFavoriteLocations();
    const filtered = favorites.filter(
      fav => !(fav.lat === lat && fav.lon === lon)
    );
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error removing favorite location:', error);
  }
}

export function getRecentSearches(): StoredLocation[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.RECENT_SEARCHES);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading recent searches:', error);
    return [];
  }
}

export function addRecentSearch(location: StoredLocation): void {
  if (typeof window === 'undefined') return;
  
  try {
    const recent = getRecentSearches();
    const filtered = recent.filter(
      item => !(item.lat === location.lat && item.lon === location.lon)
    );
    
    filtered.unshift({
      ...location,
      timestamp: Date.now()
    });
    
    // Keep only last 10 searches
    const limited = filtered.slice(0, 10);
    localStorage.setItem(STORAGE_KEYS.RECENT_SEARCHES, JSON.stringify(limited));
  } catch (error) {
    console.error('Error adding recent search:', error);
  }
}

export function getUserPreferences(): UserPreferences {
  if (typeof window === 'undefined') {
    return {
      temperatureUnit: 'celsius',
      theme: 'auto',
      notifications: false,
      autoLocation: true
    };
  }
  
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
    const defaults: UserPreferences = {
      temperatureUnit: 'celsius',
      theme: 'auto',
      notifications: false,
      autoLocation: true
    };
    
    return stored ? { ...defaults, ...JSON.parse(stored) } : defaults;
  } catch (error) {
    console.error('Error loading user preferences:', error);
    return {
      temperatureUnit: 'celsius',
      theme: 'auto',
      notifications: false,
      autoLocation: true
    };
  }
}

export function updateUserPreferences(preferences: Partial<UserPreferences>): void {
  if (typeof window === 'undefined') return;
  
  try {
    const current = getUserPreferences();
    const updated = { ...current, ...preferences };
    localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(updated));
  } catch (error) {
    console.error('Error updating user preferences:', error);
  }
}