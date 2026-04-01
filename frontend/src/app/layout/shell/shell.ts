import { Component } from '@angular/core';
import { LogList } from '../../features/logs/components/log-list/log-list';
import { Login } from '../../features/user/components/login/login';
import { Register } from '../../features/user/components/register/register';
import { TourList } from '../../features/tours/components/tour-list/tour-list';
import { Map } from '../../features/map/components/map/map';
import { TourDetails } from '../../features/tours/components/tour-details/tour-details';
import { ActivatedRoute } from '@angular/router';
import { TourForm } from '../../features/tours/components/tour-form/tour-form';
import { LogForm } from '../../features/logs/components/log-form/log-form';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [LogList, Login, Register, TourList, Map, TourDetails, TourForm, LogForm],
  templateUrl: './shell.html',
  styleUrl: './shell.css',
})
export class Shell {
  currentView: string = '';

  constructor(private route: ActivatedRoute) {
    this.route.data.subscribe((data) => {
      this.currentView = data['view'];
    });
  }
}
