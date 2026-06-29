import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface TourLogResponse {
  tour_log_id: number;
  tour_id: number;
  comment: string;
  difficulty: number;
  rating: number;
  total_time: number;
  total_distance: number;
  log_date: string;
}

export interface CreateTourLogPayload {
  tour_id: number;
  comment: string;
  difficulty: number;
  rating: number;
  total_time: number;
  total_distance: number;
}

export interface UpdateTourLogPayload {
  comment?: string;
  difficulty?: number;
  rating?: number;
  total_time?: number;
  total_distance?: number;
}

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
