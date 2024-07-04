import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgApexchartsModule } from 'ng-apexcharts';
import { InlineSVGModule } from 'ng-inline-svg';
import { NgbDatepickerModule, NgbDropdownModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PageGirdtersDashboardService } from './Services/page-girdters-dashboard.service';
import { PageGidtersDashboardComponent } from './page-girdters-dashboard.component';
import { GridsterModule } from 'angular-gridster2';
import { DynamicModule } from 'ng-dynamic-component';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { AddCloseWidgetDialogComponent } from './widgets/add-widget-dashborad/add-widget-dashborad.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMenuModule } from '@angular/material/menu';
import { AvatarModule } from 'ngx-avatar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ChartsModule } from 'ng2-charts';
import { MAT_DIALOG_DATA, MAT_DIALOG_DEFAULT_OPTIONS, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { HttpUtilsService } from 'projects/jeehr/src/modules/crud/utils/http-utils.service';
import { TranslateModule } from '@ngx-translate/core';
import './../../../../../src/styles.scss';
import { MatButtonModule } from '@angular/material/button';
import { ListMembersWidgetComponent } from './widgets/member-widget/member-widget.component';
import { WorkGeneralService } from './Services/work-general.services';
import { TrangThaiCongViecWidgetComponent } from './widgets/trang-thai-cong-viec-widget/trang-thai-cong-viec-widget.component';
import { MyWorksWidgetComponent } from './widgets/my-works-widget/my-works-widget.component';
import { AvatarUserComponent } from './component/avatar-user/avatar-user.component';
import { TaskDatetimeComponent } from './component/task-datetime/task-datetime.component';
import { TaskDatetimePCComponent } from './component/task-datetime-pc/task-datetime-pc.component';
import { Timezone } from './component/pipe/timezone.pipe';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { WorksByProjectComponent } from './widgets/works-by-project/works-by-project.component';
import { CuTagComponent } from './component/cu-tag/cu-tag.component';
import { ChooseMilestoneAndTagComponent } from './component/choose-milestone-and-tags/choose-milestone-and-tags.component';
import { ColorPicker2Component } from './component/color-picker2/color-picker2.component';
import { TongHopDuAnWidgetComponent } from './widgets/tong-hop-du-an-widget/tong-hop-du-an-widget.component';
import { BieuDoTheoDoiWidgetComponent } from './widgets/bieu-do-theo-doi/bieu-do-theo-doi-widget.component';
import { BieuDoWidget18Component } from './widgets/widget-18/widget-18.component';
import { BieuDoWidget19Component } from './widgets/widget-19/widget-19.component';
import { MyWorksWidget20Component } from './widgets/widget-20/my-works-widget-20.component';
import { MyWorksWidget21Component } from './widgets/widget-21/my-works-widget-21.component';
import { MyWorksWidget22Component } from './widgets/widget-22/my-works-widget-22.component';
import { MyWorksWidget23Component } from './widgets/widget-23/my-works-widget-23.component';
import { MyWorksWidget24Component } from './widgets/widget-24/my-works-widget-24.component';
import { WorksByProject25Component } from './widgets/widget-25/works-by-project-25.component';
import { WidgetCongViecQuanTrongComponent } from './widgets/widget-cong-viec-quan-trong/widget-cong-viec-quan-trong.component';
import { WidgetTheoDoiNhiemVuDaGiaoComponent } from './widgets/widget-theo-doi-nhiem-vu-da-giao/widget-theo-doi-nhiem-vu-da-giao.component';
import { WidgetNhiemVuTheoNguoiGiaoComponent } from './widgets/widget-nhiem-vu-theo-nguoi-giao/widget-nhiem-vu-theo-nguoi-giao.component';
import { WidgetTongHopCongViecComponent } from './widgets/widget-tong-hop-cong-viec/widget-tong-hop-cong-viec.component';
import { WidgetKhoiLuongCongViecComponent } from './widgets/widget-khoi-luong-cong-viec/widget-khoi-luong-cong-viec.component';
import { ChartTheoDoiNhiemVuWidgetComponent } from './widgets/chart-theo-doi-nhiem-vu-widget/chart-theo-doi-nhiem-vu-widget.component';
import { ListWorksDraftComponent } from './widgets/list-works-draft/list-works-draft.component';
import { TaskCommentDashboardComponent } from './component/task-comment/task-comment.component';
import { SetUpWidgetTimeComponent } from './widgets/thiet-lap-thoi-gian/set-up-widget-time/set-up-widget-time.component';
import { MotanoidungSetTimeComponent } from './widgets/thiet-lap-thoi-gian/motanoidung-set-time/motanoidung-set-time.component';
import { EditPopupWidgetTimeComponent } from './widgets/thiet-lap-thoi-gian/edit-popup-widget-time/edit-popup-widget-time.component';
import { MatTableModule } from '@angular/material/table';
import { CustomPipesModule } from './component/custom/custom-pipe.module';
import { JeeCommentModule } from '../../JeeCommentModule/jee-comment/jee-comment.module';
import { FormatTimeService } from './Services/jee-format-time.component';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { WidgetYeuCauVPPComponent } from './widgets/widget-yeu-cau-vpp/widget-yeu-cau-vpp.component';
import { JeeAdminWidgetService } from './Services/jeeadmin.service';
import { LayoutUtilsService } from 'src/app/modules/crud/utils/layout-utils.service';
import { NhacNhoNhiemVuDaGiaoWidgetComponent } from './widgets/nhac-nho-nhiem-vu-da-giao-widget/nhac-nho-nhiem-vu-da-giao-widget.component';
import { NhacNhoNhiemVuDuocGiaoWidgetComponent } from './widgets/nhac-nho-nhiem-vu-duoc-giao-widget/nhac-nho-nhiem-vu-duoc-giao-widget.component';
import { DanhSachNhiemVuDonViDuocGiaoWidgetComponent } from './widgets/danh-sach-nhiem-vu-don-vi-duoc-giao-widget/danh-sach-nhiem-vu-don-vi-duoc-giao-widget.component';
import { JeeAccountService } from '../../JeeAccount/services/jee-account.service';
import { ListMembersWidgetV1Component } from './widgets/WorkV1/member-widget/member-widget-v1.component';
import { JeeWorkLiteService, TagsService } from './widgets/WorkV1/services/wework.services';
import { MyWorksWidgetV1Component } from './widgets/WorkV1/my-works-widget/my-works-widget-v1.component';
import { TaskCommentDashboardV1Component } from './component/task-comment-v1/task-comment-v1.component';
import { JeeCommentLibModule, TranslationCommentService } from 'dps-comment';
import { TrangThaiCongViecWidgetV1Component } from './widgets/WorkV1/trang-thai-cong-viec-v1/trang-thai-cong-viec-widget-v1.component';
import { WorksByProjectV1Component } from './widgets/WorkV1/works-by-project-v1/works-by-project-v1.component';
import { SetUpWidgetTimeV1Component } from './widgets/WorkV1/thiet-lap-thoi-gian-v1/set-up-widget-time-v1/set-up-widget-time-v1.component';
import { MotanoidungSetTimeV1Component } from './widgets/WorkV1/thiet-lap-thoi-gian-v1/motanoidung-set-time-v1/motanoidung-set-time-v1.component';
import { EditPopupWidgetTimeV1Component } from './widgets/WorkV1/thiet-lap-thoi-gian-v1/edit-popup-widget-time-v1/edit-popup-widget-time-v1.component';
import { CuTagV1Component } from './widgets/WorkV1/component/cu-tag-v1/cu-tag-v1.component';
import { ChooseMilestoneAndTagV1Component } from './widgets/WorkV1/component/choose-milestone-and-tags-v1/choose-milestone-and-tags-v1.component';
import { RefWidgetNhiemVuVer2Component } from './widgets/ref-widget-nhiem-vu-v2/ref-widget-nhiem-vu-v2.component';
import { CuTagV2Component } from './component/v2-cu-tag/v2-cu-tag.component';
import { ChooseUsersV2Component } from './component/v2-choose-users/v2-choose-users.component';
import { ChooseMilestoneAndTagV2Component } from './component/v2-choose-milestone-and-tags/v2-choose-milestone-and-tags.component';
import { DanhSachChucNangWidgetComponent } from './widgets/danh-sach-chuc-nang/danh-sach-chuc-nang.component';
import { TourGuideModule } from '../../tour-guide/tour-guide.module';

const MY_FORMATS_EDIT: any = {
  parse: {
    dateInput: 'D/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM Y',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM Y',
  },
};

@NgModule({
  declarations: [
    PageGidtersDashboardComponent,
    AddCloseWidgetDialogComponent,
    ListMembersWidgetComponent,
    // ListYeuCauChoDuyetWidgetComponent,
    // ListProjectsTeamWidgetComponent,
    MyWorksWidgetComponent,
    TrangThaiCongViecWidgetComponent,
    WorksByProjectComponent,
    // WorkEditComponent,
    // NhiemVuWidgetComponent,
    TongHopDuAnWidgetComponent,
    BieuDoTheoDoiWidgetComponent,
    BieuDoWidget18Component,
    BieuDoWidget19Component,
    MyWorksWidget20Component,
    MyWorksWidget21Component,
    MyWorksWidget22Component,
    MyWorksWidget23Component,
    MyWorksWidget24Component,
    WorksByProject25Component,
    WidgetCongViecQuanTrongComponent,
    SetUpWidgetTimeComponent,
    MotanoidungSetTimeComponent,
    WidgetTheoDoiNhiemVuDaGiaoComponent,
    WidgetNhiemVuTheoNguoiGiaoComponent,
    EditPopupWidgetTimeComponent,
    WidgetTongHopCongViecComponent,
    WidgetKhoiLuongCongViecComponent,
    ChartTheoDoiNhiemVuWidgetComponent,
    ListWorksDraftComponent,
    AvatarUserComponent,
    TaskDatetimeComponent,
    TaskDatetimePCComponent,
    Timezone,
    CuTagComponent,
    ChooseMilestoneAndTagComponent,
    ColorPicker2Component,
    TaskCommentDashboardComponent,
    WidgetYeuCauVPPComponent,
    NhacNhoNhiemVuDaGiaoWidgetComponent,
    NhacNhoNhiemVuDuocGiaoWidgetComponent,
    DanhSachNhiemVuDonViDuocGiaoWidgetComponent,
    //========Start widget workv1=========
    TaskCommentDashboardV1Component,
    ListMembersWidgetV1Component,
    MyWorksWidgetV1Component,
    TrangThaiCongViecWidgetV1Component,
    WorksByProjectV1Component,
    SetUpWidgetTimeV1Component,
    MotanoidungSetTimeV1Component,
    EditPopupWidgetTimeV1Component,
    CuTagV1Component,
    ChooseMilestoneAndTagV1Component,
    //========End widget workv1=========
    
    //=====Start Component V2===========
    RefWidgetNhiemVuVer2Component,
    ChooseUsersV2Component,
    CuTagV2Component,
    ChooseMilestoneAndTagV2Component,
    //=====End Component V2=============
    DanhSachChucNangWidgetComponent,
  ],
  imports: [
    CommonModule,
    InlineSVGModule,
    NgApexchartsModule,
    NgbDropdownModule,
    GridsterModule,
    DynamicModule,
    MatIconModule,
    MatButtonToggleModule,
    MatSlideToggleModule,
    PerfectScrollbarModule,
    MatIconModule,
    MatSlideToggleModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      {
        path: '',
        component: PageGidtersDashboardComponent,
      }
    ]),
    MatDatepickerModule,
    NgbDatepickerModule,
    MatMenuModule,
    AvatarModule,
    MatTooltipModule,
    FormsModule,
    ChartsModule,
    CustomPipesModule,
    MatCheckboxModule,
    MatButtonModule,
    TranslateModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    NgbModule,
    JeeCommentModule,
    MatTableModule,
    MatSelectModule,
    MatMenuModule,
    AvatarModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    JeeCommentLibModule,
    TourGuideModule,
  ],
  providers: [PageGirdtersDashboardService,
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS_EDIT },
    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
      useValue: {
        hasBackdrop: true,
        panelClass: 'kt-mat-dialog-container__wrapper',
        height: 'auto',
        width: '700px'
      }
    },
    { provide: MAT_DIALOG_DATA, useValue: {} },
    { provide: MatDialogRef, useValue: {} },
    FormatTimeService,
    HttpUtilsService,
    WorkGeneralService,
    JeeAdminWidgetService,
    LayoutUtilsService,
    JeeAccountService,
    JeeWorkLiteService,
    TranslationCommentService,
    TagsService,
  ],
  entryComponents: [
    AddCloseWidgetDialogComponent,
    RefWidgetNhiemVuVer2Component,
  ],
  exports:[
    RefWidgetNhiemVuVer2Component,
  ]
})
export class PageGirdtersDashboardModule { }
