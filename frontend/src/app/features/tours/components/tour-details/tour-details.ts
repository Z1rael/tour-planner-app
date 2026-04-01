import { Component, computed, inject } from '@angular/core';
import { TourFacade } from '../../facade/tour.facade';
import { Tour } from '../../../../mock/data/tour-mock-data';

@Component({
  selector: 'app-tour-details',
  standalone: true,
  imports: [],
  templateUrl: './tour-details.html',
  styleUrl: './tour-details.css',
})
export class TourDetails {
  protected readonly tourMediator = inject(TourFacade);
  readonly selectedTour: Tour | null;

  constructor() {
    this.selectedTour = this.tourMediator.selected();
  }

  readonly popularity = computed(() => {
    let popularity = 0;
    let sum = 0;
    let count = 0;
    if (this.selectedTour?.logs)
      for (const log of this.selectedTour.logs) {
        sum += log.rating;
        count++;
      }
    if (count > 0) {
      popularity = sum / count;
    }
    return popularity;
  });

  protected readonly transportIcons: Record<string, string> = {
    hike: '🥾',
    bike: '🚲',
    running: '🏃',
    vacation: '✈️',
  };
}
