import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JeeAdminComponent } from './jeeadmin.component';
import { PermissionUrl } from './Services/permission.service';

const routes: Routes = [
  {
    path: '', 
    component: JeeAdminComponent,
    children: [
      {
        path: '',
        redirectTo: '/Admin/dang-ky-tai-san',
        pathMatch: 'full',
      },
      {
        path: 'yeucau-vpp',
        loadChildren: () =>
          import('./yeucau-vpp/yeucau-vpp.module').then((m) => m.YeuCauVPPModule),
        data: { preload: true }
      },
      {
        path: 'dang-ky-tai-san',
        loadChildren: () =>
          import('./dang-ky-phong-hop/dang-ky-phong-hop.module').then((m) => m.DangKyPhongHopModule),
        data: { preload: true }
      },
      {
        path: 'quan-ly-tai-san',
        canActivate: [PermissionUrl],
        loadChildren: () =>
          import('./quan-ly-phong-hop/quan-ly-phong-hop.module').then((m) => m.QuanLyPhongHopModule),
        data: { preload: true }
      },
    ]
  },

];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JeeAdminRoutingModule { }
