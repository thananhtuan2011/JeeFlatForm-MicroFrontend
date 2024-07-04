import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JeeTeamRoutingModule } from './jee-team-routing.module';
import { JeeteamComponent } from './jeeteam/jeeteam.component';
import { JeeCommentModule } from '../JeeCommentModule/jee-comment/jee-comment.module';
import { CreatedGroupComponent } from './jeeteam/created-group/created-group.component';
import { EditTopicComponent } from './jeeteam/edit-topic/edit-topic.component';
import { PopoverModule } from 'ngx-smart-popover';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { MatCardModule } from '@angular/material/card';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VirtualScrollerModule } from 'ngx-virtual-scroller';
import { EditorModule } from '@tinymce/tinymce-angular';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { QuillModule } from 'ngx-quill';
import { AvatarModule } from 'ngx-avatar';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { DateTimeFormatPipe } from './jeeteam/pipe/date-time-format.pipe';
import { ContentLoadingComponent } from './jeeteam/content-loading/content-loading.component';
import { PhanQuyenUserTeamComponent } from './jeeteam/phan-quyen-user-team/phan-quyen-user-team.component';
import { LoadHeaderBodyComponent } from './jeeteam/header_body/load-header_body.component';
import { LoadTailieuGroupComponent } from './jeeteam/load-tailieu-group/load-tailieu-group.component';
import { LoadThaoluanComponent } from './jeeteam/load-thaoluan/load-thaoluan.component';
import { LoadThanhVienComponent } from './jeeteam/load-thanh-vien/load-thanh-vien.component';
import { AddMemberChanelComponent } from './jeeteam/add-member-chanel/add-member-chanel.component';
import { EditQuyenUserInteamComponent } from './jeeteam/edit-quyen-user-inteam/edit-quyen-user-inteam.component';
import { EditNameTeamComponent } from './jeeteam/edit-name-team/edit-name-team.component';
import { CreatedChannelComponent } from './jeeteam/created-channel/created-channel.component';
import { WelcomComponent } from './jeeteam/welcom/welcom.component';
import { PhanQuyenComponent } from './jeeteam/phan-quyen/phan-quyen.component';
import { EditNameChanelComponent } from './jeeteam/edit-name-chanel/edit-name-chanel.component';
import { EditPhanquyenComponent } from './jeeteam/edit-phanquyen/edit-phanquyen.component';
import { QuanlyTeamComponent } from './jeeteam/quanly-team/quanly-team.component';
import { AddMemberComponent } from './jeeteam/add-member/add-member.component';
import { CRUDTableModule } from '../share/crud-table.module';
import { AsideDynamicComponent } from './jeeteam/aside-dynamic/aside-dynamic.component';
import { MatDialogModule } from '@angular/material/dialog';
import { LayoutUtilsService } from 'projects/jeeteam/src/modules/crud/utils/layout-utils.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { JeeTeamService } from './jeeteam/services/jeeteam.service';
import { HttpClientModule } from '@angular/common/http';
import { MenuJeeTeamServices } from './jeeteam/services/menu_jeeteam.service';
import { MenuConfigService } from './jeeteam/services/menu-config.service';
import { DynamicAsideMenuService } from './jeeteam/services/dynamic-aside-menu.service';
import './../../../styles.scss';
import { MaterialModule } from './material.module';
import { InlineSVGModule } from 'ng-inline-svg';
import { TranslationService } from 'projects/jeeteam/src/modules/i18n/translation.service';
import { LoadJeeteamComponent } from './jeeteam/load-jeeteam/load-jeeteam.component';
import { JeeCommentService } from '../JeeCommentModule/jee-comment/jee-comment.service';
import { ActionNotificationComponent } from 'projects/jeeteam/src/modules/crud/action-natification/action-notification.component';
import { DeleteEntityDialogComponent } from 'projects/jeeteam/src/modules/crud/delete-entity-dialog/delete-entity-dialog.component';
import { LoadCommentComponent } from './jeeteam/load-comment/load-comment.component';
import { CreatTopicComponent } from './jeeteam/creat-topic/creat-topic.component';
import { FormatTimeService } from './jeeteam/load-thaoluan/fotmat-time.service';
@NgModule({

  declarations: [DateTimeFormatPipe, ContentLoadingComponent,
    CreatedGroupComponent, PhanQuyenUserTeamComponent, LoadHeaderBodyComponent, LoadTailieuGroupComponent,
    LoadThaoluanComponent, LoadThanhVienComponent, AddMemberChanelComponent,
    EditNameTeamComponent, EditQuyenUserInteamComponent,
    CreatedChannelComponent,
    DeleteEntityDialogComponent,
    ActionNotificationComponent,
    JeeteamComponent,
    AsideDynamicComponent,
    WelcomComponent,
    PhanQuyenComponent,
    EditNameChanelComponent,
    EditTopicComponent, EditPhanquyenComponent, QuanlyTeamComponent, AddMemberComponent, LoadJeeteamComponent, LoadCommentComponent, CreatTopicComponent],
  entryComponents: [EditNameChanelComponent, DeleteEntityDialogComponent, ActionNotificationComponent, PhanQuyenUserTeamComponent, CreatedChannelComponent, EditQuyenUserInteamComponent, AddMemberComponent, EditNameTeamComponent, QuanlyTeamComponent],
  exports: [
    CreatedGroupComponent,
    EditTopicComponent,
  ],
  imports: [
    PerfectScrollbarModule,
    JeeCommentModule,
    MaterialModule,
    MatSnackBarModule,
    PopoverModule,
    ReactiveFormsModule,
    MatCardModule,
    VirtualScrollerModule,
    CRUDTableModule,
    // BrowserModule,
    // AngularEditorModule,
    EditorModule,
    ScrollingModule,
    NgbModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    TranslateModule.forRoot(),
    MatMenuModule,
    MatTabsModule,
    HttpClientModule,
    MatButtonModule,
    MatAutocompleteModule,
    MatChipsModule,
    CommonModule,
    QuillModule.forRoot(),
    AvatarModule,
    MatIconModule,
    MatCheckboxModule,
    MatRadioModule,
    MatDialogModule,
    NgbModule,
    CommonModule,
    InlineSVGModule.forRoot(),
    JeeTeamRoutingModule
  ],
  providers: [
    FormatTimeService,
    LayoutUtilsService,
    JeeTeamService,
    TranslationService,
    MenuJeeTeamServices,
    MenuConfigService,
    DynamicAsideMenuService,
    JeeCommentService



  ]
})
export class JeeTeamModule { }
