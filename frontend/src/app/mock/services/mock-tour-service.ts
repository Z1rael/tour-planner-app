import { Injectable, signal } from '@angular/core';
import { TourService } from '../../features/tours/services/tour-service';
import { MOCK_TOURS, Tour } from '../data/tour-mock-data';
import { delay, filter, map, Observable, of, take, tap } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class MockTourService extends TourService {
  private _tours = signal<Tour[]>([...MOCK_TOURS]);
  readonly tours$ = toObservable(this._tours);

  getTours(): Observable<Tour[]> {
    return this.tours$.pipe(take(1), delay(300));
  }

  getTourById(id: string): Observable<Tour> {
    return of(this._tours().find((t) => t.id === id)).pipe(
      delay(300),
      map((tour) => {
        if (!tour) {
          throw new Error(`Tour ${id} not found`);
        }
        return tour;
      }),
    );
  }

  createTour(tour: Tour): Observable<Tour> {
    return of(tour).pipe(
      delay(300),
      tap(() => this._tours.update((ts) => [tour, ...ts])),
    );
  }

  updateTour(tour: Tour): Observable<Tour> {
    return of(tour).pipe(
      delay(300),
      tap(() => this._tours.update((ts) => ts.map((t) => (t.id === tour.id ? tour : t)))),
    );
  }

  deleteTour(id: string): Observable<void> {
    return of(void 0).pipe(
      delay(300),
      tap(() => this._tours.update((ts) => ts.filter((t) => t.id !== id))),
    );
  }
}
