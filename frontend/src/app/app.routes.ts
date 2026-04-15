import { Routes } from '@angular/router';
import { Shell } from './layout/shell/shell';

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
