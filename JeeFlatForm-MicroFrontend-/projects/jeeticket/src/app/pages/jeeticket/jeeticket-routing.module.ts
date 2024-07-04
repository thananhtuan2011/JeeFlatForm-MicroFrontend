import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChiTietTicketComponent } from './chi-tiet-ticket/chi-tiet-ticketcomponent'; 
import { DanhSachTicketComponent } from './danh-sach-ticket/danh-sach-ticket.component';
import { AddTicketPopupComponent } from './add-ticket-popup/add-ticket-popup.component';

const routes: Routes = [
  {
    path: '',
    component: DanhSachTicketComponent,
    children: [
        {
          path: ':id',
          component: ChiTietTicketComponent
        },
        
    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JeeSupportRoutingModule { }
