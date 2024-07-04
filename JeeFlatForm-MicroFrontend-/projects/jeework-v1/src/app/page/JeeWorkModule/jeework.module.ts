import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
// import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { MatTabsModule } from '@angular/material/tabs';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
// import { NgxSpinnerModule } from 'ngx-spinner';
import { FileUploadModule } from 'ng2-file-upload';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
// import { Select2Module } from 'ng-select2-component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
// import { TimeagoModule } from 'ngx-timeago';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatButtonModule } from '@angular/material/button';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatBadgeModule } from '@angular/material/badge';
import { NgxAutoScrollModule } from 'ngx-auto-scroll';
import { NgbModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { AvatarModule } from 'ngx-avatar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { InlineSVGModule } from 'ng-inline-svg';
import { GalleryModule } from 'ng-gallery';
import { LightboxModule } from 'ng-gallery/lightbox';
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
import { JeeWorkComponent } from './jeework.component';
// import { DynamicFormModule } from './component/dynamic-form/dynamic-form.module';
import { ImageControlModule } from 'dps-lib';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { JeeWorkRoutingModule } from './jeework-routing.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { DndModule } from 'ngx-drag-drop';
import { EditorGeneralComponent } from './component/editor/editor.component';
import { EditorModule } from '@tinymce/tinymce-angular';
import { MenuServices } from '../services/menu.service';
import { SocketioService } from '../services/socketio.service';
import { DanhMucChungService } from '../services/danhmuc.service';
import { TranslationService } from 'projects/jeework-v1/src/modules/i18n/translation.service';
import './../../../../src/styles.scss'
import './../../../styles.scss';// styte css of project
import { PdfViewerComponent } from 'projects/jeework-v1/src/modules/crud/pdf-viewer/pdf-viewer.component';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { DocViewerComponent } from 'projects/jeework-v1/src/modules/crud/doc-viewer/doc-viewer.component';
import { LayoutUtilsService } from 'projects/jeework-v1/src/modules/crud/utils/layout-utils.service';
import { DeleteEntityDialogComponent } from 'projects/jeework-v1/src/modules/crud/delete-entity-dialog/delete-entity-dialog.component';
import { ActionNotificationComponent } from 'projects/jeework-v1/src/modules/crud/action-natification/action-notification.component';

@NgModule({
  declarations: [
    JeeWorkComponent,
    PdfViewerComponent,
    DocViewerComponent,
    EditorGeneralComponent,
    DeleteEntityDialogComponent,
    ActionNotificationComponent,
  ],
  entryComponents: [
    EditorGeneralComponent,
    DeleteEntityDialogComponent,
    ActionNotificationComponent,
  ],
  imports: [
    NgxMatSelectSearchModule,
    MatSortModule,
    MatCheckboxModule,
    MatSelectModule,
    MatMomentDateModule,
    MatDatepickerModule,
    MatRadioModule,
    MatExpansionModule,
    MatSlideToggleModule,
    MatSidenavModule,
    QuillModule.forRoot(),
    // CKEditorModule,
    PopoverModule,
    LightboxModule,
    GalleryModule,
    PickerModule,
    MatMenuModule,
    NgbModule,
    MatInputModule,
    MatDialogModule,
    MatTooltipModule,
    AvatarModule,
    ScrollingModule,
    MatIconModule,
    FormsModule,
    InlineSVGModule,
    MatTabsModule,
    NgbTooltipModule,
    NgxAutoScrollModule,
    MatBadgeModule,
    MatCardModule,
    MatInputModule,
    MatDialogModule,
    MatFormFieldModule,
    MatChipsModule,
    MatAutocompleteModule,
    PerfectScrollbarModule,
    MatButtonModule,
    ScrollingModule,
    MatIconModule,
    CommonModule,
    // NgxSpinnerModule,
    FileUploadModule,
    ReactiveFormsModule,
    HttpClientModule,
    // Select2Module,
    InfiniteScrollModule,
    // TimeagoModule.forRoot(),
    TabsModule.forRoot(),
    BsDatepickerModule.forRoot(),
    MatSnackBarModule,
    BsDropdownModule.forRoot(),
    CollapseModule.forRoot(),
    TooltipModule.forRoot(),
    // DynamicFormModule,
    ImageControlModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    TranslateModule.forRoot(),
    JeeWorkRoutingModule,
    DragDropModule,
    DndModule,
    EditorModule,
    NgxDocViewerModule,
    PdfViewerModule,
  ],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    // LayoutUtilsService,
    SocketioService,
    // NotifyServices,
    MenuServices,
    // DangKyCuocHopService,
    // ThemeService,
    DanhMucChungService,
    // FormatTimeService,
    // FormatCSSTimeService,
    TranslationService,
    TranslateService,
    LayoutUtilsService,
  ],
  exports: [
    MatSidenavModule,
    MatExpansionModule,
    PdfViewerComponent,
    DocViewerComponent,
    EditorGeneralComponent,
    DeleteEntityDialogComponent,
  ],
})
export class JeeWorkV1Module { }
