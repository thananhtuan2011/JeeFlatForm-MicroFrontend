import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { YeuCauVPP_EditComponent } from './yeucau-vpp-edit/yeucau-vpp-edit.component';
import { YeuCauVPP_ListComponent } from './yeucau-vpp-list/yeucau-vpp-list.component';

const routes: Routes = [{
	path: '',
	component: YeuCauVPP_ListComponent,
	children: [
		{
			path: ':id/:isView/:isToiGui',
			component: YeuCauVPP_EditComponent,
		},
		{
			path: 'add',
			component: YeuCauVPP_EditComponent,
		},
	]
}];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class YeuCauVPPRoutingModule { }
