import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JeeWorkModule } from './page/jee-work.module';

const routes: Routes = [
  // {
  //   path: 'Work/MenuWork',
  //   loadChildren: () =>
  //   import('./page/jee-work/MenuWork/menu-work.module').then((m) => m.MenuWorkModule),
  // },

];

@NgModule({
  imports: [RouterModule.forRoot(routes),
    JeeWorkModule],
  exports: [RouterModule,
    JeeWorkModule]
})
export class AppRoutingModule { }
