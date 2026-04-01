import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TourSummary } from '../../../core/models/tour-summary';
import { Tour } from '../../../core/models/tour';

@Injectable()
export abstract class TourService {
  abstract getTours(): Observable<TourSummary[]>;
  abstract getTourById(id: number): Observable<Tour>;
  abstract createTour(
    tour: Omit<Tour, 'id' | 'distance' | 'estimated_time' | 'route_information'>,
  ): Observable<Tour>;
  abstract updateTour(id: number, tour: Partial<Omit<Tour, 'id'>>): Observable<Tour>;
  abstract deleteTour(id: number): Observable<void>;
}
