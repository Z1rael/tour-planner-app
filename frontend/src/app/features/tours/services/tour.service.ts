import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { TourSummaryResponse } from '../models/tour/tour-summary-response';
import { TourResponse } from '../models/tour/tour-response';
import { CreateTourPayload } from '../models/tour/create-tour-payload';
import { UpdateTourPayload } from '../models/tour/update-tour-payload';


@Injectable({ providedIn: 'root' })
export class TourService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/tours`;

  getTours(userFiltered: boolean): Observable<TourSummaryResponse[]> {
    return this.http.get<TourSummaryResponse[]>(this.base + '?userFiltered=' + userFiltered);
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
