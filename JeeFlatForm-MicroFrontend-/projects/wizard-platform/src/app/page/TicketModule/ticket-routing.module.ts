import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomPreloadingStrategy } from './custom-preloading';
import { TicketComponent } from './ticket.component';
import { Step1Component } from './Step1/step1.component';
import { Step2Component } from './Step2/step2.component';
import { Step3Component } from './Step3/step3.component';
import { Step4Component } from './Step4/step4.component';
const routes: Routes = [
  {
    path: '', component: TicketComponent,
    children: [
      {
        path: '',
        redirectTo: '1',
        pathMatch: 'full',
      },
      {
        path: '1', 
        component: Step1Component
      },
      {
        path: '2', 
        component: Step2Component
      },
      {
        path: '3', 
        component: Step3Component
      },
      {
        path: '4', 
        component: Step4Component
      },
    ]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TicketRoutingModule { }
