
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
// import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { CookieService } from 'ngx-cookie-service';

import { NgbDatepickerModule, NgbModalModule, NgbButtonsModule } from '@ng-bootstrap/ng-bootstrap';
import { MatMomentDateModule, MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import {
  MatRippleModule,
  MatNativeDateModule,
  MAT_DATE_LOCALE,
  MAT_DATE_FORMATS,
  DateAdapter,
} from '@angular/material/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { PopoverModule } from "ngx-smart-popover";
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { AvatarModule } from 'ngx-avatar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DropdownTreeModule } from 'dps-lib';
// import { CRUDTableModule } from './../../../_metronic/shared/crud-table';
// import { ChiTietCuocHopComponent } from './components/chi-tiet-cuoc-hop/chi-tiet-cuoc-hop.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { DangKyCuocHopService } from './_services/dang-ky-cuoc-hop.service';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import timeGridPlugin from '@fullcalendar/timegrid';
// import { ContextMenuModule } from 'ngx-contextmenu';
import { StateService } from './_services/state.service';
import { EditorModule } from "@tinymce/tinymce-angular";

import { SafeHtmlPipe } from './components/SafeHtmlPipe';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ChooseUsersMTComponent } from './components/choose-users/choose-users-mt.component';
import { JeeChooseMemberModule } from './components/jee-choose-member/jee-choose-member.module';
import { JeeMeetingRoutingModule } from './jeemeeting-routing.module';
import { JeeMeetingComponent } from './jeemeeting.component';
import { JeeCommentModule } from '../JeeCommentModule/jee-comment/jee-comment.module';
import { MY_FORMATS } from './components/custom-date-format';
import { MenuCuocHopComponent } from './components/menu-cuoc-hop/menu-cuoc-hop.component';
import { DanhSachCuocHopComponent } from './components/danh-sach-cuoc-hop/danh-sach-cuoc-hop.component';
import { TimeAgoPipeCus } from './_pipe/time-ago-custom.pipe';
import { ListUsersCustomComponent } from './components/list-users-custom/list-users-custom.component';
import { UserCustomComponent } from './components/user-custom/user-custom.component';


