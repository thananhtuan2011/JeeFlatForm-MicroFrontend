import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChiTietCuocHopComponent } from './components/chi-tiet-cuoc-hop/chi-tiet-cuoc-hop.component';
import { DangKyCuocHopPageComponent } from './components/dang-ky-cuoc-hop-page/dang-ky-cuoc-hop-page.component';
import { DangKyTaiSanComponent } from './components/dang-ky-tai-san/dang-ky-tai-san.component';
import { MenuCuocHopComponent } from './components/menu-cuoc-hop/menu-cuoc-hop.component';


const routes: Routes = [
  {
    path: '',
    component: MenuCuocHopComponent,
    children: [
        {
          path: ':id',
          component: ChiTietCuocHopComponent
        },
        {
          path: 'create/:id',
          component: DangKyCuocHopPageComponent,
          data : {data : 'create'}
        },
        {
          path: 'edit/:id',
          component: DangKyCuocHopPageComponent,
          data : {data : 'create'}
        },
        {
          path: 'dang-ky-tai-san/:id',
          component: DangKyTaiSanComponent,
          data : {data : 'create'}
        }
    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JeeMeetingRoutingModule { }
