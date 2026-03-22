import { Routes } from '@angular/router';
import { Shell } from './shell/shell';  
import { Login } from './login/login';
import { Register } from './register/register';
import { TourList } from './tour-list/tour-list';
import { Map } from './map/map';
import { LogList } from './log-list/log-list';
import { TourDetails } from './tour-details/tour-details';

export const routes: Routes = [
    {path: '', component: Shell, data: { view: 'login' } },
    { path: 'login', component: Shell, data: { view: 'login' } },
    { path: 'register', component: Shell, data: { view: 'register' } },
    { path: 'profile', component: Shell, data: { view: 'profile' } },
    { path: 'tours', component: Shell, data: { view: 'tours' } },
    { path: 'add-tour-log', component: Shell, data: { view: 'add-tour-log' } },
    { path: 'add-tour', component: Shell, data: { view: 'add-tour' } },
    { path: '**', redirectTo: '' }
];