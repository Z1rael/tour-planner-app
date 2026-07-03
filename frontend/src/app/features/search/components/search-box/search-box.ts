import { Component, inject } from '@angular/core';
import { TourFacade } from '../../../tours/facade/tour.facade';
import { LogFacade } from '../../../tours/facade/log-facade';

@Component({
  selector: 'app-search-box',
  standalone: true,
  imports: [],
  templateUrl: './search-box.html',
  styleUrl: './search-box.css',
})
export class SearchBox {
  private readonly tourFacade = inject(TourFacade);
  private readonly logFacade = inject(LogFacade);

  public queryPlaceholder = '';

  protected setQuery(str: string): void {
    this.queryPlaceholder = str;
    this.tourFacade.setQuery(str);
    this.logFacade.setQuery(str);
  }

  protected clearQuery(): void {
    this.queryPlaceholder = '';
    this.tourFacade.clearQuery();
    this.logFacade.clearQuery();
  }
}
