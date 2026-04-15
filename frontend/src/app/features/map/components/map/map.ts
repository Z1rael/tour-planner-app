import { Component, OnDestroy, effect, inject, signal, AfterViewInit } from '@angular/core';
import { MapService } from '../../../../mock/services/mock-map-service';
import { TourFacade } from '../../../tours/facade/tour.facade';
import { MapFacade } from '../../facade/map-facade';

@Component({
  selector: 'app-map',
  standalone: true,
  templateUrl: './map.html',
  styleUrl: './map.css',
})
export class Map implements AfterViewInit, OnDestroy {
  private readonly tourFacade = inject(TourFacade);
  private readonly mapFacade = inject(MapFacade);
  readonly mapService = inject(MapService);

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
      this.mapFacade.setCenter(c.lat, c.lng, z);
    });

    effect(() => {
      if (!this.mapReady()) {
        return;
      }

      const from = this.selectedTour()?.from;
      const to = this.selectedTour()?.to;
      if (!from || !to) {
        this.mapFacade.clearRoute();
        return;
      }

      this.drawRoute(from, to);
    });
  }

  ngOnDestroy(): void {
    this.mapFacade.destroyMap();
  }

  async drawRoute(from: string, to: string): Promise<void> {
    const result = await this.mapService.getRoute(from, to);
    if (!result) return;

    this.mapFacade.clearRoute();

    this.mapFacade.setRoute(result.coordinates);
    this.mapFacade.setMarker('from', result.from.lat, result.from.lng);
    this.mapFacade.setMarker('to', result.to.lat, result.to.lng);
  }
}
