// src/app/services/map.service.ts
import { Injectable } from '@angular/core';
import { RouteResults } from '../../../core/models/route-results';
import { LatLng } from '../../../core/models/lat-lng';

@Injectable({ providedIn: 'root' })
export class MapService {
  routeFromGeoJson(routeGeoJson: string, distance: number, duration: number): RouteResults | null {
    try {
      const geom = JSON.parse(routeGeoJson);

      const coordinates: LatLng[] = geom.coordinates.map(([lng, lat]: [number, number]) => ({
        lat,
        lng,
      }));

      const from = coordinates[0];
      const to = coordinates[coordinates.length - 1];

      return {
        from,
        to,
        coordinates,
        distance,
        duration,
      };
    } catch {
      return null;
    }
  }
}
