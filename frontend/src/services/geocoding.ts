import axios from 'axios';
import type { Location } from '@typings/district.types';

const NOMINATIM_API = import.meta.env.VITE_NOMINATIM_API;

interface NominatimResponse {
  address: {
    state_district?: string;
    county?: string;
    state?: string;
    country?: string;
  };
  display_name: string;
}

export const reverseGeocode = async (
  latitude: number,
  longitude: number
): Promise<Location> => {
  try {
    const response = await axios.get<NominatimResponse>(
      `${NOMINATIM_API}/reverse`,
      {
        params: {
          lat: latitude,
          lon: longitude,
          format: 'json',
          addressdetails: 1,
        },
        headers: {
          'User-Agent': 'MGNREGA-Dashboard/1.0',
        },
      }
    );

    const address = response.data.address;
    
    return {
      latitude,
      longitude,
      district: address.state_district || address.county,
      state: address.state,
    };
  } catch (error) {
    console.error('Geocoding error:', error);
    throw new Error('Unable to detect location');
  }
};
