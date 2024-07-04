import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { InlineSVGModule } from 'ng-inline-svg';
import { ActivityDrawerComponent } from './activity-drawer/activity-drawer.component';
import { MessengerDrawerComponent } from './messenger-drawer/messenger-drawer.component';
import { ChatInnerModule } from '../../content/chat-inner/chat-inner.module';
import { ProfileDrawerComponent } from './profile-drawer/profile-drawer.component';
import { AvatarModule } from 'ngx-avatar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NotifyDrawerComponent } from './notify-drawer/notify-drawer.component';
import { MatIconModule } from '@angular/material/icon';
import { ApplicationDrawerComponent } from './application-drawer/application-drawer.component';

@NgModule({
  declarations: [
    ActivityDrawerComponent,
    MessengerDrawerComponent,
    ProfileDrawerComponent,
    NotifyDrawerComponent,
    ApplicationDrawerComponent,
  ],
  imports: [CommonModule, InlineSVGModule, RouterModule, ChatInnerModule, 
    AvatarModule, MatSlideToggleModule, FormsModule,MatTooltipModule,MatIconModule,],
  exports: [
    ActivityDrawerComponent,
    MessengerDrawerComponent,
    ProfileDrawerComponent,
    NotifyDrawerComponent,
    ApplicationDrawerComponent,
  ],
})
export class DrawersModule { }
