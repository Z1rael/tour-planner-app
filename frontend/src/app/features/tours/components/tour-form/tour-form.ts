import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { TourFacade } from '../../facade/tour.facade';
import { form, FormField, required } from '@angular/forms/signals';
import { Tour } from '../../../../core/models/tour';
import { TransportationType } from '../../../../core/models/transportation-type';

@Component({
  selector: 'app-tour-form',
  standalone: true,
  imports: [FormField],
  templateUrl: './tour-form.html',
  styleUrl: './tour-form.css',
})
export class TourForm {
  private router = inject(Router);
  protected readonly tourFacade = inject(TourFacade);

  readonly transportOptions = [
    { value: TransportationType.CAR, label: 'Car' },
    { value: TransportationType.BICYCLE_REGULAR, label: 'Bicycle' },
    { value: TransportationType.BICYCLE_ROAD, label: 'Road Bike' },
    { value: TransportationType.MOUNTAIN_BIKE, label: 'Mountain Bike' },
    { value: TransportationType.WALK, label: 'Walk' },
    { value: TransportationType.HIKE, label: 'Hike' },
  ];

  readonly isEditMode = computed(() => this.tourFacade.selectedTour !== null);

  readonly tourModel = signal<
    Omit<Tour, 'id' | 'distance' | 'estimated_time' | 'route_information'>
  >(this.initialFormValue());

  readonly tourForm = form(this.tourModel, (schemaPath) => {
    required(schemaPath.name, { message: 'Tour name is required' });
    required(schemaPath.from, { message: 'Tour start is required' });
    required(schemaPath.to, { message: 'Tour destination is required' });
    required(schemaPath.transport_type, { message: 'Tour transportation type is required' });
  });

  onSubmit(): void {
    const selected = this.tourFacade.selectedTour();

    if (selected) {
      this.tourFacade.updateTour(selected.id, this.tourModel());
    } else {
      this.tourFacade.createTour(this.tourModel());
    }

    this.router.navigate(['profile']);
  }

  onCancel(): void {
    const selected = this.tourFacade.selectedTour();

    if (selected) {
      this.router.navigate(['tours']);
    } else {
      this.router.navigate(['profile']);
    }
  }

  clearForm(): void {
    this.tourModel.set(this.initialFormValue());
  }

  private initialFormValue(): Omit<
    Tour,
    'id' | 'distance' | 'estimated_time' | 'route_information'
  > {
    const selected = this.tourFacade.selectedTour();
    if (selected) {
      return {
        name: selected.name,
        from: selected.from,
        to: selected.to,
        transport_type: selected.transport_type,
        description: selected.description,
        creator_id: selected.creator_id,
      };
    }

    return {
      name: '',
      from: '',
      to: '',
      transport_type: TransportationType.CAR,
      description: '',
      creator_id: 0,
    };
  }
}
