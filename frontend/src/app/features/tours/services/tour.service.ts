import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Tour } from '../../../core/models/tour';
import { TourSummary } from '../../../core/models/tour-summary';

export interface TourSummaryResponse {
  tour_id: number;
  name: string;
  from_address: string;
  to_address: string;
  transport_type_name: string;
  distance_km: number;
  estimated_time_s: number;
  popularity: number;
  child_friendliness: number;
}

export interface TourResponse {
  tour_id: number;
  name: string;
  description: string;
  from_address: string;
  to_address: string;
  transport_type_name: string;
  distance_km: number;
  estimated_time_s: number;
  route_geo_json: string;
  image_path: string | null;
  popularity: number;
  child_friendliness: number;
}

export interface CreateTourPayload {
  name: string;
  description?: string;
  from_address: string;
  to_address: string;
  from_lat: number;
  from_lng: number;
  to_lat: number;
  to_lng: number;
  profile: string;
}

export interface UpdateTourPayload {
  name?: string;
  description?: string;

  fromAddress?: string;
  toAddress?: string;

  fromLat?: number;
  fromLng?: number;
  toLat?: number;
  toLng?: number;

  profile?: string;
}

@Injectable({ providedIn: 'root' })
export class TourService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/tours`;

  getTours(): Observable<TourSummaryResponse[]> {
    return this.http.get<TourSummaryResponse[]>(this.base);
  }

  getTourById(id: number): Observable<TourResponse> {
    return this.http.get<TourResponse>(`${this.base}/${id}`);
  }

  createTour(payload: CreateTourPayload): Observable<TourResponse> {
    return this.http.post<TourResponse>(this.base, payload);
  }

  updateTour(id: number, payload: UpdateTourPayload): Observable<TourResponse> {
    console.log('HTTP payload', payload);
    return this.http.patch<TourResponse>(`${this.base}/${id}`, payload);
  }

  deleteTour(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }

  searchTour(query: string): Observable<TourSummaryResponse[]> {
    const params = new HttpParams().set('q', query);
    return this.http.get<TourSummaryResponse[]>(`${this.base}/search`, { params });
  }

  exportTours(): Observable<Blob> {
    return this.http.get(`${this.base}/export`, { responseType: 'blob' });
  }

  importTours(file: File): Observable<TourSummaryResponse[]> {
    return new Observable((observer) => {
      const reader = new FileReader();
      reader.onload = () => {
        const entries = JSON.parse(reader.result as string);
        this.http.post<TourSummaryResponse[]>(`${this.base}/import`, entries).subscribe(observer);
      };
      reader.readAsText(file);
    });
  }
}
