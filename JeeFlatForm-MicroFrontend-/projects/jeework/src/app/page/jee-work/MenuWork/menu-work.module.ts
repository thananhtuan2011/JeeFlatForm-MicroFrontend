import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuWorkComponent } from './menu-work.component';
import { MenuWorkRoutingkModule } from './menu-work-routing.module';
import { MatIconModule } from '@angular/material/icon';
import { MenuLeftTitleComponent } from './menu-left-title/menu-left-title.component';
import { MatListModule } from '@angular/material/list';
import { DonViThucHienComponent } from './don-vi-thuc-hien/don-vi-thuc-hien.component';
import { MenuWorkService } from './services/menu-work.services';
import { MenuWorkRefModule } from './menu-work-ref.module';
import { DanhMucChungService } from '../services/danhmuc.service';
import { TranslateModule } from '@ngx-translate/core';
import { CustomPipesModule } from 'projects/jeehr/src/app/page/JeeHRModule/component/custom/custom-pipe.module';
import { MatNativeDateModule, MatRippleModule, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { TranslationService } from 'src/app/modules/i18n/translation.service';
import { NhacNhoNhiemVuComponent } from './nhac-nho-nhiem-vu/nhac-nho-nhiem-vu.component';
import { DanhSachNhiemVuComponent } from './danh-sach-nhiem-vu/danh-sach-nhiem-vu.component';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { DetailTaskComponentComponent } from '../detail-task-component/detail-task-component.component';
import { AvatarModule } from 'ngx-avatar';
import { MatTooltipDefaultOptions, MatTooltipModule } from '@angular/material/tooltip';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
// import { TaskDatetimeComponent } from '../task-datetime/task-datetime.component';
import { TimezonePipe } from '../pipe/timezone.pipe';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; import { MatDatepickerModule } from '@angular/material/datepicker';
import { PanelRightComponent } from './panel-right/panel-right.component';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import '../../../../../src/styles.scss';
import { QuillModule } from 'ngx-quill';
import { placeholder, quillConfig } from '../editor/Quill_config';
import { SafeHtmlPipe } from '../pipe/safeHtml.pipe';
import { PanelDashboardComponent } from './panel-dashboard/panel-dashboard.component';
import { AddCloseWidgetDialogComponent } from './panel-dashboard/add-close-widget-dialog/add-close-widget-dialog.component';
import { ListMenuWorkComponent } from './list-menu-work/list-menu-work.component';

import { NgxOrgChartModule } from '../ngx-org-chart/lib/ngx-org-chart/ngx-org-chart.module';
import { CongViecTheoDuAnChartComponent } from './cong-viec-theo-du-an-chart/cong-viec-theo-du-an-chart.component';
import { FormatTimeService } from '../services/jee-format-time.component';
import { JeeCommentModule } from '../JeeCommentModule/jee-comment/jee-comment.module';
import { DocViewerComponent } from 'projects/jeework/src/modules/crud/doc-viewer/doc-viewer.component';
import { NgxDocViewerModule } from 'ngx-doc-viewer';

import { ThemMoiCongViecComponent } from './them-moi-cong-viec/them-moi-cong-viec.component';
// import { AuthService } from 'src/app/modules/auth';
import { TokenStorage } from 'src/app/modules/auth/services/token-storage.service';
import { NgbDropdown, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { ChooseUsersForCreateTaskComponent } from './choose-users-for-create-task/choose-users-for-create-task.component';
import { ChooseProjectComponent } from './choose-project/choose-project.component';
import { DialogSelectdayComponent } from './dialog-selectday/dialog-selectday.component';
import { LayoutUtilsService } from 'projects/jeework/src/modules/crud/utils/layout-utils.service';
import { ActionNotificationComponent } from 'projects/jeework/src/modules/crud/action-natification/action-notification.component';

import { ThietLapNhiemVuComponent } from './ThietLapNhiemVu/ThietLapNhiemVu.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { TongHopDuAnWidgetComponent } from './panel-dashboard/widget/tong-hop-du-an-widget/tong-hop-du-an-widget.component';
import { TrangThaiCongViecWidgetComponent } from './panel-dashboard/widget/trang-thai-cong-viec/trang-thai-cong-viec-widget.component';
import { TaskCommentComponent } from './task-comment/task-comment.component';
import { SetUpWidgetTimeComponent } from './panel-dashboard/set-up-widget-time/set-up-widget-time.component';
import { MotanoidungSetTimeComponent } from './panel-dashboard/motanoidung-set-time/motanoidung-set-time.component';
import { EditPopupWidgetTimeComponent } from './panel-dashboard/edit-popup-widget-time/edit-popup-widget-time.component';
import { BieuDoTheoDoiWidgetComponent } from './panel-dashboard/widget/bieu-do-theo-doi/bieu-do-theo-doi-widget.component';
import { BieuDoWidget18Component } from './panel-dashboard/widget/widget-18/widget-18.component';
import { MyWorksWidget20Component } from './panel-dashboard/widget/widget-20/my-works-widget-20.component';
import { MyWorksWidget21Component } from './panel-dashboard/widget/widget-21/my-works-widget-21.component';
import { MyWorksWidget24Component } from './panel-dashboard/widget/widget-24/my-works-widget-24.component';
import { WorksByProject25Component } from './panel-dashboard/widget/widget-25/works-by-project-25.component';
import { ChartsModule } from 'ng2-charts';
import { GridsterModule } from 'angular-gridster2';
import { DynamicModule } from 'ng-dynamic-component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { DeleteEntityDialogComponent } from 'projects/jeework/src/modules/crud/delete-entity-dialog/delete-entity-dialog.component';
import { CuTagComponent } from './cu-tag/cu-tag.component';
import { ColorPicker2Component } from './color-picker2/color-picker2.component';
import { ChooseMilestoneAndTagComponent } from './choose-milestone-and-tags/choose-milestone-and-tags.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ThemMoiCongViecKhongVanBanComponent } from './them-moi-cong-viec-khong-van-ban/them-moi-cong-viec-khong-van-ban.component';
import { TimeEstimatesViewComponent } from '../time-estimates-view/time-estimates-view.component';
import { ThemMoiRef } from './them-moi-ref.module';
import { PanelDashboardModuleRef } from './panel-dashboard/panel-dashboard-ref.module';
import { ThietLapPhongBan } from './ThietLapPhongBan/ThietLapPhongBan.component';
import { MatTabsModule } from '@angular/material/tabs';
import { ThietLapThe } from './ThietLapThe/ThietLapThe.component';
import { AppFocusBlockComponent } from './ThietLapThe/app-focus-block/app-focus-block.component';
import { SocketioService } from '../services/socketio.service';
import { NhacNhoNhiemVuDaGiaoWidgetComponent } from './panel-dashboard/widget/nhac-nho-nhiem-vu-da-giao-widget/nhac-nho-nhiem-vu-da-giao-widget.component';
import { NhacNhoNhiemVuDuocGiaoWidgetComponent } from './panel-dashboard/widget/nhac-nho-nhiem-vu-duoc-giao-widget/nhac-nho-nhiem-vu-duoc-giao-widget.component';
import { NhacNhoNhiemVuDaTaoWidgetComponent } from './panel-dashboard/widget/nhac-nho-nhiem-vu-da-tao-widget/nhac-nho-nhiem-vu-da-tao-widget.component';
import { DanhSachNhiemVuDonViDuocGiaoWidgetComponent } from './panel-dashboard/widget/danh-sach-nhiem-vu-don-vi-duoc-giao-widget/danh-sach-nhiem-vu-don-vi-duoc-giao-widget.component';
import { ThietLapTemplate } from './ThietLapTemplate/ThietLapTemplate.component';
import { ThietLapNhiemVuCuaDonVi } from './ThietLapNhiemVuCuaDonVi/ThietLapNhiemVuCuaDonVi.component';
import { ThietLapNhiemVuPhoiHop } from './ThietLapNhiemVuPhoiHop/ThietLapNhiemVuPhoiHop.component';
import { CongViecTuChoiHistoryComponent } from './cong-viec-tu-choi-history/cong-viec-tu-choi-history.component';
import { DanhSachNhiemVuVer2Component } from './danh-sach-nhiem-vu-v2/danh-sach-nhiem-vu-v2.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { HistoryChangeAssignee } from './Histoty-change-assignee/history-change-assignee.component';
import { RefDanhSachNhiemVuVer2Component } from './ref-danh-sach-nhiem-vu-v2/ref-danh-sach-nhiem-vu-v2.component';
import { DanhSachNhiemVuLapLaiComponent } from './danh-sach-nhiem-vu-lap-lai/danh-sach-nhiem-vu-lap-lai.component';
import { HighlightDirective } from './highlight.directive';
import { BaoCaoDoanhNghiepComponent } from './bao-cao-doanh-nghiep/bao-cao-doanh-nghiep.component';
import { AddBaoCaoDialogComponent } from './bao-cao-doanh-nghiep/add-bao-cao-dialog/add-bao-cao-dialog.component';
import { ThoiHanCongViecBaoCaoComponent } from './bao-cao-doanh-nghiep/bao-cao/thoi-han-cong-viec/thoi-han-cong-viec.component';
import { CongViecHoanThanhTrongNgayComponent } from './bao-cao-doanh-nghiep/bao-cao/cong-viec-hoan-thanh-trong-ngay/cong-viec-hoan-thanh-trong-ngay.component';
import { CongViecMoiTrongNgayComponent } from './bao-cao-doanh-nghiep/bao-cao/cong-viec-moi-trong-ngay/cong-viec-moi-trong-ngay.component';
import { TongHopCongViecComponent } from './bao-cao-doanh-nghiep/bao-cao/tong-hop-cong-viec/tong-hop-cong-viec.component';
import { CongViecHoanThanhTheoNgayComponent } from './bao-cao-doanh-nghiep/bao-cao/cong-viec-hoan-thanh-theo-ngay/cong-viec-hoan-thanh-theo-ngay.component';
import { ProjectTeamEditComponent } from './project-team-edit/project-team-edit.component';
import { ViewConfigStatusComponent } from './view-config-status/view-config-status.component';
import { ChooseUsersV3Component } from './choose-user-v3/choose-user-v3.component';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
@NgModule({
  declarations: [
    MenuWorkComponent,
    MenuLeftTitleComponent,
    MenuWorkComponent,
    DonViThucHienComponent,
    NhacNhoNhiemVuComponent,
    DanhSachNhiemVuComponent,
    PanelRightComponent,
    ListMenuWorkComponent,
    CongViecTheoDuAnChartComponent,
    CongViecTuChoiHistoryComponent,
    HistoryChangeAssignee,
    DocViewerComponent,
    DialogSelectdayComponent,
    ActionNotificationComponent,
    ThietLapNhiemVuComponent,
    TaskCommentComponent,
    DeleteEntityDialogComponent,
    //============Start dashboard (Thiên)====
    PanelDashboardComponent,
    AddCloseWidgetDialogComponent,
    SetUpWidgetTimeComponent,
    MotanoidungSetTimeComponent,
    EditPopupWidgetTimeComponent,
    TrangThaiCongViecWidgetComponent,
    TongHopDuAnWidgetComponent,
    NhacNhoNhiemVuDaGiaoWidgetComponent,
    NhacNhoNhiemVuDuocGiaoWidgetComponent,
    NhacNhoNhiemVuDaTaoWidgetComponent,
    BieuDoTheoDoiWidgetComponent,
    BieuDoWidget18Component,
    MyWorksWidget20Component,
    MyWorksWidget21Component,
    MyWorksWidget24Component,
    WorksByProject25Component,
    TaskCommentComponent,
    ThietLapPhongBan,
    ThietLapThe,
    AppFocusBlockComponent,
    DanhSachNhiemVuDonViDuocGiaoWidgetComponent,
    ThietLapTemplate,
    ThietLapNhiemVuCuaDonVi,
    ThietLapNhiemVuPhoiHop,
    ProjectTeamEditComponent,
    ViewConfigStatusComponent,
    ChooseUsersV3Component,
    //============End dashboard (Thiên)======
    DanhSachNhiemVuVer2Component,
    RefDanhSachNhiemVuVer2Component,
    DanhSachNhiemVuLapLaiComponent,
    HighlightDirective,
    //============Start bao báo doanh nghiêp (Thiên)====
    BaoCaoDoanhNghiepComponent,//giao diện mới ngày 01/02/2024
    AddBaoCaoDialogComponent,
    ThoiHanCongViecBaoCaoComponent,
    CongViecHoanThanhTrongNgayComponent,
    CongViecMoiTrongNgayComponent,
    TongHopCongViecComponent,
    CongViecHoanThanhTheoNgayComponent,
    //============End bao báo doanh nghiêp (Thiên)====
  ],
  entryComponents: [
    ActionNotificationComponent,
    MatDialogRef,
    //============Start dashboard (Thiên)======
    AddCloseWidgetDialogComponent,
    SetUpWidgetTimeComponent,
    MotanoidungSetTimeComponent,
    EditPopupWidgetTimeComponent,
    //============End dashboard (Thiên)======
    RefDanhSachNhiemVuVer2Component,
    AddBaoCaoDialogComponent,
    ViewConfigStatusComponent,
  ],
  imports: [
    CommonModule,
    MenuWorkRoutingkModule,
    MatIconModule,
    MatListModule,
    MenuWorkRefModule,
    TranslateModule.forRoot(),
    CustomPipesModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatRippleModule,
    MatSelectModule,
    MatTableModule,
    MatMenuModule,
    AvatarModule,
    MatTooltipModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    FormsModule,
    // BrowserAnimationsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatSnackBarModule,

    QuillModule.forRoot({
      modules: quillConfig,
      placeholder: placeholder,
    }),
    NgxOrgChartModule,
    JeeCommentModule,
    NgxDocViewerModule,
    MatExpansionModule,
    MatSlideToggleModule,
    ChartsModule,//Thiên
    GridsterModule,//Thiên
    DynamicModule,//Thiên
    NgbDropdownModule,//Thiên
    MatCheckboxModule,//Thiên
    MatSidenavModule,
    ThemMoiRef,
    PanelDashboardModuleRef,
    MatTabsModule,
    DragDropModule,
    NgxMatSelectSearchModule,
  ],
  providers: [
    TranslationService,
    TimezonePipe,
    SafeHtmlPipe,

    FormatTimeService,
    // AuthService,
    TokenStorage,
    NgbDropdown,
    LayoutUtilsService,
    SocketioService,
    HighlightDirective,
  ],
  exports: [
    TimezonePipe,
    SafeHtmlPipe,
    RefDanhSachNhiemVuVer2Component,
    DanhSachNhiemVuComponent
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ]
})
export class MenuWorkModule { }
