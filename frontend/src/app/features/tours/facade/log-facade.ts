import { computed, inject, Injectable, signal } from '@angular/core';
import { TourLogService } from '../services/tour-log.service';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import {
  BehaviorSubject,
  catchError,
  debounceTime,
  distinctUntilChanged,
  EMPTY,
  finalize,
  map,
  of,
  startWith,
  switchMap,
  tap,
} from 'rxjs';
import { TourLog } from '../models/log/tour-log';
import { CreateTourLogForm } from '../models/log/create-tour-log-form';
import { UpdateTourLogForm } from '../models/log/update-tour-log-form';
import { CreateTourLogPayload } from '../models/log/create-tour-log-payload';
import { UpdateTourLogPayload } from '../models/log/update-tour-log-payload';
import { TourLogResponse } from '../models/log/tour-log-response';

@Injectable({
  providedIn: 'root',
})
export class LogFacade {
  private readonly logApi = inject(TourLogService);
  readonly refreshTrigger = signal(0);

  readonly error = signal<string | null>(null);
  readonly loading = signal(false);
  readonly query = signal('');

  readonly tourId = signal<number | null>(null);
  readonly selectedLogId = signal<number | null>(null);

  private readonly logsQuery = computed(() => ({
    id: this.tourId(),
    tick: this.refreshTrigger(),
  }));

  readonly logsQuery$ = toObservable(this.logsQuery);

  //readonly tourId$ = toObservable(this.tourId);
  readonly logs$ = this.logsQuery$.pipe(
    switchMap(({ id }) => {
      this.loading.set(true);
      this.error.set(null);

      if (null === id) {
        return this.logApi.getTourLogs().pipe(
          map((logs) => logs.map((l) => this.mapLog(l))),
          catchError((err) => {
            this.loading.set(false);
            this.error.set(err.message);
            return EMPTY;
          }),
          finalize(() => this.loading.set(false)),
        );
      }

      return this.logApi.getLogByTourId(id).pipe(
        map((logs) => logs.map((l) => this.mapLog(l))),
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
  );
  readonly logs = toSignal(this.logs$);
  readonly logCount = computed(() => this.logs()?.length);

  readonly query$ = toObservable(this.query);
  readonly filteredLogs$ = this.query$.pipe(
    map((q) => q.trim()),
    debounceTime(300),
    distinctUntilChanged(),
    switchMap((q) => {
      this.loading.set(true);
      this.error.set(null);

      if (0 === q.length) {
        return this.logApi.getTourLogs().pipe(
          map((logs) => logs.map((l) => this.mapLog(l))),
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

      return this.logApi.searchTourLogs(q).pipe(
        map((logs) => logs.map((l) => this.mapLog(l))),
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
  );
  readonly filteredLogs = toSignal(this.filteredLogs$);

  readonly selectedLogId$ = toObservable(this.selectedLogId);
  readonly selectedLog$ = this.selectedLogId$.pipe(
    switchMap((id) => {
      if (null === id) {
        return of(null);
      }

      //this.loading.set(true);
      //this.error.set(null);

      return this.logApi.getLogById(id).pipe(
        map((l) => this.mapLog(l)),
        catchError((err) => {
          this.error.set(err.message);
          return EMPTY;
        }),
        //finalize(() => this.loading.set(false)),
      );
    }),
  );
  readonly selectedLog = toSignal(this.selectedLog$, { initialValue: null });

  // methods
  setTourId(id: number | null): void {
    this.tourId.set(id);
  }

  clearTourId(): void {
    this.tourId.set(null);
  }

  setQuery(str: string): void {
    this.query.set(str);
  }

  clearQuery(): void {
    this.query.set('');
  }

  selectLog(id: number): void {
    this.selectedLogId.set(id);
  }

  clearLogSelection(): void {
    this.selectedLogId.set(null);
  }

  createLog(data: CreateTourLogForm): void {
    this.loading.set(true);
    this.error.set(null);

    // need to convert from minutes to seconds 
    const payload: CreateTourLogPayload = {
      tour_id: data.tour_id,
      comment: data.comment,
      difficulty: data.difficulty,
      rating: data.rating,
      total_time_s: data.total_time_m * 60,
      total_distance_km: data.total_distance_km
    }

    this.logApi
      .createTourLog(payload)
      .pipe(
        catchError((err) => {
          this.loading.set(false);
          this.error.set(err.message);
          return EMPTY;
        }),
        finalize(() => this.loading.set(false)),
      )
      .subscribe();
  }

  updateLog(id: number, data: UpdateTourLogForm): void {
    this.loading.set(true);
    this.error.set(null);

    const payload: UpdateTourLogPayload = {
      comment: data.comment,
      difficulty: data.difficulty,
      rating: data.rating,
      total_time_s: data.total_time_m ? data.total_time_m * 60 : undefined,
      total_distance_km: data.total_distance_km
    }


    this.logApi
      .updateTourLog(id, payload)
      .pipe(
        catchError((err) => {
          this.loading.set(false);
          this.error.set(err.message);
          return EMPTY;
        }),
        finalize(() => this.loading.set(false)),
      )
      .subscribe();
  }

  deleteLog(id: number): void {
    this.logApi
      .deleteTourLog(id)
      .pipe(
        startWith(() => {
          this.loading.set(true);
          this.error.set(null);
        }),
        catchError((err) => {
          this.loading.set(false);
          this.error.set(err.message);
          return EMPTY;
        }),
        finalize(() => {
          // whacky refresh again
          const tourId = this.tourId();
          this.clearTourId();
          this.setTourId(tourId);
        }),
      )
      .subscribe();
  }

  // helpers
  private mapLog(t: TourLogResponse): TourLog {
    return {
      id: t.tour_log_id,
      tour_id: t.tour_id,
      comment: t.comment,
      difficulty: t.difficulty,
      rating: t.rating,
      total_distance_km: t.total_distance_km,
      total_time_m: t.total_time_s / 60,
      timestamp: t.log_date,
      creator_id: 0,
      isOwner: t.is_owner
    };
  }
}
