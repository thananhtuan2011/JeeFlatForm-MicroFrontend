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
import { TicketComponent } from './ticket.component';
import { TicketRoutingModule } from './ticket-routing.module';
import './../../../../src/styles.scss';
import './../../../styles.scss';// styte css of project
import { TranslationService } from 'projects/wizard-platform/src/modules/i18n/translation.service';
import { LayoutUtilsService } from 'projects/wizard-platform/src/modules/crud/utils/layout-utils.service';
import { Step1Component } from './Step1/step1.component';
import { Step2Component } from './Step2/step2.component';
import { Step3Component } from './Step3/step3.component';
import { Step4Component } from './Step4/step4.component';
import { PhanloaihotroEditDialogComponent } from './component/phan-loai-ho-tro-management-edit-dialog/phan-loai-ho-tro-management-edit-dialog.component';
import { TicKetService } from './ticket.service';
import { AuthService } from 'src/app/modules/auth';
import { LinhvucyeucauEditDialogComponent } from './component/linhvucyeucau-management-edit-dialog/linh-vuc-yeu-cau-management-edit-dialog.component';
import { StatusManagementEditDialogComponent } from './component/list-status-edit-dialog/list-status-edit-dialog.component';
import { ColorPicker2Component } from './component/color-picker2/color-picker2.component'; 
import { ChooseUsersComponent } from './component/choose-users/choose-users.component'; 
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
    TicketComponent,
    Step1Component,
    Step2Component,
    Step3Component,
    Step4Component,
    PhanloaihotroEditDialogComponent,
    LinhvucyeucauEditDialogComponent,
    StatusManagementEditDialogComponent,
    ColorPicker2Component,ChooseUsersComponent
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
    TicketRoutingModule,
    MatSnackBarModule,
    
  ],
  entryComponents: [ColorPicker2Component,ChooseUsersComponent
  ],
  exports:[
    ColorPicker2Component,
    LinhvucyeucauEditDialogComponent,
    StatusManagementEditDialogComponent,
    PhanloaihotroEditDialogComponent,ChooseUsersComponent
    
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'vi' },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS_EDIT },
    TranslationService,
    LayoutUtilsService,AuthService,
    TicKetService,

  ],
})
export class WizardTicketModule { }
