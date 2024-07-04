import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  // {
  //   path: 'Admin/yeucau-vpp',
  //   loadChildren: () =>
  //   import('./page/JeeAdminModule/yeucau-vpp/yeucau-vpp.module').then((m) => m.YeuCauVPPModule),
  // },
  // {
  //   path: 'Admin/dang-ky-tai-san',
  //   loadChildren: () =>
  //   import('./page/JeeAdminModule/dang-ky-phong-hop/dang-ky-phong-hop.module').then((m) => m.DangKyPhongHopModule),
  // },
  // {
  //   path: 'Admin/quan-ly-tai-san',
  //   loadChildren: () =>
  //   import('./page/JeeAdminModule/quan-ly-phong-hop/quan-ly-phong-hop.module').then((m) => m.QuanLyPhongHopModule),
  // },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
