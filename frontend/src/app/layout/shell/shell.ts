import {
  Component,
  inject,
  PLATFORM_ID,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Login } from '../../features/user/components/login/login';
import { Register } from '../../features/user/components/register/register';
import { TourList } from '../../features/tours/components/tour-list/tour-list';
import { Map } from '../../features/map/components/map/map';
import { TourDetails } from '../../features/tours/components/tour-details/tour-details';
import { ActivatedRoute } from '@angular/router';
import { TourForm } from '../../features/tours/components/tour-form/tour-form';
import { LogForm } from '../../features/tours/components/log-form/log-form';
import { LogList } from '../../features/tours/components/log-list/log-list';
import { isPlatformBrowser } from '@angular/common';
import { SearchBox } from '../../features/search/components/search-box/search-box';
import { TourSearch } from '../../features/search/components/tour-search/tour-search';
import { LogSearch } from '../../features/search/components/log-search/log-search';
import { TourListProfile } from '../../features/tours/components/tour-list-profile/tour-list-profile';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [LogList, Login, Register, TourList, TourListProfile, Map, TourDetails, TourForm, LogForm, SearchBox, TourSearch, LogSearch],
  templateUrl: './shell.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './shell.css',
})
export class Shell {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  currentView: string = '';

  constructor(private route: ActivatedRoute) {
    this.route.data.subscribe((data) => {
      this.currentView = data['view'];
    });
  }
}
