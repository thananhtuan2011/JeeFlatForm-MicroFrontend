import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChatAppRoutingModule } from './chat-app-routing.module';
import { ChatAppComponent } from './chat-app.component';


@NgModule({
  declarations: [
    ChatAppComponent
  ],
  imports: [
    CommonModule,
    ChatAppRoutingModule
  ]
})
export class ChatAppModule { }