import { AvatarUserMTComponent } from './components/custom-avatar/avatar-user/avatar-user-mt.component';
import { ContentLoadingComponent } from './components/content-loading/content-loading.component';
import { MeetingStore } from './_services/meeting.store';
import { MatExpansionModule } from '@angular/material/expansion';
import { CRUDTableModule } from '../share/crud-table.module';
import './../../../../src/styles.scss';
import './../../../styles.scss';// styte css of project
import { ActionNotificationComponent } from 'projects/jeemeet/src/modules/crud/action-natification/action-notification.component';
import { DeleteEntityDialogComponent } from 'projects/jeemeet/src/modules/crud/delete-entity-dialog/delete-entity-dialog.component';
import { LayoutUtilsService } from 'projects/jeemeet/src/modules/crud/utils/layout-utils.service';
import { TranslationService } from 'projects/jeemeet/src/modules/i18n/translation.service';
import { QuanLyCuocHopEditComponent } from './components/quan-ly-cuoc-hop-edit/quan-ly-cuoc-hop-edit.component';
import { ChartsModule } from 'ng2-charts';
import { AvatarUserModule } from './components/custom-avatar/custom-avatar/avatar-user.module';
import { QuanLyCuocHopService } from './_services/quan-ly-cuoc-hop.service';
import { UserViewDocumentListComponent } from './components/user-view-document-list/user-view-document-list.component';
import { DiagramViewAddComponent } from './components/diagram-view/diagram-view.component';
import { DiagramModule, SymbolPaletteAllModule } from '@syncfusion/ej2-angular-diagrams';
import { ChiTietCuocHopComponent } from './components/cuoc-hop-chi-tiet/cuoc-hop-chi-tiet.component';
import { ChooseUsersComponent } from './components/components/choose-users/choose-users.component';
import { SearchPipe } from './components/filter.pipe';
import { WorkModule } from './components/components/work-gov/work.module';
import { CuocHopInfoComponent } from './components/components/cuoc-hop-info/cuoc-hop-info.component';
import { DanhSachPhatBieuComponent } from './components/components/danh-sach-phat-bieu/danh-sach-phat-bieu.component';
import { DienBienCuocHopComponent } from './components/components/dien-bien-cuoc-hop/dien-bien-cuoc-hop.component';
import { MeetingFeedbackAddComponent } from './components/components/meeting-feedback-add/meeting-feedback-add.component';
import { QuanLySoTayGhiChuCuocHopAddComponent } from './components/components/ql-so-tay-ghi-chu-ch-add/ql-so-tay-ghi-chu-ch-add.component';
import { CuocHopNotiFyComponent } from './components/cuoc-hop-notify/cuoc-hop-notify.component';
import { SurveyListComponent } from './components/components/survey-list/survey-list.component';
import { QuanLyDiemDanhComponent } from './components/components/quan-ly-diem-danh/quan-ly-diem-danh.component';
import { MeetingSupportAddComponent } from './components/components/meeting-support-add/meeting-support-add.component';
import { QuanLyPhieuLayYkienModule } from './quan-ly-phieu-lay-y-kien/quan-ly-phieu-lay-y-kien.module';
import { SurveyPhieuKhaoSatListMeetComponent } from './components/components/ds-phieu-khao-sat/ds-phieu-khao-sat.component';
import { ExportWordComponent } from './components/components/export-word/export-word.component';
import { MeetingFeedbackListComponent } from './components/components/meeting-feedback-list/meeting-feedback-list.component';
import "quill-mention"
import { QuanLyDocumentAddComponent } from './components/ql-add-document/ql-add-document.component';
import { KhongDuyetFileDialogComponent } from './components/khong-duyet-file-dialog/khong-duyet-file-dialog.component';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { InMaQRComponent } from './components/components/in-ma-qr/in-ma-qr.component';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { ChooseUserThemTaiLieuComponent } from './components/components/choose-user-chuan-bi-tai-lieu/choose-user-chuan-bi-tai-lieu.component';
import { QuillModule } from 'ngx-quill';
import { placeholder, quillConfig } from './components/components/editor/Quill_config';
import { MenuServices } from './_services/menu.service';
import { CorsHeaderInterceptor } from './_services/cors-header-interceptor';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { AvatarUserDeptModule } from './components/custom-avatar/custom-avatar-dept/avatar-user-dept.module';
import { MenuWorkModule } from 'projects/jeework/src/app/page/jee-work/MenuWork/menu-work.module';
import { LichHopDonViModule } from './lich-hop-don-vi/lich-hop-don-vi.module';
import { ThongKeHopDonViModule } from './thong-ke-hop-don-vi/thong-ke-hop-don-vi.module';
import { MeetDetailComponent } from './components/meet-v2/meet-detail/meet-detail.component';
import { MeetListComponent } from './components/meet-v2/meet-list/meet-list.component';
import { MeetListDetailComponent } from './components/meet-v2/meet-list-detail/meet-list-detail.component';
import { NgxContentLoadingModule } from 'ngx-content-loading';
import { DynamicSearchFormRequestModule } from './components/dynamic-search-form/dynamic-search-form.module';
import { MeetDetaiEmptyComponent } from './components/meet-v2/meet-detai-empty/meet-detai-empty.component';
import { DanhSachPhatBieuPageComponent } from './components/components/danh-sach-phat-bieu-page/danh-sach-phat-bieu.component';
import { DanhSachDaPhatBieuPageComponent } from './components/components/danh-sach-da-phat-bieu-page/danh-sach-phat-bieu.component';
import { MeetingFeedbackPageComponent } from './components/components/meeting-feedback-page/meeting-feedback-list.component';
import { QuanLySoTayCuocHopModule } from './quan-ly-so-tay-cuoc-hop/quan-ly-so-tay-cuoc-hop.module';
import { ViewPdfLichHopComponent } from './components/meet-v2/view-pdf-lich-hop/view-pdf-lich-hop.component';
import { ProgressComponent } from './components/meet-v2/view-pdf-lich-hop/progress/progress.component';
import { DndDirectiveModule } from './components/meet-v2/view-pdf-lich-hop/directives/dnd.directive.module';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { QuanLyDocumentAddStopMeetingComponent } from './components/meet-v2/ql-add-document-stop-meet/ql-add-document.component';
import { QuanLyCuocHopEditV2Component } from './components/meet-v2/quan-ly-cuoc-hop-edit/quan-ly-cuoc-hop-edit.component';
FullCalendarModule.registerPlugins([ // register FullCalendar plugins
  dayGridPlugin,
  interactionPlugin,
  listPlugin,
  timeGridPlugin
]);
@NgModule({
  imports: [
    // BrowserModule,
    // BrowserAnimationsModule,
    ChartsModule,
    AvatarUserModule,
    MatExpansionModule,
    JeeChooseMemberModule,
    JeeCommentModule,
    PerfectScrollbarModule,
    EditorModule,
    OwlNativeDateTimeModule,
    OwlDateTimeModule,
    MatToolbarModule,
    HttpClientModule,
    JeeMeetingRoutingModule,
    FullCalendarModule,
    NgxMatSelectSearchModule,
    TranslateModule.forRoot(),
    MatTooltipModule,
    AvatarModule,
    InfiniteScrollModule,
    PerfectScrollbarModule,
    CRUDTableModule,
    PopoverModule,
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
    DropdownTreeModule,
    DiagramModule,
    SymbolPaletteAllModule,
    WorkModule,
    NgbDropdownModule,
    AvatarUserDeptModule,
    QuillModule.forRoot({
      modules: quillConfig,
      placeholder: placeholder,
    }),
    // QuanLyPhieuLayYkienModule
    ScrollingModule,
    MenuWorkModule,
    LichHopDonViModule,
    ThongKeHopDonViModule,
    NgxContentLoadingModule,
    DynamicSearchFormRequestModule,
    QuanLySoTayCuocHopModule,
    DndDirectiveModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: CorsHeaderInterceptor, multi: true },
    { provide: MAT_DATE_LOCALE, useValue: 'vi' },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
      useValue: {
        hasBackdrop: true,
        //  disableClose: true,
        panelClass: ['sky-padding-0'],
        height: "fit-content",
        width: '900px',
      }
    },
    // LoadingService,
    // {
    // 	provide: HTTP_INTERCEPTORS,
    // 	useClass: LoadingInterceptor,
    // 	multi: true
    // },
    // ThemeService,
    // DanhMucChungService,
    DangKyCuocHopService,
    StateService,
    DatePipe,
    // DanhMucChungService,
    CookieService,
    // LandingPageService,
    //jework
    // ProjectsTeamMTService,
    // TagsMTService,
    // WeWorkMTService,
    // WorkMTService,
    // CommunicateMTService,
    // MenuPhanQuyenMTServices,
    //end jeewok

    //jework new

    MeetingStore,
    LayoutUtilsService,
    TranslateService,
    TranslationService,
    QuanLyCuocHopService,
    MenuServices

  ],
  declarations: [
    QuanLyCuocHopEditComponent,
    MenuCuocHopComponent,
    JeeMeetingComponent,
    SafeHtmlPipe,
    ChiTietCuocHopComponent,
    UserViewDocumentListComponent,
    DiagramViewAddComponent,
    ChooseUsersComponent,
    SearchPipe,
    CuocHopInfoComponent,
    DanhSachPhatBieuComponent,
    DanhSachPhatBieuPageComponent,
    DanhSachDaPhatBieuPageComponent,
    DienBienCuocHopComponent,
    MeetingFeedbackAddComponent,
    QuanLySoTayGhiChuCuocHopAddComponent,
    SurveyPhieuKhaoSatListMeetComponent,
    MeetingFeedbackPageComponent,
    //Jeework
    // ChooseUsersMTComponent,
    // AvatarUserMTComponent,
    // AvatarListUsersMTComponent,
    // WorkListNewMTComponent,
    // AddNewFieldsMTComponent,
    // CuTagMTComponent,
    // ChooseMilestoneAndTagMTComponent,
    // ClickOutsideMTDirective,
    // AddTaskMTComponent,
    // AppFocusBlockMTComponent,
    // ColorPicker2MTComponent,
    // StatusDynamicMTDialogComponent,
    // WorkAssignedMTComponent,
    // DuplicateTaskNewMTComponent,
    // DuplicateWorkMTComponent,
    // WorkGroupEditMTComponent,
    // ChooseUsers2MTComponent,
    // DialogSelectdayMTComponent,
    // TagsEditMTComponent,
    // AllowUpdateStatusMT,
    //end jeework




    DanhSachCuocHopComponent,
    TimeAgoPipeCus,
    ListUsersCustomComponent,
    UserCustomComponent,
    AvatarUserMTComponent,
    ChooseUsersMTComponent,
    ContentLoadingComponent,
    ActionNotificationComponent,
    DeleteEntityDialogComponent,
    SurveyListComponent,
    CuocHopNotiFyComponent,
    QuanLyDiemDanhComponent,
    MeetingSupportAddComponent,
    DiagramViewAddComponent,
    ExportWordComponent,
    MeetingFeedbackListComponent,
    QuanLyDocumentAddComponent,
    KhongDuyetFileDialogComponent,
    InMaQRComponent,
    ChooseUserThemTaiLieuComponent,
    MeetDetailComponent,
    MeetListComponent,
    MeetListDetailComponent,
    MeetDetaiEmptyComponent,
    ViewPdfLichHopComponent,
    ProgressComponent,
    QuanLyDocumentAddStopMeetingComponent,

    QuanLyCuocHopEditV2Component
  ],
  entryComponents: [
    MenuCuocHopComponent,
    MeetListComponent,
    JeeMeetingComponent,
    TimeAgoPipeCus,
    ListUsersCustomComponent,
    ChiTietCuocHopComponent,
    UserCustomComponent,
    DanhSachCuocHopComponent,
    //jework
    // AvatarUserMTComponent,
    // AvatarListUsersMTComponent,,
    // AddNewFieldsMTComponent,
    // CuTagMTComponent,
    // StatusDynamicMTDialogComponent,
    // WorkAssignedMTComponent,
    // DuplicateTaskNewMTComponent,
    // DuplicateWorkMTComponent,
    // WorkGroupEditMTComponent,
    // DialogSelectdayMTComponent,
    // TagsEditMTComponent,
    //end jeework

    AvatarUserMTComponent,
    ChooseUsersMTComponent,
  ],
  exports: [
  ],
  bootstrap: []
})
export class JeeMeetModule { }
