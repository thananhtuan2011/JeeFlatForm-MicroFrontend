import { Routes } from '@angular/router';
import { AuthGuard } from './modules/auth/services/auth.guard';

const approuting: Routes = [
  {
    path: 'auth',
    loadChildren: () =>
      import('./modules/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'error',
    loadChildren: () =>
      import('./modules/errors/errors.module').then((m) => m.ErrorsModule),
  },
  {
    path: '',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./_metronic/layout/layout.module').then((m) => m.LayoutModule),
  },
  {
    path: 'auxWork',
    outlet: 'auxName',
    loadChildren: () => import('jeework/AuxWork').then(mod => mod.AuxiliaryWorkRouterModule),
    data: { preload: true }
  },
  { path: '**', redirectTo: 'error/404' },
];

export { approuting };

