import { Component, inject } from '@angular/core';
import { TourFacade } from '../../facade/tour.facade';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tour-details',
  standalone: true,
  imports: [],
  templateUrl: './tour-details.html',
  styleUrl: './tour-details.css',
})
export class TourDetails {
  protected readonly tourFacade = inject(TourFacade);
  private router = inject(Router);
  return(): void {
    this.tourFacade.clearSelection();
    this.router.navigate(['profile']);
  }

  editTour(): void {
    this.router.navigate(['add-tour']);
    // need to implement this
  }
}
