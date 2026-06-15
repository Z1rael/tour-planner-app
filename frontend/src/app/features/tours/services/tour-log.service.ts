import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface TourLogApiResponse {
  logId: number;
  tourId: number;
  logDate: string; // ISO-8601
  comment: string;
  difficulty: number; // 1-5
  rating: number; // 1-5
  totalTimeS: number;
  totalDistanceKm: number;
}

export interface CreateLogPayload {
  logDate: string;
  comment: string;
  difficulty: number;
  rating: number;
  totalTimeS: number;
  totalDistanceKm: number;
}

export type UpdateLogPayload = Partial<CreateLogPayload>;

@Injectable({ providedIn: 'root' })
export class TourLogService {
  constructor(private http: HttpClient) {}

  private base(tourId: number) {
    return `/api/tours/${tourId}/logs`;
  }

  getLogs(tourId: number): Observable<TourLogApiResponse[]> {
    return this.http.get<TourLogApiResponse[]>(this.base(tourId));
  }

  getLog(tourId: number, logId: number): Observable<TourLogApiResponse> {
    return this.http.get<TourLogApiResponse>(`${this.base(tourId)}/${logId}`);
  }

  createLog(tourId: number, payload: CreateLogPayload): Observable<TourLogApiResponse> {
    return this.http.post<TourLogApiResponse>(this.base(tourId), payload);
  }

  updateLog(
    tourId: number,
    logId: number,
    payload: UpdateLogPayload,
  ): Observable<TourLogApiResponse> {
    return this.http.put<TourLogApiResponse>(`${this.base(tourId)}/${logId}`, payload);
  }

  deleteLog(tourId: number, logId: number): Observable<void> {
    return this.http.delete<void>(`${this.base(tourId)}/${logId}`);
  }

  searchLogs(tourId: number, query: string): Observable<TourLogApiResponse[]> {
    return this.http.get<TourLogApiResponse[]>(`${this.base(tourId)}/search`, {
      params: { q: query },
    });
  }
}
