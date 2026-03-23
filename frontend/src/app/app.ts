import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './components/navbar/navbar';
import { Shell } from './components/shell/shell';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { TourList } from './components/tour-list/tour-list';
import { Map } from './components/map/map';
import { LogList } from './components/log-list/log-list';
import { LogForm } from './components/log-form/log-form';
import { TourForm } from './components/tour-form/tour-form';

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
