import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { NgbDatepickerModule, NgbModalModule, NgbButtonsModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { MatRippleModule, MatNativeDateModule, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { AvatarModule } from 'ngx-avatar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatListModule } from '@angular/material/list';
import { MatSliderModule } from '@angular/material/slider';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDividerModule } from '@angular/material/divider';
import { MatStepperModule } from '@angular/material/stepper';
import { MatChipsModule } from '@angular/material/chips';
import { MatTreeModule } from '@angular/material/tree';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { TranslateModule, TranslateService, TranslateStore } from '@ngx-translate/core';
import { MenuServices } from '../services/menu.service';
import { DialogDecision } from './component/dialog-decision/dialog-decision.component';
import { ProcessWorkEditComponent } from './component/process-work-edit/process-work-edit.component';
import { CongViecDialogUpdateComponent } from './component/cong-viec-dialog-update/cong-viec-dialog-update.component';
import { DocViewerComponent } from 'projects/jeeworkflow/src/modules/crud/doc-viewer/doc-viewer.component';
import { PdfViewerComponent } from 'projects/jeeworkflow/src/modules/crud/pdf-viewer/pdf-viewer.component';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { ImageControlModule } from 'dps-lib';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { DynamicFormModule } from './component/dynamic-form/dynamic-form.module';
import { DndModule } from 'ngx-drag-drop';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { TranslationService } from 'projects/jeeworkflow/src/modules/i18n/translation.service';
import { LayoutUtilsService } from 'projects/jeeworkflow/src/modules/crud/utils/layout-utils.service';
import { HttpUtilsService } from 'projects/jeeworkflow/src/modules/crud/utils/http-utils.service';
import { DynamicSearchFormService } from './component/dynamic-search-form/dynamic-search-form.service';
import { DanhMucChungService } from '../services/danhmuc.service';
import { FormatTimeService } from '../services/jee-format-time.component';
import './../../../../src/styles.scss'
import { AddNewFieldsComponent } from './component/jeework/add-new-fields/add-new-fields.component';
import { WorkAssignedComponent } from './component/jeework/work-assigned/work-assigned.component';
import { WorkListNewComponent } from './component/jeework/work-list-new/work-list-new.component';
import { TaskDatetimeComponent } from './component/jeework/task-datetime/task-datetime.component';
import { AvatarUserComponent } from './component/jeework/custom-avatar/avatar-user/avatar-user.component';
import { ChooseUsersComponent } from './component/jeework/choose-users/choose-users.component';
import { TimeEstimatesViewComponent } from './component/jeework/time-estimates-view/time-estimates-view.component';
import { TaskCommentComponent } from './component/jeework/task-comment/task-comment.component';
import { AppFocusBlockComponent } from './component/jeework/app-focus-block/app-focus-block.component';
import { CustomPipesModule } from './component/custom/custom-pipe.module';
import { TasksGroupComponent } from './component/jeework/tasks-group/tasks-group.component';
import { AddTaskComponent } from './component/jeework/add-task/add-task.component';
import { DialogSelectdayComponent } from './component/jeework/dialog-selectday/dialog-selectday.component';
import { ListDepartmentService, MenuPhanQuyenServices, ProjectsTeamService, WeWorkService, WorkGeneralService } from '../services/jee-work.service';
import { ActionNotificationComponent } from 'projects/jeeworkflow/src/modules/crud/action-natification/action-notification.component';
import { DeleteEntityDialogComponent } from 'projects/jeeworkflow/src/modules/crud/delete-entity-dialog/delete-entity-dialog.component';
import { UpdateStatusWFDialogComponent } from 'projects/jeeworkflow/src/modules/crud/update-status-dialog-wf/update-status-dialog-wf.component';
import { TemplateCenterComponent } from './component/jeework/template-center/template-center.component';
import { TemplateCenterUpdateComponent } from './component/jeework/template-center/template-center-update/template-center-update.component';
import { AvatarListUsersComponent } from './component/jeework/custom-avatar/avatar-list-users/avatar-list-users.component';
import { JeeCommentLibModule, TranslationCommentService } from 'dps-comment';
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
    ActionNotificationComponent,
    DeleteEntityDialogComponent,
    UpdateStatusWFDialogComponent,
    DialogDecision,
    ProcessWorkEditComponent,
    CongViecDialogUpdateComponent,
    DocViewerComponent,
    PdfViewerComponent,
    AddNewFieldsComponent,
    WorkAssignedComponent,
    WorkListNewComponent,
    TaskDatetimeComponent,
    AvatarUserComponent,
    AvatarListUsersComponent,
    ChooseUsersComponent,
    TimeEstimatesViewComponent,
    TaskCommentComponent,
    AppFocusBlockComponent,
    TasksGroupComponent,
    AddTaskComponent,
    DialogSelectdayComponent,
    TemplateCenterComponent,
    TemplateCenterUpdateComponent,
  ],
  imports: [
    CommonModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatAutocompleteModule,
    MatListModule,
    MatSliderModule,
    MatCardModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatNativeDateModule,
    MatSlideToggleModule,
    MatCheckboxModule,
    MatMenuModule,
    MatTabsModule,
    MatTooltipModule,
    MatSidenavModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTableModule,
    MatGridListModule,
    MatToolbarModule,
    MatBottomSheetModule,
    MatExpansionModule,
    MatDividerModule,
    MatSortModule,
    MatStepperModule,
    MatChipsModule,
    MatPaginatorModule,
    MatDialogModule,
    MatRippleModule,
    MatRadioModule,
    MatTreeModule,
    MatButtonToggleModule,
    FormsModule,
    ReactiveFormsModule,
    MatMenuModule,
    AvatarModule,
    MatTooltipModule,
    NgbModalModule,
    NgbDatepickerModule,
    TranslateModule,
    NgbDropdownModule,
    NgxMatSelectSearchModule,
    ImageControlModule,
    DragDropModule,
    DynamicFormModule,
    DndModule,
    NgxDocViewerModule,
    PdfViewerModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    CustomPipesModule,
    JeeCommentLibModule,
  ],
  entryComponents: [
    ActionNotificationComponent,
    DeleteEntityDialogComponent,
    UpdateStatusWFDialogComponent,
    DialogDecision,
    ProcessWorkEditComponent,
    CongViecDialogUpdateComponent,
    AddNewFieldsComponent,
    WorkAssignedComponent,
    WorkListNewComponent,
    TaskDatetimeComponent,
    AvatarUserComponent,
    AvatarListUsersComponent,
    ChooseUsersComponent,
    TimeEstimatesViewComponent,
    TaskCommentComponent,
    AppFocusBlockComponent,
    TasksGroupComponent,
    AddTaskComponent,
    DialogSelectdayComponent,
    TemplateCenterComponent,
    TemplateCenterUpdateComponent,
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'vi' },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS_EDIT },
    MenuServices,
    TranslationService,
    LayoutUtilsService,
    HttpUtilsService,
    DatePipe,
    DynamicSearchFormService,
    TranslateService,
    DanhMucChungService,
    FormatTimeService,
    ProjectsTeamService,
    WeWorkService,
    MenuPhanQuyenServices,
    WorkGeneralService,
    ListDepartmentService,
    TranslationCommentService,
  ],
  exports: [
    TranslateModule,
    DialogDecision,
    ProcessWorkEditComponent,
    CongViecDialogUpdateComponent,
    DocViewerComponent,
    PdfViewerComponent,
    AddNewFieldsComponent,
    WorkAssignedComponent,
    WorkListNewComponent,
    TaskDatetimeComponent,
    AvatarUserComponent,
    AvatarListUsersComponent,
    ChooseUsersComponent,
    TimeEstimatesViewComponent,
    TaskCommentComponent,
    AppFocusBlockComponent,
    TasksGroupComponent,
    AddTaskComponent,
    DialogSelectdayComponent,
    TemplateCenterComponent,
    TemplateCenterUpdateComponent,
    JeeCommentLibModule,
  ]
})
export class JeeWFWorkModule { }
