import { Component, inject, ChangeDetectionStrategy, effect } from '@angular/core';
import { Router } from '@angular/router';
import { LogListItem } from '../log-list-item/log-list-item';
import { LogFacade } from '../../facade/log-facade';

@Component({
  selector: 'app-log-list',
  standalone: true,
  imports: [LogListItem],
  templateUrl: './log-list.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './log-list.css',
})
export class LogList {
  private router = inject(Router);
  protected readonly logFacade = inject(LogFacade);

  protected addLog(): void {
    this.router.navigate(['add-tour-log']);
  }

  canAddLog(): boolean {
    return this.logFacade.tourId() === null;
  }

  edit(id: number): void {
    this.logFacade.selectLog(id);
    this.router.navigate(['add-tour-log']);
  }

  selectLog(id: number): void {
    if (this.logFacade.selectedLogId() === null) {
      this.logFacade.selectLog(id);
    } else {
      this.logFacade.clearLogSelection();
    }
  }
}
