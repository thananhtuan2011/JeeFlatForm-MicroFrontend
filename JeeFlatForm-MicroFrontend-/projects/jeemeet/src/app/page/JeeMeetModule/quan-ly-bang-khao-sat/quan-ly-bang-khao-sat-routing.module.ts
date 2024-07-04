import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuanLyBangKhaoSatListComponent } from './quan-ly-bang-khao-sat-list/quan-ly-bang-khao-sat-list.component';
import { QuanLyBangKhaoSatComponent } from './quan-ly-bang-khao-sat.component';
const routes: Routes = [
  {
    path: '',
    component: QuanLyBangKhaoSatComponent,
    children: [
      {
        path: '',
        component: QuanLyBangKhaoSatListComponent,
      },
      {
        path: 'type/:type',
        component: QuanLyBangKhaoSatListComponent,
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
export class QuanLyBangKhaoSatRoutingModule {}
