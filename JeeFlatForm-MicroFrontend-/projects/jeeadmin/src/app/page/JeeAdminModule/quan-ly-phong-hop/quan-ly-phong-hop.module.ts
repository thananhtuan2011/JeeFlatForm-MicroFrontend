import { NgModule } from '@angular/core';
import { CommonModule, DatePipe, } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { FullCalendarModule } from '@fullcalendar/angular';

// Material
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { DateAdapter, MatNativeDateModule, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MomentDateAdapter, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list'; 
import timeGridPlugin from '@fullcalendar/timegrid';
import { RouterModule, Routes } from '@angular/router';
import { QuanLyPhongHopComponent } from './quan-ly-phong-hop.component';
import { ModalPositionCache } from './quan-ly-phong-hop-dialog/modal-position.cache';
import { QuanLyPhongHopDialogComponent } from './quan-ly-phong-hop-dialog/quan-ly-phong-hop-dialog.component';
import { QuanLyPhongHopInfoComponent } from './quan-ly-phong-hop-info/quan-ly-phong-hop-info.component';
import { QuanLyPhongHopGhiChuComponent } from './quan-ly-phong-hop-ghi-chu/quan-ly-phong-hop-ghi-chu.component';
import { DialogDraggableTitleDirective } from './quan-ly-phong-hop-dialog/dialog-draggable-title.dirextive';
import { MY_FORMATS } from '../Services/custom-date-format';
import { DropdownTreeModule } from 'dps-lib';
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
		component: QuanLyPhongHopComponent,
	},
	{
		path: 'view/:id', 
		component: QuanLyPhongHopComponent
	},
];

@NgModule({
	imports: [
		CommonModule,
		HttpClientModule,
		RouterModule.forChild(routes),
		TranslateModule.forRoot(),
		MatNativeDateModule,
		MatProgressBarModule,
		MatProgressSpinnerModule,
		MatSnackBarModule,
		FullCalendarModule, 
		DropdownTreeModule,
		GeneralModule,
	],
	providers: [
		{ provide: MAT_DATE_LOCALE, useValue: 'vi' },
		{ provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
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
		QuanLyPhongHopComponent,
		QuanLyPhongHopDialogComponent,
		QuanLyPhongHopInfoComponent,
		QuanLyPhongHopGhiChuComponent,
	],
	declarations: [
		QuanLyPhongHopComponent,
		DialogDraggableTitleDirective,
		QuanLyPhongHopDialogComponent,
		QuanLyPhongHopInfoComponent,
		QuanLyPhongHopGhiChuComponent,
	],
	bootstrap: [QuanLyPhongHopComponent],
	exports: [QuanLyPhongHopComponent]
})

export class QuanLyPhongHopModule { }
