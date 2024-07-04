import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JeeWFComponent } from './jeewf.component';

const routes: Routes = [
  {
    path: '', component: JeeWFComponent,
    children: [
      {
        path: '',
        redirectTo: '/Workflow/CongViecTheoQuyTrinh',
        pathMatch: 'full',
      },
      {
        path: 'CongViecTheoQuyTrinh',
        loadChildren: () =>
          import('./cong-viec-theo-quy-trinh/cong-viec-theo-quy-trinh.module').then((m) => m.CongViecTheoQuyTrinhModule),
      },
      {
        path: 'NhiemVu',
        loadChildren: () =>
          import('./nhiem-vu/process-work.module').then((m) => m.ProcessWorkModule),
      },
    ]

  },

];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JeeWFRoutingModule { }
