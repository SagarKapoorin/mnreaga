import { useState } from 'react';
import { reverseGeocode } from '@services/geocoding';
import type { Location } from '@typings/district.types';

interface GeolocationState {
  location: Location | null;
  loading: boolean;
  error: string | null;
  requestLocation: () => void;
}

export const useGeolocation = (): GeolocationState => {
  const [location, setLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const locationData = await reverseGeocode(latitude, longitude);
          setLocation(locationData);
        } catch (err) {
          setError('Unable to determine your location');
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        setError(err.message || 'Location permission denied');
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      }
    );
  };

  return {
    location,
    loading,
    error,
    requestLocation,
  };
};
