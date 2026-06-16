import { Component, computed, inject, input, signal } from '@angular/core';
import { TourLogApiResponse } from '../../services/tour-log.service';
import { DatePipe } from '@angular/common';
import { LogFacade } from '../../facade/log-facade';
import { Router } from '@angular/router';

@Component({
  selector: 'app-log-list-item',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './log-list-item.html',
  styleUrl: './log-list-item.css',
})
export class LogListItem {
  readonly log = input.required<TourLogApiResponse>();
  protected readonly expanded = signal(false);
  private readonly logFacade = inject(LogFacade);
  private readonly router = inject(Router);

  logId = computed(() => this.log().logId);

  toggle(): void {
    this.expanded.update((visible) => !visible);
  }

  readonly daysSinceCreated = computed(() => {
    const created = new Date(this.log().logDate);
    const today = new Date();
    const diffMs = today.getTime() - created.getTime();
    return Math.floor(diffMs / (1000 * 60 * 60 * 24));
  });

  readonly timeAgoLabel = computed(() => {
    const days = this.daysSinceCreated();
    if (0 === days) return 'Today';
    if (1 === days) return 'Yesterday';
    return `${days} days ago`;
  });

  editLog(): void {
    this.router.navigate(['add-tour-log']);
  }

  deleteLog(): void {
    const id = this.logFacade.selectedLog()?.logId;
    if (id) {
      this.logFacade.deleteLog(id);
    }
  }
}
