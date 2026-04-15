import { Component, inject } from '@angular/core';
import { TourFacade } from '../../facade/tour.facade';
import { Router } from '@angular/router';
import { LogFacade } from '../../facade/log-facade';

@Component({
  selector: 'app-tour-details',
  standalone: true,
  imports: [],
  templateUrl: './tour-details.html',
  styleUrl: './tour-details.css',
})
export class TourDetails {
  private router = inject(Router);
  private readonly logFacade = inject(LogFacade);
  protected readonly tourFacade = inject(TourFacade);

  readonly tour = this.tourFacade.selectedTour;

  return(): void {
    this.tourFacade.clearSelection();
    this.logFacade.clearTourId();
    this.router.navigate(['profile']);
  }

  editTour(): void {
    this.router.navigate(['add-tour']);
  }

  deleteTour(): void {
    const id = this.tour()?.id;
    if (id !== undefined) {
      this.tourFacade.deleteTour(id);
      this.tourFacade.clearSelection();
      this.router.navigate(['profile']);
    }
  }
}
