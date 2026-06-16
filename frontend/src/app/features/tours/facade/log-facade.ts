import { computed, inject, Injectable, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import {
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
import { TourLogService, TourLogApiResponse, CreateLogPayload } from '../services/tour-log.service';

@Injectable({
  providedIn: 'root',
})
export class LogFacade {
  private readonly logApi = inject(TourLogService);

  readonly error = signal<string | null>(null);
  readonly loading = signal(false);
  readonly query = signal('');

  readonly tourId = signal<number | null>(null);
  readonly selectedLogId = signal<number | null>(null);

  readonly tourId$ = toObservable(this.tourId);
  readonly logs$ = this.tourId$.pipe(
    switchMap((id) => {
      this.loading.set(true);
      this.error.set(null);

      if (null === id) {
        return EMPTY;
      }

      return this.logApi.getLogs(id).pipe(
        catchError((err) => {
          this.error.set(err.message);
          return EMPTY;
        }),
        finalize(() => this.loading.set(false)),
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

      const id = this.tourId();
      if (null === id) return EMPTY;

      if (0 === q.length) {
        return this.logApi.getLogs(id).pipe(
          catchError((err) => {
            this.error.set(err.message);
            return EMPTY;
          }),
          finalize(() => this.loading.set(false)),
        );
      }

      return this.logApi.searchLogs(id, q).pipe(
        catchError((err) => {
          this.error.set(err.message);
          return EMPTY;
        }),
        finalize(() => this.loading.set(false)),
      );
    }),
  );
  readonly filteredLogs = toSignal(this.filteredLogs$);

  readonly selectedLogId$ = toObservable(this.selectedLogId);
  readonly selectedLog$ = this.selectedLogId$.pipe(
    switchMap((logId) => {
      if (null === logId) return of(null);

      const tourId = this.tourId();
      if (null === tourId) return of(null);

      return this.logApi.getLog(tourId, logId).pipe(
        catchError((err) => {
          this.error.set(err.message);
          return EMPTY;
        }),
      );
    }),
  );
  readonly selectedLog = toSignal(this.selectedLog$, { initialValue: null });

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

  createLog(tourId: number, payload: CreateLogPayload): void {
    this.loading.set(true);
    this.error.set(null);

    this.logApi
      .createLog(tourId, payload)
      .pipe(
        catchError((err) => {
          this.error.set(err.message);
          return EMPTY;
        }),
        finalize(() => {
          this.loading.set(false);
          this.setTourId(tourId); // refresh
        }),
      )
      .subscribe();
  }

  updateLog(tourId: number, logId: number, payload: Partial<CreateLogPayload>): void {
    this.loading.set(true);
    this.error.set(null);

    this.logApi
      .updateLog(tourId, logId, payload)
      .pipe(
        catchError((err) => {
          this.error.set(err.message);
          return EMPTY;
        }),
        finalize(() => {
          this.loading.set(false);
          this.setTourId(tourId); // refresh
        }),
      )
      .subscribe();
  }

  deleteLog(logId: number): void {
    const tourId = this.tourId();
    if (null === tourId) return;

    this.logApi
      .deleteLog(tourId, logId)
      .pipe(
        catchError((err) => {
          this.error.set(err.message);
          return EMPTY;
        }),
        finalize(() => {
          this.loading.set(false);
          const id = this.tourId();
          this.clearTourId();
          this.setTourId(id);
        }),
      )
      .subscribe();
  }
}
