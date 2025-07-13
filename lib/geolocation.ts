export interface GeolocationResult {
  lat: number;
  lon: number;
}

export class GeolocationError extends Error {
  constructor(message: string, public code: number) {
    super(message);
    this.name = 'GeolocationError';
  }
}

export async function getUserLocation(): Promise<GeolocationResult> {
  console.log('geolocation: getUserLocation called');
  
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      console.error('geolocation: Geolocation not supported');
      reject(new GeolocationError('Geolocation is not supported by this browser', 0));
      return;
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 15000, // Increased timeout
      maximumAge: 5 * 60 * 1000 // 5 minutes
    };

    console.log('geolocation: Requesting position with options:', options);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log('geolocation: Position received:', position);
        const result = {
          lat: position.coords.latitude,
          lon: position.coords.longitude
        };
        console.log('geolocation: Returning coordinates:', result);
        resolve(result);
      },
      (error) => {
        console.error('geolocation: Error getting position:', error);
        let message = 'Unable to get your location';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = 'Location access denied. Please enable location services or search for a city.';
            break;
          case error.POSITION_UNAVAILABLE:
            message = 'Location information is unavailable. Please search for a city.';
            break;
          case error.TIMEOUT:
            message = 'Location request timed out. Please try again or search for a city.';
            break;
        }
        reject(new GeolocationError(message, error.code));
      },
      options
    );
  });
}

export function watchUserLocation(
  onSuccess: (position: GeolocationResult) => void,
  onError: (error: GeolocationError) => void
): number {
  console.log('geolocation: watchUserLocation called');
  
  if (!navigator.geolocation) {
    onError(new GeolocationError('Geolocation is not supported by this browser', 0));
    return -1;
  }

  return navigator.geolocation.watchPosition(
    (position) => {
      console.log('geolocation: Watch position received:', position);
      onSuccess({
        lat: position.coords.latitude,
        lon: position.coords.longitude
      });
    },
    (error) => {
      console.error('geolocation: Watch position error:', error);
      let message = 'Unable to get your location';
      switch (error.code) {
        case error.PERMISSION_DENIED:
          message = 'Location access denied by user';
          break;
        case error.POSITION_UNAVAILABLE:
          message = 'Location information is unavailable';
          break;
        case error.TIMEOUT:
          message = 'Location request timed out';
          break;
      }
      onError(new GeolocationError(message, error.code));
    },
    {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 5 * 60 * 1000
    }
  );
}

export function clearLocationWatch(watchId: number): void {
  console.log('geolocation: clearLocationWatch called with ID:', watchId);
  navigator.geolocation.clearWatch(watchId);
}