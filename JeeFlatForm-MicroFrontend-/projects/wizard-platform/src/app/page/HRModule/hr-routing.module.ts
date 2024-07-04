import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomPreloadingStrategy } from './custom-preloading';
import { HRComponent } from './hr.component';

const routes: Routes = [
  {
    path: '', component: HRComponent,
    children: [
      {
        path: '',
        redirectTo: '/WizardHR/Introduce',
        pathMatch: 'full',
      },
      {
        path: 'Introduce',
        loadChildren: () =>
          import('./thiet-lap-ban-dau/thiet-lap-ban-dau.module').then((m) => m.ThietLapBanDauModule),
        data: { preload: true }
      },
      {
        path: 'Department',
        loadChildren: () =>
          import('./danh-muc-phong-ban/danh-muc-phong-ban.module').then((m) => m.DanhMucPhongBanModule),
        data: { preload: true }
      },
      {
        path: 'JobTitle',
        loadChildren: () =>
          import('./danh-muc-chuc-vu/danh-muc-chuc-vu.module').then((m) => m.DanhMucChucVuModule),
        data: { preload: true }
      },
      {
        path: 'StaffType',
        loadChildren: () =>
          import('./danh-muc-loai-nhan-vien/danh-muc-loai-nhan-vien.module').then((m) => m.DanhMucLoaiNhanVienModule),
        data: { preload: true }
      },
      {
        path: 'ContractType',
        loadChildren: () =>
          import('./danh-muc-loai-hop-dong/danh-muc-loai-hop-dong.module').then((m) => m.DanhMucLoaiHopDongModule),
        data: { preload: true }
      },
      {
        path: 'Staff',
        loadChildren: () =>
          import('./danh-muc-nhan-vien/danh-muc-nhan-vien.module').then((m) => m.DanhMucNhanVienModule),
        data: { preload: true }
      },
      {
        path: 'Calendar',
        loadChildren: () =>
          import('./thiet-lap-lich-lam-viec/thiet-lap-lich-lam-viec.module').then((m) => m.ThietLapLichLamViecModule),
        data: { preload: true }
      },
      {
        path: 'Timekeeping',
        loadChildren: () =>
          import('./hinh-thuc-cham-cong/hinh-thuc-cham-cong.module').then((m) => m.HinhThucChamCongModule),
        data: { preload: true }
      },
      {
        path: 'Config',
        loadChildren: () =>
          import('./cau-hinh-cham-cong/cau-hinh-cham-cong.module').then((m) => m.CauHinhChamCongModule),
        data: { preload: true }
      },
      {
        path: 'Complete',
        loadChildren: () =>
          import('./hoan-thanh-thiet-lap/hoan-thanh-thiet-lap.module').then((m) => m.HoanhThanhThietLapModule),
        data: { preload: true }
      },
    ]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HRRoutingModule { }
