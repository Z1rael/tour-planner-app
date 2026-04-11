import {
  Component, OnInit, OnDestroy,
  input, effect, PLATFORM_ID, Inject
} from '@angular/core';
import { MapService } from '../../../../mock/services/mock-map-service';
import {isPlatformBrowser} from '@angular/common';

@Component({
  selector: 'app-map',
  standalone: true,
  templateUrl: './map.html',
  styleUrl: './map.css',
})
export class Map implements OnInit, OnDestroy {
  from = input<string>('');
  to   = input<string>('');

  private map: any;
  private routeLayer: any;
  private markers: any[] = [];
  private L: any;

  constructor(private mapService: MapService, @Inject(PLATFORM_ID) private platformId: Object) {
    effect(() => {
      const f = this.from();
      const t = this.to();
      if (f && t && this.L) this.drawRoute(f, t);
    });

  }

  async ngOnInit(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) return;
    this.L = await import('leaflet');
    this.initMap();
  }

  ngOnDestroy(): void {
    this.map?.remove();
  }

  private initMap(): void {
    this.map = this.L.map('leaflet-map', {
      center: [48.2082, 16.3738],
      zoom: 12,
    });

    this.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(this.map);
  }

  async drawRoute(from: string, to: string): Promise<void> {
    const result = await this.mapService.getRoute(from, to);
    if (!result) return;

    this.routeLayer?.remove();
    this.markers.forEach(m => m.remove());
    this.markers = [];

    const latLngs = result.coordinates.map(
      ([lng, lat]: [number, number]) => this.L.latLng(lat, lng)
    );

    this.routeLayer = this.L.polyline(latLngs, {
      color: '#7fd8c8',
      weight: 4,
      opacity: 0.9,
    }).addTo(this.map);

    this.markers.push(
      this.L.marker(latLngs[0]).addTo(this.map).bindPopup(`Start: ${from}`),
      this.L.marker(latLngs[latLngs.length - 1]).addTo(this.map).bindPopup(`End: ${to}`)
    );

    if (this.routeLayer) {
      this.map.fitBounds(this.routeLayer.getBounds(), { padding: [32, 32] });
    }
  }
}
