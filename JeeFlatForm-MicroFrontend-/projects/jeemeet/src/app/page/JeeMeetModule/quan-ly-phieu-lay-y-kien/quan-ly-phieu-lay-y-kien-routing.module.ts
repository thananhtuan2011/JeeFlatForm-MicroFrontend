import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuanLyPhieuLayYKienListComponent } from './quan-ly-phieu-lay-y-kien-list/quan-ly-phieu-lay-y-kien-list.component';
import { QuanLyPhieuLayYKienComponent } from './quan-ly-phieu-lay-y-kien.component';
import { QuanLyPhieuLayYKienListDialogComponent } from './quan-ly-phieu-lay-y-kien-list-dialog/quan-ly-phieu-lay-y-kien-list.component';
const routes: Routes = [
  {
    path: '',
    component: QuanLyPhieuLayYKienComponent,
    children: [
      {
        path: 'list',
        component: QuanLyPhieuLayYKienListComponent,
      },
      {
        path: ':id',
        component: QuanLyPhieuLayYKienListDialogComponent,
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
export class QuanLyPhieuLayYKienRoutingModule {}
