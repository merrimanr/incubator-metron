import {Routes, RouterModule} from '@angular/router';
import {ModuleWithProviders}  from '@angular/core';

import {AlertsListComponent} from './alerts-list.component';

export const routes:Routes = [
    {path: 'alerts-list', component: AlertsListComponent},
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);

