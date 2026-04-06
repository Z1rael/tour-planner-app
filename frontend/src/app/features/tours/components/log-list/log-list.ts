import { Component, inject } from '@angular/core';
import { TourFacade } from '../../facade/tour.facade';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { LogListItem } from '../log-list-item/log-list-item';

@Component({
  selector: 'app-log-list',
  standalone: true,
  imports: [LogListItem],
  templateUrl: './log-list.html',
  styleUrl: './log-list.css',
})
export class LogList {
  private router = inject(Router);
  protected readonly tourFacade = inject(TourFacade);

  protected addLog(): void {
    this.router.navigate(['add-log']);
  }

  toggle(): void {}
}
