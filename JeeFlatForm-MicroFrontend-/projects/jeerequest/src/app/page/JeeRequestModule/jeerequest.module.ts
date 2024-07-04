
import { MatTabsModule } from '@angular/material/tabs';
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { MatButtonModule } from '@angular/material/button';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { AvatarModule } from 'ngx-avatar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { InlineSVGModule } from 'ng-inline-svg';
import { GalleryModule } from '@ngx-gallery/core';
import { LightboxModule } from '@ngx-gallery/lightbox';
import { PopoverModule } from 'ngx-smart-popover';
import { QuillModule } from 'ngx-quill';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMomentDateModule, MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { JeeRequestRoutingModule } from './jeerequest-routing.module';
import { JeeRequestComponent } from './jeerequest.component';
import { DynamicFormModule } from './components/dynamic-form/dynamic-form.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { TimeAgoPipe } from './_pipe/time-ago.pipe';
import { TaoYeuCauDialogComponent } from './components/tao-yeu-cau/tao-yeu-cau.component';
import { DanhSachLoaiYeuCauDialogComponent } from './components/danh-sach-loai-yeu-cau/danh-sach-loai-yeu-cau.component';
import { PreviewFileImageYeuCauComponent } from './components/preview-file-image/preview-file-image.component';
import { YeuCauService } from './_services/yeu-cau.services';
import { NoiDungYeuCauComponent } from './chi-tiet-yeu-cau/noi-dung-yeu-cau/noi-dung-yeu-cau.component';
import { ListYeuCauGuiComponent } from './chi-tiet-yeu-cau/list-yeu-cau-gui/list-yeu-cau-gui.component';
import { ListYeuCauDuyetComponent } from './chi-tiet-yeu-cau/list-yeu-cau-duyet/list-yeu-cau-duyet.component';
import { ListUsersCustomComponent } from './components/list-users-custom/list-users-custom.component';
import { UserCustomComponent } from './components/user-custom/user-custom.component';
import { ChiTietYeuCauComponent } from './chi-tiet-yeu-cau/chi-tiet-yeu-cau/chi-tiet-yeu-cau.component';
import { DynamicSearchFormRequestModule } from './components/dynamic-search-form/dynamic-search-form.module';
import { JeeCommentModule } from '../JeeCommentModule/jee-comment/jee-comment.module';
import { LayoutUtilsService } from 'projects/jeerequest/src/modules/crud/utils/layout-utils.service';
import { TranslationService } from 'projects/jeerequest/src/modules/i18n/translation.service';
import { HttpUtilsService } from 'projects/jeerequest/src/modules/crud/utils/http-utils.service';
import './../../../../src/styles.scss';
import { ActionNotificationComponent } from 'projects/jeerequest/src/modules/crud/action-natification/action-notification.component';
import { DeleteEntityDialogComponent } from 'projects/jeerequest/src/modules/crud/delete-entity-dialog/delete-entity-dialog.component';
import "quill-mention"
import './../../../styles.scss';
import { ChooseUsersComponent } from './components/choose-users/choose-users.component';
@NgModule({
  imports: [
    GalleryModule,
    LightboxModule,
    TranslateModule.forRoot(),
    MatTooltipModule,
    AvatarModule,
    InfiniteScrollModule,
    DynamicFormModule,
    PerfectScrollbarModule,
    PopoverModule,
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    InlineSVGModule,
    MatCheckboxModule,
    NgbModule,
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
    NgxDocViewerModule,
    JeeRequestRoutingModule,
    DynamicSearchFormRequestModule,
    JeeCommentModule,

  ],
  providers: [
    // ThemeService,
    HttpUtilsService,
    DatePipe,
    YeuCauService,
    LayoutUtilsService,
    TranslateService,
    TranslationService
  ],
  declarations: [
    JeeRequestComponent,
    TimeAgoPipe,
    DanhSachLoaiYeuCauDialogComponent,
    TaoYeuCauDialogComponent,
    PreviewFileImageYeuCauComponent,
    NoiDungYeuCauComponent,
    ListYeuCauGuiComponent,
    ListYeuCauDuyetComponent,
    ListUsersCustomComponent,
    UserCustomComponent,
    ChiTietYeuCauComponent,
    ActionNotificationComponent,
    DeleteEntityDialogComponent,
    ChooseUsersComponent
  ],
  entryComponents: [
    ActionNotificationComponent,
    JeeRequestComponent,
    TimeAgoPipe,
    DanhSachLoaiYeuCauDialogComponent,
    TaoYeuCauDialogComponent,
    PreviewFileImageYeuCauComponent,
    NoiDungYeuCauComponent,
    ListYeuCauGuiComponent,
    ListYeuCauDuyetComponent,
    ListUsersCustomComponent,
    UserCustomComponent,
    ChiTietYeuCauComponent
  ],
  exports: [
  ],
})
export class JeeRequestModule { }
