import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MomentDateAdapter, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
import { DangKyDialogComponent } from './dang-ky/dang-ky.dialog.component';
import { CalendarService } from './services/tasks.service';
import { LichDangKyComponent } from './calendar.component';
// import { LoaiTaskEditDialogComponent } from './loai-task-edit/loai-task-edit.dialog.component';
import { DialogDraggableTitleDirective } from './dang-ky/dialog-draggable-title.dirextive';
import { ModalPositionCache } from './dang-ky/modal-position.cache';
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
import { MatSidenavModule } from '@angular/material/sidenav';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { DateAdapter, MatNativeDateModule, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { AvatarModule } from 'ngx-avatar';
import { OvertimeRegistrationService } from './services/Overtime-registration.service';
import { LeavePersonalService } from './services/dang-ky-phep-ca-nhan.service';
import { ChangeShiftStaffbyStaffService } from './services/doi-ca-lam-viec.service';
import { GuiGiaiTrinhChamCongService } from './services/gui-giai-trinh-cham-cong.service';
import { XinThoiViecService } from './services/xin-thoi-viec.service';
import { QuanLyDuyetService } from './services/quan-ly-duyet.service';
import { DonTuRefModule } from '../../JeeHRModule/don-tu/don-tu-ref.module';
import { CustomPipesModule } from '../../JeeHRModule/component/custom/custom-pipe.module';
import { MY_FORMATS_JeeHR } from '../../services/custom-date-format';
import { HttpUtilsService } from 'projects/jeehr/src/modules/crud/utils/http-utils.service';
import { DanhMucChungService } from '../../services/danhmuc.service';
import { LayoutUtilsService } from 'projects/jeehr/src/modules/crud/utils/layout-utils.service';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import { JeeHRModule } from '../../jeehr.module';
FullCalendarModule.registerPlugins([
	dayGridPlugin,
	interactionPlugin,
	listPlugin,
	timeGridPlugin
  ]);
@NgModule({
	imports: [
		MatDialogModule,
		CommonModule,
		HttpClientModule,
		FormsModule,
		ReactiveFormsModule,
		TranslateModule.forRoot(),
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
		MatExpansionModule,
		MatSidenavModule,
		NgxMatSelectSearchModule,
		FullCalendarModule,
		AvatarModule,
		CustomPipesModule,
		DonTuRefModule,
		JeeHRModule,
		// JeeWorkModule,
		// EditorModule,
		// BsDropdownModule,
	],
	providers: [
		{ provide: MAT_DATE_LOCALE, useValue: 'vi' },
		{ provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
		{ provide: MAT_DATE_FORMATS, useValue: MY_FORMATS_JeeHR },
		{
			provide: MAT_DIALOG_DEFAULT_OPTIONS,
			useValue: {
				hasBackdrop: true,
				panelClass: 'kt-mat-dialog-container__wrapper',
				height: 'auto',
				width: '700px',
			}
		},
		HttpUtilsService,
		DanhMucChungService,
		LayoutUtilsService,
		ModalPositionCache,
		CalendarService,
		LeavePersonalService,
		// MyProjectsService,
		OvertimeRegistrationService,
		ChangeShiftStaffbyStaffService,
		GuiGiaiTrinhChamCongService,
		XinThoiViecService,
		QuanLyDuyetService,
		// CongViecTheoDuAnService,
		// MenuPhanQuyenServices,
	],
	entryComponents: [
		LichDangKyComponent,
		DangKyDialogComponent,
		// LoaiTaskEditDialogComponent,
	],
	declarations: [
		LichDangKyComponent,
		DangKyDialogComponent,
		DialogDraggableTitleDirective,
		// LoaiTaskEditDialogComponent,
	],
	bootstrap: [LichDangKyComponent],
	exports: [LichDangKyComponent,]
})

export class LichDangKyRefModule { }
