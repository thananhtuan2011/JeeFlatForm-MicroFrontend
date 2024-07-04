import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { JeeWorkV1Module } from './page/JeeWorkModule/jeework.module';
import { AuxiliaryWorkV1RouterModule } from './page/JeeWorkModule/auxiliary-router/auxiliary-router.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    JeeWorkV1Module,
    AuxiliaryWorkV1RouterModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
