import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LichHopDonViComponent } from './lich-hop-don-vi.component';
import { LichHopDonViPageComponent } from './components/lich-hop-don-vi-page.component';
const routes: Routes = [
  {
    path: '',
    component: LichHopDonViComponent,
    children: [
      {
        path: '',
        component: LichHopDonViPageComponent,
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
export class LichHopDonViRoutingModule {}
