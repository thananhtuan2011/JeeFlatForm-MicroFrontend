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
import { NgbDatepickerModule, NgbModalModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
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
import { DonTuComponent } from './don-tu.component';
import { DonTuListComponent } from './don-tu-list/don-tu-list.component';
import { DonTuPopupComponent } from './don-tu-popup/don-tu-popup.component';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { LeavePersonalService } from '../../JeeCalendarModule/calendar/services/dang-ky-phep-ca-nhan.service';
import { OvertimeRegistrationService } from '../../JeeCalendarModule/calendar/services/Overtime-registration.service';
import { GuiGiaiTrinhChamCongService } from '../../JeeCalendarModule/calendar/services/gui-giai-trinh-cham-cong.service';
import { XinThoiViecService } from '../../JeeCalendarModule/calendar/services/xin-thoi-viec.service';
import { ChangeShiftStaffbyStaffService } from '../../JeeCalendarModule/calendar/services/doi-ca-lam-viec.service';
import { QuanLyDuyetService } from '../../JeeCalendarModule/calendar/services/quan-ly-duyet.service';
import { DonTuDetailsComponent } from './don-tu-details/don-tu-details.component';
import { DonTuRoutingModule } from './don-tu-routing.module';
import { DonTuRefModule } from './don-tu-ref.module';
import { JeeHRModule } from '../../jeehr.module';
import { DynamicSearchFormModule } from '../component/dynamic-search-form/dynamic-search-form.module';
import { TranslationService } from 'projects/jeehr/src/modules/i18n/translation.service';
import { CustomPipesModule } from '../component/custom/custom-pipe.module';
import { EditorModule } from '@tinymce/tinymce-angular';
import { TimeAgoPipe } from '../../services/time-ago.pipe';
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
    DonTuComponent,
    DonTuListComponent,
    DonTuDetailsComponent,
    DonTuPopupComponent,
    TimeAgoPipe,
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
    DynamicSearchFormModule,
    NgxMatSelectSearchModule,
    EditorModule,
    DonTuRoutingModule,
    DonTuRefModule,
    NgbDropdownModule,
    JeeHRModule,
    CustomPipesModule,
  ],
  entryComponents: [
    DonTuPopupComponent,
    TimeAgoPipe,
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'vi' },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS_EDIT },
    TranslationService,
    LeavePersonalService,
    OvertimeRegistrationService,
    GuiGiaiTrinhChamCongService,
		XinThoiViecService,
    ChangeShiftStaffbyStaffService,
    QuanLyDuyetService,
  ],
})
export class DonTuModule {}
