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
import { ChooseUsersComponent } from './choose-users/choose-users.component';
import { ChooseUsersV2Component } from './choose-users-v2/choose-users-v2.component';
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
import { AvatarUserComponent } from './panel-dashboard/component/avatar-user/avatar-user.component';
import { TaskDatetimeComponent } from './panel-dashboard/component/task-datetime/task-datetime.component';
import { TaskDatetimePCComponent } from './panel-dashboard/component/task-datetime-pc/task-datetime-pc.component';
import { Timezone } from './panel-dashboard/component/pipe/timezone.pipe';
import { MyWorksWidget24Component } from './panel-dashboard/widget/widget-24/my-works-widget-24.component';
import { WorksByProject25Component } from './panel-dashboard/widget/widget-25/works-by-project-25.component';
import { ChartsModule } from 'ng2-charts';
import { GridsterModule } from 'angular-gridster2';
import { DynamicModule } from 'ng-dynamic-component';
import { EditorJeeWorkComponent } from './editor-jeework/editor-jeework';
import {MatSidenavModule} from '@angular/material/sidenav';
import { DeleteEntityDialogComponent } from 'projects/jeework/src/modules/crud/delete-entity-dialog/delete-entity-dialog.component';
import { CuTagComponent } from './cu-tag/cu-tag.component';
import { ColorPicker2Component } from './color-picker2/color-picker2.component';
import { ChooseMilestoneAndTagComponent } from './choose-milestone-and-tags/choose-milestone-and-tags.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ThemMoiCongViecKhongVanBanComponent } from './them-moi-cong-viec-khong-van-ban/them-moi-cong-viec-khong-van-ban.component';
import { TimeEstimatesViewComponent } from '../time-estimates-view/time-estimates-view.component';
import { ListNhiemVuPopupComponent } from './panel-dashboard/list-nhiem-vu-popup/list-nhiem-vu-popup.component';
import { PanelDashboardModuleRef } from './panel-dashboard/panel-dashboard-ref.module';
import { ThemMoiCongViecVer2Component } from './them-moi-cong-viec-ver2/them-moi-cong-viec-ver2.component';
import { ChuyenXuLyNhiemVuComponent } from './chuyen-xu-ly-nhiem-vu/chuyen-xu-ly-nhiem-vu.component';
import { ListNhiemVuPopupV2Component } from './panel-dashboard/list-nhiem-vu-popup-v2/list-nhiem-vu-popup-v2.component';
import { ListNhiemVuPopupV2ChildComponent } from './panel-dashboard/list-nhiem-vu-popup-v2-child/list-nhiem-vu-popup-v2-child.component';
import { SwitchHandlerComponent } from './switch-handler/switch-handler.component';
import { DetailTaskV2ComponentComponent } from '../detail-task-v2-component/detail-task-v2-component.component';
import { LogWorkDescriptionComponent } from './log-work-description/log-work-description.component';
import { ChooseUsersFollowComponent } from './choose-users-follow/choose-users-follow.component';
import { ChooseDepartmentComponent } from './choose-department/choose-department.component';
import { ChooseProjectNVPHComponent } from './choose-project-nvph/choose-project-nvph.component';
import { StatusAttachedComponent } from './status-attched/status-attached.component';
import { ThemMoiCongViecVer3Component } from './them-moi-cong-viec-ver3/them-moi-cong-viec-ver3.component';
import { AlternativeKeywordListComponent } from './alternative-keyword-list/alternative-keyword-list.component';
import { EditorUrgesComponent } from './editor-urges/editor-urges';
import { ReasonFormComponent } from './reason-form/reason-form.component';
import { WorkResultDialogComponent } from './update-workresult-editor/update-workresult-editor.component';
import { CustomUserComponent } from './custom-user/custom-user.component';
import { BaoCaoService } from './bao-cao/services/bao-cao.services';
import { ChooseGroupWorkComponent } from './choose-group-work/choose-group-work.component';
import { TasksGroupComponent } from './tasks-group/tasks-group.component';
import { WorkService } from './bao-cao/services/jee-work.service';
@NgModule({
  declarations: [
    // MenuWorkComponent,
    // MenuLeftTitleComponent,
    // MenuWorkComponent,
    // DonViThucHienComponent,
    // NhacNhoNhiemVuComponent,
    DetailTaskComponentComponent,
    // TaskDatetimeComponent,
    TimezonePipe,
    // PanelRightComponent,
    SafeHtmlPipe,
    ChooseUsersComponent,
    ChooseUsersV2Component,
    // ListMenuWorkComponent,
    // CongViecTheoDuAnChartComponent,
    // DocViewerComponent,
    ThemMoiCongViecComponent,
    ThemMoiCongViecVer2Component,
    ThemMoiCongViecVer3Component,
    ChooseUsersForCreateTaskComponent,
    ChooseProjectComponent,
    CustomUserComponent,
    // DialogSelectdayComponent,
    // ActionNotificationComponent,
    // ThietLapNhiemVuComponent,
    // TaskCommentComponent,
    // DeleteEntityDialogComponent,
    CuTagComponent,
    //============Start dashboard (Thiên)====
    // PanelDashboardComponent,
    // AddCloseWidgetDialogComponent,
    // SetUpWidgetTimeComponent,
    // MotanoidungSetTimeComponent,
    // EditPopupWidgetTimeComponent,
    // TrangThaiCongViecWidgetComponent,
    // TongHopDuAnWidgetComponent,
    // BieuDoTheoDoiWidgetComponent,
    // BieuDoWidget18Component,
    // MyWorksWidget20Component,
    // MyWorksWidget21Component,
    // AvatarUserComponent,
    // TaskDatetimeComponent,
    // TaskDatetimePCComponent,
    // Timezone,
    // MyWorksWidget24Component,
    // WorksByProject25Component,
    // TaskCommentComponent,
    EditorJeeWorkComponent,
    ColorPicker2Component,
    ChooseMilestoneAndTagComponent,
    ThemMoiCongViecKhongVanBanComponent,
    TimeEstimatesViewComponent,
    //============End dashboard (Thiên)======
    ListNhiemVuPopupComponent,
    ChuyenXuLyNhiemVuComponent,
    ListNhiemVuPopupV2Component,
    ListNhiemVuPopupV2ChildComponent,
    SwitchHandlerComponent,
    DetailTaskV2ComponentComponent,
    LogWorkDescriptionComponent,
    ChooseUsersFollowComponent,
    ChooseDepartmentComponent,
    ChooseProjectNVPHComponent,
    StatusAttachedComponent,
    AlternativeKeywordListComponent,
    EditorUrgesComponent,
    ReasonFormComponent,
    WorkResultDialogComponent,
    TasksGroupComponent,
    ChooseGroupWorkComponent,
  ],
  entryComponents: [
    // MatDialogRef,
    //============Start dashboard (Thiên)======
    // AddCloseWidgetDialogComponent,
    // SetUpWidgetTimeComponent,
    // MotanoidungSetTimeComponent,
    // EditPopupWidgetTimeComponent,
    // AvatarUserComponent,
    // TaskDatetimeComponent,
    // TaskDatetimePCComponent,
    // TaskCommentComponent,
    //============End dashboard (Thiên)======
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
    PanelDashboardModuleRef,
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
    BaoCaoService,
    WorkService,

  ],
  exports: [
    ThemMoiCongViecKhongVanBanComponent,
    ThemMoiCongViecComponent,
    ThemMoiCongViecVer2Component,
    ThemMoiCongViecVer3Component,
    EditorJeeWorkComponent,
    ColorPicker2Component,
    ChooseMilestoneAndTagComponent,
    TimeEstimatesViewComponent,
    ChooseUsersForCreateTaskComponent,
    ChooseProjectComponent,
    ChooseUsersComponent,
    ChooseUsersV2Component,
    DetailTaskComponentComponent,
    SafeHtmlPipe,
    TimezonePipe,
    CuTagComponent,
    ListNhiemVuPopupComponent,
    ChuyenXuLyNhiemVuComponent,
    ListNhiemVuPopupV2Component,
    ListNhiemVuPopupV2ChildComponent,
    SwitchHandlerComponent,
    DetailTaskV2ComponentComponent,
    LogWorkDescriptionComponent,
    ChooseUsersFollowComponent,
    ChooseDepartmentComponent,
    ChooseProjectNVPHComponent,
    StatusAttachedComponent,
    AlternativeKeywordListComponent,
    EditorUrgesComponent,
    ReasonFormComponent,
    WorkResultDialogComponent,
    CustomUserComponent,
    // ChooseGroupWorkComponent,
    TasksGroupComponent,
    ChooseGroupWorkComponent,
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ] 
})
export class ThemMoiRef { }
