import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CongViecTheoQuyTrinhDetailsComponent } from './cong-viec-theo-quy-trinh-details/cong-viec-theo-quy-trinh-details.component';
import { CongViecTheoQuyTrinhListComponent } from './cong-viec-theo-quy-trinh-list/cong-viec-theo-quy-trinh-list.component';
const routes: Routes = [
	{
		path: '',
		component: CongViecTheoQuyTrinhListComponent,
		data: {
		},
		children: [
			{
				path: ':typeid/:stageid/:taskid',
				component: CongViecTheoQuyTrinhDetailsComponent,
			},
		]
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class CongViecTheoQuyTrinhRoutingModule { }
