import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
// Core
// Core => Services
import { MomentDateAdapter, MAT_MOMENT_DATE_FORMATS, MatMomentDateModule } from '@angular/material-moment-adapter';
import { ProcessWorkComponent } from './process-work.component';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { DndModule } from 'ngx-drag-drop';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { EditorModule } from '@tinymce/tinymce-angular';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDialogModule, MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AvatarModule } from 'ngx-avatar';
import { NgxPrintModule } from 'ngx-print';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PopoverModule } from 'ngx-smart-popover';
import { InlineSVGModule } from 'ng-inline-svg';
import { NgbButtonsModule, NgbDatepickerModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { DropdownTreeModule, ImageControlModule } from 'dps-lib';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { MatExpansionModule } from '@angular/material/expansion';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { DynamicFormModule } from '../component/dynamic-form/dynamic-form.module';
import { JeeChooseMemberModule } from '../component/jee-choose-member/jee-choose-member.module';
import { AvatarWorkFlowModule } from '../component/avatar-workflow/avatar-wf.module';
import { ProcessWorkTabComponent } from './process-work-tab/process-work-tab.component';
import { KanBanListComponent } from './kanban-list/kanban-list.component';
import { TaskListComponent } from './task-list/task-list.component';
import { ThanhVienListComponent } from './thanh-vien-list/thanh-vien-list.component';
import { BieuMauDialogComponent } from './bieu-mau-dialog/bieu-mau-dialog.component';
import { BieuMauListComponent } from './bieu-mau-list/bieu-mau-list.component';
import { BaoCaoListComponent } from './bao-cao-list/bao-cao-list.component';
import { ChartsModule } from 'ng2-charts';
import { CongViecChiTietDialogComponent } from './cong-viec-chi-tiet-dialog/cong-viec-chi-tiet-dialog.component';
import { CongViecDialogComponent } from './cong-viec-dialog/cong-viec-dialog.component';
import { ProcessWorkDetailsComponent } from './process-work-details/process-work-details.component';
import { DiagramModule } from '@syncfusion/ej2-angular-diagrams';
import { ProgressBarColor } from '../progress-bar-color';
import { TranslateModule } from '@ngx-translate/core';
import { CongViecTheoQuyTrinhService } from '../cong-viec-theo-quy-trinh/services/cong-viec-theo-quy-trinh.services';
import { CustomPipesModule } from '../component/custom/custom-pipe.module';
import { HttpUtilsService } from 'projects/jeeworkflow/src/modules/crud/utils/http-utils.service';
import { DanhMucChungService } from '../../services/danhmuc.service';
import { LayoutUtilsService } from 'projects/jeeworkflow/src/modules/crud/utils/layout-utils.service';
import { ProcessWorkService } from '../../services/process-work.service';
import { JeeWFWorkModule } from '../jeewf-work.module';
import { DynamicSearchFormModule } from '../component/dynamic-search-form/dynamic-search-form.module';
const routes: Routes = [
	{
		path: '',
		component: ProcessWorkComponent,
		children: [
			{
				path: '',
				component: ProcessWorkTabComponent,//Các tab trong tquy trình
			},
			{
				path: ':id',
				component: ProcessWorkDetailsComponent,
			},

		]
	}
];

export const MY_MOMENT_FORMATS = {
	fullPickerInput: { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' },
	datePickerInput: { year: 'numeric', month: 'numeric', day: 'numeric' },
	timePickerInput: { hour: 'numeric', minute: 'numeric' },
	monthYearLabel: { year: 'numeric', month: 'short' },
	dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
	monthYearA11yLabel: { year: 'numeric', month: 'long' },
};

@NgModule({
	imports: [
		RouterModule.forChild(routes),
		MatDialogModule,
		CommonModule,
		HttpClientModule,
		FormsModule,
		ReactiveFormsModule,
		MatTooltipModule,
		AvatarModule,
		NgxPrintModule,
		PickerModule,
		InfiniteScrollModule,
		PerfectScrollbarModule,
		PopoverModule,
		CommonModule,
		HttpClientModule,
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
		NgxMatSelectSearchModule,
		DropdownTreeModule,
		ImageControlModule,
		EditorModule,
		DynamicFormModule,
		OwlDateTimeModule,
		OwlNativeDateTimeModule,
		DndModule,
		DiagramModule,
		ChartsModule,
		MatExpansionModule,
		NgxDocViewerModule,
		JeeChooseMemberModule,
		AvatarWorkFlowModule,
		TranslateModule.forChild(),
		CustomPipesModule,
		DynamicSearchFormModule,
		JeeWFWorkModule,
	],
	providers: [
		{ provide: MAT_DATE_LOCALE, useValue: 'vi' },
		{ provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
		{ provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
		{
			provide: MAT_DIALOG_DEFAULT_OPTIONS,
			useValue: {
				hasBackdrop: true,
				panelClass: 'mat-dialog-container__wrapper',
				disableClose: true,
			}
		},
		HttpUtilsService,
		DanhMucChungService,
		LayoutUtilsService,
		ProcessWorkService,
		CongViecTheoQuyTrinhService,
	],
	entryComponents: [
		CongViecChiTietDialogComponent,//Dùng cho công việc chi tiết
		CongViecDialogComponent,
		BieuMauDialogComponent,
	],
	declarations: [
		ProcessWorkComponent,
		ProcessWorkTabComponent,//Các tab trong tquy trình
		KanBanListComponent,//Danh sách kanban
		TaskListComponent,//Danh sách nhiệm vụ
		ProcessWorkDetailsComponent,
		CongViecChiTietDialogComponent,//Dùng cho công việc chi tiết
		CongViecDialogComponent,
		ThanhVienListComponent,//Danh sách thành viên
		BaoCaoListComponent,//Báo cáo hoạt động
		BieuMauListComponent,//Biểu mẫu
		BieuMauDialogComponent,
		ProgressBarColor,
	]
})
export class ProcessWorkModule { }
