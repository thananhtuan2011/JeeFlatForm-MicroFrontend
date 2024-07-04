
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
import { ChiTietCuocHopComponent } from './components/chi-tiet-cuoc-hop/chi-tiet-cuoc-hop.component';
import { DangKyTaiSanComponent } from './components/dang-ky-tai-san/dang-ky-tai-san.component';
import { DanhSachDangKyHuyComponent } from './components/danh-sach-dang-ky-huy/danh-sach-dang-ky-huy.component';
import { DangKyCuocHopPageComponent } from './components/dang-ky-cuoc-hop-page/dang-ky-cuoc-hop-page.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { DangKyCuocHopService } from './_services/dang-ky-cuoc-hop.service';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import timeGridPlugin from '@fullcalendar/timegrid';
// import { ContextMenuModule } from 'ngx-contextmenu';
import { QuanLyPhongHopDialogComponent } from './components/quan-ly-phong-hop-dialog/quan-ly-phong-hop-dialog.component';
import { DialogDraggableTitleDirective } from './components/quan-ly-phong-hop-dialog/dialog-draggable-title.dirextive';
import { ModalPositionCache } from './components/quan-ly-phong-hop-dialog/modal-position.cache';
import { StateService } from './_services/state.service';
import { EditorModule } from "@tinymce/tinymce-angular";

