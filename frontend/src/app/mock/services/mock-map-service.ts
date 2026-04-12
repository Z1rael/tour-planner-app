// map.service.ts
import { Injectable } from '@angular/core';

export interface RouteResult {
  coordinates: [number, number][];  // [lng, lat] pairs
  distance: number;   // km
  duration: number;   // minutes
}

@Injectable({ providedIn: 'root' })
export class MapService {

  async getRoute(from: string, to: string): Promise<RouteResult | null> {
    // Mock: just return two random points near Vienna
    await new Promise(r => setTimeout(r, 400)); // fake latency

    const mockCoords: [number, number][] = [
      [16.3738, 48.2082],
      [16.39,   48.22],
      [16.41,   48.215],
      [16.43,   48.208],
      [16.45,   48.20],
    ];

    return {
      coordinates: mockCoords,
      distance: 8.4,
      duration: 112,
    };
  }
}
