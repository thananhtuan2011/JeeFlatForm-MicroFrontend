import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetailTaskComponentComponent } from '../detail-task-component/detail-task-component.component';
import { MenuWorkComponent } from './menu-work.component';
import { PanelDashboardComponent } from './panel-dashboard/panel-dashboard.component';
import { PanelRightComponent } from './panel-right/panel-right.component';
import { ThietLapNhiemVuComponent } from './ThietLapNhiemVu/ThietLapNhiemVu.component';
import { BaoCaoDoanhNghiepComponent } from './bao-cao-doanh-nghiep/bao-cao-doanh-nghiep.component';

const routes: Routes = [
	{
		path: '',
		component: MenuWorkComponent,
		children: [
			{
				path: '',
				component: PanelDashboardComponent,
			},
			{
				path: 'list/:loaimenu/:filter',
				component: PanelRightComponent,
			},
			{
				path: 'list/:loaimenu/:filter/:advance',
				component: PanelRightComponent,
			},
			{
				path: 'list/:loaimenu/:filter/:projectid/:advance',
				component: PanelRightComponent,
			},
			{
				path: 'list/:loaimenu/:filter/:projectid/:advance/:isstatus',//dùng cho menu tags
				component: PanelRightComponent,
			},
			{
				path: 'list/:loaimenu/:filter/:projectid/:projectname',
				component: PanelRightComponent,
			},
			{
				path: 'list/:loaimenu/:filter/:projectid',
				component: PanelRightComponent,
			},
			{
				path: 'detail',
				component: DetailTaskComponentComponent,
				children: [
					{
						path: ':idtask',
						component: DetailTaskComponentComponent,
					},
				]
			},
			{
				path: 'setting',
				component: ThietLapNhiemVuComponent,
			},
			{
				path: 'BaoCao',
				loadChildren: () => 
				import('./bao-cao/bao-cao.module').then((m) => m.BaoCaoModule),
			},
			{
				path: 'BaoCaoDN',
				component: BaoCaoDoanhNghiepComponent,
			},
			{
				path: 'list/:loaimenu/:filter/:projectid/:IDUser/:ID/:IDep/:CollectBy',
				component: PanelRightComponent,
			},
		]
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class MenuWorkRoutingkModule { }
