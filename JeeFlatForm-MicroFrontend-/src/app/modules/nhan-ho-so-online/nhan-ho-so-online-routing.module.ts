import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import { NhanHoSoOnlineEditComponent } from './nhan-ho-so-online-edit/nhan-ho-so-online-edit.component';
import { NhanHoSoOnlineComponent } from './nhan-ho-so-online.component';


const routes: Routes = [
  {
    path: '',
    component: NhanHoSoOnlineComponent,
    children: [
      {
        path: 'ReceiveProfileOnline/:idkh/:id/:id_vc',
        component: NhanHoSoOnlineEditComponent
      },
      {path: '', redirectTo: '', pathMatch: 'full'},
      {path: '**', redirectTo: '', pathMatch: 'full'},
    ]
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class NhanHoSoOnlineRoutingModule {}
