import { Component, inject } from '@angular/core';
import { TourFacade } from '../../facade/tour.facade';
import { Tour } from '../../../../mock/data/tour-mock-data';
import { FormsModule, NgModel } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tour-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tour-list.html',
  styleUrl: './tour-list.css',
})
export class TourList {
  protected readonly mediator = inject(TourFacade);

  protected readonly transportIcons: Record<string, string> = {
    hike: '🥾',
    bike: '🚲',
    running: '🏃',
    vacation: '✈️',
  };

  protected setQuery(str: string): void {
    this.mediator.searchQuery.set(str);
  }

  protected clearQuery(): void {
    this.mediator.searchQuery.set('');
  }

  protected onSelect(tour: Tour): void {
    this.mediator.select(tour.id);
  }
}
