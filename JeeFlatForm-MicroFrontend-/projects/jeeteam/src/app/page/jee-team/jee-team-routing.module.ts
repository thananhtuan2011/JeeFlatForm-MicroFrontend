import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JeeteamComponent } from './jeeteam/jeeteam.component';
import { WelcomComponent } from './jeeteam/welcom/welcom.component';
import { PhanQuyenComponent } from './jeeteam/phan-quyen/phan-quyen.component';
import { LoadHeaderBodyComponent } from './jeeteam/header_body/load-header_body.component';
import { LoadTailieuGroupComponent } from './jeeteam/load-tailieu-group/load-tailieu-group.component';
import { LoadThaoluanComponent } from './jeeteam/load-thaoluan/load-thaoluan.component';
import { LoadThanhVienComponent } from './jeeteam/load-thanh-vien/load-thanh-vien.component';
import { LoadJeeteamComponent } from './jeeteam/load-jeeteam/load-jeeteam.component';

// const routes: Routes = [{
//   path: '',
//   component: JeeteamComponent,

// }];
const routes: Routes = [

  {
    path: '',
    component: JeeteamComponent,
    children: [
      {
        path: '',
        component: WelcomComponent,
      },
      { path: 'phanquyen', component: PhanQuyenComponent, },
      {
        path: 'team/:idmenu',
        component: LoadJeeteamComponent,

        children: [
          {
            path: 'chanel/private/:idsub/:idchildmenu',
            component: LoadHeaderBodyComponent,


            children: [

              {
                path: 'tailieu',
                component: LoadTailieuGroupComponent,
              },
              {
                path: 'thaoluan',
                component: LoadThaoluanComponent,
              },
              {
                path: 'thanhvien',
                component: LoadThanhVienComponent,
              },
              {
                path: '',
                redirectTo: 'thaoluan',
                pathMatch: 'full',
              },

            ]


          },
          {
            path: 'chanel/:id',
            component: LoadHeaderBodyComponent,
            children: [

              {
                path: 'tailieu',
                component: LoadTailieuGroupComponent,
              },
              {
                path: 'thaoluan',
                component: LoadThaoluanComponent,

              },

              {
                path: 'thanhvien',
                component: LoadThanhVienComponent,
              },
              {
                path: '',
                redirectTo: 'thaoluan',
                pathMatch: 'full',
              },

            ]

          },


        ],

      },
    ],

  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JeeTeamRoutingModule { }
