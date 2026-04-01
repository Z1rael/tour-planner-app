import { computed, inject, Injectable, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import {
  BehaviorSubject,
  catchError,
  debounceTime,
  distinctUntilChanged,
  EMPTY,
  finalize,
  map,
  Observable,
  of,
  startWith,
  switchMap,
} from 'rxjs';
import { MockTourService } from '../../../mock/services/mock-tour-service';
import { TourSummary } from '../../../core/models/tour-summary';
import { Tour } from '../../../core/models/tour';

@Injectable({
  providedIn: 'root',
})
export class TourFacade {
  private readonly tourApi = inject(MockTourService);
  private readonly refresh$ = new BehaviorSubject<void>(undefined);

  // State
  readonly error = signal<string | null>(null);
  readonly loading = signal(false);
  readonly selectedTourId = signal<number | null>(null);
  readonly query = signal('');

  refresh(): void {
    this.refresh$.next();
  }

  // Load Tour Summaries list
  readonly tourSummaries$: Observable<TourSummary[]> = this.refresh$.pipe(
    switchMap(() =>
      this.tourApi.getTours().pipe(
        catchError((err) => {
          this.error.set(err.message);
          return EMPTY;
        }),
        finalize(() => this.loading.set(false)),
      ),
    ),
  );
  readonly tours = toSignal(this.tourSummaries$, { initialValue: [] });

  // whole selected Tour tour circle or smth like that
  readonly selectedTourId$ = toObservable(this.selectedTourId);
  readonly selectedTour$ = this.selectedTourId$.pipe(
    switchMap((id) => {
      if (null === id) {
        return of(null);
      }

      return this.tourApi.getTourById(id).pipe(
        catchError((err) => {
          this.error.set(err.message);
          return EMPTY;
        }),
      );
    }),
  );
  readonly selectedTour = toSignal(this.selectedTour$, { initialValue: null });

  // query stuff
  readonly query$ = toObservable(this.query);
  readonly filteredTours$ = this.query$.pipe(
    map((q) => q.trim()),
    debounceTime(300),
    distinctUntilChanged(),
    switchMap((q) => {
      if (0 === q.length) {
        this.loading.set(false);
        this.error.set(null);
        return [];
      }

      return this.tourApi.searchTour(q).pipe(
        catchError((err) => {
          this.error.set(err.message);
          return EMPTY;
        }),
      );
    }),
  );
  readonly filteredTours = toSignal(this.filteredTours$);

  readonly tourCount = computed(() => this.tours().length);

  // methods

  select(id: number): void {
    this.selectedTourId.set(id);
  }

  clearSelection(): void {
    this.selectedTourId.set(null);
  }

  setQuery(query: string): void {
    this.query.set(query);
  }

  clearQuery(): void {
    this.query.set('');
  }

  createTour(data: Omit<Tour, 'id' | 'distance' | 'estimated_time' | 'route_information'>): void {
    this.tourApi.createTour(data).pipe(
      startWith(() => {
        this.loading.set(true);
        this.error.set(null);
      }),
      catchError((err) => {
        this.loading.set(false);
        this.error.set(err.message);
        return EMPTY;
      }),
      finalize(() => this.loading.set(false)),
    );
  }

  updateTour(id: number, data: Partial<Omit<Tour, 'id'>>): void {
    this.tourApi.updateTour(id, data).pipe(
      startWith(() => {
        this.loading.set(true);
        this.error.set(null);
      }),
      catchError((err) => {
        this.loading.set(false);
        this.error.set(err.message);
        return EMPTY;
      }),
      finalize(() => this.loading.set(false)),
    );
  }

  deleteTour(id: number): void {
    this.tourApi.deleteTour(id).pipe(
      startWith(() => {
        this.loading.set(true);
        this.error.set(null);
      }),
      catchError((err) => {
        this.loading.set(false);
        this.error.set(err.message);
        return EMPTY;
      }),
      finalize(() => this.loading.set(false)),
    );
  }
}
