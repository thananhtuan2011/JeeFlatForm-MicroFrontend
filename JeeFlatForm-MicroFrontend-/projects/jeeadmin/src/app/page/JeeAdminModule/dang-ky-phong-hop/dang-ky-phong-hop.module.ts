import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FullCalendarModule } from '@fullcalendar/angular';

// Material
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { MatNativeDateModule, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list'; 
import timeGridPlugin from '@fullcalendar/timegrid';
import { RouterModule, Routes } from '@angular/router';
import { ModalPositionCache } from './dang-ky-phong-hop-dialog/modal-position.cache';
import { DangKyPhongHopDialogComponent } from './dang-ky-phong-hop-dialog/dang-ky-phong-hop-dialog.component';
import { DangKyPhongHopInfoComponent } from './dang-ky-phong-hop-info/dang-ky-phong-hop-info.component';
import { GhiChuPhongHopEditComponent } from './ghi-chu-edit/ghi-chu-edit.component';
import { DialogDraggableTitleDirective } from './dang-ky-phong-hop-dialog/dialog-draggable-title.dirextive';
import { DanhSachPhongHuyListComponent } from './danh-sach-phong-huy-list/danh-sach-phong-huy-list.component';
import { DangKyPhongHopComponent } from './dang-ky-phong-hop.component';
import { MY_FORMATS } from '../Services/custom-date-format';
import { GeneralModule } from '../general.module';
import './../../../../../src/styles.scss';
import { DatPhongService } from '../Services/dat-phong.service';

FullCalendarModule.registerPlugins([ // register FullCalendar plugins
	dayGridPlugin,
	interactionPlugin,
	listPlugin, 
	timeGridPlugin
]);

const routes: Routes = [
	{
		path: '',
		component: DangKyPhongHopComponent,
	},
	{
		path: 'view/:id', 
		component: DangKyPhongHopComponent
	},
];

@NgModule({
	imports: [
		CommonModule,
		RouterModule.forChild(routes),
		TranslateModule.forRoot(),
		MatNativeDateModule,
		MatProgressBarModule,
		MatProgressSpinnerModule,
		FullCalendarModule, 
		GeneralModule
	],
	providers: [
		{ provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
		{
			provide: MAT_DIALOG_DEFAULT_OPTIONS,
			useValue: {
				hasBackdrop: true,
				panelClass: 'k-popup-container',
				height: 'auto',
				width: '900px'
			}
		},
		ModalPositionCache,
		DatPhongService
	],
	entryComponents: [
		DangKyPhongHopComponent,
		DangKyPhongHopDialogComponent,
		DangKyPhongHopInfoComponent,
		GhiChuPhongHopEditComponent,
	],
	declarations: [
		DangKyPhongHopComponent,
		DialogDraggableTitleDirective,
		DangKyPhongHopDialogComponent,
		DangKyPhongHopInfoComponent,
		GhiChuPhongHopEditComponent,
		DanhSachPhongHuyListComponent,
	],
	bootstrap: [DangKyPhongHopComponent],
	exports: [DangKyPhongHopComponent]
})

export class DangKyPhongHopModule { }
