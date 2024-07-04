import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { NgbDatepickerModule, NgbModalModule, NgbButtonsModule } from '@ng-bootstrap/ng-bootstrap';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
// import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
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
import { CongViecTheoDuAnService } from './services/cong-viec-theo-du-an.services';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { EditorModule } from '@tinymce/tinymce-angular';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { CustomPipesModule } from '../component/custom/custom-pipe.module';
import { ProjectsTeamService } from '../component/Jee-Work/jee-work.servide';
import { CongViecTheoDuAnPopupComponent } from './cong-viec-theo-du-an-popup/cong-viec-theo-du-an-popup.component';
import { CongViecTheoDuAnDetaisPopupComponent } from './cong-viec-theo-du-an-details-popup/cong-viec-theo-du-an-details-popup.component';
import { CongViecTheoDuAnVer1PopupComponent } from './cong-viec-theo-du-an-v1-popup/cong-viec-theo-du-an-v1-popup.component';
import { AddDropDownDialogComponent } from './add-dropdown-dialog/add-dropdown-dialog.component';
import { CongViecTheoDuAnChartComponent } from './cong-viec-theo-du-an-chart/cong-viec-theo-du-an-chart.component';
import { CongViecTheoDuAnListPopupComponent } from './cong-viec-theo-du-an-list-popup/cong-viec-theo-du-an-list-popup.component';
import { FieldsCustomModule } from '../custom/fields-custom.module';
import { QuillModule } from 'ngx-quill';
import { JeeWorkComponentModule } from '../component/Jee-Work/jee-work.module';
import { DynamicSearchFormModule } from '../component/dynamic-search-form/dynamic-search-form.module';
import { FormatTimeService } from '../../services/jee-format-time.component';
import { FormatCSSTimeService } from '../../services/jee-format-css-time.component';
import { NgxOrgChartModule } from '../component/ngx-org-chart/lib/ngx-org-chart/ngx-org-chart.module';
import { LayoutUtilsService } from 'projects/jeework-v1/src/modules/crud/utils/layout-utils.service';
import { JeeCommentLibModule, TranslationCommentService } from 'dps-comment';
import { SocketioService } from '../../services/socketio.service';
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
    CongViecTheoDuAnPopupComponent,
    CongViecTheoDuAnDetaisPopupComponent,
    CongViecTheoDuAnVer1PopupComponent,
    AddDropDownDialogComponent,
    CongViecTheoDuAnChartComponent,
    CongViecTheoDuAnListPopupComponent
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
    NgxMatSelectSearchModule,
    EditorModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    CustomPipesModule,
    DynamicSearchFormModule,
    NgxOrgChartModule,
    FieldsCustomModule,
    QuillModule.forRoot(),
    JeeWorkComponentModule,
    JeeCommentLibModule,
  ],
  entryComponents: [
    CongViecTheoDuAnPopupComponent,
    CongViecTheoDuAnDetaisPopupComponent,
    CongViecTheoDuAnVer1PopupComponent,
    AddDropDownDialogComponent,
    CongViecTheoDuAnChartComponent,
    CongViecTheoDuAnListPopupComponent,
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'vi' },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS_EDIT },
    CongViecTheoDuAnService,
    ProjectsTeamService,
    FormatTimeService,
    FormatCSSTimeService,
    LayoutUtilsService,
    TranslationCommentService,
    SocketioService,
  ],
  exports: [
    CongViecTheoDuAnPopupComponent,
    CongViecTheoDuAnDetaisPopupComponent,
    CongViecTheoDuAnVer1PopupComponent,
    AddDropDownDialogComponent,
    CongViecTheoDuAnChartComponent,
    CongViecTheoDuAnListPopupComponent,
  ]
})
export class CongViecTheoDuAnRefModule { }
