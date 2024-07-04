import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuanLyNhomCuocHopListComponent } from './quan-ly-nhom-cuoc-hop-list/quan-ly-nhom-cuoc-hop-list.component';
import { QuanLyNhomCuocHopComponent } from './quan-ly-nhom-cuoc-hop.component';
const routes: Routes = [
  {
    path: '',
    component: QuanLyNhomCuocHopComponent,
    children: [
      {
        path: 'list',
        component: QuanLyNhomCuocHopListComponent,
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
export class QuanLyNhomCuocHopRoutingModule {}
