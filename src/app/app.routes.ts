import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { operatorsRoutes }  from './component/operators/operators.route';
import { reportsRoutes }  from './component/reports/reports.route';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/operators',
    pathMatch: 'full'
  },
  ...operatorsRoutes,
  ...reportsRoutes
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes);
