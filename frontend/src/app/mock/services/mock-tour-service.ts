import { Injectable } from '@angular/core';
import { TourService } from '../../features/tours/services/tour-service';
import { mockTours } from '../data/tour-mock-data';
import { Tour } from '../../core/models/tour';
import { from, Observable } from 'rxjs';
import { TourSummary } from '../../core/models/tour-summary';

const MOCK_DELAY = 300;
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

@Injectable({
  providedIn: 'root',
})
export class MockTourService extends TourService {
  private _tours: Tour[] = structuredClone(mockTours);
  private nextTourId = Math.max(...this._tours.map((t) => t.id)) + 1;

  getTours(): Observable<TourSummary[]> {
    return from(this.fetchTours());
  }

  getTourById(id: number): Observable<Tour> {
    return from(this.fetchTourById(id));
  }

  updateTour(id: number, tour: Partial<Omit<Tour, 'id'>>): Observable<Tour> {
    return from(this.mockUpdateTour(id, tour));
  }

  createTour(
    tour: Omit<Tour, 'id' | 'distance' | 'estimated_time' | 'route_information'>,
  ): Observable<Tour> {
    return from(this.mockCreateTour(tour));
  }

  deleteTour(id: number): Observable<void> {
    return from(this.mockDeleteTour(id));
  }

  searchTour(query: string): Observable<TourSummary[]> {
    return from(this.mockSearchTour(query));
  }

  private async fetchTours(): Promise<TourSummary[]> {
    await delay(MOCK_DELAY);
    return this._tours.map((t) => ({
      id: t.id,
      name: t.name,
      from: t.from,
      to: t.to,
      transport_type: t.transport_type,
      creator_id: t.creator_id,
    }));
  }

  private async fetchTourById(id: number): Promise<Tour> {
    await delay(MOCK_DELAY);
    const tour = this._tours.find((t) => t.id === id);
    if (!tour) {
      throw new Error(`Tour with id ${id} not found`);
    }

    return structuredClone(tour);
  }

  private async mockCreateTour(
    data: Omit<Tour, 'id' | 'distance' | 'estimated_time' | 'route_information'>,
  ): Promise<Tour> {
    await delay(MOCK_DELAY);
    const newTour: Tour = {
      ...data,
      id: this.nextTourId++,
      distance: 0,
      estimated_time: 0,
      route_information: '',
    };
    this._tours.push(newTour);

    return structuredClone(newTour);
  }

  private async mockUpdateTour(id: number, data: Partial<Omit<Tour, 'id'>>): Promise<Tour> {
    await delay(MOCK_DELAY);
    const index = this._tours.findIndex((t) => t.id === id);
    if (-1 === index) {
      throw new Error(`Tour with id ${id} not found`);
    }
    this._tours[index] = { ...this._tours[index], ...data };

    return structuredClone(this._tours[index]);
  }

  // TODO(felix): don't forget to implement the same for tour logs
  private async mockDeleteTour(id: number): Promise<void> {
    await delay(MOCK_DELAY);
    const index = this._tours.findIndex((t) => t.id === id);
    if (-1 === index) {
      throw new Error(`Tour with id ${id} not found`);
    }
    this._tours.splice(index, 1);
  }

  private async mockSearchTour(query: string): Promise<TourSummary[]> {
    const q = query.toLowerCase();

    const out = this._tours.filter(
      (tour) =>
        tour.name.toLowerCase().includes(q) ||
        tour.from.toLowerCase().includes(q) ||
        tour.to.toLowerCase().includes(q) ||
        tour.transport_type.toLowerCase().includes(q),
    );

    return out.map((t) => ({
      id: t.id,
      name: t.name,
      from: t.from,
      to: t.to,
      transport_type: t.transport_type,
      creator_id: t.creator_id,
    }));
  }

  resetMockData(): void {
    this._tours = structuredClone(mockTours);
    this.nextTourId = Math.max(...this._tours.map((t) => t.id)) + 1;
  }
}
