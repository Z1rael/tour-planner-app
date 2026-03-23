import { Component } from '@angular/core';
import { LogList } from '../log-list/log-list';
import { Login } from '../login/login';
import { Register } from '../register/register';
import { TourList } from '../tour-list/tour-list';
import { Map } from '../map/map';
import { TourDetails } from '../tour-details/tour-details';
import { TourForm } from "../tour-form/tour-form";
import { LogForm } from '../log-form/log-form';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-shell',
  imports: [LogList, Login, Register, TourList, Map, TourDetails, TourForm, LogForm],
  templateUrl: './shell.html',
  styleUrl: './shell.css',
})

export class Shell {
  currentView: string = '';

  constructor(private route: ActivatedRoute) {
    this.route.data.subscribe(data => {
      this.currentView = data['view'];
    });
  }
}
