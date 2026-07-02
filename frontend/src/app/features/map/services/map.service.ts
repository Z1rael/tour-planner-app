import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { LatLng } from './models/lat-lng';
import { OrsDirectionsResponse } from './models/ors-directions-response';
import { RouteResults } from './models/route-results';

// TODO(felix): need to get this into proper configuration
const ORS_API_KEY =
  'eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjMwNGMyZWRiZmI0ZTRkZmI4NzcyNzM4YTQ3YTkwZTU2IiwiaCI6Im11cm11cjY0In0=';

@Injectable({ providedIn: 'root' })
export class MapService {
  private readonly http = inject(HttpClient);

  async getRoute(
    from: LatLng | string,
    to: LatLng | string,
    profile = 'foot-walking',
  ): Promise<RouteResults | null> {
    if (typeof from === 'string' || typeof to === 'string') {
      console.warn('MapService.getRoute() requires LatLng objects, not address strings');
      return null;
    }

    const body = {
      coordinates: [
        [from.lng, from.lat],
        [to.lng, to.lat],
      ],
    };

    try {
      const res = await firstValueFrom(
        this.http.post<OrsDirectionsResponse>(`/ors/v2/directions/${profile}/geojson`, body, {
          headers: { Authorization: ORS_API_KEY, 'Content-Type': 'application/json' },
        }),
      );

      const feature = res.features[0];
      if (!feature) return null;

      const coordinates: LatLng[] = feature.geometry.coordinates.map(([lng, lat]) => ({
        lat,
        lng,
      }));

      return {
        from,
        to,
        coordinates,
        distance: feature.properties.summary.distance / 1000, // metres -> km
        duration: feature.properties.summary.duration / 60, // seconds -> minutes
      };
    } catch (err) {
      console.error('ORS directions error', err);
      return null;
    }
  }
}
