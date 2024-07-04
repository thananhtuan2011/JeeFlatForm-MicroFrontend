import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';

//ModuleComponent
import { NhapHoSoOnlineComponent } from './nhap-ho-so-online.component';

import { NhapHoSoOnlineEditComponent, SafeHtmlPipe } from './nhap-ho-so-online-edit/nhap-ho-so-online-edit.component';
import { NhapHoSoOnlineService } from './Services/nhap-ho-so-online.service';
import { RecaptchaModule } from 'ng-recaptcha';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatDialogModule, MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HttpUtilsService } from '../crud/utils/http-utils.service';
import { LayoutUtilsService } from '../crud/utils/layout-utils.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NhapHoSoOnlineRoutingModule } from './nhap-ho-so-online-routing.module';
import { DanhMucChungService } from 'src/app/_metronic/core/services/danhmuc.service';
import { DropdownProvinceModule } from 'src/app/pages/JeeHRModule/component/dropdown-province/dropdown-province.module';
import { MomentDateAdapter } from '@angular/material-moment-adapter';

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
	imports: [
		MatDialogModule,
		CommonModule,
		HttpClientModule,
		FormsModule,
		ReactiveFormsModule,
		TranslateModule.forChild(),
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
		MatTooltipModule,
		DropdownProvinceModule,
		NgxMatSelectSearchModule,
		MatFormFieldModule,
		NhapHoSoOnlineRoutingModule,
	],
	providers: [
		{
			provide: MAT_DIALOG_DEFAULT_OPTIONS,
			useValue: {
				hasBackdrop: true,
				panelClass: 'm-mat-dialog-container__wrapper',
				height: 'auto',
				width: '900px',
				disableClose: true,
			}
		},
		{ provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
		{ provide: MAT_DATE_LOCALE, useValue: 'vi' },
		{ provide: MAT_DATE_FORMATS, useValue: MY_FORMATS_EDIT },
		HttpUtilsService,
		DanhMucChungService,
		NhapHoSoOnlineService,
		LayoutUtilsService,
	],
	entryComponents: [
		NhapHoSoOnlineEditComponent,
	],
	declarations: [
		NhapHoSoOnlineComponent, //Module Component Parent
		NhapHoSoOnlineEditComponent,
		SafeHtmlPipe,
	]
})
export class NhapHoSoOnlineModule { }
