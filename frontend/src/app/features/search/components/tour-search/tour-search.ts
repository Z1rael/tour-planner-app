import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { LogFacade } from '../../../tours/facade/log-facade';
import { TourFacade } from '../../../tours/facade/tour.facade';

@Component({
  selector: 'app-tour-search',
  standalone: true,
  imports: [],
  templateUrl: './tour-search.html',
  styleUrl: './tour-search.css',
})
export class TourSearch {
  private router = inject(Router);
  protected readonly tourFacade = inject(TourFacade);
  private readonly logFacade = inject(LogFacade);

  protected onSelect(id: number): void {
    this.tourFacade.select(id);
    this.logFacade.setTourId(id);

    this.router.navigate(['tours']);
  }
}
