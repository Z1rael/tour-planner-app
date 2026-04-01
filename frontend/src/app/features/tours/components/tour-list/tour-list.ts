import { Component, inject } from '@angular/core';
import { TourFacade } from '../../facade/tour.facade';
import { Router } from '@angular/router';
import { Tour } from '../../../../core/models/tour';

@Component({
  selector: 'app-tour-list',
  standalone: true,
  imports: [],
  templateUrl: './tour-list.html',
  styleUrl: './tour-list.css',
})
export class TourList {
  private router = inject(Router);
  protected readonly tourFacade = inject(TourFacade);

  protected setQuery(str: string): void {
    this.tourFacade.setQuery(str);
  }

  protected clearQuery(): void {
    this.tourFacade.clearQuery();
  }

  protected onSelect(id: number): void {
    this.tourFacade.select(id);
    this.router.navigate(['/tours']);
  }

  //TODO(felix): if we want to do a profile view we prolly need to add certain functionality for this
}
