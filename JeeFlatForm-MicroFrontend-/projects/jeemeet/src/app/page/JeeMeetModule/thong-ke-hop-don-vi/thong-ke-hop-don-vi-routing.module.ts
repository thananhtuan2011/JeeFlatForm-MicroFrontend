import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ThongKeHopDonViComponent } from './thong-ke-hop-don-vi.component';
import { ThongKeHopDonViPageComponent } from './components/thong-ke-hop-don-vi-page/thong-ke-hop-don-vi-page.component';
const routes: Routes = [
  {
    path: '',
    component: ThongKeHopDonViComponent,
    children: [
      {
        path: '',
        component: ThongKeHopDonViPageComponent,
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
export class ThongKeHopDonViRoutingModule { }
