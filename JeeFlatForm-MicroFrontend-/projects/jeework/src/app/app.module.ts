import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CollapseModule } from 'ngx-bootstrap/collapse';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { JeeWorkModule } from './page/jee-work.module';
import { MenuWorkModule } from './page/jee-work/MenuWork/menu-work.module';
import { AuxiliaryWorkRouterModule } from './page/jee-work/auxiliaryRouter/auxiliary-router.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    JeeWorkModule,
    MenuWorkModule,
    CommonModule,
    CollapseModule.forRoot(),
    AuxiliaryWorkRouterModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
