import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './modules/auth/services/auth.guard';
import { CustomPreloadingStrategy } from './pages/custom-preloading';
import { approuting } from './app-routing';

// export const routes: Routes = [
//   {
//     path: 'auth',
//     loadChildren: () =>
//       import('./modules/auth/auth.module').then((m) => m.AuthModule),
//   },
//   {
//     path: 'error',
//     loadChildren: () =>
//       import('./modules/errors/errors.module').then((m) => m.ErrorsModule),
//   },
//   {
//     path: '',
//     canActivate: [AuthGuard],
//     loadChildren: () =>
//       import('./_metronic/layout/layout.module').then((m) => m.LayoutModule),
//   },
//   {
//     path: 'auxWork',
//     outlet: 'auxName',
//     loadChildren: () => import('jeework/AuxWork').then(mod => mod.AuxiliaryWorkRouterModule),
//     data: { preload: true }
//   },
//   {
//     path: 'auxWorkV1',
//     outlet: 'auxNameV1',
//     loadChildren: () => import('jeeworkv1/AuxWorkV1').then(mod => mod.AuxiliaryWorkV1RouterModule),
//     data: { preload: true }
//   },
//   { path: '**', redirectTo: 'error/404' },
// ];

@NgModule({
  imports: [RouterModule.forRoot(approuting, { preloadingStrategy: CustomPreloadingStrategy })],
  exports: [RouterModule],
  providers: [CustomPreloadingStrategy],
})
export class AppRoutingModule { }
