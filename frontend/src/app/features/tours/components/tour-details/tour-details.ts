import { Component, computed, inject } from '@angular/core';
import { TourFacade } from '../../facade/tour.facade';

@Component({
  selector: 'app-tour-details',
  standalone: true,
  imports: [],
  templateUrl: './tour-details.html',
  styleUrl: './tour-details.css',
})
export class TourDetails {
  protected readonly tourFacade = inject(TourFacade);

  protected readonly transportIcons: Record<string, string> = {
    hike: '🥾',
    bike: '🚲',
    running: '🏃',
    vacation: '✈️',
  };
}
