'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Clock, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDebounce } from '@/hooks/useDebounce';
import { searchLocations, LocationData } from '@/lib/weather-api';
import { getRecentSearches, addRecentSearch, StoredLocation } from '@/lib/storage';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface SearchBarProps {
  onLocationSelect: (location: LocationData) => void;
  className?: string;
}

export function SearchBar({ onLocationSelect, className = '' }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<LocationData[]>([]);
  const [recentSearches, setRecentSearches] = useState<StoredLocation[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    setRecentSearches(getRecentSearches());
  }, []);

  useEffect(() => {
    if (debouncedQuery.trim()) {
      performSearch(debouncedQuery);
    } else {
      setSearchResults([]);
    }
  }, [debouncedQuery]);

  const performSearch = async (searchQuery: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const { searchLocations } = await import('@/lib/weather-api');
      const results = await searchLocations(searchQuery);
      setSearchResults(results);
    } catch (err) {
      setError('Failed to search locations');
      setSearchResults([]);
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLocationSelect = (location: LocationData) => {
    const storedLocation: StoredLocation = {
      ...location,
      timestamp: Date.now()
    };
    
    addRecentSearch(storedLocation);
    setRecentSearches(getRecentSearches());
    onLocationSelect(location);
    setQuery('');
    setIsOpen(false);
    setSearchResults([]);
  };

  const clearQuery = () => {
    setQuery('');
    setSearchResults([]);
    inputRef.current?.focus();
  };

  const handleFocus = () => {
    setIsOpen(true);
  };

  const handleBlur = (e: React.FocusEvent) => {
    // Don't close if clicking on a result
    if (containerRef.current?.contains(e.relatedTarget as Node)) {
      return;
    }
    setTimeout(() => setIsOpen(false), 200);
  };

  const displayResults = query.trim() ? searchResults : recentSearches;
  const showResults = isOpen && (displayResults.length > 0 || loading || error);

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder="Search for a city..."
          className="pl-10 pr-10 h-12 bg-white/10 border-white/20 text-white placeholder-white/70 focus:border-white/40"
        />
        {query && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearQuery}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white p-1"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      <AnimatePresence>
        {showResults && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 z-50 mt-2"
          >
            <Card className="bg-white/95 backdrop-blur-sm border-white/20 shadow-lg">
              <div className="p-2">
                {loading && (
                  <div className="flex items-center justify-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                  </div>
                )}
                
                {error && (
                  <div className="text-red-500 text-sm p-3 text-center">
                    {error}
                  </div>
                )}
                
                {!loading && !error && (
                  <>
                    {!query.trim() && recentSearches.length > 0 && (
                      <div className="mb-2">
                        <div className="text-sm text-gray-500">
                          <Clock className="w-4 h-4" />
                        </div>
                      </div>
                    )}
                    
                    <div className="space-y-1">
                      {displayResults.map((location, index) => (
                        <motion.button
                          key={`${location.lat}-${location.lon}-${index}`}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ 
                            scale: 1.02, 
                            backgroundColor: "rgba(59, 130, 246, 0.1)",
                            x: 5
                          }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleLocationSelect(location)}
                          className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 transition-all duration-200 flex items-center gap-2"
                        >
                          <motion.div
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                          >
                            <MapPin className="w-4 h-4 text-gray-400" />
                          </motion.div>
                          <motion.div 
                            className="font-medium text-gray-900"
                            whileHover={{ color: "#3b82f6" }}
                          >
                            {location.name}
                          </motion.div>
                        </motion.button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}