import React from 'react';
import { useTranslation } from 'react-i18next';
import { useGeolocation } from '@hooks/useGeolocation';
import { MapPin, Loader2 } from 'lucide-react';

interface AutoDetectLocationProps {
  onDistrictDetected: (districtName: string) => void;
}

export const AutoDetectLocation: React.FC<AutoDetectLocationProps> = ({
  onDistrictDetected,
}) => {
  const { t } = useTranslation();
  const { location, loading, error, requestLocation } = useGeolocation();

  React.useEffect(() => {
    if (location?.district) {
      onDistrictDetected(location.district);
    }
  }, [location, onDistrictDetected]);

  return (
    <div>
      <button
        onClick={requestLocation}
        disabled={loading}
        className="w-full btn-primary flex items-center justify-center space-x-3 text-lg py-4"
      >
        {loading ? (
          <>
            <Loader2 className="w-6 h-6 animate-spin" />
            <span>{t('detectingLocation') || 'Detecting your location...'}</span>
          </>
        ) : (
          <>
            <MapPin className="w-6 h-6" />
            <span>{t('autoDetect') || 'Auto-detect my district'}</span>
          </>
        )}
      </button>

      {error && (
        <p className="mt-2 text-sm text-danger-600 text-center">
          {error}
        </p>
      )}

      {location && (
        <p className="mt-2 text-sm text-success-600 text-center">
          ✓ {t('locationDetected') || 'Location detected'}: {location.district}, {location.state}
        </p>
      )}
    </div>
  );
};
