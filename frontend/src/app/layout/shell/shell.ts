import {
  Component,
  HostListener,
  inject,
  PLATFORM_ID,
  signal,
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
import { TourFacade } from '../../features/tours/facade/tour.facade';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [LogList, Login, Register, TourList, Map, TourDetails, TourForm, LogForm],
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
