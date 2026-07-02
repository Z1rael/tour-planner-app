import { Component, computed, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { TourFacade } from '../../facade/tour.facade';
import { TourLog } from '../../models/tour/tour-log';
import { debounce, form, FormField, max, min, required, FormRoot, submit } from '@angular/forms/signals';
import { LogFacade } from '../../facade/log-facade';
import { resolve } from 'path';

@Component({
  selector: 'app-log-form',
  standalone: true,
  imports: [FormField, FormRoot],
  templateUrl: './log-form.html',
  changeDetection: ChangeDetectionStrategy.Eager,
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
    min(schemaPath.difficulty, 1);
    max(schemaPath.difficulty, 5);

    required(schemaPath.total_distance_km, { message: 'Tour total distance is required' });
    min(schemaPath.total_distance_km, 0);
    max(schemaPath.total_distance_km, this.tourDistance);

    required(schemaPath.total_time_m, { message: 'Tour total time is required' });
    min(schemaPath.total_time_m, 0);

    required(schemaPath.rating, { message: 'Tour rating is required' });
    min(schemaPath.rating, 1);
    max(schemaPath.rating, 5);

    required(schemaPath.tour_id, { message: 'Tour Id is required' });
  });

  async onSubmit() {
    const selected = this.logFacade.selectedLog();

    submit(this.logForm, async () => {
      if (selected) {
        this.logFacade.updateLog(selected.id, this.logModel());
      } else {
        this.logFacade.createLog(this.logModel());
      }
    });


    // whacky workaround :c
    await this.delay(500);
    this.logFacade.clearTourId();
    this.logFacade.setTourId(this.tourFacade.selectedTourId());

    this.logFacade.clearLogSelection();

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
        total_distance_km: selected.total_distance_km,
        total_time_m: selected.total_time_m,
        rating: selected.rating,
        creator_id: selected.creator_id,
      };
    }

    return {
      tour_id: this.selectedTour !== null ? this.selectedTour.id : 0,
      comment: '',
      difficulty: 0,
      total_distance_km: 0,
      total_time_m: 0,
      rating: 0,
      creator_id: 1,
    };
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

}
