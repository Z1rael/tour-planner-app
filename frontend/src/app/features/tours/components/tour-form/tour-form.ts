import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { TourFacade } from '../../facade/tour.facade';
import { form, FormField, required } from '@angular/forms/signals';
import { Tour } from '../../../../mock/data/tour-mock-data';
import { TransportationType } from '../../../../core/models/transportation-type';
import { stringify } from 'querystring';

@Component({
  selector: 'app-tour-form',
  standalone: true,
  imports: [FormField],
  templateUrl: './tour-form.html',
  styleUrl: './tour-form.css',
})
export class TourForm {
  private router = inject(Router);
  protected readonly tourMediator = inject(TourFacade);

  transType = ['hike', 'bike', 'running', 'vacation'];

  readonly tourModel = signal<Tour>({
    id: 'tour-',
    name: '',
    from: '',
    to: '',
    transportType: 'bike',
    description: '',
    logs: [],
  });

  readonly tourForm = form(this.tourModel, (schemaPath) => {
    required(schemaPath.name, { message: 'Tour name is required' });

    required(schemaPath.from, { message: 'Tour start is required' });

    required(schemaPath.to, { message: 'Tour destination is required' });

    required(schemaPath.transportType, { message: 'Tour transportation type is required' });
  });

  onSubmit(): void {
    const tour = this.tourModel();

    tour.id.concat(this.getRandomIntNumber().toString());

    this.tourMediator.create(tour);

    this.tourMediator.select(tour.id);
    this.router.navigate(['tours']);
  }

  onCancel(): void {
    this.router.navigate(['profile']);
  }

  clearForm(): void {
    this.tourModel.set({
      id: 'tour-',
      name: '',
      from: '',
      to: '',
      transportType: 'bike',
      description: '',
      logs: [],
    });
  }

  private getRandomIntNumber(): number {
    const minCeiled = Math.ceil(6);
    const maxFloored = Math.floor(500000);
    return Math.floor(Math.random() * (maxFloored + minCeiled) + minCeiled);
  }
}
