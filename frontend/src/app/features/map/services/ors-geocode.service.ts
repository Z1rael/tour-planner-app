import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable, of, catchError } from 'rxjs';

export interface GeocodeDTO {
  label: string;
  lat: number;
  lng: number;
}

@Injectable({ providedIn: 'root' })
export class OrsGeocodeService {
  private readonly http = inject(HttpClient);

  geocode(address: string): Observable<{ lat: number; lng: number; label: string } | null> {
    const params = new HttpParams().set('query', address);

    return this.http.get<GeocodeDTO[]>('/api/geocode', { params }).pipe(
      map((results) => {
        if (!results?.length) return null;
        const first = results[0];
        return { lat: first.lat, lng: first.lng, label: first.label };
      }),
      catchError((err) => {
        console.error('Geocode error:', err);
        return of(null);
      }),
    );
  }
  geocodeAll(address: string): Observable<GeocodeDTO[]> {
    const params = new HttpParams().set('query', address);
    return this.http.get<GeocodeDTO[]>('/api/geocode', { params }).pipe(catchError(() => of([])));
  }
}
