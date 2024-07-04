import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuanLyCauHoiKhaoSatListComponent } from './quan-ly-cau-hoi-khao-sat-list/quan-ly-cau-hoi-khao-sat-list.component';
import { QuanLyCauHoiKhaoSatComponent } from './quan-ly-cau-hoi-khao-sat.component';
const routes: Routes = [
  {
    path: '',
    component: QuanLyCauHoiKhaoSatComponent,
    children: [
      {
        path: 'list',
        component: QuanLyCauHoiKhaoSatListComponent,
      },
      { path: '', redirectTo: 'list', pathMatch: 'full' },
      { path: '**', redirectTo: 'list', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuanLyCauHoiKhaoSatRoutingModule {}
