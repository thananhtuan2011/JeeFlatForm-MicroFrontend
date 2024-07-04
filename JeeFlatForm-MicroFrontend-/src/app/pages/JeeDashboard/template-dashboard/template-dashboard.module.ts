import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgApexchartsModule } from 'ng-apexcharts';
import { InlineSVGModule } from 'ng-inline-svg';
import { NgbDatepickerModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { GridsterModule } from 'angular-gridster2';
import { DynamicModule } from 'ng-dynamic-component';
import { RouterModule, Routes } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMenuModule } from '@angular/material/menu';
import { AvatarModule } from 'ngx-avatar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ChartsModule } from 'ng2-charts';
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { TemplateDashboardComponent } from './template-dashboard.component';
import { TemplateDashboardListComponent } from './template-dashboard-list/template-dashboard-list.component';
import { TemplateDashboardService } from './Services/template-dashboard.service';
import { TemplateDashboardEditComponent } from './template-dashboard-edit/template-dashboard-edit.component';
import { TemplateDashboardDetailsComponent } from './template-dashboard-details/template-dashboard-details.component';
import { PageGirdtersDashboardService } from '../page-girdters-dashboard/Services/page-girdters-dashboard.service';
import { AddCloseWidgetTemplateDialogComponent } from './add-close-widget-dialog/add-close-widget-dialog.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { TranslationModule } from 'projects/jeehr/src/modules/i18n/translation.module';
import { FormatTimeService } from '../page-girdters-dashboard/Services/jee-format-time.component';
import { LayoutUtilsService } from 'src/app/modules/crud/utils/layout-utils.service';


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

const routes: Routes = [
	{
		path: '',
		component: TemplateDashboardComponent,
		children: [
			{
				path: '',
				component: TemplateDashboardListComponent,
			},
			{
				path: ':id',
				component: TemplateDashboardDetailsComponent,
			}
		]
	}
];

@NgModule({
	declarations: [
		TemplateDashboardComponent,
		TemplateDashboardListComponent,
		TemplateDashboardEditComponent,
		TemplateDashboardDetailsComponent,
		AddCloseWidgetTemplateDialogComponent,
	],
	imports: [
		RouterModule.forChild(routes),
		CommonModule,
		InlineSVGModule,
		NgApexchartsModule,
		NgbDropdownModule,
		TranslationModule,
		GridsterModule,
		DynamicModule,
		MatIconModule,
		MatButtonToggleModule,
		MatSlideToggleModule,
		PerfectScrollbarModule,
		MatIconModule,
		MatSlideToggleModule,
		MatProgressSpinnerModule,
		ReactiveFormsModule,
		MatDatepickerModule,
		NgbDatepickerModule,
		MatMenuModule,
		AvatarModule,
		MatTooltipModule,
		MatFormFieldModule,
		FormsModule,
		ChartsModule,
		MatPaginatorModule,
		MatTableModule,
	],
	providers: [
		{ provide: MAT_DATE_FORMATS, useValue: MY_FORMATS_EDIT },
		{
			provide: MAT_DIALOG_DEFAULT_OPTIONS,
			useValue: {
				hasBackdrop: true,
				panelClass: 'kt-mat-dialog-container__wrapper',
				height: 'auto',
				width: '700px'
			}
		},
		FormatTimeService,
		TemplateDashboardService,
		PageGirdtersDashboardService,
		LayoutUtilsService,
	],
	entryComponents: [
		TemplateDashboardEditComponent,
		AddCloseWidgetTemplateDialogComponent,
	],
})
export class TemplateDashboardModule { }
