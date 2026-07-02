import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { TourFacade } from '../../facade/tour.facade';
import { Router } from '@angular/router';
import { LogFacade } from '../../facade/log-facade';

@Component({
  selector: 'app-tour-list',
  standalone: true,
  imports: [],
  templateUrl: './tour-list.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './tour-list.css',
})
export class TourList {
  private router = inject(Router);
  private readonly logFacade = inject(LogFacade);
  protected readonly tourFacade = inject(TourFacade);

  protected setQuery(str: string): void {
    this.tourFacade.setQuery(str);
  }

  protected clearQuery(): void {
    this.tourFacade.clearQuery();
  }

  protected onSelect(id: number): void {
    this.tourFacade.select(id);
    this.logFacade.setTourId(id);
    this.router.navigate(['tours']);
  }

  //TODO(felix): if we want to do a profile view we prolly need to add certain functionality for this
  protected addTour(): void {
    this.router.navigate(['add-tour']);
  }
}
