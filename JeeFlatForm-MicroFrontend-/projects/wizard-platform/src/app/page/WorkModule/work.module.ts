import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import { TranslateModule } from '@ngx-translate/core';
import { WorkComponent } from './work.component';
import { WorkRoutingModule } from './work-routing.module';
import './../../../../src/styles.scss';
import './../../../styles.scss';// styte css of project
import { TranslationService } from 'projects/wizard-platform/src/modules/i18n/translation.service';
import { LayoutUtilsService } from 'projects/wizard-platform/src/modules/crud/utils/layout-utils.service';
import { Step5ComponentComponent } from './step5-component/step5-component.component';
import { Step4ComponentComponent } from './step4-component/step4-component.component';
import { Step3ComponentComponent } from './step3-component/step3-component.component';
import { Step2ComponentComponent } from './step2-component/step2-component.component';
import { Step1ComponentComponent } from './step1-component/step1-component.component';
import { StatusDynamicDialogComponent } from './status-dynamic-dialog/status-dynamic-dialog.component';
import { ColorPicker2Component } from './color-picker2/color-picker2.component';
import { NgxOrgChartModule } from './ngx-org-chart/lib/ngx-org-chart/ngx-org-chart.module';
import { FormatTimeService } from './service/jee-format-time.component';
import { ViewConfigStatusComponent } from './view-config-status/view-config-status.component';
import { ProjectTeamEditComponent } from './project-team-edit/project-team-edit.component';
import { ChooseUsersV3Component } from './choose-user-v3/choose-user-v3.component';
import { AvatarUserComponent } from './avatar-user/avatar-user.component';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { TemplateCenterComponent } from './template-center/template-center.component';
import { DepartmentEditV2Component } from './department-edit-v2/department-edit-v2.component';
import { AppFocusBlockComponent } from './app-focus-block/app-focus-block.component';
import { TemplateChonTrangThaiComponent } from './template-chontrangthai/template-chontrangthai.component';
import { ChooseUsersV2Component } from './choose-user-v2/choose-user-v2.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
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
    WorkComponent,
    Step1ComponentComponent,
    Step2ComponentComponent,
    Step3ComponentComponent,
    Step4ComponentComponent,
    Step5ComponentComponent,
    StatusDynamicDialogComponent,
    ColorPicker2Component,
    ViewConfigStatusComponent,
    ProjectTeamEditComponent,
    ChooseUsersV3Component,
    AvatarUserComponent,
    TemplateCenterComponent,
    DepartmentEditV2Component,
    AppFocusBlockComponent,
    TemplateChonTrangThaiComponent,
    ChooseUsersV2Component,
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
    TranslateModule.forRoot(),
    NgbDropdownModule,
    WorkRoutingModule,
    NgxOrgChartModule,
    NgxMatSelectSearchModule,
    DragDropModule,
  ],
  entryComponents: [
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'vi' },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS_EDIT },
    TranslationService,
    LayoutUtilsService,
  ],
})
export class WizardWorkModule { }
