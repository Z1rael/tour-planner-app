import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './navbar/navbar';
import { Shell } from './shell/shell';
import { Login } from './login/login';
import { Register } from './register/register';
import { TourList } from './tour-list/tour-list';
import { Map } from './map/map';
import { LogList } from './log-list/log-list';
import { LogForm } from './log-form/log-form';
import { TourForm } from './tour-form/tour-form';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Navbar, Shell, Login, Register, TourList, Map, LogList, LogForm, TourForm],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('tour-planner-ui');
}
