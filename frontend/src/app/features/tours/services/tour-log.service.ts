import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { TourLogResponse } from '../models/log/tour-log-response';
import { CreateTourLogPayload } from '../models/log/create-tour-log-payload';
import { UpdateTourLogPayload } from '../models/log/update-tour-log-payload';

@Injectable({ providedIn: 'root' })
export class TourLogService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/logs`;

  getTourLogs(): Observable<TourLogResponse[]> {
    return this.http.get<TourLogResponse[]>(this.base);
  }

  getLogByTourId(tourId: number): Observable<TourLogResponse[]> {
    const params = new HttpParams().set('tourId', tourId);
    return this.http.get<TourLogResponse[]>(this.base, { params });
  }

  getLogById(id: number): Observable<TourLogResponse> {
    return this.http.get<TourLogResponse>(`${this.base}/${id}`);
  }

  createTourLog(payload: CreateTourLogPayload): Observable<TourLogResponse> {
    return this.http.post<TourLogResponse>(this.base, payload);
  }

  updateTourLog(id: number, payload: UpdateTourLogPayload): Observable<TourLogResponse> {
    return this.http.patch<TourLogResponse>(`${this.base}/${id}`, payload);
  }

  deleteTourLog(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }

  searchTourLogs(query: string): Observable<TourLogResponse[]> {
    const params = new HttpParams().set('q', query);
    return this.http.get<TourLogResponse[]>(`${this.base}/search`, { params });
  }
}
