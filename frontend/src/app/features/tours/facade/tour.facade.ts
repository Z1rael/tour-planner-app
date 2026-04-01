import { computed, inject, Injectable, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { catchError, finalize, Observable, of, switchMap, tap } from 'rxjs';
import { TourService } from '../services/tour-service';
import { MockTourService } from '../../../mock/services/mock-tour-service';
import { Tour, TourLog } from '../../../mock/data/tour-mock-data';

@Injectable({
  providedIn: 'root',
})
export class TourFacade {
  private readonly tourService = inject(MockTourService);
  private readonly errorSignal = signal<string | null>(null);
  private readonly loadingSignal = signal(false);

  readonly tours = toSignal(this.tourService.tours$, { initialValue: [] });
  readonly selected = signal<Tour | null>(null);

  readonly error = this.errorSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();

  readonly toursWithStats = computed(() =>
    this.tours().map((tour) => ({
      ...tour,
      popularity: this.computePopularity(tour),
      childFriendly: this.computeChildFriendly(tour),
    })),
  );

  readonly searchQuery = signal('');

  readonly searchResults = computed(() => {
    const query = this.searchQuery().toLocaleLowerCase().trim();
    if (!query) {
      return this.toursWithStats();
    }

    return this.toursWithStats().filter((tour) => this.toSearchableString(tour).includes(query));
  });

  select(id: string): void {
    const tour = this.tours().find((t) => t.id === id) ?? null;
    this.selected.set(tour);
  }

  create(tour: Tour): void {
    this.execute(this.tourService.createTour(tour));
  }

  update(tour: Tour): void {
    this.execute(this.tourService.updateTour(tour));

    if (this.selected()?.id === tour.id) {
      this.selected.set(tour);
    }
  }

  delete(id: string): void {
    this.execute(this.tourService.deleteTour(id));

    if (this.selected()?.id === id) {
      this.selected.set(null);
    }
  }

  private execute<T>(op: Observable<T>): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    op.pipe(finalize(() => this.loadingSignal.set(false))).subscribe({
      error: (err: Error) => this.errorSignal.set(err.message),
    });
  }

  private toSearchableString(tour: Tour & { popularity: number; childFriendly: boolean }): string {
    return [
      tour.name,
      tour.description,
      tour.from,
      tour.to,
      tour.transportType,
      tour.popularity,
      tour.childFriendly ? 'child friendly' : 'not child friendly',
      ...tour.logs.map((l) => l.comment),
    ]
      .join(' ')
      .toLowerCase();
  }

  private computePopularity(tour: Tour): number {
    return tour.logs.length;
  }

  private computeChildFriendly(tour: Tour): boolean {
    if (!tour.logs.length) return false;
    const avg = (fn: (l: TourLog) => number) =>
      tour.logs.reduce((sum, l) => sum + fn(l), 0) / tour.logs.length;

    return (
      avg((l) => l.difficulty) <= 2 &&
      avg((l) => l.totalTime) <= 120 &&
      avg((l) => l.totalDistance) <= 10
    );
  }
}
