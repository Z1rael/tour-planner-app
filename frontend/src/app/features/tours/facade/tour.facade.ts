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
  switchMap,
  tap,
} from 'rxjs';
import {
  CreateTourPayload,
  TourResponse,
  TourService,
  TourSummaryResponse,
  UpdateTourPayload,
} from '../services/tour.service';
import { Tour } from '../../../core/models/tour';
import { TransportationType } from '../../../core/models/transportation-type';
import { TourSummary } from '../../../core/models/tour-summary';

@Injectable({
  providedIn: 'root',
})
export class TourFacade {
  private readonly tourApi = inject(TourService);
  private readonly refresh$ = new BehaviorSubject<void>(undefined);

  // State
  readonly error = signal<string | null>(null);
  readonly loading = signal(false);
  readonly selectedTourId = signal<number | null>(null);
  readonly query = signal('');

  //
  // Tour
  //
  refresh(): void {
    this.refresh$.next();
  }

  // Load Tour Summaries list
  readonly tourSummaries$: Observable<TourSummary[]> = this.refresh$.pipe(
    switchMap(() =>
      this.tourApi.getTours().pipe(
        map((tours) => tours.map(this.mapSummary.bind(this))),
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

      this.loading.set(true);
      this.error.set(null);

      return this.tourApi.getTourById(id).pipe(
        map((t) => this.mapFull(t)),
        catchError((err) => {
          this.error.set(err.message);
          return EMPTY;
        }),
        finalize(() => this.loading.set(false)),
      );
    }),
  );

  readonly selectedTour = toSignal(this.selectedTour$, { initialValue: null });

  // query stuff
  readonly query$ = toObservable(this.query);
  readonly filteredTours$ = this.refresh$.pipe(
    switchMap(() =>
      this.query$.pipe(
        map((q) => q.trim()),
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((q) => {
          this.loading.set(true);
          this.error.set(null);

          if (0 === q.length) {
            return this.tourApi.getTours().pipe(
              map((tours) => tours.map((t) => this.mapSummary(t))),
              catchError((err) => {
                this.loading.set(false);
                this.error.set(err.message);
                return EMPTY;
              }),
              finalize(() => {
                this.loading.set(false);
              }),
            );
          }

          return this.tourApi.searchTour(q).pipe(
            map((tours) => tours.map((t) => this.mapSummary(t))),
            catchError((err) => {
              this.loading.set(false);
              this.error.set(err.message);
              return EMPTY;
            }),
            finalize(() => {
              this.loading.set(false);
            }),
          );
        }),
      ),
    ),
  );
  readonly filteredTours = toSignal(this.filteredTours$);
  readonly tourCount = computed(() => this.filteredTours()?.length);

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

  createTour(data: CreateTourPayload): void {
    this.loading.set(true);
    this.error.set(null);

    this.tourApi
      .createTour(data)
      .pipe(
        tap((newTour) => console.log('API returned:', newTour)),
        catchError((err) => {
          this.loading.set(false);
          this.error.set(err.message);
          return EMPTY;
        }),
        finalize(() => this.loading.set(false)),
      )
      .subscribe(() => this.refresh());
  }

  updateTour(id: number, data: UpdateTourPayload): void {
    console.log('Facade received', data);
    this.tourApi
      .updateTour(id, data)
      .pipe(
        tap(() => {
          this.loading.set(true);
          this.error.set(null);
        }),
        catchError((err) => {
          this.loading.set(false);
          this.error.set(err.message);
          return EMPTY;
        }),
        finalize(() => this.loading.set(false)),
      )
      .subscribe(() => this.refresh());
  }

  deleteTour(id: number): void {
    this.tourApi
      .deleteTour(id)
      .pipe(
        tap(() => {
          this.loading.set(true);
          this.error.set(null);
        }),
        catchError((err) => {
          this.loading.set(false);
          this.error.set(err.message);
          return EMPTY;
        }),
        finalize(() => this.loading.set(false)),
      )
      .subscribe(() => this.refresh());
  }

  // helpers
  private mapSummary(t: TourSummaryResponse): TourSummary {
    return {
      id: t.tour_id,
      name: t.name,
      from: t.from_address,
      to: t.to_address,
      transportType: t.transport_type_name as TransportationType,
      distanceKm: t.distance_km,
      estimatedTimeS: t.estimated_time_s,
      popularity: t.popularity,
      childFriendliness: t.child_friendliness,
      creatorId: 0,
    };
  }

  private mapFull(t: TourResponse): Tour {
    return {
      id: t.tour_id,
      name: t.name,
      fromGeocode: t.from_geocode,
      toGeocode: t.to_geocode,
      transport_type: t.transport_type_name as TransportationType,
      description: t.description,
      distance: t.distance_km,
      estimated_time: t.estimated_time_s / 60,
      route_information: t.route_geo_json ?? '',
      creator_id: 0,
      popularity: t.popularity,
      child_friendliness: t.child_friendliness,
    };
  }
}
