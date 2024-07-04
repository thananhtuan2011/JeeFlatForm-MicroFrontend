import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JeeHRComponent } from './jeehr.component';
import { CustomPreloadingStrategy } from './custom-preloading';

const routes: Routes = [
  {
    path: '', component: JeeHRComponent,
    children: [
      {
        path: '',
        redirectTo: '/HR/DonTu',
        pathMatch: 'full',
      },
      {
        path: 'DonTu',
        loadChildren: () =>
          import('./don-tu/don-tu.module').then((m) => m.DonTuModule),
      },
      {
        path: 'BangCong',
        loadChildren: () =>
          import('./bang-cong/bang-cong.module').then((m) => m.BangCongModule),
          data: { preload: true }
      },
      {
        path: 'PhieuLuong',
        loadChildren: () =>
          import('./phieu-luong/phieu-luong.module').then((m) => m.PhieuLuongModule),
          data: { preload: true }
      },
      {
        path: 'PhepNhanVien',
        loadChildren: () =>
          import('./phep-nhan-vien/phep-nhan-vien.module').then((m) => m.PhepNhanVienModule),
          data: { preload: true }
      },
      {
        path: 'SoDoToChuc',
        loadChildren: () =>
          import('./so-do-to-chuc/so-do-to-chuc.module').then((m) => m.SoDoToChucModule),
          data: { preload: true }
      },
      {
        path: 'XepCaLamViec',
        loadChildren: () =>
          import('./xep-ca-lam-viec/xep-ca-lam-viec.module').then((m) => m.XepCaLamViecModule),
          data: { preload: true }
      },
    ]

  },

];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JeeHRRoutingModule { }
