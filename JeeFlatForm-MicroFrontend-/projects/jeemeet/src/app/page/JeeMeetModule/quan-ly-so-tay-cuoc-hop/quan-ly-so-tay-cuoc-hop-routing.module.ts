import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuanLySoTayCuocHopListComponent } from './quan-ly-so-tay-cuoc-hop-list/quan-ly-so-tay-cuoc-hop-list.component';
import { QuanLySoTayCuocHopComponent } from './quan-ly-so-tay-cuoc-hop.component';
const routes: Routes = [
  {
    path: '',
    component: QuanLySoTayCuocHopComponent,
    children: [
      {
        path: 'list',
        component: QuanLySoTayCuocHopListComponent,
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
export class QuanLySoTayCuocHopRoutingModule {}
