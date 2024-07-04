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
import { CongViecTheoQuyTrinhComponent } from './cong-viec-theo-quy-trinh.component';
import { CongViecTheoQuyTrinhListComponent } from './cong-viec-theo-quy-trinh-list/cong-viec-theo-quy-trinh-list.component';
import { CongViecTheoQuyTrinhService } from './services/cong-viec-theo-quy-trinh.services';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { EditorModule } from '@tinymce/tinymce-angular';
import { AvatarWorkFlowModule } from '../component/avatar-workflow/avatar-wf.module';
import { DynamicFormModule } from '../component/dynamic-form/dynamic-form.module';
// import { JeeCommentModule } from '../../JeeCommentModule/jee-comment/jee-comment.module';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { CongViecTheoQuyTrinhDetailsComponent } from './cong-viec-theo-quy-trinh-details/cong-viec-theo-quy-trinh-details.component';
import { CongViecTheoQuyTrinhRoutingModule } from './cong-viec-theo-quy-trinh-routing.module';
import { CustomPipesModule } from '../component/custom/custom-pipe.module';
import { CongViecTheoQuyTrinhRefModule } from './cong-viec-theo-quy-trinh-ref.module';
import { DynamicSearchFormModule } from '../component/dynamic-search-form/dynamic-search-form.module';
import { ProcessWorkService } from '../../services/process-work.service';
import { AddTaskModule } from '../component/add-task/add-task.module';
import { TranslateModule } from '@ngx-translate/core';
import { JeeWFWorkModule } from '../jeewf-work.module';
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
    CongViecTheoQuyTrinhComponent,
    CongViecTheoQuyTrinhListComponent,
    CongViecTheoQuyTrinhDetailsComponent,
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
    NgxMatSelectSearchModule,
    EditorModule,
    AvatarWorkFlowModule,
    DynamicFormModule,
    AddTaskModule,
    // JeeCommentModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    CongViecTheoQuyTrinhRoutingModule,
    DynamicSearchFormModule,
    CustomPipesModule,
    CongViecTheoQuyTrinhRefModule,
    TranslateModule,
    JeeWFWorkModule,
  ],
  entryComponents: [
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'vi' },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS_EDIT },
    CongViecTheoQuyTrinhService,
    ProcessWorkService,
  ],
})
export class CongViecTheoQuyTrinhModule {}
