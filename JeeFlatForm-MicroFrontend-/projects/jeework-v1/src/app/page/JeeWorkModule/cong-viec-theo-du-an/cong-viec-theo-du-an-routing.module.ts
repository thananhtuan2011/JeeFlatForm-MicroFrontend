import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CongViecTheoDuAnChartComponent } from './cong-viec-theo-du-an-chart/cong-viec-theo-du-an-chart.component';
import { CongViecTheoDuAnDetaisComponent } from './cong-viec-theo-du-an-details/cong-viec-theo-du-an-details.component';
import { CongViecTheoDuAnListFirstComponent } from './cong-viec-theo-du-an-list-first/cong-viec-theo-du-an-list-first.component';
import { CongViecTheoDuAnListComponent } from './cong-viec-theo-du-an-list/cong-viec-theo-du-an-list.component';
import { CongViecTheoDuAnComponent } from './cong-viec-theo-du-an.component';
const routes: Routes = [
	{
		path: '',
		component: CongViecTheoDuAnComponent,
		children: [
			{
				path: '',
				component: CongViecTheoDuAnListFirstComponent,
			},
			{
				path: 'Details',
				component: CongViecTheoDuAnListComponent,
				children: [
					{
						path: ':id_project/:id',
						component: CongViecTheoDuAnDetaisComponent,
					},
				]
			},
			{
				path: 'Chart/:id',
				component: CongViecTheoDuAnChartComponent,
			},
		]
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class CongViecTheoDuAnRoutingModule { }
