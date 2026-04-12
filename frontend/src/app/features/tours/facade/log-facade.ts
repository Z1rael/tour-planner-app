import { computed, inject, Injectable, signal } from '@angular/core';
import { MockLogService } from '../../../mock/services/mock-log-service';
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
import { TourLog } from '../../../core/models/tour-log';

@Injectable({
  providedIn: 'root',
})
export class LogFacade {
  private readonly logApi = inject(MockLogService);

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
        return this.logApi.getTourLogs().pipe(
          catchError((err) => {
            this.loading.set(false);
            this.error.set(err.message);
            return EMPTY;
          }),
          finalize(() => this.loading.set(false)),
        );
      }

      return this.logApi.getLogByTourId(id).pipe(
        catchError((err) => {
          this.loading.set(false);
          this.error.set(err);
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

  createLog(data: Omit<TourLog, 'id' | 'timestamp'>): void {
    this.loading.set(true);
    this.error.set(null);

    this.logApi.createTourLog(data).pipe(
      catchError((err) => {
        this.loading.set(false);
        this.error.set(err.message);
        return EMPTY;
      }),
      finalize(() => this.loading.set(false)),
    );
  }

  updateLog(id: number, data: Omit<TourLog, 'id' | 'timestamp'>): void {
    this.loading.set(true);
    this.error.set(null);

    this.logApi.updateTourLog(id, data).pipe(
      catchError((err) => {
        this.loading.set(false);
        this.error.set(err.message);
        return EMPTY;
      }),
      finalize(() => this.loading.set(false)),
    );
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
}
