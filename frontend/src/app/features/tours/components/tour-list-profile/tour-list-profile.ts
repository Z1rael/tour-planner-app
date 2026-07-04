import { Component, inject, ChangeDetectionStrategy, input, effect } from '@angular/core';
import { TourFacade } from '../../facade/tour.facade';
import { Router } from '@angular/router';
import { LogFacade } from '../../facade/log-facade';
import { TourExportService } from '../../services/tour-export-service';
import { Dialog } from '@angular/cdk/dialog';
import { TourSummary } from '../../models/tour/tour-summary';
import { TourSummaryResponse } from '../../models/tour/tour-summary-response';
import { TourImport } from '../tour-import/tour-import';

@Component({
  selector: 'app-tour-list-profile',
  standalone: true,
  imports: [],
  templateUrl: './tour-list-profile.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './tour-list-profile.css',
})
export class TourListProfile {
  private router = inject(Router);
  private readonly logFacade = inject(LogFacade);
  protected readonly tourFacade = inject(TourFacade);
  private readonly exportTourService = inject(TourExportService);
  private dialog = inject(Dialog);

  openImportModal() {
    const dialogRef = this.dialog.open<TourSummaryResponse[]>(TourImport);

    dialogRef.closed.subscribe((imported) => {
      if (imported?.length) {
        console.log('Looks Cool :D');
      }
    });
  }

  protected setQuery(str: string): void {
    this.tourFacade.setQuery(str);
  }

  protected clearQuery(): void {
    this.tourFacade.clearQuery();
  }

  protected onSelect(id: number): void {
    this.tourFacade.select(id);
    this.logFacade.setTourId(id);
    this.router.navigate(['tour-details']);
  }

  //TODO(felix): if we want to do a profile view we prolly need to add certain functionality for this
  protected addTour(): void {
    this.router.navigate(['add-tour']);
  }

  protected exportTours(): void {
    this.exportTourService.exportAll()
  }

  protected importTours(): void {
    this.router.navigate
  }
}
