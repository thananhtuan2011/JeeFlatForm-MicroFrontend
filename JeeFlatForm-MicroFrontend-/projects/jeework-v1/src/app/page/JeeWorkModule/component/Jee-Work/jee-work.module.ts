import { DragDropModule } from "@angular/cdk/drag-drop";
import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatMomentDateModule, MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from "@angular/material-moment-adapter";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from "@angular/material/bottom-sheet";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatChipsModule } from "@angular/material/chips";
import { DateAdapter, MatNativeDateModule, MAT_DATE_LOCALE } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatDialogModule, MAT_DIALOG_DEFAULT_OPTIONS } from "@angular/material/dialog";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule, MatIconRegistry } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatListModule } from "@angular/material/list";
import { MatMenuModule } from "@angular/material/menu";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatRadioModule } from "@angular/material/radio";
import { MatSelectModule } from "@angular/material/select";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatSliderModule } from "@angular/material/slider";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatSortModule } from "@angular/material/sort";
import { MatStepperModule } from "@angular/material/stepper";
import { MatTableModule } from "@angular/material/table";
import { MatTabsModule } from "@angular/material/tabs";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatTreeModule } from "@angular/material/tree";
import { RouterModule } from "@angular/router";
import { NgbModule, NgbProgressbarModule } from "@ng-bootstrap/ng-bootstrap";
import { TranslateModule } from "@ngx-translate/core";
import { EditorModule } from "@tinymce/tinymce-angular";
import { DropdownTreeModule, DynamicComponentModule } from "dps-lib";
import { AvatarModule } from "ngx-avatar";
import { NgxMatSelectSearchModule } from "ngx-mat-select-search";
import { PerfectScrollbarModule } from "ngx-perfect-scrollbar";
import { PopoverModule } from "ngx-smart-popover";
import { AddNewFieldsComponent } from "./add-new-fields/add-new-fields.component";
import { AddTaskComponent } from "./add-task/add-task.component";
import { CheckListEditComponent } from "./check-list-edit/check-list-edit.component";
import { ChooseMilestoneAndTagComponent } from "./choose-milestone-and-tags/choose-milestone-and-tags.component";
import { ChooseUsersComponent } from "./choose-users/choose-users.component";
import { ColorPicker2Component } from "./color-picker2/color-picker2.component";
import { CuTagComponent } from "./cu-tag/cu-tag.component";
import { AvatarListUsersComponent } from "./custom-avatar/avatar-list-users/avatar-list-users.component";
import { AvatarUserComponent } from "./custom-avatar/avatar-user/avatar-user.component";
import { DialogSelectdayComponent } from "./dialog-selectday/dialog-selectday.component";
import { AttachmentService, CommunicateService, ListDepartmentService, MenuPhanQuyenServices, ProjectsTeamService, TagsService, UpdateByKeyService, WeWorkService, WorkService } from "./jee-work.servide";
import { LogWorkDescriptionComponent } from "./log-work-description/log-work-description.component";
import { milestoneDetailEditComponent } from "./milestone-detail-edit/milestone-detail-edit.component";
import { ApplicationPipesModule } from "./pipe/pipe.module";
import { StatusDynamicDialogComponent } from "./status-dynamic-dialog/status-dynamic-dialog.component";
import { TagsEditComponent } from "./tags-edit/tags-edit.component";
import { TaskDatetimeComponent } from "./task-datetime/task-datetime.component";
import { TaskDatetimePCComponent } from "./task-datetime-pc/task-datetime-pc.component";
import { TasksGroupComponent } from "./tasks-group/tasks-group.component";
import { TemplateCenterUpdateComponent } from "./template-center/template-center-update/template-center-update.component";
import { TemplateCenterComponent } from "./template-center/template-center.component";
import { TemplateCenterService } from "./template-center/template-center.service";
import { TimeEstimatesViewComponent } from "./time-estimates-view/time-estimates-view.component";
import { UpdateByKeysComponent } from "./update-by-keys-edit/update-by-keys-edit.component";
import { WorkAssignedComponent } from "./work-assigned/work-assigned.component";
import { WorkListNewDetailJeeWorkComponent } from "./work-list-new-detail/work-list-new-detail.component";
import { WorkListNewComponent } from "./work-list-new/work-list-new.component";
import { WorkProcessEditComponent } from "./work-process-edit/work-process-edit.component";
import { DndModule } from "ngx-drag-drop";
import { OwlDateTimeModule, OwlNativeDateTimeModule } from "ng-pick-datetime";
import { NgxPrintModule } from "ngx-print";
import { ChooseUsers2Component } from "./choose-users2/choose-users2.component";
import { ChooseMilestoneAndTagCreateComponent } from "./choose-milestone-and-tags-create/choose-milestone-and-tags-create.component";
import { CuTagCreateComponent } from "./cu-tag-create/cu-tag-create.component";
import { AppFocusBlockComponent } from "./app-focus-block/app-focus-block.component";
import { FieldsCustomModule } from "../../custom/fields-custom.module";
import { DialogDeadlineComponent } from "./dialog-deadline/dialog-deadline.component";
import { HttpUtilsService } from "projects/jeework-v1/src/modules/crud/utils/http-utils.service";
import { DanhMucChungService } from "../../../services/danhmuc.service";
import { LayoutUtilsService } from "projects/jeework-v1/src/modules/crud/utils/layout-utils.service";
import { ConfirmationDialogComponent } from "projects/jeework-v1/src/modules/crud/action-confirm/confirmation-dialog.component";
import { TaskCommentWorkV1Component } from "./task-comment/task-comment.component";
import { JeeCommentLibModule, TranslationCommentService } from "dps-comment";
@NgModule({
    imports: [
        MatFormFieldModule,
        CommonModule,
        HttpClientModule,
        FormsModule,
        RouterModule,
        ReactiveFormsModule,
        TranslateModule.forChild(),
        MatDialogModule,
        MatButtonModule,
        MatMenuModule,
        MatSelectModule,
        MatInputModule,
        MatTableModule,
        MatAutocompleteModule,
        MatRadioModule,
        MatIconModule,
        MatNativeDateModule,
        MatProgressBarModule,
        MatDatepickerModule,
        MatCardModule,
        MatPaginatorModule,
        MatSortModule,
        MatListModule,
        MatCheckboxModule,
        MatProgressSpinnerModule,
        MatSnackBarModule,
        MatTabsModule,
        MatStepperModule,
        MatTooltipModule,
        MatMomentDateModule,
        NgxMatSelectSearchModule,
        MatSidenavModule,
        MatSlideToggleModule,
        MatSidenavModule,
        DndModule,
        MatSliderModule,
        OwlDateTimeModule,
        OwlNativeDateTimeModule,
        DragDropModule,
        NgbModule,
        NgbProgressbarModule,
        MatProgressBarModule,
        DropdownTreeModule,
        MatTreeModule,
        MatSnackBarModule,
        MatTabsModule,
        MatTooltipModule,
        MatMomentDateModule,
        NgxMatSelectSearchModule,
        MatExpansionModule,
        DynamicComponentModule,
        PerfectScrollbarModule,
        EditorModule,
        PopoverModule,
        MatChipsModule,
        MatToolbarModule,
        AvatarModule,
        NgxPrintModule,
        ApplicationPipesModule,
        AvatarModule,
        FieldsCustomModule,
        JeeCommentLibModule,
    ],
    providers: [
        { provide: MAT_DATE_LOCALE, useValue: 'vi' },
        { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
        {
            provide: MAT_DIALOG_DEFAULT_OPTIONS,
            useValue: {
                hasBackdrop: true,
                panelClass: 'mat-dialog-container__wrapper',
                height: 'auto',
                width: '700px'
            }
        },
        MatIconRegistry,
        { provide: MatBottomSheetRef, useValue: {} },
        { provide: MAT_BOTTOM_SHEET_DATA, useValue: {} },
        { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
        HttpUtilsService,
        DanhMucChungService,
        LayoutUtilsService,
        //===================
        TemplateCenterService,
        ProjectsTeamService,
        ListDepartmentService,
        WeWorkService,
        CommunicateService,
        MenuPhanQuyenServices,
        WorkService,
        UpdateByKeyService,
        AttachmentService,
        // JeeCommentService,
        TagsService,
        TranslationCommentService,
    ],
    entryComponents: [
        TemplateCenterComponent,
        TemplateCenterUpdateComponent,
        AvatarUserComponent,
        AvatarListUsersComponent,
        WorkListNewComponent,
        WorkListNewDetailJeeWorkComponent,
        AddTaskComponent,
        TimeEstimatesViewComponent,
        WorkAssignedComponent,
        AddNewFieldsComponent,
        DialogSelectdayComponent,
        DialogDeadlineComponent,
        TaskDatetimeComponent,
        TaskDatetimePCComponent,
        LogWorkDescriptionComponent,
        CheckListEditComponent,
        WorkProcessEditComponent,
        StatusDynamicDialogComponent,
        ConfirmationDialogComponent,
        UpdateByKeysComponent,
        ColorPicker2Component,
        TasksGroupComponent,
        CuTagComponent,
        CuTagCreateComponent,
        ChooseMilestoneAndTagComponent,
        ChooseMilestoneAndTagCreateComponent,
        TagsEditComponent,
        milestoneDetailEditComponent,
        AppFocusBlockComponent,
        TaskCommentWorkV1Component,
    ],
    declarations: [
        TemplateCenterComponent,
        TemplateCenterUpdateComponent,
        AvatarUserComponent,
        AvatarListUsersComponent,
        ChooseUsersComponent,
        ChooseUsers2Component,
        WorkListNewComponent,
        WorkListNewDetailJeeWorkComponent,
        AddTaskComponent,
        TimeEstimatesViewComponent,
        WorkAssignedComponent,
        AddNewFieldsComponent,
        DialogSelectdayComponent,
        DialogDeadlineComponent,
        TaskDatetimeComponent,
        TaskDatetimePCComponent,
        LogWorkDescriptionComponent,
        CheckListEditComponent,
        WorkProcessEditComponent,
        StatusDynamicDialogComponent,
        ConfirmationDialogComponent,
        UpdateByKeysComponent,
        ColorPicker2Component,
        TasksGroupComponent,
        CuTagComponent,
        CuTagCreateComponent,
        ChooseMilestoneAndTagComponent,
        ChooseMilestoneAndTagCreateComponent,
        TagsEditComponent,
        milestoneDetailEditComponent,
        AppFocusBlockComponent,
        TaskCommentWorkV1Component,
    ],
    exports: [
        MatDialogModule,
        MatButtonModule,
        MatMenuModule,
        MatSelectModule,
        MatInputModule,
        MatTableModule,
        MatAutocompleteModule,
        MatRadioModule,
        MatIconModule,
        MatNativeDateModule,
        MatProgressBarModule,
        MatDatepickerModule,
        MatCardModule,
        MatPaginatorModule,
        MatSortModule,
        MatCheckboxModule,
        MatProgressSpinnerModule,
        MatSnackBarModule,
        MatTabsModule,
        MatListModule,
        MatTooltipModule,
        MatMomentDateModule,
        NgxMatSelectSearchModule,
        MatSlideToggleModule,
        MatSidenavModule,
        DndModule,
        MatSliderModule,
        OwlDateTimeModule,
        OwlNativeDateTimeModule,
        DragDropModule,
        NgbModule,
        NgbProgressbarModule,
        MatProgressBarModule,
        DropdownTreeModule,
        MatTreeModule,
        PerfectScrollbarModule,
        MatExpansionModule,
        //========================
        TemplateCenterComponent,
        TemplateCenterUpdateComponent,
        AvatarUserComponent,
        AvatarListUsersComponent,
        ChooseUsersComponent,
        ChooseUsers2Component,
        WorkListNewComponent,
        WorkListNewDetailJeeWorkComponent,
        AddTaskComponent,
        TimeEstimatesViewComponent,
        WorkAssignedComponent,
        AddNewFieldsComponent,
        DialogSelectdayComponent,
        DialogDeadlineComponent,
        TaskDatetimeComponent,
        TaskDatetimePCComponent,
        LogWorkDescriptionComponent,
        CheckListEditComponent,
        WorkProcessEditComponent,
        StatusDynamicDialogComponent,
        ConfirmationDialogComponent,
        UpdateByKeysComponent,
        ColorPicker2Component,
        TasksGroupComponent,
        CuTagComponent,
        CuTagCreateComponent,
        ChooseMilestoneAndTagComponent,
        ChooseMilestoneAndTagCreateComponent,
        TagsEditComponent,
        milestoneDetailEditComponent,
        AppFocusBlockComponent,
        TaskCommentWorkV1Component,
    ]
})
export class JeeWorkComponentModule {
}