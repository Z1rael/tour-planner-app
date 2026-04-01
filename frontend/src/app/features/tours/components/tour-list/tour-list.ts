import { Component, inject } from '@angular/core';
import { TourFacade } from '../../facade/tour.facade';
import { Tour } from '../../../../mock/data/tour-mock-data';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tour-list',
  standalone: true,
  imports: [],
  templateUrl: './tour-list.html',
  styleUrl: './tour-list.css',
})
export class TourList {
  private router = inject(Router);
  protected readonly tourMediator = inject(TourFacade);

  protected readonly transportIcons: Record<string, string> = {
    hike: '🥾',
    bike: '🚲',
    running: '🏃',
    vacation: '✈️',
  };

  protected setQuery(str: string): void {
    this.tourMediator.searchQuery.set(str);
  }

  protected clearQuery(): void {
    this.tourMediator.searchQuery.set('');
  }

  protected onSelect(tour: Tour): void {
    this.tourMediator.select(tour.id);
    this.router.navigate(['/tours']);
  }

  //TODO(felix): if we want to do a profile view we prolly need to add certain functionality for this
}
