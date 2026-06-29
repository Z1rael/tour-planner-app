import { Component, computed, effect, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { TourFacade } from '../../facade/tour.facade';
import { form, FormField, required } from '@angular/forms/signals';
import { TransportationType } from '../../../../core/models/transportation-type';
import { OrsGeocodeService, GeocodeDTO } from '../../../map/services/ors-geocode.service';
import { NgFor, NgIf } from '@angular/common';
import { firstValueFrom } from 'rxjs';

interface TourFormModel {
  name: string;
  description: string;
  from: string;
  to: string;
  transport_type: TransportationType;
}

const EMPTY_FORM: TourFormModel = {
  name: '',
  description: '',
  from: '',
  to: '',
  transport_type: TransportationType.WALK,
};

@Component({
  selector: 'app-tour-form',
  standalone: true,
  imports: [FormField, NgFor, NgIf],
  templateUrl: './tour-form.html',
  styleUrl: './tour-form.css',
})
export class TourForm {
  private readonly router = inject(Router);
  protected readonly tourFacade = inject(TourFacade);
  private readonly geocodeService = inject(OrsGeocodeService);

  readonly isSubmitting = signal(false);
  readonly geocodeError = signal<string | null>(null);
  readonly fromCoords = signal<GeocodeDTO | null>(null);
  readonly toCoords = signal<GeocodeDTO | null>(null);
  readonly fromSuggestions = signal<GeocodeDTO[]>([]);
  readonly toSuggestions = signal<GeocodeDTO[]>([]);
  readonly tourModel = signal<TourFormModel>(EMPTY_FORM);

  readonly transportOptions = [
    { value: TransportationType.CAR, label: 'Car' },
    { value: TransportationType.BICYCLE_REGULAR, label: 'Bicycle' },
    { value: TransportationType.BICYCLE_ROAD, label: 'Road Bike' },
    { value: TransportationType.MOUNTAIN_BIKE, label: 'Mountain Bike' },
    { value: TransportationType.WALK, label: 'Walk' },
    { value: TransportationType.HIKE, label: 'Hike' },
  ];

  readonly isEditMode = computed(() => this.tourFacade.selectedTour() !== null);

  readonly tourForm = form(this.tourModel, (schemaPath) => {
    required(schemaPath.name, { message: 'Tour name is required' });
    required(schemaPath.from, { message: 'Tour start is required' });
    required(schemaPath.to, { message: 'Tour destination is required' });
    required(schemaPath.transport_type, { message: 'Transport type is required' });
  });

  private coordsInitialized = false;

  constructor() {
    effect(() => {
      const selected = this.tourFacade.selectedTour();
      if (selected && !this.coordsInitialized) {
        this.coordsInitialized = true;
        this.tourModel.set({
          name: selected.name,
          description: selected.description ?? '',
          from: selected.from,
          to: selected.to,
          transport_type: selected.transport_type as TransportationType,
        });

        // Geocode existing addresses to get real coords
        Promise.all([
          firstValueFrom(this.geocodeService.geocode(selected.from)),
          firstValueFrom(this.geocodeService.geocode(selected.to)),
        ]).then(([fromCoords, toCoords]) => {
          if (fromCoords) this.fromCoords.set(fromCoords);
          if (toCoords) this.toCoords.set(toCoords);
        });
      } else if (!selected) {
        this.coordsInitialized = false;
        this.fromCoords.set(null);
        this.toCoords.set(null);
        this.fromSuggestions.set([]);
        this.toSuggestions.set([]);
        this.tourModel.set(EMPTY_FORM);
      }
    });
  }

  onFromInput(query: string): void {
    this.fromCoords.set(null);
    if (query.length < 3) {
      this.fromSuggestions.set([]);
      return;
    }
    this.geocodeService.geocodeAll(query).subscribe((r) => this.fromSuggestions.set(r));
  }

  onToInput(query: string): void {
    this.toCoords.set(null);
    if (query.length < 3) {
      this.toSuggestions.set([]);
      return;
    }
    this.geocodeService.geocodeAll(query).subscribe((r) => this.toSuggestions.set(r));
  }

  selectFrom(result: GeocodeDTO): void {
    this.fromCoords.set(result);
    this.fromSuggestions.set([]);
    this.tourModel.update((m) => ({ ...m, from: result.label }));
  }

  selectTo(result: GeocodeDTO): void {
    this.toCoords.set(result);
    this.toSuggestions.set([]);
    this.tourModel.update((m) => ({ ...m, to: result.label }));
  }

  onSubmit(event?: Event): void {
    event?.preventDefault();
    const model = this.tourModel();
    const fromCoords = this.fromCoords();
    const toCoords = this.toCoords();

    this.geocodeError.set(null);

    if (!fromCoords || !toCoords) {
      this.geocodeError.set('Please select a location from the suggestions for both From and To.');
      return;
    }

    this.isSubmitting.set(true);
    const selected = this.tourFacade.selectedTour();

    if (selected) {
      fromCoords.lat !== 0 && fromCoords.lng !== 0 && toCoords.lat !== 0 && toCoords.lng !== 0;
      const payload = {
        name: model.name,
        description: model.description,
        profile: model.transport_type,

        fromAddress: fromCoords.label,
        toAddress: toCoords.label,
        fromLat: fromCoords.lat,
        fromLng: fromCoords.lng,
        toLat: toCoords.lat,
        toLng: toCoords.lng,
      };

      this.tourFacade.updateTour(selected.id, payload);
      this.tourFacade.clearSelection();
      this.router.navigate(['profile']);
    } else {
      this.tourFacade.createTour({
        name: model.name,
        description: model.description,
        from_address: fromCoords.label,
        to_address: toCoords.label,
        from_lat: fromCoords.lat,
        from_lng: fromCoords.lng,
        to_lat: toCoords.lat,
        to_lng: toCoords.lng,
        profile: model.transport_type,
      });
      this.router.navigate(['profile']);
    }
    this.isSubmitting.set(false);
  }

  onCancel(): void {
    this.tourFacade.selectedTour()
      ? this.router.navigate(['tours'])
      : this.router.navigate(['profile']);
  }
}
