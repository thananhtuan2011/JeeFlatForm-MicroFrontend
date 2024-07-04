import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import { NhapHoSoOnlineComponent } from './nhap-ho-so-online.component';


const routes: Routes = [
  {
    path: '',
    component: NhapHoSoOnlineComponent,
    children: [
      {
        path: '',
        redirectTo: '',
        pathMatch: 'full'
      },
      {
        path: ':token',
        component: NhapHoSoOnlineComponent
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
export class NhapHoSoOnlineRoutingModule {}
