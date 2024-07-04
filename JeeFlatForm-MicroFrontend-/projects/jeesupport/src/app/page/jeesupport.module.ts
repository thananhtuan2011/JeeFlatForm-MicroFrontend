import { TranslateModule } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
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
import { MatTabsModule } from '@angular/material/tabs';
import { CookieService } from 'ngx-cookie-service';

import { NgbDatepickerModule, NgbModalModule, NgbButtonsModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatMomentDateModule, MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import {
  MatRippleModule,
  MatNativeDateModule,
  MAT_DATE_LOCALE,
  MAT_DATE_FORMATS,
  DateAdapter,
} from '@angular/material/core';
import { JeeSupportComponent } from './jeesupport.component';
import { RouterModule } from '@angular/router';
import { JeeSupportRoutingModule } from './jeesupport-routing.module';
import { DanhSachHoTroComponent } from './danh-sach-ho-tro/danh-sach-ho-tro.component';
import { DanhSachHoTroService } from './_services/danh-sach-ho-tro.service';
import { ChiTietHoTroComponent } from './chi-tiet-ho-tro/chi-tiet-ho-tro.component';
import { TimeAgoPipeCus } from './_pipe/time-ago-custom.pipe';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AvatarModule } from 'ngx-avatar';
import { QuillModule } from 'ngx-quill';


import { MessageService } from './_services/message.service';
import { FormatTimeService } from './_services/jee-format-time.component';
import { AddSupPopupComponent } from './add-sup-popup/add-sup-popup.component';
import { RatingPopupComponent } from './Rating-popup/rating-popup.component';
import { PermissionManagementService } from './_services/permission-management.service';
import { SocketioService } from './_services/socketio.service';
import { AuthService } from './_services/auth.service';
import { AuthHTTPService } from './_services/auth-http.service';
import { TokenStorage } from './_services/token-storage.service';
import { TicketRequestManagementService } from './_services/ticket-request-management.service';
import './../../../src/styles.scss'
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { LayoutUtilsService } from '../modules/crud/utils/layout-utils.service';
import { ActionNotificationComponent } from '../modules/crud/action-natification/action-notification.component';
import { DeleteEntityDialogComponent } from '../modules/crud/delete-entity-dialog/delete-entity-dialog.component';
import { FetchEntityDialogComponent } from '../modules/crud/fetch-entity-dialog/fetch-entity-dialog.component';
import { UpdateStatusDialogComponent } from '../modules/crud/update-status-dialog/update-status-dialog.component';
import { TranslationService } from '../modules/i18n/translation.service';
import { TranslationModule } from '../modules/i18n/translation.module';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { ChatService } from './_services/chat.service';

@NgModule({
  imports: [
    QuillModule.forRoot(),
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
    TranslateModule.forRoot(),
    // TranslationModule,
    // NgxMatSelectSearchModule,
    NgbModule,
    PickerModule,

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
    DanhSachHoTroService,
    DatePipe,
    CookieService,
    MessageService,
    FormatTimeService,
    PermissionManagementService,
    SocketioService,
    AuthService,
    AuthHTTPService,
    TokenStorage,
    TicketRequestManagementService,
    LayoutUtilsService,
    TranslationService,
    ChatService,
  ],
  declarations: [
    DanhSachHoTroComponent,
    JeeSupportComponent,
    ChiTietHoTroComponent,
    TimeAgoPipeCus,
    AddSupPopupComponent,
    RatingPopupComponent,
    ActionNotificationComponent,
    DeleteEntityDialogComponent,
    FetchEntityDialogComponent,
    UpdateStatusDialogComponent,
  ],
  entryComponents: [
    DanhSachHoTroComponent,
    JeeSupportComponent,
    TimeAgoPipeCus,
    ChiTietHoTroComponent,
    AddSupPopupComponent,
    RatingPopupComponent,
    ActionNotificationComponent,
    DeleteEntityDialogComponent,
    FetchEntityDialogComponent,
    UpdateStatusDialogComponent,
  ],
  exports: [
  ],
  bootstrap: [JeeSupportComponent]
})
export class JeeSupportModule { }
