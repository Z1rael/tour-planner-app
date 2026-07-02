import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { LatLng } from '../services/models/lat-lng';

type LeafletModule = typeof import('leaflet');

@Injectable({
  providedIn: 'root',
})
export class MapFacade {
  private readonly platformId = inject(PLATFORM_ID);

  private L: LeafletModule | null = null;
  private map: import('leaflet').Map | null = null;

  private markerFrom: import('leaflet').CircleMarker | null = null;
  private markerTo: import('leaflet').CircleMarker | null = null;
  private routeLine: import('leaflet').Polyline | null = null;

  async initMap(containerId: string): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) return;

    const leaflet = await import('leaflet');
    this.L = (leaflet.default ?? leaflet) as LeafletModule;
    const L = this.L;

    this.map = L.map(containerId, {
      zoomControl: true,
      attributionControl: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(this.map);
  }

  setCenter(lat: number, lng: number, zoom = 13): void {
    this.map?.setView([lat, lng], zoom);
  }

  setMarker(kind: 'from' | 'to', lat: number, lng: number): void {
    if (!this.map || !this.L) {
      return;
    }
    const L = this.L;

    const marker = L.circleMarker([lat, lng], {
      radius: 8,
      weight: 2,
      opacity: 1,
      fillOpacity: 0.8,
    });

    if (kind === 'from') {
      this.markerFrom?.remove();
      this.markerFrom = marker.addTo(this.map);
      this.markerFrom.bindTooltip('From', { permanent: false });
    } else {
      this.markerTo?.remove();
      this.markerTo = marker.addTo(this.map);
      this.markerTo.bindTooltip('To', { permanent: false });
    }
  }

  setRoute(points: readonly LatLng[]): void {
    if (!this.map || !this.L || !points?.length) {
      return;
    }
    const L = this.L;

    this.routeLine?.remove();

    const latlngs: import('leaflet').LatLngExpression[] = points.map((p) => [p.lat, p.lng]);
    this.routeLine = L.polyline(latlngs, {
      color: '#7fd8c8',
      weight: 4,
      opacity: 0.9,
    }).addTo(this.map);

    const bounds = this.routeLine.getBounds();
    this.map.fitBounds(bounds, { padding: [32, 32] });
  }

  clearRoute(): void {
    this.markerFrom?.remove();
    this.markerFrom = null;

    this.markerTo?.remove();
    this.markerTo = null;

    this.routeLine?.remove();
    this.routeLine = null;
  }

  destroyMap(): void {
    if (this.map) {
      this.map.remove();
    }
  }
}
