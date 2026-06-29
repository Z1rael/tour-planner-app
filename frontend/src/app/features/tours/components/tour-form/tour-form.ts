import { Component, computed, effect, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { TourFacade } from '../../facade/tour.facade';
import { form, FormField, required } from '@angular/forms/signals';
import { TransportationType } from '../../../../core/models/transportation-type';
import { OrsGeocodeService, GeocodeDTO } from '../../../map/services/ors-geocode.service';
import { debounceTime, distinctUntilChanged, EMPTY, firstValueFrom, switchMap } from 'rxjs';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { CreateTourPayload } from '../../services/tour.service';

interface TourFormModel {
  name: string;
  transport_type: TransportationType;
  from: GeocodeDTO;
  to: GeocodeDTO;
  description: string;
}

const EMPTY_FORM: TourFormModel = {
  name: '',
  description: '',
  from: {
    label: '',
    lat: 0,
    lng: 0
  },
  to: {
    label: '',
    lat: 0,
    lng: 0
  },
  transport_type: TransportationType.WALK,
};

@Component({
  selector: 'app-tour-form',
  standalone: true,
  imports: [FormField],
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
  readonly tourModel = signal<TourFormModel>(EMPTY_FORM);
  readonly fromQuery = signal('');
  readonly toQuery = signal('');

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

  constructor() {
    effect(() => {
      const selected = this.tourFacade.selectedTour();
      if (selected) {
        this.tourModel.set({
          name: selected.name,
          description: selected.description ?? '',
          from: selected.fromGeocode,
          to: selected.toGeocode,
          transport_type: selected.transport_type as TransportationType,
        });
      } else if (!selected) {
        this.fromCoords.set(null);
        this.toCoords.set(null);
        this.tourModel.set(EMPTY_FORM);
      }
    });
  }

  onFromInput(query: string): void {
    this.fromCoords.set(null);
    if (query.length > 3) {
      this.fromQuery.set(query);
    }
  }

  readonly fromQuery$ = toObservable(this.fromQuery);
  readonly fromSuggestions$ = this.fromQuery$.pipe(
    debounceTime(600),
    distinctUntilChanged(),
    switchMap((q) => {
      if (0 === q.length) {
        return EMPTY;
      }

      return this.geocodeService.geocodeAll(q);
    })
  );
  readonly fromSuggestions = toSignal(this.fromSuggestions$);

  onToInput(query: string): void {
    this.toCoords.set(null);
    if (query.length > 3) {
      this.toQuery.set(query);
    }
  }

  readonly toQuery$ = toObservable(this.toQuery);
  readonly toSuggestions$ = this.toQuery$.pipe(
    debounceTime(600),
    distinctUntilChanged(),
    switchMap((q) => {
      if (0 === q.length) {
        return EMPTY;
      }

      return this.geocodeService.geocodeAll(q);
    })
  );
  readonly toSuggestions = toSignal(this.toSuggestions$);

  selectFrom(result: GeocodeDTO): void {
    this.fromCoords.set(result);
    this.tourModel.update((m) => ({ ...m, from: result }));
  }

  selectTo(result: GeocodeDTO): void {
    this.toCoords.set(result);
    this.tourModel.update((m) => ({ ...m, to: result }));
  }

  onSubmit(): void {
    let payload: CreateTourPayload = {
      name: this.tourModel().name,
      description: this.tourModel().description,
      fromGeocode: this.tourModel().from,
      toGeocode: this.tourModel().to,
      profile: this.tourModel().transport_type
    }

    this.geocodeError.set(null);

    if (!this.fromCoords || !this.toCoords) {
      this.geocodeError.set('Please select a location from the suggestions for both From and To.');
      return;
    }

    this.isSubmitting.set(true);
    const selected = this.tourFacade.selectedTour();

    if (selected) {
      this.tourFacade.updateTour(selected.id, payload);
      this.tourFacade.clearSelection();
      this.router.navigate(['profile']);
    } else {
      this.tourFacade.createTour(payload);
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
