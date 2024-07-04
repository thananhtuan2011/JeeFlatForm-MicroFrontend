import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { JeeAdminRoutingModule } from './jeeadmin-routing.module';
import { JeeAdminComponent } from './jeeadmin.component';
import { LayoutUtilsService } from 'projects/jeeadmin/src/modules/crud/utils/layout-utils.service';
import { JeeAdminService } from './Services/jeeadmin.service';
import { MenuServices } from './Services/menu.service';
import { PermissionUrl } from './Services/permission.service';
import { HttpUtilsService } from 'projects/jeeadmin/src/modules/crud/utils/http-utils.service';
import { SocketioService } from './Services/socketio.service';
import { TranslationService } from 'projects/jeeadmin/src/modules/i18n/translation.service';

@NgModule({ 
  declarations: [
    JeeAdminComponent,
  ],
  entryComponents: [],
  imports: [
    TranslateModule.forRoot(),
    NgbModule,
    RouterModule,
    CommonModule,
    JeeAdminRoutingModule
  ],
  providers: [
    LayoutUtilsService,
    HttpUtilsService,
    MenuServices,
    SocketioService,
    JeeAdminService,
    PermissionUrl,
    TranslationService
  ],
})

export class JeeAdminModule { }
