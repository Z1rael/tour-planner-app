import { LatLng } from './lat-lng';

export interface RouteResults {
  from: LatLng;
  to: LatLng;
  coordinates: readonly LatLng[]; // [lng, lat] pairs
  distance: number; // km
  duration: number; // minutes
}
