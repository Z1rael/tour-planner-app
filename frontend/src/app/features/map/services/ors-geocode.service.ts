import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable, of, catchError } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface GeocodeDTO {
  label: string;
  lat: number;
  lng: number;
}

@Injectable({ providedIn: 'root' })
export class OrsGeocodeService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/geocode`

  geocode(address: string): Observable<GeocodeDTO | null> {
    const params = new HttpParams().set('query', address);

    return this.http.get<GeocodeDTO[]>(this.baseUrl, { params }).pipe(
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
    return this.http.get<GeocodeDTO[]>(this.baseUrl, { params }).pipe(catchError(() => of([])));
  }
}
