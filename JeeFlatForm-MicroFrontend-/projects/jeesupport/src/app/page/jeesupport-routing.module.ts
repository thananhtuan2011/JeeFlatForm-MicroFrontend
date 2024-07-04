import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChiTietHoTroComponent } from './chi-tiet-ho-tro/chi-tiet-ho-tro.component';
import { DanhSachHoTroComponent } from './danh-sach-ho-tro/danh-sach-ho-tro.component';

const routes: Routes = [
  {
    path: '',
    component: DanhSachHoTroComponent,
    children: [
        {
          path: ':id',
          component: ChiTietHoTroComponent
        },
    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JeeSupportRoutingModule { }
