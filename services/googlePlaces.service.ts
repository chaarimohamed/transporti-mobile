import { GOOGLE_MAPS_API_KEY, GOOGLE_PLACES_CONFIG } from '../config/google.config';

const PLACES_AUTOCOMPLETE_URL = 'https://maps.googleapis.com/maps/api/place/autocomplete/json';
const PLACES_DETAILS_URL = 'https://maps.googleapis.com/maps/api/place/details/json';
const PLACEHOLDER_GOOGLE_MAPS_API_KEY = 'YOUR_GOOGLE_MAPS_API_KEY';

export interface GoogleSuggestion {
  place_id: string;
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text?: string;
  };
  types: string[];
}

export interface AddressDetails {
  address: string;
  fullAddress: string;
  city?: string;
  postalCode?: string;
  latitude: number;
  longitude: number;
  placeId: string;
}

interface PlaceAutocompleteResponse {
  status: string;
  predictions: GoogleSuggestion[];
  error_message?: string;
}

interface PlaceDetailsResponse {
  status: string;
  result: {
    place_id: string;
    formatted_address: string;
    name: string;
    geometry: {
      location: {
        lat: number;
        lng: number;
      };
    };
    address_components: Array<{
      long_name: string;
      short_name: string;
      types: string[];
    }>;
  };
  error_message?: string;
}

class GooglePlacesService {
  private sessionToken: string = '';

  // Generate a new session token (recommended for billing optimization)
  startSession(): string {
    // Generate a UUID-like session token
    this.sessionToken = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
    return this.sessionToken;
  }

  // Get session token
  getSessionToken(): string {
    if (!this.sessionToken) {
      this.startSession();
    }
    return this.sessionToken;
  }

  // Get autocomplete suggestions as user types
  async getSuggestions(query: string): Promise<GoogleSuggestion[]> {
    if (!query || query.length < 2) {
      return [];
    }

    if (GOOGLE_MAPS_API_KEY.trim() === PLACEHOLDER_GOOGLE_MAPS_API_KEY) {
      console.warn('Google Maps API key not configured. Please update config/google.config.ts');
      return [];
    }

    try {
      const sessionToken = this.getSessionToken();
      const params = new URLSearchParams({
        input: query,
        key: GOOGLE_MAPS_API_KEY,
        sessiontoken: sessionToken,
        language: GOOGLE_PLACES_CONFIG.language,
        components: `country:${GOOGLE_PLACES_CONFIG.country}`,
      });

      const response = await fetch(`${PLACES_AUTOCOMPLETE_URL}?${params.toString()}`);

      if (!response.ok) {
        throw new Error(`Google Places API error: ${response.status}`);
      }

      const data: PlaceAutocompleteResponse = await response.json();

      if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
        console.error('Google Places API error:', data.status, data.error_message);
        return [];
      }

      return data.predictions || [];
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      return [];
    }
  }

  // Get full place details including coordinates when user selects
  async retrieveAddress(placeId: string): Promise<AddressDetails | null> {
    if (GOOGLE_MAPS_API_KEY.trim() === PLACEHOLDER_GOOGLE_MAPS_API_KEY) {
      console.warn('Google Maps API key not configured. Please update config/google.config.ts');
      return null;
    }

    try {
      const sessionToken = this.getSessionToken();
      const params = new URLSearchParams({
        place_id: placeId,
        key: GOOGLE_MAPS_API_KEY,
        sessiontoken: sessionToken,
        language: GOOGLE_PLACES_CONFIG.language,
        fields: 'place_id,formatted_address,name,geometry,address_components',
      });

      const response = await fetch(`${PLACES_DETAILS_URL}?${params.toString()}`);

      if (!response.ok) {
        throw new Error(`Google Places API error: ${response.status}`);
      }

      const data: PlaceDetailsResponse = await response.json();

      if (data.status !== 'OK') {
        console.error('Google Places API error:', data.status, data.error_message);
        return null;
      }

      const result = data.result;

      // Extract city and postal code from address components
      let city: string | undefined;
      let postalCode: string | undefined;

      for (const component of result.address_components) {
        if (component.types.includes('locality')) {
          city = component.long_name;
        } else if (component.types.includes('administrative_area_level_1') && !city) {
          city = component.long_name;
        }
        if (component.types.includes('postal_code')) {
          postalCode = component.long_name;
        }
      }

      // End the session after successful retrieval
      this.sessionToken = '';

      return {
        address: result.name || result.formatted_address,
        fullAddress: result.formatted_address,
        city,
        postalCode,
        latitude: result.geometry.location.lat,
        longitude: result.geometry.location.lng,
        placeId: result.place_id,
      };
    } catch (error) {
      console.error('Error retrieving address:', error);
      return null;
    }
  }
}

export const googlePlacesService = new GooglePlacesService();

// Re-export for backward compatibility during transition
export const placesService = googlePlacesService;
