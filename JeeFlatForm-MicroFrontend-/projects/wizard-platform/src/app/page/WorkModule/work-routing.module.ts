import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomPreloadingStrategy } from './custom-preloading';
import { WorkComponent } from './work.component';
import { Step1ComponentComponent } from './step1-component/step1-component.component';
import { Step2ComponentComponent } from './step2-component/step2-component.component';
import { Step4ComponentComponent } from './step4-component/step4-component.component';
import { Step3ComponentComponent } from './step3-component/step3-component.component';
import { Step5ComponentComponent } from './step5-component/step5-component.component';

const routes: Routes = [
  {
    path: '', 
    component: WorkComponent,
    children: [
      {
        path: '',
        redirectTo: '1',
        pathMatch: 'full',
      },
      {
        path: '1',
        component:Step1ComponentComponent,
      },
      {
        path: '2',
        component:Step2ComponentComponent,
      },
      {
        path: '3',
        component:Step3ComponentComponent,
      },
      {
        path: '4',
        component:Step4ComponentComponent,
      },
      {
        path: '5',
        component:Step5ComponentComponent,
      },
    ]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkRoutingModule { }
