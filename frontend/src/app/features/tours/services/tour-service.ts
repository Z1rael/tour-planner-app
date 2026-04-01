import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Tour } from '../../../mock/data/tour-mock-data';
//import { Tour } from '../../../core/models/tour';

@Injectable()
export abstract class TourService {
  abstract getTours(): Observable<Tour[]>;
  abstract getTourById(id: string): Observable<Tour>;
  abstract createTour(tour: Tour): Observable<Tour>;
  abstract updateTour(tour: Tour): Observable<Tour>;
  abstract deleteTour(id: string): Observable<void>;
}
