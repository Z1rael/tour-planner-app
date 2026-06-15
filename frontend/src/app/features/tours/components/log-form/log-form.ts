import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { TourFacade } from '../../facade/tour.facade';
import { TourLog } from '../../../../core/models/tour-log';
import { debounce, form, FormField, max, min, required } from '@angular/forms/signals';
import { UserService } from '../../../user/services/user.service';
import { LogFacade } from '../../facade/log-facade';

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

  readonly isEditMode = computed(() => this.logFacade.selectedLog !== null);

  readonly selectedTour = this.tourFacade.selectedTour();
  readonly tourDistance = computed(() => this.selectedTour?.distance);

  readonly logModel = signal<Omit<TourLog, 'id' | 'timestamp'>>(this.initialFormValue());

  readonly logForm = form(this.logModel, (schemaPath) => {
    debounce(schemaPath, 500);
    required(schemaPath.comment, { message: 'A small comment is mandatory' });

    required(schemaPath.difficulty, { message: 'Tour difficulty is required' });
    min(schemaPath.difficulty, 0);
    max(schemaPath.difficulty, 5);

    required(schemaPath.total_distance, { message: 'Tour total distance is required' });
    min(schemaPath.total_distance, 0);
    max(schemaPath.total_distance, this.tourDistance);

    required(schemaPath.total_time, { message: 'Tour total time is required' });
    min(schemaPath.total_time, 0);

    required(schemaPath.rating, { message: 'Tour rating is required' });
    min(schemaPath.rating, 0);
    max(schemaPath.rating, 5);

    required(schemaPath.tour_id, { message: 'Tour Id is required' });
  });

  onSubmit(): void {
    const selected = this.logFacade.selectedLog();

    if (selected) {
      this.logFacade.updateLog(selected.id, this.logModel());
    } else {
      this.logFacade.createLog(this.logModel());
    }

    // whacky workaround :c
    this.logFacade.clearTourId();
    this.logFacade.setTourId(this.tourFacade.selectedTourId());

    this.router.navigate(['tours']);
  }

  onCancel(): void {
    this.logFacade.clearLogSelection();

    this.router.navigate(['tours']);
  }

  private initialFormValue(): Omit<TourLog, 'id' | 'timestamp'> {
    const selected = this.logFacade.selectedLog();
    if (selected) {
      return {
        tour_id: selected.tour_id,
        comment: selected.comment,
        difficulty: selected.difficulty,
        total_distance: selected.total_distance,
        total_time: selected.total_time,
        rating: selected.rating,
        creator_id: selected.creator_id,
      };
    }

    return {
      tour_id: this.selectedTour !== null ? this.selectedTour.id : 0,
      comment: '',
      difficulty: 0,
      total_distance: 0,
      total_time: 0,
      rating: 0,
      creator_id: 1,
    };
  }
}
