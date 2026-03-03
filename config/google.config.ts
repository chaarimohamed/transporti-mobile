/**
 * Google Maps API Configuration
 * 
 * To use Google Maps Places API:
 * 1. Go to Google Cloud Console: https://console.cloud.google.com/
 * 2. Create a new project or select an existing one
 * 3. Enable the following APIs:
 *    - Places API
 *    - Geocoding API
 * 4. Create an API key with the following restrictions (recommended):
 *    - Application restrictions: Android apps / iOS apps (for production)
 *    - API restrictions: Places API, Geocoding API
 * 5. Replace 'YOUR_GOOGLE_MAPS_API_KEY' below with your API key
 */

// Replace this with your actual Google Maps API key
export const GOOGLE_MAPS_API_KEY = 'AIzaSyDAQzYlsMsPGQKSBkz7KGgXLXxrdUOSFRI';

// Google Places API configuration
export const GOOGLE_PLACES_CONFIG = {
  // Restrict results to Tunisia
  country: 'tn',
  // Language for results
  language: 'fr',
  // Types of places to search for
  types: ['address', 'establishment', 'geocode'],
};
