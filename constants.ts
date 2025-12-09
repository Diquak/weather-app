import { City } from './types';

export const CITIES: City[] = [
  { name: 'Taipei', lat: 25.0330, lng: 121.5654, country: 'TW' },
  { name: 'Tokyo', lat: 35.6762, lng: 139.6503, country: 'JP' },
  { name: 'New York', lat: 40.7128, lng: -74.0060, country: 'US' },
  { name: 'London', lat: 51.5074, lng: -0.1278, country: 'UK' },
  { name: 'Paris', lat: 48.8566, lng: 2.3522, country: 'FR' },
  { name: 'Sydney', lat: -33.8688, lng: 151.2093, country: 'AU' },
  { name: 'Reykjavik', lat: 64.1466, lng: -21.9426, country: 'IS' },
  { name: 'Singapore', lat: 1.3521, lng: 103.8198, country: 'SG' },
];

export const DEFAULT_CITY = CITIES[0];
