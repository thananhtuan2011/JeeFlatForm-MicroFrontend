import { PresenceService } from 'projects/jeechat/src/app/page/jee-chat/services/presence.service';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { LayoutUtilsService } from './../../../../src/app/modules/crud/utils/layout-utils.service';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserModule } from '@angular/platform-browser';
import { TokenStorage } from 'src/app/modules/auth/services/token-storage.service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { JeeChatModule } from './page/jee-chat/jee-chat.module';
// import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    JeeChatModule,

    AppRoutingModule,
    MatSnackBarModule,
    HttpClientModule
  ],
  providers: [TokenStorage,LayoutUtilsService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
