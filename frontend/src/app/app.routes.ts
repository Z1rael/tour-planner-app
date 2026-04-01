import { Routes } from '@angular/router';
import { Shell } from './layout/shell/shell';
import { Login } from './features/user/components/login/login';
import { Register } from './features/user/components/register/register';
import { TourList } from './features/tours/components/tour-list/tour-list';
import { Map } from './features/map/components/map/map';
import { LogList } from './features/logs/components/log-list/log-list';
import { TourDetails } from './features/tours/components/tour-details/tour-details';

export const routes: Routes = [
  { path: '', component: Shell, data: { view: 'login' } },
  { path: 'login', component: Shell, data: { view: 'login' } },
  { path: 'register', component: Shell, data: { view: 'register' } },
  { path: 'profile', component: Shell, data: { view: 'profile' } },
  { path: 'tours', component: Shell, data: { view: 'tours' } },
  { path: 'add-tour-log', component: Shell, data: { view: 'add-tour-log' } },
  { path: 'add-tour', component: Shell, data: { view: 'add-tour' } },
  { path: '**', redirectTo: '' },
];
