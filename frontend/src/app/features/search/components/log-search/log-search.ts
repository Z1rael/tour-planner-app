import { Component, inject, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { LogFacade } from '../../../tours/facade/log-facade';
import { TourFacade } from '../../../tours/facade/tour.facade';
import { LogListItem } from '../../../tours/components/log-list-item/log-list-item';

@Component({
  selector: 'app-log-search',
  standalone: true,
  imports: [LogListItem],
  templateUrl: './log-search.html',
  styleUrl: './log-search.css',
})
export class LogSearch {
  private router = inject(Router);
  protected readonly logFacade = inject(LogFacade);
  private readonly tourFacade = inject(TourFacade);

  protected onSelect(logId: number, tourId: number) {
    //still need to find out what i need to do here
  }

  selectLog(id: number): void {
    if (this.logFacade.selectedLogId() === null) {
      this.logFacade.selectLog(id);
    } else {
      this.logFacade.clearLogSelection();
    }
  }

}
