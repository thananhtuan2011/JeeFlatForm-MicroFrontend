import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WizardDashboardModule } from './page/DashboardModule/dashboard.module';
import { WizardHRModule } from './page/HRModule/hr.module';
import { WizardWorkModule } from './page/WorkModule/work.module';
import { WizardTicketModule } from './page/TicketModule/ticket.module';
import { WizardSaleModule } from './page/SaleModule/sale.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    WizardDashboardModule,
    WizardHRModule,
    WizardWorkModule,
    WizardTicketModule,
    WizardSaleModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
