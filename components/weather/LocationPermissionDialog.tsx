'use client';

import { useState } from 'react';
import { MapPin, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface LocationPermissionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAllowLocation: () => void;
  onDenyLocation: () => void;
}

export function LocationPermissionDialog({
  isOpen,
  onClose,
  onAllowLocation,
  onDenyLocation
}: LocationPermissionDialogProps) {
  const [isRequesting, setIsRequesting] = useState(false);

  const handleAllowLocation = async () => {
    setIsRequesting(true);
    try {
      await onAllowLocation();
    } finally {
      setIsRequesting(false);
    }
  };

  const handleDenyLocation = () => {
    onDenyLocation();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-500" />
            Location Access
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-gray-600">
            Allow location access to get weather information for your current location automatically.
          </p>
          
          <div className="flex flex-col gap-3">
            <Button 
              onClick={handleAllowLocation}
              disabled={isRequesting}
              className="w-full"
            >
              {isRequesting ? 'Requesting...' : 'Allow Location Access'}
            </Button>
            
            <Button 
              variant="outline" 
              onClick={handleDenyLocation}
              className="w-full"
            >
              Use Search Instead
            </Button>
          </div>
          
          <p className="text-xs text-gray-500 text-center">
            You can change this preference later in settings.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}