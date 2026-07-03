import { Injectable } from '@angular/core';
import { mockTours } from '../data/tour-mock-data';
import { Tour } from '../../features/tours/models/tour/tour';
import { from, firstValueFrom, Observable } from 'rxjs';
import { TourSummary } from '../../features/tours/models/tour/tour-summary';
import { MockUserService } from './mock-user-service';

const MOCK_DELAY = 300;
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const toSummary = (t: Tour): TourSummary => ({
  id: t.id,
  name: t.name,
  from: t.fromGeocode.label,
  to: t.toGeocode.label,
  transportType: t.transport_type,
  distanceKm: t.distance,
  estimatedTimeS: t.estimated_time,
  popularity: t.popularity,
  childFriendliness: t.child_friendliness,
  creatorId: t.creator_id,
});

@Injectable({
  providedIn: 'root',
})
export class MockTourService {
  private _tours: Tour[] = structuredClone(mockTours);
  private nextTourId = Math.max(...this._tours.map((t) => t.id)) + 1;

  constructor(private userService: MockUserService) {
    console.log('Mock Tour API service instantiated');
  }

  getTours(): Observable<TourSummary[]> {
    return from(this.fetchTours());
  }

  getTourById(id: number): Observable<Tour> {
    return from(this.fetchTourById(id));
  }

  updateTour(id: number, tour: Partial<Omit<Tour, 'id' | 'creator_id'>>): Observable<Tour> {
    return from(this.mockUpdateTour(id, tour));
  }

  createTour(
    tour: Omit<Tour, 'id' | 'creator_id' | 'distance' | 'estimated_time' | 'route_information'>,
  ): Observable<Tour> {
    return from(this.mockCreateTour(tour));
  }

  deleteTour(id: number): Observable<void> {
    return from(this.mockDeleteTour(id));
  }

  searchTour(query: string): Observable<TourSummary[]> {
    return from(this.mockSearchTour(query));
  }

  resetMockData(): void {
    this._tours = structuredClone(mockTours);
    this.nextTourId = Math.max(...this._tours.map((t) => t.id)) + 1;
  }

  private async currentUserId(): Promise<number> {
    const user = await firstValueFrom(this.userService.getCurrentUser());
    if (!user) throw new Error('Not authenticated');
    return user.id;
  }

  private async fetchTours(): Promise<TourSummary[]> {
    await delay(MOCK_DELAY);
    const uid = await this.currentUserId();
    return this._tours.filter((t) => t.creator_id === uid).map(toSummary);
  }

  private async fetchTourById(id: number): Promise<Tour> {
    await delay(MOCK_DELAY);
    const uid = await this.currentUserId();
    const tour = this._tours.find((t) => t.id === id && t.creator_id === uid);
    if (!tour) throw new Error(`Tour with id ${id} not found`);
    return structuredClone(tour);
  }

  private async mockCreateTour(
    data: Omit<Tour, 'id' | 'creator_id' | 'distance' | 'estimated_time' | 'route_information'>,
  ): Promise<Tour> {
    await delay(MOCK_DELAY);
    const uid = await this.currentUserId();
    const newTour: Tour = {
      ...data,
      id: this.nextTourId++,
      creator_id: uid,
      distance: 0,
      estimated_time: 0,
      route_information: '',
    };
    this._tours.push(newTour);
    return structuredClone(newTour);
  }

  private async mockUpdateTour(
    id: number,
    data: Partial<Omit<Tour, 'id' | 'creator_id'>>,
  ): Promise<Tour> {
    await delay(MOCK_DELAY);
    const uid = await this.currentUserId();
    const index = this._tours.findIndex((t) => t.id === id && t.creator_id === uid);
    if (index === -1) throw new Error(`Tour with id ${id} not found`);
    this._tours[index] = { ...this._tours[index], ...data };
    return structuredClone(this._tours[index]);
  }

  private async mockDeleteTour(id: number): Promise<void> {
    await delay(MOCK_DELAY);
    const uid = await this.currentUserId();
    const index = this._tours.findIndex((t) => t.id === id && t.creator_id === uid);
    if (index === -1) throw new Error(`Tour with id ${id} not found`);
    this._tours.splice(index, 1);
  }

  private async mockSearchTour(query: string): Promise<TourSummary[]> {
    await delay(MOCK_DELAY);
    const uid = await this.currentUserId();
    const q = query.toLowerCase();
    return this._tours
      .filter((t) => t.creator_id === uid)
      .filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.fromGeocode.label.toLowerCase().includes(q) ||
          t.toGeocode.label.toLowerCase().includes(q) ||
          t.transport_type.toLowerCase().includes(q),
      )
      .map(toSummary);
  }
}
