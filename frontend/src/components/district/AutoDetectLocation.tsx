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
  const [fallbackMessage, setFallbackMessage] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (location) {
      const { district, state } = location;
      // Only accept districts in Uttar Pradesh
      if (state === 'Uttar Pradesh') {
        onDistrictDetected(district || '');
      } else {
        // Default to Agra if outside UP
        setFallbackMessage(
          t('locationOutsideUP', { state }) ||
            `Detected state ${state}, defaulting to Agra.`
        );
        onDistrictDetected('Agra');
      }
    }
  }, [location, onDistrictDetected, t]);

  return (
    <div>
      <button
        onClick={requestLocation}
        disabled={loading}
        className="w-full btn-primary flex items-center justify-center space-x-3 text-lg py-4"
        aria-label={
          loading
            ? t('detectingLocation') || 'Detecting your location...'
            : t('autoDetect') || 'Auto-detect my district'
        }
        aria-busy={loading}
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
      {fallbackMessage && (
        <p className="mt-2 text-sm text-warning-600 text-center">
          {fallbackMessage}
        </p>
      )}
    </div>
  );
};
