import { JeeTicKetLiteService } from './_services/JeeTicketLite.service';
import { Compiler, NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { InlineSVGModule } from 'ng-inline-svg';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { MatDialogModule, MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { CookieService } from 'ngx-cookie-service';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

import { NgbDatepickerModule, NgbModalModule, NgbButtonsModule, NgbModule, NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { MatMomentDateModule, MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import {
  MatRippleModule,
  MatNativeDateModule,
  MAT_DATE_LOCALE,
  MAT_DATE_FORMATS,
  DateAdapter,
} from '@angular/material/core';
import { JeeTicKetComponent } from './jeeticket.component';
import { RouterModule } from '@angular/router';
import { JeeSupportRoutingModule } from './jeeticket-routing.module';
import { DanhSachTicketComponent } from './danh-sach-ticket/danh-sach-ticket.component';
import { ChiTietTicketComponent } from './chi-tiet-ticket/chi-tiet-ticketcomponent';
import { TimeAgoPipeCus } from './_pipe/time-ago-custom.pipe';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AvatarModule } from 'ngx-avatar';
import { QuillModule } from 'ngx-quill';
import { FormatTimeService } from './_services/jee-format-time.component';
import { AddTicketPopupComponent } from './add-ticket-popup/add-ticket-popup.component';

import { MessageService } from './_services/message.service';
import { RatingPopupComponent } from './Rating-popup/rating-popup.component';
import { TicKetSendService } from './_services/ticket-send.service';
import { TicKetHandleService } from './_services/ticket-handle.service';
import { TicKetFollowService } from './_services/ticket-follow.service';

//component

import { CuTagCreateComponent } from './component/cu-tag-create/cu-tag-create.component';
import { CuTagComponent } from './component/cu-tag/cu-tag.component';
import { ColorPicker2Component } from './component/color-picker2/color-picker2.component';
import { TicketDocumentService } from './_services/ticket-document.service';

import { TagsManagementService } from './_services/listtag-management.service';
import { TicketTagsManagementService } from './_services/ticket-tags-management.service';
import { ChooseMilestoneAndTagComponent } from './component/choose-milestone-and-tags/choose-milestone-and-tags.component';
import { ChooseUsersModule } from './component/choose-users/choose-users.module';
import { PermissionManagementService } from './_services/permission-management.service';
import { NoSpaceDirective } from './add-ticket-popup/no-space.directive';
import { DocViewerComponent } from '../../modules/crud/doc-viewer/doc-viewer.component';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { TicketRequestManagementService } from './_services/ticket-request-management.service';
import { SocketioService } from './_services/socketio.service';
import { AuthService } from './_services/auth.service';
import { AuthHTTPService } from './_services/auth-http.service';
import { TokenStorage } from './_services/token-storage.service';
import { LayoutUtilsService } from '../../modules/crud/utils/layout-utils.service';
import './../../../styles.scss'
import { TranslateModule } from '@ngx-translate/core';
import { TranslationService } from '../../modules/i18n/translation.service';
import { ActionNotificationComponent } from '../../modules/crud/action-natification/action-notification.component';
import { DeleteEntityDialogComponent } from '../../modules/crud/delete-entity-dialog/delete-entity-dialog.component';
import { FetchEntityDialogComponent } from '../../modules/crud/fetch-entity-dialog/fetch-entity-dialog.component';
import { UpdateStatusDialogComponent } from '../../modules/crud/update-status-dialog/update-status-dialog.component';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { ScrollToBottomDirective } from './chi-tiet-ticket/scroll-to-bottom.directive';
import { placeholder,quillConfig } from './editor/Quill_config';
import { PreviewfileComponent } from './previewfile/previewfile.component';
import { PreviewAllimgComponent } from './preview-allimg/preview-allimg.component';

import { AngularImageViewerModule } from 'image-viewer-dps';
import { GalleryModule } from 'ng-gallery';
import { LightboxModule } from 'ng-gallery/lightbox';
import { ChooseTagTicketComponent } from './component/choose-milestone-and-tags-detail-ticket/choose-milestone-and-tags-detail-ticket.component';
@NgModule({
  imports: [
    QuillModule.forRoot({
      modules: quillConfig,
      placeholder: placeholder,
  }),
    PerfectScrollbarModule,
    HttpClientModule,
    JeeSupportRoutingModule,
    MatTooltipModule,
    AvatarModule,
    PerfectScrollbarModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InlineSVGModule,
    NgbModalModule,
    NgbDatepickerModule,
    MatCheckboxModule,
    NgbButtonsModule,
    MatRadioModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatDatepickerModule,
    MatMomentDateModule,
    MatInputModule,
    MatTabsModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatSortModule,
    MatPaginatorModule,
    MatCardModule,
    MatProgressBarModule,
    MatIconModule,
    MatAutocompleteModule,
    MatTableModule,
    MatMenuModule,
    MatButtonModule,
    MatChipsModule,
    MatDialogModule,
    PerfectScrollbarModule,
    DragDropModule,
    // DropdownTreeModule,
    RouterModule,
    ChooseUsersModule,
    // ChooseMilestoneAndTagModule,
    // CuTagModule,
    TranslateModule.forRoot(),
    NgxMatSelectSearchModule,
    NgxDocViewerModule,
    // MatSnackBarModule,
    NgbCollapseModule,
    PickerModule,
    AngularImageViewerModule,
    LightboxModule,
    GalleryModule

  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'vi' },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
      useValue: {
        hasBackdrop: true,
        disableClose: true,
        panelClass: "no-padding",
        height: "fit-content",
        width: '900px',
      }
    },
    DatePipe,
    CookieService,
    FormatTimeService,
    MessageService,
    TicKetSendService,
    TicKetHandleService,
    TicKetFollowService,
    TicketDocumentService,
    TagsManagementService,
    TicketTagsManagementService,
    JeeTicKetLiteService,
    PermissionManagementService,
    TicketRequestManagementService,
    SocketioService,
    AuthService,
    AuthHTTPService,
    TokenStorage,
    LayoutUtilsService,
    TranslationService,
  ],
  declarations: [
    CuTagComponent,
    CuTagCreateComponent,
    DanhSachTicketComponent,
    JeeTicKetComponent,
    ChiTietTicketComponent,
    TimeAgoPipeCus,
    AddTicketPopupComponent,
    RatingPopupComponent,
    ColorPicker2Component,
    ChooseMilestoneAndTagComponent,
    NoSpaceDirective,
    DocViewerComponent,
    ActionNotificationComponent,
    DeleteEntityDialogComponent,
    FetchEntityDialogComponent,
    UpdateStatusDialogComponent,
    PreviewAllimgComponent,
    ScrollToBottomDirective,
    PreviewfileComponent,
    ChooseTagTicketComponent
  ],
  entryComponents: [
    CuTagComponent,
    CuTagCreateComponent,
    DanhSachTicketComponent,
    JeeTicKetComponent,
    TimeAgoPipeCus,
    ChiTietTicketComponent,
    AddTicketPopupComponent,
    RatingPopupComponent,
    ColorPicker2Component,
    ChooseMilestoneAndTagComponent,
    ActionNotificationComponent,
    DeleteEntityDialogComponent,
    FetchEntityDialogComponent,
    UpdateStatusDialogComponent,
    PreviewAllimgComponent,
    PreviewfileComponent,
    ChooseTagTicketComponent
  ],
  exports: [
    CuTagComponent,
    CuTagCreateComponent,
    ColorPicker2Component,
    ChooseMilestoneAndTagComponent,
    PreviewAllimgComponent,
    RatingPopupComponent,
    ChooseTagTicketComponent
  ],
  bootstrap: [JeeTicKetComponent]
})
export class JeeTicketModule { }
