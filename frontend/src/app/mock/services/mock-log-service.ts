import { Injectable } from '@angular/core';
import { mockTourLogs, mockTours } from '../data/tour-mock-data';
import { Tour } from '../../core/models/tour';
import { firstValueFrom, from, Observable } from 'rxjs';
import { TourLog } from '../../core/models/tour-log';
import { MockUserService } from './mock-user-service';

const MOCK_DELAY = 300;
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

@Injectable({
  providedIn: 'root',
})
export class MockLogService {
  private _logs: TourLog[] = structuredClone(mockTourLogs);
  private nextLogId = Math.max(...this._logs.map((t) => t.id)) + 1;

  constructor(private userService: MockUserService) {
    console.log('Mock Log API service instantiated');
  }

  getTourLogs(): Observable<TourLog[]> {
    return from(this.fetchTourLogs());
  }

  getLogByTourId(id: number): Observable<TourLog[]> {
    return from(this.fetchLogByTourId(id));
  }

  updateTourLog(
    id: number,
    tour_log: Partial<Omit<TourLog, 'id' | 'timestamp'>>,
  ): Observable<TourLog> {
    return from(this.mockUpdateTourLog(id, tour_log));
  }

  createTourLog(tour_log: Omit<TourLog, 'id' | 'timestamp'>): Observable<TourLog> {
    return from(this.mockCreateTourLog(tour_log));
  }

  deleteTour(id: number): Observable<void> {
    return from(this.mockDeleteTourLog(id));
  }

  searchTourLogs(query: string): Observable<TourLog[]> {
    return from(this.mockSearchTourLog(query));
  }

  getLogById(id: number): Observable<TourLog> {
    return from(this.mockGetTourLogById(id));
  }

  private async fetchTourLogs(): Promise<TourLog[]> {
    await delay(MOCK_DELAY);
    return this._logs;
  }

  private async fetchLogByTourId(tour_id: number): Promise<TourLog[]> {
    await delay(MOCK_DELAY);
    const logs = this._logs.filter((t) => t.tour_id === tour_id);
    if (!logs) {
      throw new Error(`Log(s) for Tour with id ${tour_id} found`);
    }

    return structuredClone(logs);
  }

  private async mockCreateTourLog(data: Omit<TourLog, 'id' | 'timestamp'>): Promise<TourLog> {
    await delay(MOCK_DELAY);
    const newLog: TourLog = {
      ...data,
      id: this.nextLogId++,
      timestamp: new Date().toISOString(),
    };
    this._logs.push(newLog);

    return structuredClone(newLog);
  }

  private async mockUpdateTourLog(
    id: number,
    data: Partial<Omit<TourLog, 'id' | 'timestamp'>>,
  ): Promise<TourLog> {
    await delay(MOCK_DELAY);
    const index = this._logs.findIndex((t) => t.id === id);
    if (-1 === index) {
      throw new Error(`Log with id ${id} not found`);
    }
    this._logs[index] = { ...this._logs[index], ...data };

    return structuredClone(this._logs[index]);
  }

  // TODO(felix): don't forget to implement the same for tour logs
  private async mockDeleteTourLog(id: number): Promise<void> {
    await delay(MOCK_DELAY);
    const index = this._logs.findIndex((t) => t.id === id);
    if (-1 === index) {
      throw new Error(`Log with id ${id} not found`);
    }
    this._logs.splice(index, 1);
  }

  private async mockSearchTourLog(query: string): Promise<TourLog[]> {
    const q = query.toLowerCase();

    const out = this._logs.filter(
      (tour) =>
        tour.comment.toLowerCase().includes(q) ||
        tour.timestamp.toLowerCase().includes(q) ||
        tour.difficulty.toString().includes(q) ||
        tour.total_distance.toString().includes(q) ||
        tour.total_time.toString().includes(q) ||
        tour.rating.toString().includes(q),
    );

    return out;
  }

  private async mockGetTourLogById(id: number): Promise<TourLog> {
    await delay(MOCK_DELAY);
    const uid = await this.currentUserId();
    const tour = this._logs.find((t) => t.id === id && t.creator_id === uid);
    if (!tour) throw new Error(`Tour with id ${id} not found`);
    return structuredClone(tour);
  }

  private async currentUserId(): Promise<number> {
    const user = await firstValueFrom(this.userService.getCurrentUser());
    if (!user) throw new Error('Not authenticated');
    return user.id;
  }

  resetMockData(): void {
    this._logs = structuredClone(mockTourLogs);
    this.nextLogId = Math.max(...this._logs.map((t) => t.id)) + 1;
  }
}
