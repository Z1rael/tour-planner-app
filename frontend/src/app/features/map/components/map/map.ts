import { Component, OnDestroy, effect, inject, signal, AfterViewInit } from '@angular/core';
import { MapService } from '../../services/map.service';
import { TourFacade } from '../../../tours/facade/tour.facade';
import { MapFacade } from '../../facade/map-facade';
import { OrsGeocodeService } from '../../services/ors-geocode.service';
import { firstValueFrom } from 'rxjs';
import { LatLng } from '../../../../core/models/lat-lng';
@Component({
  selector: 'app-map',
  standalone: true,
  templateUrl: './map.html',
  styleUrl: './map.css',
})
export class Map implements AfterViewInit, OnDestroy {
  private readonly tourFacade = inject(TourFacade);
  private readonly mapFacade = inject(MapFacade);
  private readonly mapService = inject(MapService);
  private readonly geocodeService = inject(OrsGeocodeService);

  readonly selectedTour = this.tourFacade.selectedTour;
  private readonly mapReady = signal(false);

  async ngAfterViewInit(): Promise<void> {
    await this.mapFacade.initMap('leaflet-map');
    this.mapReady.set(true);
  }

  constructor() {
    effect(() => {
      if (!this.mapReady()) return;

      const c = { lat: 48.2082, lng: 16.3738 };
      const z = 13;
      this.mapFacade.setCenter(c.lat, c.lng, z); // default to Vienna, Austria
    });

    effect(() => {
      if (!this.mapReady()) {
        return;
      }

      const tour = this.selectedTour();
      if (!tour) {
        this.mapFacade.clearRoute();
        return;
      }

      if (tour.route_information) {
        this.drawRouteFromGeoJson(tour.route_information);
      }
    });
  }

  ngOnDestroy(): void {
    this.mapFacade.destroyMap();
  }

  drawRouteFromGeoJson(geoJson: string): void {
    try {
      const parsed = JSON.parse(geoJson);
      const coordinates: LatLng[] = parsed.coordinates.map(([lng, lat]: [number, number]) => ({
        lat,
        lng,
      }));
      this.mapFacade.clearRoute();
      this.mapFacade.setRoute(coordinates);
      if (coordinates.length > 0) {
        const first = coordinates[0];
        const last = coordinates[coordinates.length - 1];
        this.mapFacade.setMarker('from', first.lat, first.lng);
        this.mapFacade.setMarker('to', last.lat, last.lng);
      }
    } catch (err) {
      console.error('Failed to parse route GeoJSON', err);
    }
  }

  async drawRoute(from: string, to: string, profile: string): Promise<void> {
    const [fromCoords, toCoords] = await Promise.all([
      firstValueFrom(this.geocodeService.geocode(from)),
      firstValueFrom(this.geocodeService.geocode(to)),
    ]);
    console.log('Geocode results:', fromCoords, toCoords);

    if (!fromCoords || !toCoords) {
      console.warn('Could not geocode tour addresses for map display');
      return;
    }

    const result = await this.mapService.getRoute(fromCoords, toCoords, profile);
    if (!result) return;

    this.mapFacade.clearRoute();
    this.mapFacade.setRoute(result.coordinates);
    this.mapFacade.setMarker('from', result.from.lat, result.from.lng);
    this.mapFacade.setMarker('to', result.to.lat, result.to.lng);
  }
}
