import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { TourFacade } from '../../facade/tour.facade';
import { debounce, form, FormField, max, min, required } from '@angular/forms/signals';
import { LogFacade } from '../../facade/log-facade';
import { CreateLogPayload } from '../../services/tour-log.service';

@Component({
  selector: 'app-log-form',
  standalone: true,
  imports: [FormField],
  templateUrl: './log-form.html',
  styleUrl: './log-form.css',
})
export class LogForm {
  private readonly router = inject(Router);
  protected readonly logFacade = inject(LogFacade);
  protected readonly tourFacade = inject(TourFacade);

  readonly isEditMode = computed(() => this.logFacade.selectedLog() !== null);
  readonly selectedTour = this.tourFacade.selectedTour();
  readonly tourDistance = computed(() => this.selectedTour?.distance);

  readonly logModel = signal<CreateLogPayload>(this.initialFormValue());
  readonly logForm = form(this.logModel, (schemaPath) => {
    debounce(schemaPath, 500);
    required(schemaPath.comment, { message: 'A small comment is mandatory' });
    required(schemaPath.difficulty, { message: 'Tour difficulty is required' });
    min(schemaPath.difficulty, 0);
    max(schemaPath.difficulty, 5);
    required(schemaPath.totalDistanceKm, { message: 'Tour total distance is required' });
    min(schemaPath.totalDistanceKm, 0);
    max(schemaPath.totalDistanceKm, this.tourDistance);
    required(schemaPath.totalTimeS, { message: 'Tour total time is required' });
    min(schemaPath.totalTimeS, 0);
    required(schemaPath.rating, { message: 'Tour rating is required' });
    min(schemaPath.rating, 0);
    max(schemaPath.rating, 5);
  });

  onSubmit(): void {
    const tourId = this.tourFacade.selectedTourId();
    if (null === tourId) return;

    const selected = this.logFacade.selectedLog();
    if (selected) {
      this.logFacade.updateLog(tourId, selected.logId, this.logModel());
    } else {
      this.logFacade.createLog(tourId, this.logModel());
    }

    this.logFacade.clearTourId();
    this.logFacade.setTourId(tourId);
    this.router.navigate(['tours']);
  }

  onCancel(): void {
    this.logFacade.clearLogSelection();
    this.router.navigate(['tours']);
  }

  private initialFormValue(): CreateLogPayload {
    const selected = this.logFacade.selectedLog();
    if (selected) {
      return {
        logDate: selected.logDate,
        comment: selected.comment,
        difficulty: selected.difficulty,
        totalDistanceKm: selected.totalDistanceKm,
        totalTimeS: selected.totalTimeS,
        rating: selected.rating,
      };
    }
    return {
      logDate: new Date().toISOString(),
      comment: '',
      difficulty: 0,
      totalDistanceKm: 0,
      totalTimeS: 0,
      rating: 0,
    };
  }
}