import { SafeHtmlPipe } from './components/SafeHtmlPipe';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ChooseUsersMTComponent } from './components/choose-users/choose-users-mt.component';
import { QuanLyPhongHopInfoComponent } from './components/quan-ly-phong-hop-info/quan-ly-phong-hop-info.component';
import { QuanLyPhongHopGhiChuComponent } from './components/quan-ly-phong-hop-ghi-chu/quan-ly-phong-hop-ghi-chu.component';
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
import { MenuPhanQuyenServices } from './components/jeework-components/_services/menu-phan-quyen.service';
import { CommunicateService } from './components/jeework-components/_services/communicate.service';
import { WorkService } from './components/jeework-components/_services/work.service';
import { ProjectsTeamService } from './components/jeework-components/_services/department-and-project.service';
import { WorkListNewComponent } from './components/jeework-components/work-list-new.component';
import { TagsService } from './components/jeework-components/_services/tags.service';
import { TagsEditComponent } from './components/jeework-components/tags-edit/tags-edit.component';
import { DialogSelectdayComponent } from './components/jeework-components/dialog-selectday/dialog-selectday.component';
import { ChooseUsersComponent } from './components/jeework-components/choose-users/choose-users.component';
import { WorkGroupEditComponent } from './components/jeework-components/work-group-edit/work-group-edit.component';
import { DuplicateWorkComponent } from './components/jeework-components/work-duplicate/work-duplicate.component';
import { DuplicateTaskNewComponent } from './components/jeework-components/duplicate-task-new/duplicate-task-new.component';
import { WorkAssignedComponent } from './components/jeework-components/work-assigned/work-assigned.component';
import { StatusDynamicDialogComponent } from './components/jeework-components/status-dynamic-dialog/status-dynamic-dialog.component';
import { ColorPicker2Component } from './components/jeework-components/color-picker2/color-picker2.component';
import { AppFocusBlockComponent } from './components/jeework-components/app-focus-block/app-focus-block.component';
import { AddTaskComponent } from './components/jeework-components/add-task/add-task.component';
import { ClickOutsideDirective } from './components/jeework-components/clickoutside.directive';
import { ChooseMilestoneAndTagComponent } from './components/jeework-components/choose-milestone-and-tags/choose-milestone-and-tags.component';
import { CuTagComponent } from './components/jeework-components/choose-milestone-and-tags/tags-new/cu-tag/cu-tag.component';
import { AddNewFieldsComponent } from './components/jeework-components/add-new-fields/add-new-fields.component';
import { AvatarListUsersComponent } from './components/jeework-components/custom-avatar/avatar-list-users/avatar-list-users.component';
import { AvatarUserComponent } from './components/jeework-components/custom-avatar/avatar-user/avatar-user.component';
import { AllowUpdateStatus } from './components/jeework-components/_pipe/allow_update_status.pipe';
import { TaskDatetimeComponent } from './components/jeework-components/field-custom/task-datetime/task-datetime.component';
import { TimeEstimatesViewComponent } from './components/jeework-components/time-estimates-view/time-estimates-view.component';
import { TaskCommentComponent } from './components/jeework-components/field-custom/task-comment/task-comment.component';
import { TasksGroupComponent } from './components/jeework-components/field-custom/tasks-group/tasks-group.component';
import { milestoneDetailEditComponent } from './components/jeework-components/milestone-detail-edit/milestone-detail-edit.component';
import { workAddFollowersComponent } from './components/jeework-components/work-add-followers/work-add-followers.component';
import { TimezonePipe } from './components/jeework-components/_pipe/timezone.pipe';
import { UserGroupComponent } from './components/jeework-components/field-custom/user-group/user-group.component';
import { SearchBoxCustomComponent } from './components/jeework-components/field-custom/search-box-custom/search-box-custom.component';
import { PrioritizeComponent } from './components/jeework-components/field-custom/prioritize/prioritize.component';
import { JeeWorkLiteService } from './components/jeework-components/_services/wework.services';
import { AvatarUserMTComponent } from './components/custom-avatar/avatar-user/avatar-user-mt.component';
import { ContentLoadingComponent } from './components/content-loading/content-loading.component';
import { MeetingStore } from './_services/meeting.store';
import { ProjectTeamEditComponent } from './components/jeework-components/projects-team/project-team-edit/project-team-edit.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { ProjectTeamEditStatusComponent } from './components/jeework-components/projects-team/project-team-edit-status/project-team-edit-status.component';
import { ListDepartmentService } from './components/jeework-components/_services/List-department.service';
import { CommonService } from './components/jeework-components/_services/common.service';
import { UpdateStatusProjectComponent } from './components/jeework-components/projects-team/update-status-project/update-status-project.component';
import { ClosedProjectComponent } from './components/jeework-components/projects-team/closed-project/closed-project.component';
import { TaoCuocHopDialogComponent } from './components/tao-cuoc-hop-dialog/tao-cuoc-hop-dialog.component';
import { CRUDTableModule } from '../share/crud-table.module';
import './../../../../src/styles.scss';
import './../../../styles.scss';// styte css of project
import { ActionNotificationComponent } from 'projects/jeemeeting/src/modules/crud/action-natification/action-notification.component';
import { DeleteEntityDialogComponent } from 'projects/jeemeeting/src/modules/crud/delete-entity-dialog/delete-entity-dialog.component';
import { LayoutUtilsService } from 'projects/jeemeeting/src/modules/crud/utils/layout-utils.service';
import { TranslationService } from 'projects/jeemeeting/src/modules/i18n/translation.service';
import "quill-mention"
import { MenuWorkModule } from 'projects/jeework/src/app/page/jee-work/MenuWork/menu-work.module';
import { NgxContentLoadingModule } from 'ngx-content-loading';
FullCalendarModule.registerPlugins([ // register FullCalendar plugins
  dayGridPlugin,
  interactionPlugin,
  listPlugin,
  timeGridPlugin
]);
@NgModule({
  imports: [
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
    MenuWorkModule,
    NgxContentLoadingModule,
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'vi' },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
      useValue: {
        hasBackdrop: true,
        //  disableClose: true,
        // panelClass: "no-padding",
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
    ModalPositionCache,
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
    ProjectsTeamService,
    TagsService,
    WorkService,
    CommunicateService,
    MenuPhanQuyenServices,
    JeeWorkLiteService,
    // TagsService,
    // WeWorkService,
    WorkService,
    CommunicateService,
    MenuPhanQuyenServices,
    //end jeewok
    MeetingStore,
    // SocketioStore,
    // SocketioService,
    ListDepartmentService,
    CommonService,
    LayoutUtilsService,
    TranslateService,
    TranslationService,

  ],
  declarations: [
    MenuCuocHopComponent,
    JeeMeetingComponent,
    SafeHtmlPipe,
    ChiTietCuocHopComponent,
    DangKyTaiSanComponent,
    DanhSachDangKyHuyComponent,
    DangKyCuocHopPageComponent,
    QuanLyPhongHopDialogComponent,
    DialogDraggableTitleDirective,
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

    //Jeework new
    ChooseUsersComponent,
    AvatarUserComponent,
    AvatarListUsersComponent,
    WorkListNewComponent,
    AddNewFieldsComponent,
    CuTagComponent,
    ChooseMilestoneAndTagComponent,
    ClickOutsideDirective,
    AddTaskComponent,
    AppFocusBlockComponent,
    ColorPicker2Component,
    StatusDynamicDialogComponent,
    WorkAssignedComponent,
    DuplicateTaskNewComponent,
    DuplicateWorkComponent,
    WorkGroupEditComponent,
    ChooseUsersComponent,
    DialogSelectdayComponent,
    TagsEditComponent,
    AllowUpdateStatus,
    TaskDatetimeComponent,
    TimeEstimatesViewComponent,
    TaskCommentComponent,
    TasksGroupComponent,
    milestoneDetailEditComponent,
    workAddFollowersComponent,
    UserGroupComponent,
    SearchBoxCustomComponent,
    PrioritizeComponent,
    //end jeework

    QuanLyPhongHopGhiChuComponent,
    QuanLyPhongHopInfoComponent,
    DanhSachCuocHopComponent,
    TimeAgoPipeCus,
    TimezonePipe,
    ListUsersCustomComponent,
    UserCustomComponent,
    AvatarUserMTComponent,
    ChooseUsersMTComponent,
    ContentLoadingComponent,
    ProjectTeamEditComponent,
    ProjectTeamEditStatusComponent,
    UpdateStatusProjectComponent,
    ClosedProjectComponent,
    TaoCuocHopDialogComponent,
    ActionNotificationComponent,
    DeleteEntityDialogComponent,
  ],
  entryComponents: [
    MenuCuocHopComponent,
    JeeMeetingComponent,
    QuanLyPhongHopDialogComponent,
    QuanLyPhongHopGhiChuComponent,
    QuanLyPhongHopInfoComponent,
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

    ChooseUsersComponent,
    AvatarUserComponent,
    AvatarListUsersComponent,
    WorkListNewComponent,
    AddNewFieldsComponent,
    CuTagComponent,
    ChooseMilestoneAndTagComponent,
    ClickOutsideDirective,
    AddTaskComponent,
    AppFocusBlockComponent,
    ColorPicker2Component,
    StatusDynamicDialogComponent,
    WorkAssignedComponent,
    DuplicateTaskNewComponent,
    DuplicateWorkComponent,
    WorkGroupEditComponent,
    ChooseUsersComponent,
    DialogSelectdayComponent,
    TagsEditComponent,
    AllowUpdateStatus,
    TaskDatetimeComponent,
    TimeEstimatesViewComponent,
    TaskCommentComponent,
    TasksGroupComponent,
    milestoneDetailEditComponent,
    workAddFollowersComponent,
    UserGroupComponent,
    SearchBoxCustomComponent,
    PrioritizeComponent,
    AvatarUserMTComponent,
    ChooseUsersMTComponent,
    ProjectTeamEditComponent,
    ProjectTeamEditStatusComponent,
    UpdateStatusProjectComponent,
    ClosedProjectComponent,
    TaoCuocHopDialogComponent
  ],
  exports: [
  ],
  bootstrap: [JeeMeetingComponent, DangKyTaiSanComponent]
})
export class JeeMeetingModule { }
