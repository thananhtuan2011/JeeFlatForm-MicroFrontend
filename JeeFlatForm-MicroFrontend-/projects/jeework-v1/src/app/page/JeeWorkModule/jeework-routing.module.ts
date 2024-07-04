import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JeeWorkComponent } from './jeework.component';

const routes: Routes = [
  {
    path: '', component: JeeWorkComponent,
    children: [
      {
        path: '',
        redirectTo: '/Work/CongViecTheoDuAn',
        pathMatch: 'full',
      },
      {
        path: 'CongViecTheoDuAn',
        loadChildren: () =>
          import('./cong-viec-theo-du-an/cong-viec-theo-du-an.module').then((m) => m.CongViecTheoDuAnModule),
      },
      {
        path: 'BaoCao',
        loadChildren: () =>
          import('./bao-cao/bao-cao.module').then((m) => m.BaoCaoModule),
      },
    ]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JeeWorkRoutingModule { }
