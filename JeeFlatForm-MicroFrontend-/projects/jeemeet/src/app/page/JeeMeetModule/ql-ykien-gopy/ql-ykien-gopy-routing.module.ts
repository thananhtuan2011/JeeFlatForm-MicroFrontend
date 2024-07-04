import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuanLyYKienGopYListComponent } from './ql-ykien-gopy-list/ql-ykien-gopy-list.component';
import { QuanLyYKienGopYComponent } from './ql-ykien-gopy.component';


const routes: Routes = [
  {
    path: '',
    component:QuanLyYKienGopYComponent,
    children: [
      {
        path: 'list',
        component:QuanLyYKienGopYListComponent,
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
export class QuanLyYKienGopYRoutingModule {}
