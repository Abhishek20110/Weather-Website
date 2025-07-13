'use client';

import { useState, useEffect } from 'react';
import { Settings, Thermometer, Palette, Bell, MapPin } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { getUserPreferences, updateUserPreferences, UserPreferences } from '@/lib/storage';

interface WeatherSettingsProps {
  onSettingsChange?: (preferences: UserPreferences) => void;
}

export function WeatherSettings({ onSettingsChange }: WeatherSettingsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [preferences, setPreferences] = useState<UserPreferences>({
    temperatureUnit: 'celsius',
    theme: 'auto',
    notifications: false,
    autoLocation: true
  });

  useEffect(() => {
    setPreferences(getUserPreferences());
  }, []);

  const handlePreferenceChange = (key: keyof UserPreferences, value: any) => {
    const newPreferences = { ...preferences, [key]: value };
    setPreferences(newPreferences);
    updateUserPreferences(newPreferences);
    onSettingsChange?.(newPreferences);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="text-white border-white/30 hover:bg-white/20 bg-white/10 backdrop-blur-sm">
          <Settings className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Weather Settings
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Thermometer className="w-5 h-5 text-blue-500" />
              <Label htmlFor="temperature-unit" className="text-sm font-medium">
                Temperature Unit
              </Label>
            </div>
            <div className="flex items-center gap-4 ml-8">
              <Button
                variant={preferences.temperatureUnit === 'celsius' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handlePreferenceChange('temperatureUnit', 'celsius')}
              >
                °C
              </Button>
              <Button
                variant={preferences.temperatureUnit === 'fahrenheit' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handlePreferenceChange('temperatureUnit', 'fahrenheit')}
              >
                °F
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Palette className="w-5 h-5 text-purple-500" />
              <Label htmlFor="theme" className="text-sm font-medium">
                Theme
              </Label>
            </div>
            <div className="flex items-center gap-2 ml-8">
              <Button
                variant={preferences.theme === 'auto' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handlePreferenceChange('theme', 'auto')}
              >
                Auto
              </Button>
              <Button
                variant={preferences.theme === 'light' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handlePreferenceChange('theme', 'light')}
              >
                Light
              </Button>
              <Button
                variant={preferences.theme === 'dark' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handlePreferenceChange('theme', 'dark')}
              >
                Dark
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-yellow-500" />
                <Label htmlFor="notifications" className="text-sm font-medium">
                  Weather Notifications
                </Label>
              </div>
              <Switch
                id="notifications"
                checked={preferences.notifications}
                onCheckedChange={(checked) => handlePreferenceChange('notifications', checked)}
              />
            </div>
            <p className="text-xs text-gray-500 ml-8">
              Get notified about weather alerts and significant changes
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-green-500" />
                <Label htmlFor="auto-location" className="text-sm font-medium">
                  Auto-detect Location
                </Label>
              </div>
              <Switch
                id="auto-location"
                checked={preferences.autoLocation}
                onCheckedChange={(checked) => handlePreferenceChange('autoLocation', checked)}
              />
            </div>
            <p className="text-xs text-gray-500 ml-8">
              Automatically use your current location for weather updates
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}