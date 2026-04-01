import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { Tour } from '../../../core/models/tour';
import { TourService } from './tour-service';

@Injectable({
  providedIn: 'root',
})
export class TourServiceImpl {
  private http = inject(HttpClient);

  private readonly baseUrl = '/api/tours';

  getTours(): Observable<Tour[]> {
    return this.http.get<Tour[]>(this.baseUrl).pipe(
      catchError((err) => {
        console.error('Failed to load tours', err);
        return throwError(() => err);
      }),
    );
  }

  getTourById(id: number): Observable<Tour> {
    return this.http.get<Tour>(`${this.baseUrl}/${id}`).pipe(
      catchError((err) => {
        console.error(`Failed to fetch tour with id: ${id}`, err);
        return throwError(() => err);
      }),
    );
  }

  createTour(tour: Partial<Tour>): Observable<Tour> {
    return this.http.post<Tour>(this.baseUrl, tour).pipe(
      catchError((err) => {
        console.error('Failed to create tour', err);
        return throwError(() => err);
      }),
    );
  }

  updateTour(id: number, tour: Partial<Tour>): Observable<Tour> {
    return this.http.put<Tour>(`${this.baseUrl}/${id}`, tour).pipe(
      catchError((err) => {
        console.error(`Failed to update tour with id: ${id}`, err);
        return throwError(() => err);
      }),
    );
  }

  deleteTour(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`).pipe(
      catchError((err) => {
        console.error(`Failed to delete tour with id: ${id}`, err);
        return throwError(() => err);
        1;
      }),
    );
  }
}
