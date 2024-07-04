import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DonTuDetailsComponent } from './don-tu-details/don-tu-details.component';
import { DonTuListComponent } from './don-tu-list/don-tu-list.component';
const routes: Routes = [
	{
		path: '',
		component: DonTuListComponent,
		children: [
			{
				path: ':idtype/:idnv/:id',
				component: DonTuDetailsComponent,
			},
		]
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class DonTuRoutingModule { }
