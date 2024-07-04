import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomPreloadingStrategy } from './custom-preloading';
import { SaleComponent } from './sale.component';

const routes: Routes = [
  {
    path: '', component: SaleComponent,
    children: [
      {
        path: '',
        redirectTo: '/WizardSale/Introduce',
        pathMatch: 'full',
      },
      {
        path: 'Introduce',
        loadChildren: () =>
          import('./thiet-lap-ban-dau/thiet-lap-ban-dau.module').then((m) => m.ThietLapBanDauModule),
        data: { preload: true }
      },
      {
        path: 'Store',
        loadChildren: () =>
          import('./danh-muc-chi-nhanh/danh-muc-chi-nhanh.module').then((m) => m.DanhMucChiNhanhModule),
        data: { preload: true }
      },
      {
        path: 'Depot',
        loadChildren: () =>
          import('./danh-muc-kho/danh-muc-kho.module').then((m) => m.DanhMucKhoModule),
        data: { preload: true }
      },
      {
        path: 'Supplier',
        loadChildren: () =>
          import('./danh-muc-ncc/danh-muc-ncc.module').then((m) => m.DanhMucNCCModule),
        data: { preload: true }
      },
      {
        path: 'GroupItems',
        loadChildren: () =>
          import('./danh-muc-nhom-hang/danh-muc-nhom-hang.module').then((m) => m.DanhMucNhomHangModule),
        data: { preload: true }
      },
      {
        path: 'Unit',
        loadChildren: () =>
          import('./danh-muc-dvt/danh-muc-dvt.module').then((m) => m.DanhMucDVTModule),
        data: { preload: true }
      },
      {
        path: 'Items',
        loadChildren: () =>
          import('./danh-muc-hang/danh-muc-hang.module').then((m) => m.DanhMucHangModule),
        data: { preload: true }
      },
      {
        path: 'GroupCustomer',
        loadChildren: () =>
          import('./danh-muc-nhom-khach/danh-muc-nhom-khach.module').then((m) => m.DanhMucNhomKhachModule),
        data: { preload: true }
      },
      {
        path: 'Customer',
        loadChildren: () =>
          import('./danh-muc-khach/danh-muc-khach.module').then((m) => m.DanhMucKhachModule),
        data: { preload: true }
      },
      // {
      //   path: 'Complete',
      //   loadChildren: () =>
      //     import('./hoan-thanh-thiet-lap/hoan-thanh-thiet-lap.module').then((m) => m.HoanhThanhThietLapModule),
      //   data: { preload: true }
      // },
    ]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SaleRoutingModule { }
