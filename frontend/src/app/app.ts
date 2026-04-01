import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './shared/components/navbar/navbar';
import { Shell } from './layout/shell/shell';
import { Login } from './features/user/components/login/login';
import { Register } from './features/user/components/register/register';
import { TourList } from './features/tours/components/tour-list/tour-list';
import { Map } from './features/map/components/map/map';
import { LogList } from './features/logs/components/log-list/log-list';
import { LogForm } from './features/logs/components/log-form/log-form';
import { TourForm } from './features/tours/components/tour-form/tour-form';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    Navbar,
    Shell,
    Login,
    Register,
    TourList,
    Map,
    LogList,
    LogForm,
    TourForm,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('tour-planner-ui');
}
