import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChiTietYeuCauComponent } from './chi-tiet-yeu-cau/chi-tiet-yeu-cau/chi-tiet-yeu-cau.component';
import { NoiDungYeuCauComponent } from './chi-tiet-yeu-cau/noi-dung-yeu-cau/noi-dung-yeu-cau.component';

const routes: Routes = [
  {
    path: '',
    component: ChiTietYeuCauComponent,
    children: [
        {
            path: ':id',
            component: NoiDungYeuCauComponent
        },
    ]
}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JeeRequestRoutingModule { }
